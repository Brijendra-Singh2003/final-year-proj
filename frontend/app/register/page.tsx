"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, Mail, Lock, User, Phone, Stethoscope, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center p-6 py-12 bg-linear-to-br from-bg-secondary via-accent-subtle to-bg-primary">
      <div className="w-full max-w-md bg-bg-card rounded-2xl p-10 shadow-form border border-border">

        {/* Brand */}
        <div className="flex items-center gap-3 mb-7">
          <div className="bg-accent-subtle border border-accent-medium p-2 rounded-xl">
            <Activity size={24} className="text-accent" />
          </div>
          <div>
            <h1 className="gradient-text font-extrabold text-lg font-display">MedConnect</h1>
            <p className="text-xs text-text-muted">Digital Health Platform</p>
          </div>
        </div>

        <h2 className="font-extrabold text-2xl text-text-primary mb-1 font-display">Create your account 🎉</h2>
        <p className="text-text-secondary text-sm mb-6">Join as a Patient or Doctor — it&apos;s free</p>

        {/* Role Selector */}
        <div className="flex gap-3 mb-6">
          {["patient", "doctor"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setForm({ ...form, role: r })}
              className={`flex-1 py-2.5 rounded-[10px] font-bold text-sm cursor-pointer transition-all border-2
                ${form.role === r
                  ? "bg-linear-to-r from-accent to-accent-light text-white border-transparent shadow-btn"
                  : "bg-bg-secondary text-text-secondary border-border hover:border-accent-medium"}`}
            >
              {r === "patient" ? "🧑‍⚕️ Patient" : "👨‍⚕️ Doctor"}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl text-sm bg-red-50 text-danger border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label>Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input id="name" type="text" required className="input" style={{ paddingLeft: "2.5rem" }}
                placeholder="Jane Smith" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
          </div>

          <div>
            <label>Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input id="register-email" type="email" required className="input" style={{ paddingLeft: "2.5rem" }}
                placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>

          <div>
            <label>Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input id="phone" type="tel" className="input" style={{ paddingLeft: "2.5rem" }}
                placeholder="+91 9876543210" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          {form.role === "doctor" && (
            <div>
              <label>Specialty</label>
              <div className="relative">
                <Stethoscope size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
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
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input id="register-password" type="password" required className="input" style={{ paddingLeft: "2.5rem" }}
                placeholder="Min 6 characters" minLength={6} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary justify-center py-3.5 text-base mt-1"
            disabled={loading}
          >
            {loading ? "Creating Account…" : <><span>Create Account</span><ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-accent font-bold no-underline hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
