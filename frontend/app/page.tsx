"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import {
  Activity, Calendar, FileText, Shield, ArrowRight,
  CheckCircle, Star, Users, Clock, Stethoscope,
} from "lucide-react";

const FEATURES = [
  { icon: Calendar,    title: "Easy Appointment Booking",  desc: "Find and book doctors in minutes. Smart scheduling that fits your life.",          color: "text-accent",       bg: "bg-accent-subtle" },
  { icon: FileText,    title: "Digital Medical Records",    desc: "All your health history in one secure place. Access anytime, anywhere.",           color: "text-violet-600",   bg: "bg-violet-50" },
  { icon: Shield,      title: "Privacy & Security",         desc: "Bank-grade encryption keeps your sensitive health data safe.",                      color: "text-cyan-600",     bg: "bg-cyan-50" },
  { icon: Stethoscope, title: "Expert Doctors",             desc: "Connect with verified specialists across 30+ medical disciplines.",                  color: "text-amber-600",    bg: "bg-amber-50" },
];

const STATS = [
  { value: "10K+", label: "Patients Served" },
  { value: "500+", label: "Expert Doctors" },
  { value: "98%",  label: "Satisfaction Rate" },
  { value: "24/7", label: "Support Available" },
];

const STEPS = [
  { num: "01", icon: Users,    title: "Create Account",   desc: "Sign up as a patient or doctor in under 2 minutes." },
  { num: "02", icon: Clock,    title: "Book Appointment", desc: "Search for specialists and book a convenient slot." },
  { num: "03", icon: FileText, title: "Access Records",   desc: "View prescriptions and reports securely online." },
];

const TESTIMONIALS = [
  { name: "Priya Sharma",   role: "Patient",       rating: 5, text: "MedConnect made booking my appointments so simple. I love having all my records in one place!" },
  { name: "Dr. Rahul Mehta", role: "Cardiologist", rating: 5, text: "Managing my patient appointments has never been easier. The platform is intuitive and saves me hours." },
  { name: "Ananya Patel",   role: "Patient",       rating: 5, text: "I can access my test results and prescriptions instantly. No more paper records!" },
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!loading && user) router.push(`/${user.role}/dashboard`);
  }, [user, loading, router]);

  useEffect(() => { setVisible(true); }, []);

  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-pulse-green p-4 rounded-full bg-accent-subtle">
            <Activity size={40} className="text-accent" />
          </div>
          <p className="text-text-secondary">Loading MedConnect…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-primary">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="animate-pulse-green bg-accent-subtle border border-accent-medium p-1.5 rounded-[10px]">
              <Activity size={22} className="text-accent" />
            </div>
            <span className="gradient-text font-extrabold text-xl font-display">MedConnect</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login"    className="btn-ghost">Sign In</Link>
            <Link href="/register" className="btn-primary">Get Started <ArrowRight size={15} /></Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-linear-to-br from-bg-secondary via-accent-subtle to-bg-primary px-6 pt-20 pb-24 overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Copy */}
          <div
            className="transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(30px)" }}
          >
            <span className="inline-flex items-center gap-1.5 bg-accent-subtle text-accent-dark text-xs font-bold px-3.5 py-1.5 rounded-full border border-accent-medium mb-6">
              <CheckCircle size={13} /> India&apos;s #1 Digital Health Platform
            </span>

            <h1 className="font-extrabold font-display text-text-primary leading-tight mb-5 text-4xl lg:text-5xl">
              Your Health,{" "}
              <span className="gradient-text">Digitized &amp;</span>
              <br />Simplified.
            </h1>

            <p className="text-text-secondary text-lg leading-relaxed mb-9 max-w-[480px]">
              Book appointments with top specialists, manage your complete medical records,
              and get the care you deserve — all from one secure platform.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link href="/register" className="btn-primary text-base py-3.5 px-8">
                Get Started Free <ArrowRight size={17} />
              </Link>
              <Link href="/login" className="btn-secondary text-base py-3.5 px-8">
                Sign In
              </Link>
            </div>

            <div className="flex gap-6 mt-9 flex-wrap">
              {["No credit card required", "Free for patients", "Instant setup"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-sm text-text-secondary">
                  <CheckCircle size={14} className="text-accent" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Hero image */}
          <div className="animate-float rounded-3xl overflow-hidden border-2 border-accent-medium shadow-[0_24px_60px_rgba(22,163,74,0.18),0_8px_24px_rgba(0,0,0,0.1)]">
            <Image
              src="/hero_doctor.png"
              alt="Doctor consulting patient on a tablet"
              width={640}
              height={420}
              className="w-full h-auto block"
              priority
            />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-accent px-6 py-14">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-white">
              <div className="text-3xl font-extrabold font-display">{value}</div>
              <div className="text-sm opacity-85 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 pt-24 pb-20 bg-bg-primary">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-extrabold font-display text-text-primary text-3xl lg:text-4xl mb-4">
              Everything you need for{" "}
              <span className="gradient-text">better healthcare</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-[520px] mx-auto">
              A complete digital health platform designed for patients, doctors, and healthcare administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="stat-card cursor-default p-8">
                <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-5`}>
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-bold text-text-primary mb-2.5">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-6 py-20 bg-bg-secondary">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-extrabold font-display text-text-primary text-3xl lg:text-4xl mb-3.5">
              Get started in <span className="gradient-text">3 simple steps</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map(({ num, icon: Icon, title, desc }) => (
              <div key={num} className="text-center px-6 py-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-5 shadow-btn">
                  <Icon size={24} className="text-white" />
                </div>
                <div className="text-xs font-bold text-accent tracking-widest uppercase mb-2">STEP {num}</div>
                <h3 className="font-bold text-text-primary text-base mb-2.5">{title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="px-6 py-20 bg-bg-card">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-extrabold font-display text-text-primary text-3xl lg:text-4xl">
              Loved by <span className="gradient-text">thousands</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, text, rating }) => (
              <div key={name} className="stat-card p-7">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={15} className="text-accent fill-accent" />
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-5">&ldquo;{text}&rdquo;</p>
                <div>
                  <p className="font-bold text-text-primary text-sm">{name}</p>
                  <p className="text-text-muted text-xs">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-linear-to-r from-accent-dark via-accent to-accent-light px-6 py-20 text-center">
        <div className="max-w-[640px] mx-auto">
          <h2 className="font-extrabold font-display text-white text-3xl lg:text-4xl mb-4">
            Ready to take control of your health?
          </h2>
          <p className="text-white/85 text-lg mb-8 leading-relaxed">
            Join thousands of patients and doctors already using MedConnect.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-accent-dark font-extrabold px-9 py-3.5 rounded-[10px] text-base no-underline shadow-[0_4px_14px_rgba(0,0,0,0.15)] hover:-translate-y-0.5 hover:shadow-lg transition-all"
          >
            Create Free Account <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-text-primary text-white/70 py-10 px-6 text-center">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3.5">
            <Activity size={18} className="text-accent-light" />
            <span className="font-bold text-white font-display">MedConnect</span>
          </div>
          <p className="text-sm">© 2026 MedConnect. Your health, digitized.</p>
        </div>
      </footer>
    </div>
  );
}
