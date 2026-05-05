"use client";
import { useEffect, useState, useCallback } from "react";
import { getAuditLogs, verifyAuditChain } from "@/lib/api";
import { ShieldAlert, CheckCircle2, XCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface AuditEntry { id: number; user_id: number | null; action: string; resource_type: string | null; resource_id: number | null; details: string | null; ip_address: string | null; timestamp: string; }

const ACTION_COLORS: Record<string, string> = {
  "auth.login": "#10b981", "auth.logout": "#6b7280", "auth.login_failed": "#ef4444",
  "appointment.booked": "#3b82f6", "appointment.cancelled": "#ef4444", "appointment.confirmed": "#10b981",
  "report.created": "#a78bfa", "file.uploaded": "#f59e0b", "file.downloaded": "#06b6d4",
  "admin.user_deleted": "#ef4444", "user.register": "#10b981", "records.viewed": "#6b7280",
};

const ALL_ACTIONS = ["auth.login", "auth.logout", "auth.login_failed", "user.register", "appointment.booked", "appointment.cancelled", "appointment.confirmed", "report.created", "file.uploaded", "file.downloaded", "records.viewed", "admin.user_deleted"];
const LIMIT = 20;

export default function AuditLogsTab() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [actionFilter, setActionFilter] = useState("");
  const [chainStatus, setChainStatus] = useState<{ valid: boolean; first_broken_id: number | null } | null>(null);
  const [verifying, setVerifying] = useState(false);

  const fetchLogs = useCallback(async () => {
    const res = await getAuditLogs({ skip: page * LIMIT, limit: LIMIT, action: actionFilter || undefined });
    setLogs(res.data.items);
    setTotal(res.data.total);
  }, [page, actionFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await verifyAuditChain();
      setChainStatus(res.data);
    } finally {
      setVerifying(false);
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-4">
      {/* Chain integrity banner */}
      <div className="glass p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1">
          <p className="font-semibold text-sm">Chain Integrity</p>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Verify that no audit log entry has been tampered with</p>
        </div>
        {chainStatus && (
          <div className={`flex items-center gap-2 text-sm font-semibold ${chainStatus.valid ? "text-green-400" : "text-red-400"}`}>
            {chainStatus.valid ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            {chainStatus.valid ? "Chain intact" : `Broken at entry #${chainStatus.first_broken_id}`}
          </div>
        )}
        <button onClick={handleVerify} disabled={verifying} className="btn-ghost" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>
          <ShieldAlert size={14} /> {verifying ? "Verifying…" : "Verify Chain"}
        </button>
      </div>

      <div className="glass p-6">
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <select value={actionFilter} onChange={(e) => { setActionFilter(e.target.value); setPage(0); }}
            className="px-3 py-2 border border-border rounded-btn text-sm"
          >
            <option value="">All actions</option>
            {ALL_ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <span className="text-xs ml-auto" style={{ color: "var(--text-secondary)" }}>{total} total events</span>
        </div>

        <div className="table-container">
          <table>
            <thead><tr><th>#</th><th>Timestamp</th><th>Action</th><th>User</th><th>Resource</th><th>Details</th><th>IP</th></tr></thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{l.id}</td>
                  <td style={{ fontSize: "0.78rem", whiteSpace: "nowrap" }}>{new Date(l.timestamp).toLocaleString()}</td>
                  <td>
                    <span className="badge" style={{ background: (ACTION_COLORS[l.action] ?? "#6b7280") + "22", color: ACTION_COLORS[l.action] ?? "#6b7280", border: `1px solid ${(ACTION_COLORS[l.action] ?? "#6b7280")}44`, fontSize: "0.7rem" }}>
                      {l.action}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.8rem" }}>{l.user_id ? `#${l.user_id}` : "—"}</td>
                  <td style={{ fontSize: "0.8rem" }}>{l.resource_type ? `${l.resource_type} #${l.resource_id}` : "—"}</td>
                  <td style={{ fontSize: "0.75rem", color: "var(--text-secondary)", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.details || "—"}</td>
                  <td style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{l.ip_address || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end gap-2 mt-4">
            <button onClick={() => setPage(p => p - 1)} disabled={page === 0} className="btn-ghost" style={{ padding: "0.3rem 0.6rem" }}>
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>Page {page + 1} of {totalPages}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1} className="btn-ghost" style={{ padding: "0.3rem 0.6rem" }}>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
