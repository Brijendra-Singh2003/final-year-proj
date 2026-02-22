"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-bg-secondary via-accent-subtle to-bg-primary">
      <div className="w-full max-w-md bg-bg-card rounded-2xl p-10 shadow-form border border-border">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-accent-subtle border border-accent-medium p-2 rounded-xl">
            <Activity size={24} className="text-accent" />
          </div>
          <div>
            <h1 className="gradient-text font-extrabold text-lg font-display">MedConnect</h1>
            <p className="text-xs text-text-muted">Digital Health Platform</p>
          </div>
        </div>

        <h2 className="font-extrabold text-2xl text-text-primary mb-1 font-display">Welcome back 👋</h2>
        <p className="text-text-secondary text-sm mb-7">Sign in to access your health dashboard</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-50 text-danger border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label>Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
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
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
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
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors bg-transparent border-none cursor-pointer flex"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary justify-center py-3.5 text-base mt-1"
            disabled={loading}
          >
            {loading ? "Signing in…" : <><span>Sign In</span><ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent font-bold no-underline hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
