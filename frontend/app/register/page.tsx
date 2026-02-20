"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Mail, Lock, User, Phone, Stethoscope } from "lucide-react";
import { register } from "@/lib/api";

const SPECIALTIES = [
  "General Practitioner", "Cardiologist", "Dermatologist", "Neurologist",
  "Orthopedist", "Pediatrician", "Psychiatrist", "Oncologist",
  "Gynecologist", "Ophthalmologist", "ENT Specialist",
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "patient",
    specialty: "", phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register({
        ...form,
        specialty: form.role === "doctor" ? form.specialty : undefined,
      });
      router.push("/login?registered=1");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e?.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-12"
      style={{
        background:
          "radial-gradient(ellipse at 40% 0%,rgba(167,139,250,0.12) 0%,transparent 60%), var(--bg-primary)",
      }}
    >
      <div className="glass p-8 w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-xl" style={{ background: "var(--accent-glow)" }}>
            <Activity size={24} style={{ color: "var(--accent)" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">MedConnect</h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Digital Health Platform</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Create Account</h2>
        <p className="mb-6" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Join as a Patient or Doctor
        </p>

        {/* Role Selector */}
        <div className="flex gap-2 mb-6">
          {["patient", "doctor"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, role: r })}
              className="flex-1 py-2 rounded-lg font-semibold text-sm transition-all"
              style={{
                background: form.role === r ? "linear-gradient(135deg,#3b82f6,#6366f1)" : "rgba(255,255,255,0.05)",
                color: form.role === r ? "white" : "var(--text-secondary)",
                border: "1px solid",
                borderColor: form.role === r ? "transparent" : "var(--border)",
                cursor: "pointer",
              }}
            >
              {r === "patient" ? "🧑‍⚕️ Patient" : "👨‍⚕️ Doctor"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm"
            style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
              <input id="name" type="text" required className="input" style={{ paddingLeft: "2.5rem" }}
                placeholder="Dr. Jane Smith" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>

          <div>
            <label>Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
              <input id="register-email" type="email" required className="input" style={{ paddingLeft: "2.5rem" }}
                placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div>
            <label>Phone</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
              <input id="phone" type="tel" className="input" style={{ paddingLeft: "2.5rem" }}
                placeholder="+91 9876543210" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          {form.role === "doctor" && (
            <div>
              <label>Specialty</label>
              <div className="relative">
                <Stethoscope size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
                <select id="specialty" required className="input" style={{ paddingLeft: "2.5rem" }}
                  value={form.specialty}
                  onChange={(e) => setForm({ ...form, specialty: e.target.value })}>
                  <option value="">Select specialty</option>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}

          <div>
            <label>Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-secondary)" }} />
              <input id="register-password" type="password" required className="input" style={{ paddingLeft: "2.5rem" }}
                placeholder="Min 8 characters" minLength={6} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "Creating Account…" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--accent-light)", fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
