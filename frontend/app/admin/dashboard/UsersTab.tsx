"use client";
import { useState } from "react";
import { Trash2, ShieldCheck } from "lucide-react";
import { User } from "@/context/AuthContext";

export default function UsersTab({ users, me, onDelete }: { users: User[]; me: User | null; onDelete: (id: number, name: string) => void }) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? users : users.filter((u) => u.role === filter);

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "patient", "doctor", "lab", "admin"].map((r) => (
          <button key={r} onClick={() => setFilter(r)} className="btn-ghost"
            style={{ padding: "0.4rem 1rem", background: filter === r ? "var(--accent-glow)" : undefined, borderColor: filter === r ? "var(--accent)" : undefined, color: filter === r ? "var(--accent-light)" : undefined }}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
            <span className="ml-1 text-xs opacity-60">
              ({r === "all" ? users.length : users.filter(u => u.role === r).length})
            </span>
          </button>
        ))}
      </div>
      <div className="glass p-6">
        <div className="table-container">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Specialty</th><th>Phone</th><th>Joined</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {u.name}
                    {u.id === me?.id && <span className="ml-2 badge badge-admin" style={{ fontSize: "0.6rem" }}>You</span>}
                  </td>
                  <td>{u.email}</td>
                  <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                  <td>{u.specialty || "—"}</td>
                  <td>{u.phone || "—"}</td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    {u.id !== me?.id ? (
                      <button onClick={() => onDelete(u.id, u.name)} className="btn-danger" style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }}>
                        <Trash2 size={13} /> Delete
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <ShieldCheck size={13} /> Protected
                      </span>
                    )}
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
