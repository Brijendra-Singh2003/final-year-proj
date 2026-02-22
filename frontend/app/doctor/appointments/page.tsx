"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getDoctorAppointments, confirmAppointment } from "@/lib/api";
import { Calendar, CheckCircle } from "lucide-react";

interface Appointment {
  id: number; date: string; time_slot: string;
  status: "pending" | "confirmed" | "cancelled"; notes?: string;
  patient: { id: number; name: string };
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    getDoctorAppointments().then((r) => setAppointments(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const confirm = async (id: number) => {
    await confirmAppointment(id);
    fetch();
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">All <span className="gradient-text">Appointments</span></h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>Manage and confirm patient appointments</p>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
        ) : appointments.length === 0 ? (
          <div className="glass p-12 text-center">
            <Calendar size={40} style={{ margin: "0 auto 1rem", color: "var(--text-secondary)" }} />
            <p style={{ color: "var(--text-secondary)" }}>No appointments yet.</p>
          </div>
        ) : (
          <div className="glass p-6">
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Patient</th><th>Date</th><th>Time</th><th>Status</th><th>Notes</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id}>
                      <td style={{ color: "var(--text-primary)", fontWeight: 600 }}>{a.patient?.name}</td>
                      <td>{a.date}</td>
                      <td>{a.time_slot}</td>
                      <td><span className={`badge badge-${a.status}`}>{a.status}</span></td>
                      <td>{a.notes || "—"}</td>
                      <td>
                        {a.status === "pending" && (
                          <button id={`confirm-appt-${a.id}`} onClick={() => confirm(a.id)} className="btn-success"
                            style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }}>
                            <CheckCircle size={13} /> Confirm
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
