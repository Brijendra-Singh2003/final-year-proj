"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getDoctorAppointments, confirmAppointment } from "@/lib/api";
import { Calendar, CheckCircle, Clock, Users } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Appointment {
  id: number; date: string; time_slot: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  patient: { id: number; name: string; email: string; phone?: string };
}

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppts = async () => {
    try {
      const res = await getDoctorAppointments();
      setAppointments(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppts(); }, []);

  const handleConfirm = async (id: number) => {
    await confirmAppointment(id);
    fetchAppts();
  };

  const today = new Date().toISOString().split("T")[0];
  const todayAppts = appointments.filter((a) => a.date === today && a.status !== "cancelled");
  const pending = appointments.filter((a) => a.status === "pending");

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Welcome, <span className="gradient-text">Dr. {user?.name}</span></h1>
          <p style={{ color: "var(--text-secondary)" }}>{user?.specialty} · Manage your appointments and patient records</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Today's Appointments", value: todayAppts.length, icon: Calendar, color: "#3b82f6" },
            { label: "Pending Confirmation", value: pending.length, icon: Clock, color: "#f59e0b" },
            { label: "Total Patients", value: new Set(appointments.map((a) => a.patient?.id)).size, icon: Users, color: "#a78bfa" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ background: `${color}20` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        <Link href="/doctor/patients" className="btn-primary mb-8 inline-flex">
          <Users size={15} /> View My Patients
        </Link>

        {/* Appointments */}
        <div className="glass p-6">
          <h2 className="text-xl font-bold mb-4">All Appointments</h2>
          {loading ? (
            <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={40} style={{ color: "var(--text-secondary)", margin: "0 auto 1rem" }} />
              <p style={{ color: "var(--text-secondary)" }}>No appointments yet.</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Patient</th><th>Date</th><th>Time</th><th>Status</th><th>Notes</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id}>
                      <td>
                        <Link href={`/doctor/patients/${a.patient?.id}`}
                          style={{ color: "var(--accent-light)", fontWeight: 600, textDecoration: "none" }}>
                          {a.patient?.name}
                        </Link>
                      </td>
                      <td>{a.date}</td>
                      <td>{a.time_slot}</td>
                      <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                      <td className="max-w-xs truncate">{a.notes || "—"}</td>
                      <td>
                        {a.status === "pending" && (
                          <button id={`confirm-${a.id}`} onClick={() => handleConfirm(a.id)} className="btn-success" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }}>
                            <CheckCircle size={13} /> Confirm
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
