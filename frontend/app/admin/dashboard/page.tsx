"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getAllUsers, deleteUser } from "@/lib/api";
import { Users, Trash2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface User { id: number; name: string; email: string; role: string; specialty?: string; phone?: string; created_at: string; }

export default function AdminDashboard() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    await deleteUser(id);
    fetchUsers();
  };

  const filtered = filter === "all" ? users : users.filter((u) => u.role === filter);

  const counts = {
    all: users.length,
    patient: users.filter((u) => u.role === "patient").length,
    doctor: users.filter((u) => u.role === "doctor").length,
    admin: users.filter((u) => u.role === "admin").length,
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">
            Admin <span className="gradient-text">Dashboard</span>
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Manage all users on the platform</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Users", value: counts.all, color: "#3b82f6" },
            { label: "Patients", value: counts.patient, color: "#10b981" },
            { label: "Doctors", value: counts.doctor, color: "#a78bfa" },
            { label: "Admins", value: counts.admin, color: "#fb7185" },
          ].map(({ label, value, color }) => (
            <div key={label} className="stat-card">
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {["all", "patient", "doctor", "admin"].map((r) => (
            <button key={r} onClick={() => setFilter(r)}
              className="btn-ghost"
              style={{
                padding: "0.4rem 1rem",
                background: filter === r ? "var(--accent-glow)" : undefined,
                borderColor: filter === r ? "var(--accent)" : undefined,
                color: filter === r ? "var(--accent-light)" : undefined,
              }}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        {/* Users table */}
        <div className="glass p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users size={20} style={{ color: "var(--accent)" }} />
            <h2 className="text-lg font-bold">
              {filter === "all" ? "All Users" : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
            </h2>
          </div>

          {loading ? (
            <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr><th>Name</th><th>Email</th><th>Role</th><th>Specialty</th><th>Joined</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                        {u.name}
                        {u.id === me?.id && (
                          <span className="ml-2 badge badge-admin" style={{ fontSize: "0.6rem" }}>You</span>
                        )}
                      </td>
                      <td>{u.email}</td>
                      <td><span className={`badge badge-${u.role}`}>{u.role}</span></td>
                      <td>{u.specialty || "—"}</td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        {u.id !== me?.id ? (
                          <button id={`delete-user-${u.id}`} onClick={() => handleDelete(u.id, u.name)} className="btn-danger"
                            style={{ padding: "0.3rem 0.7rem", fontSize: "0.75rem" }}>
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
          )}
        </div>
      </main>
    </div>
  );
}
