"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { getMyAppointments, cancelAppointment } from "@/lib/api";
import { Calendar, Clock, UserCheck, XCircle, Activity } from "lucide-react";
import Link from "next/link";

interface Appointment {
  id: number;
  date: string;
  time_slot: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  doctor: { id: number; name: string; specialty?: string };
}

export default function PatientDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppts = async () => {
    try {
      const res = await getMyAppointments();
      setAppointments(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppts(); }, []);

  const handleCancel = async (id: number) => {
    if (!confirm("Cancel this appointment?")) return;
    await cancelAppointment(id);
    fetchAppts();
  };

  const upcoming = appointments.filter((a) => a.status !== "cancelled");
  const stats = {
    total: appointments.length,
    upcoming: upcoming.length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display mb-1">
            Good day, <span className="gradient-text">{user?.name}</span> 👋
          </h1>
          <p className="text-text-secondary">Here&apos;s an overview of your health activity</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Appointments", value: stats.total, icon: Calendar, color: "#3b82f6" },
            { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "#a78bfa" },
            { label: "Confirmed", value: stats.confirmed, icon: UserCheck, color: "#10b981" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ background: `${color}20` }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{value}</p>
                <p className="text-sm text-text-secondary">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8">
          <Link href="/patient/search" className="btn-primary">
            <Activity size={16} /> Book Appointment
          </Link>
          <Link href="/patient/records" className="btn-ghost">
            <Calendar size={16} /> View Records
          </Link>
        </div>

        {/* Appointments table */}
        <div className="glass p-6">
          <h2 className="text-xl font-bold font-display mb-4">My Appointments</h2>
          {loading ? (
            <p className="text-text-secondary">Loading…</p>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar size={40} className="text-text-secondary mx-auto mb-4" />
              <p className="text-text-secondary">No appointments yet.</p>
              <Link href="/patient/search" className="btn-primary mt-4 inline-flex">Book your first appointment</Link>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialty</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id}>
                      <td className="font-semibold text-text-primary">Dr. {a.doctor?.name}</td>
                      <td>{a.doctor?.specialty || "—"}</td>
                      <td>{a.date}</td>
                      <td>{a.time_slot}</td>
                      <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                      <td>
                        {a.status !== "cancelled" && (
                          <button id={`cancel-appt-${a.id}`} onClick={() => handleCancel(a.id)} className="btn-danger">
                            <XCircle size={13} /> Cancel
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
