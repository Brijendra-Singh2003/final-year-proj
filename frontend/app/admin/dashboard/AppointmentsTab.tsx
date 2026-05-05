"use client";
import { useState } from "react";

interface User { id: number; name: string; }
interface Appointment { id: number; patient_id: number; doctor_id: number; date: string; time_slot: string; status: string; patient?: User; doctor?: User; }

const STATUS_COLORS: Record<string, string> = { pending: "#f59e0b", confirmed: "#10b981", cancelled: "#ef4444" };

export default function AppointmentsTab({ appointments }: { appointments: Appointment[] }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "pending", "confirmed", "cancelled"].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className="btn-ghost"
            style={{ padding: "0.4rem 1rem", background: filter === s ? "var(--accent-glow)" : undefined, borderColor: filter === s ? "var(--accent)" : undefined, color: filter === s ? "var(--accent-light)" : undefined }}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
            <span className="ml-1 text-xs opacity-60">
              ({s === "all" ? appointments.length : appointments.filter(a => a.status === s).length})
            </span>
          </button>
        ))}
      </div>
      <div className="glass p-6">
        <div className="table-container">
          <table>
            <thead><tr><th>ID</th><th>Patient</th><th>Doctor</th><th>Date</th><th>Slot</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>#{a.id}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{a.patient?.name ?? `#${a.patient_id}`}</td>
                  <td>{a.doctor?.name ?? `#${a.doctor_id}`}</td>
                  <td>{a.date}</td>
                  <td>{a.time_slot}</td>
                  <td>
                    <span className="badge" style={{ background: STATUS_COLORS[a.status] + "22", color: STATUS_COLORS[a.status], border: `1px solid ${STATUS_COLORS[a.status]}44` }}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
