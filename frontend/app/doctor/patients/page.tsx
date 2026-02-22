"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getMyPatients } from "@/lib/api";
import { Users, User } from "lucide-react";
import Link from "next/link";

interface Patient { id: number; name: string; email: string; phone?: string; }

export default function DoctorPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyPatients().then((r) => setPatients(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">My <span className="gradient-text">Patients</span></h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
          All patients who have booked with you
        </p>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
        ) : patients.length === 0 ? (
          <div className="glass p-12 text-center">
            <Users size={40} style={{ margin: "0 auto 1rem", color: "var(--text-secondary)" }} />
            <p style={{ color: "var(--text-secondary)" }}>No patients yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {patients.map((p) => (
              <Link key={p.id} href={`/doctor/patients/${p.id}`}
                style={{ textDecoration: "none" }}
                className="glass p-5 flex items-center gap-4 hover:border-blue-500/50 transition-all">
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold"
                  style={{ background: "linear-gradient(135deg,#a78bfa,#6366f1)", color: "white" }}>
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold" style={{ color: "var(--text-primary)" }}>{p.name}</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{p.email}</p>
                  {p.phone && <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{p.phone}</p>}
                </div>
                <User size={16} style={{ color: "var(--accent)" }} />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
