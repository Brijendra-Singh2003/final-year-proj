import { BarChart3 } from "lucide-react";

interface Stats {
  users: Record<string, number>;
  appointments: { total: number; pending: number; confirmed: number; cancelled: number };
  records: number;
  reports: number;
  lab_assignments: number;
  audit_logs: number;
}

function StatCard({ label, value, color, sub }: { label: string; value: number | string; color: string; sub?: string }) {
  return (
    <div className="stat-card">
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</p>
      {sub && <p className="text-xs mt-1" style={{ color: "var(--text-secondary)", opacity: 0.7 }}>{sub}</p>}
    </div>
  );
}

export default function OverviewTab({ stats }: { stats: Stats | null }) {
  if (!stats) return <p style={{ color: "var(--text-secondary)" }}>Loading…</p>;
  
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>USERS</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Patients" value={stats.users.patient ?? 0} color="#10b981" />
          <StatCard label="Doctors" value={stats.users.doctor ?? 0} color="#a78bfa" />
          <StatCard label="Labs" value={stats.users.lab ?? 0} color="#f59e0b" />
          <StatCard label="Admins" value={stats.users.admin ?? 0} color="#fb7185" />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>APPOINTMENTS</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.appointments.total} color="#3b82f6" />
          <StatCard label="Pending" value={stats.appointments.pending} color="#f59e0b" />
          <StatCard label="Confirmed" value={stats.appointments.confirmed} color="#10b981" />
          <StatCard label="Cancelled" value={stats.appointments.cancelled} color="#ef4444" />
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>RECORDS & ACTIVITY</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Medical Records" value={stats.records} color="#06b6d4" />
          <StatCard label="Reports" value={stats.reports} color="#a78bfa" />
          <StatCard label="Lab Assignments" value={stats.lab_assignments} color="#f59e0b" />
          <StatCard label="Audit Events" value={stats.audit_logs} color="#6b7280" />
        </div>
      </div>
    </div>
  );
}
