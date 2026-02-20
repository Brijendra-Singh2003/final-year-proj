"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Activity } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push(`/${user.role}/dashboard`);
      } else {
        router.push("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div style={{ color: "var(--accent)" }}>
          <Activity size={48} />
        </div>
        <p style={{ color: "var(--text-secondary)" }}>Loading MedConnect…</p>
      </div>
    </div>
  );
}
