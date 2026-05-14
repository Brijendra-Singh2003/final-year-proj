"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getMe, logout as apiLogout } from "@/lib/api";
import { usePathname, useRouter } from "next/navigation";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin" | "lab";
  specialty?: string;
  phone?: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const protectedPrefixes = ["/patient", "/doctor", "/admin", "/lab"];
const ROLE_ROUTES: Record<string, string[]> = {
  patient: ["/patient"],
  doctor: ["/doctor"],
  admin: ["/admin"],
  lab: ["/lab"],
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));

  const refresh = async () => {
    try {
      const res = await getMe();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (loading) return;

    if (isProtected && !user) {
      router.push("/login");
      return;
    }

    // Wrong role
    if (user) {
      for (const [role, paths] of Object.entries(ROLE_ROUTES)) {
        if (role !== user.role && paths.some((p) => pathname.startsWith(p))) {
          router.push(`/${user.role}/dashboard`);
          return;
        }
      }
    }
  }, [user, loading, pathname, router]);

  if (isProtected && !user) {
    return;
  }

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
