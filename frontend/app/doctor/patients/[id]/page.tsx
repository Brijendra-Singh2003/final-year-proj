"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getPatientRecords, appendReport } from "@/lib/api";
import { FileText, ChevronDown, ChevronUp, Plus, X, Pill } from "lucide-react";

interface Report {
  id: number; content: string; diagnosis?: string; prescription?: string;
  created_at: string; doctor: { name: string };
}
interface Record { id: number; summary?: string; created_at: string; reports: Report[]; }

export default function PatientHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [reportModal, setReportModal] = useState<{ recordId: number } | null>(null);
  const [form, setForm] = useState({ content: "", diagnosis: "", prescription: "" });
  const [saving, setSaving] = useState(false);

  const fetchRecords = async () => {
    try {
      const res = await getPatientRecords(parseInt(id));
      setRecords(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, [id]);

  const toggle = (rid: number) =>
    setExpanded((prev) => prev.includes(rid) ? prev.filter((x) => x !== rid) : [...prev, rid]);

  const handleSaveReport = async () => {
    if (!reportModal) return;
    setSaving(true);
    try {
      await appendReport(reportModal.recordId, form);
      setReportModal(null);
      setForm({ content: "", diagnosis: "", prescription: "" });
      fetchRecords();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      alert(e?.response?.data?.detail || "Failed to save report");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Patient <span className="gradient-text">History</span></h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>View and append reports to patient&apos;s medical records</p>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
        ) : records.length === 0 ? (
          <div className="glass p-12 text-center">
            <FileText size={40} style={{ margin: "0 auto 1rem", color: "var(--text-secondary)" }} />
            <p style={{ color: "var(--text-secondary)" }}>No records for this patient.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((rec) => (
              <div key={rec.id} className="glass">
                <button className="w-full p-5 flex items-center justify-between"
                  onClick={() => toggle(rec.id)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-primary)", textAlign: "left" }}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ background: "var(--accent-glow)" }}>
                      <FileText size={18} style={{ color: "var(--accent)" }} />
                    </div>
                    <div>
                      <p className="font-bold">{rec.summary || "Medical Record"}</p>
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                        {new Date(rec.created_at).toLocaleDateString()} · {rec.reports.length} report(s)
                      </p>
                    </div>
                  </div>
                  {expanded.includes(rec.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {expanded.includes(rec.id) && (
                  <div className="px-5 pb-5 space-y-4">
                    <button id={`add-report-${rec.id}`} className="btn-primary"
                      onClick={() => setReportModal({ recordId: rec.id })}>
                      <Plus size={15} /> Append Report
                    </button>

                    {rec.reports.length === 0 ? (
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No reports yet.</p>
                    ) : rec.reports.map((rpt) => (
                      <div key={rpt.id} className="p-4 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">Dr. {rpt.doctor?.name}</span>
                          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            · {new Date(rpt.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mb-2" style={{ color: "var(--text-secondary)" }}>{rpt.content}</p>
                        {rpt.diagnosis && (
                          <p className="text-sm"><strong style={{ color: "#f59e0b" }}>Diagnosis:</strong> {rpt.diagnosis}</p>
                        )}
                        {rpt.prescription && (
                          <div className="flex items-start gap-1 text-sm mt-1">
                            <Pill size={13} style={{ color: "#10b981", marginTop: 2 }} />
                            <span>{rpt.prescription}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Report Modal */}
        {reportModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
            <div className="glass p-6 w-full max-w-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Append Report</h3>
                <button onClick={() => setReportModal(null)}
                  style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label>Notes / Findings</label>
                  <textarea id="report-content" className="input" rows={4} style={{ resize: "none" }}
                    placeholder="Clinical notes…" value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })} />
                </div>
                <div>
                  <label>Diagnosis</label>
                  <input id="report-diagnosis" type="text" className="input" placeholder="e.g. Hypertension Stage 1"
                    value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
                </div>
                <div>
                  <label>Prescription</label>
                  <textarea id="report-prescription" className="input" rows={2} style={{ resize: "none" }}
                    placeholder="Medications, dosage…" value={form.prescription}
                    onChange={(e) => setForm({ ...form, prescription: e.target.value })} />
                </div>
                <button id="save-report-btn" className="btn-primary w-full justify-center"
                  disabled={!form.content || saving} onClick={handleSaveReport}>
                  {saving ? "Saving…" : "Save Report"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
