"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(form);
      await refresh();
      const role = res.data.user.role;
      router.push(`/${role}/dashboard`);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e?.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "radial-gradient(ellipse at 60% 0%,rgba(59,130,246,0.12) 0%,transparent 60%), var(--bg-primary)",
      }}
    >
      <div className="glass p-8 w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="p-2 rounded-xl"
            style={{ background: "var(--accent-glow)" }}
          >
            <Activity size={24} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">MedConnect</h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Digital Health Platform
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
        <p className="mb-6" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Sign in to your account
        </p>

        {error && (
          <div
            className="mb-4 p-3 rounded-lg text-sm"
            style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
              <input
                id="email"
                type="email"
                required
                className="input"
                style={{ paddingLeft: "2.5rem" }}
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label>Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
              <input
                id="password"
                type={showPass ? "text" : "password"}
                required
                className="input"
                style={{ paddingLeft: "2.5rem", paddingRight: "3rem" }}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer" }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          No account?{" "}
          <Link href="/register" style={{ color: "var(--accent-light)", fontWeight: 600 }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
