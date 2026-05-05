"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getPatientRecords, appendReport, createLabAssignment, getLabUsers, createPatientRecord } from "@/lib/api";
import { FileText, ChevronDown, ChevronUp, Plus, X, Pill, UploadCloud } from "lucide-react";

interface Report {
  id: number; content: string; diagnosis?: string; prescription?: string;
  created_at: string; doctor: { name: string };
}
interface TestFile {
  id: number; original_filename: string; size_bytes: number;
  created_at: string; hash_algo: string; hash_hex: string;
}
interface MedicalRecord {
  id: number; summary?: string; created_at: string;
  reports: Report[]; test_result_files: TestFile[];
}
interface LabUser { id: number; name: string; }

export default function PatientHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [activeTabByRecord, setActiveTabByRecord] = useState<Record<number, "diagnostics" | "labs">>({});
  const [labUsers, setLabUsers] = useState<LabUser[]>([]);
  const [labUserId, setLabUserId] = useState<string>("");
  const [assigning, setAssigning] = useState<number | null>(null);

  // New record modal
  const [newRecordModal, setNewRecordModal] = useState(false);
  const [newRecordSummary, setNewRecordSummary] = useState("");
  const [creatingRecord, setCreatingRecord] = useState(false);

  // Report modal
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
  useEffect(() => { getLabUsers().then((res) => setLabUsers(res.data)).catch(() => {}); }, []);

  const toggle = (rid: number) =>
    setExpanded((prev) => prev.includes(rid) ? prev.filter((x) => x !== rid) : [...prev, rid]);

  const handleCreateRecord = async () => {
    setCreatingRecord(true);
    try {
      await createPatientRecord(parseInt(id), { summary: newRecordSummary || undefined });
      setNewRecordModal(false);
      setNewRecordSummary("");
      fetchRecords();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      alert(e?.response?.data?.detail || "Failed to create record");
    } finally {
      setCreatingRecord(false);
    }
  };

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
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Patient <span className="gradient-text">History</span></h1>
          <button className="btn-primary" onClick={() => setNewRecordModal(true)}>
            <Plus size={15} /> New Record
          </button>
        </div>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>View and manage patient medical records</p>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
        ) : records.length === 0 ? (
          <div className="glass p-12 text-center">
            <FileText size={40} style={{ margin: "0 auto 1rem", color: "var(--text-secondary)" }} />
            <p style={{ color: "var(--text-secondary)" }}>No records yet. Create one to get started.</p>
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
                    <div className="inline-flex items-center gap-1 p-1 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                      {(["diagnostics", "labs"] as const).map((tab) => {
                        const active = (activeTabByRecord[rec.id] ?? "diagnostics") === tab;
                        return (
                          <button key={tab} type="button"
                            onClick={() => setActiveTabByRecord((prev) => ({ ...prev, [rec.id]: tab }))}
                            className={"px-3 py-2 text-sm font-semibold transition border-b-3 " +
                              (active ? "border-accent-light" : "text-text-secondary border-transparent")}>
                            {tab === "diagnostics" ? "Diagnostics" : "Lab results"}
                          </button>
                        );
                      })}
                    </div>

                    {(activeTabByRecord[rec.id] ?? "diagnostics") === "diagnostics" ? (
                      <div className="space-y-4">
                        <button className="btn-primary" onClick={() => setReportModal({ recordId: rec.id })}>
                          <Plus size={15} /> Add Report
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
                    ) : (
                      <div className="p-4 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                        <p className="font-bold mb-3">Lab test results</p>
                        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
                          <div className="flex-1">
                            <label className="text-sm">Lab uploader</label>
                            <select className="input" value={labUserId} onChange={(e) => setLabUserId(e.target.value)}>
                              <option value="">Select a lab…</option>
                              {labUsers.map((u) => (
                                <option key={u.id} value={u.id}>{u.name}</option>
                              ))}
                            </select>
                          </div>
                          <button className="btn-secondary" disabled={!labUserId || assigning === rec.id}
                            onClick={async () => {
                              const labId = parseInt(labUserId);
                              if (Number.isNaN(labId)) return alert("Select a lab uploader");
                              setAssigning(rec.id);
                              try {
                                await createLabAssignment(rec.id, { lab_user_id: labId });
                                alert("Assigned lab uploader. They can upload once.");
                              } catch (err: unknown) {
                                const e = err as { response?: { data?: { detail?: string } } };
                                alert(e?.response?.data?.detail || "Failed to assign lab");
                              } finally {
                                setAssigning(null);
                              }
                            }}>
                            <UploadCloud size={15} /> {assigning === rec.id ? "Assigning…" : "Assign lab"}
                          </button>
                        </div>
                        <div className="mt-4">
                          {rec.test_result_files.length === 0 ? (
                            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No uploaded test files yet.</p>
                          ) : (
                            <div className="space-y-2">
                              {rec.test_result_files.map((f) => (
                                <div key={f.id} className="flex items-center justify-between gap-3 p-3 rounded-lg"
                                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-sm truncate">{f.original_filename}</p>
                                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                      {new Date(f.created_at).toLocaleString()} · {(f.size_bytes / 1024).toFixed(1)} KB
                                    </p>
                                  </div>
                                  <a className="btn-secondary"
                                    href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/files/${f.id}/download`}
                                    target="_blank" rel="noreferrer">
                                    Download
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* New Record Modal */}
        {newRecordModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
            <div className="glass p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">New Medical Record</h3>
                <button onClick={() => setNewRecordModal(false)}
                  style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}>
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label>Summary / Reason for visit</label>
                  <input className="input" placeholder="e.g. Follow-up for hypertension"
                    value={newRecordSummary} onChange={(e) => setNewRecordSummary(e.target.value)} />
                </div>
                <button className="btn-primary w-full justify-center"
                  disabled={creatingRecord} onClick={handleCreateRecord}>
                  {creatingRecord ? "Creating…" : "Create Record"}
                </button>
              </div>
            </div>
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
                  <textarea className="input" rows={4} style={{ resize: "none" }}
                    placeholder="Clinical notes…" value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })} />
                </div>
                <div>
                  <label>Diagnosis</label>
                  <input type="text" className="input" placeholder="e.g. Hypertension Stage 1"
                    value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })} />
                </div>
                <div>
                  <label>Prescription</label>
                  <textarea className="input" rows={2} style={{ resize: "none" }}
                    placeholder="Medications, dosage…" value={form.prescription}
                    onChange={(e) => setForm({ ...form, prescription: e.target.value })} />
                </div>
                <button className="btn-primary w-full justify-center"
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
