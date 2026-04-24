"use client";
import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { getAllUsers, deleteUser, getAllAppointments, getAdminStats } from "@/lib/api";
import { BarChart3, Users, CalendarDays, ScrollText } from "lucide-react";
import { useAuth, User } from "@/context/AuthContext";
import OverviewTab from "./OverviewTab";
import UsersTab from "./UsersTab";
import AppointmentsTab from "./AppointmentsTab";
import AuditLogsTab from "./AuditLogsTab";

interface Appointment { id: number; patient_id: number; doctor_id: number; date: string; time_slot: string; status: string; patient?: User; doctor?: User; }
interface Stats {
  users: Record<string, number>;
  appointments: { total: number; pending: number; confirmed: number; cancelled: number };
  records: number; reports: number; lab_assignments: number; audit_logs: number;
}

const TABS = ["Overview", "Users", "Appointments", "Audit Logs"] as const;
type Tab = typeof TABS[number];
const TAB_ICONS = { Overview: BarChart3, Users: Users, Appointments: CalendarDays, "Audit Logs": ScrollText };

export default function AdminDashboard() {
  const { user: me } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [u, a, s] = await Promise.all([getAllUsers(), getAllAppointments(), getAdminStats()]);
      setUsers(u.data);
      setAppointments(a.data);
      setStats(s.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    await deleteUser(id);
    fetchAll();
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-1">Admin <span className="gradient-text">Dashboard</span></h1>
          <p style={{ color: "var(--text-secondary)" }}>Platform overview and management</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6" style={{ borderBottom: "1px solid var(--border)" }}>
          {TABS.map((tab) => {
            const Icon = TAB_ICONS[tab];
            return (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={"flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 "
                  + (activeTab === tab ? "text-accent-dark border-accent " : "border-transparent")
                }>
                <Icon size={15} /> {tab}
              </button>
            );
          })}
        </div>

        {loading && activeTab !== "Audit Logs" ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
        ) : (
          <>
            {activeTab === "Overview" && <OverviewTab stats={stats} />}
            {activeTab === "Users" && <UsersTab users={users} me={me} onDelete={handleDelete} />}
            {activeTab === "Appointments" && <AppointmentsTab appointments={appointments} />}
            {activeTab === "Audit Logs" && <AuditLogsTab />}
          </>
        )}
      </main>
    </div>
  );
}
