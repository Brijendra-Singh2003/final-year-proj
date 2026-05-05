"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getMyRecords, getMyRecordTestFiles } from "@/lib/api";
import { FileText, ChevronDown, ChevronUp, Pill, Stethoscope, Paperclip } from "lucide-react";

interface Report {
  id: number; content: string; diagnosis?: string; prescription?: string;
  created_at: string; doctor: { name: string; specialty?: string };
}
interface MedicalRecord { id: number; summary?: string; created_at: string; reports: Report[]; }
interface TestFile {
  id: number;
  original_filename: string;
  size_bytes: number;
  created_at: string;
}

export default function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [filesByRecord, setFilesByRecord] = useState<Record<number, TestFile[]>>({});

  useEffect(() => {
    getMyRecords().then((res) => setRecords(res.data)).finally(() => setLoading(false));
  }, []);

  const toggle = async (id: number) => {
    setExpanded((prev: number[]) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    if (!filesByRecord[id]) {
      try {
        const res = await getMyRecordTestFiles(id);
        setFilesByRecord((prev: Record<number, TestFile[]>) => ({ ...prev, [id]: res.data }));
      } catch {
        setFilesByRecord((prev: Record<number, TestFile[]>) => ({ ...prev, [id]: [] }));
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Medical <span className="gradient-text">Records</span></h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>Your complete digital health history</p>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
        ) : records.length === 0 ? (
          <div className="glass p-12 text-center">
            <FileText size={40} style={{ margin: "0 auto 1rem", color: "var(--text-secondary)" }} />
            <p style={{ color: "var(--text-secondary)" }}>No records yet. Book an appointment to get started.</p>
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
                        Created {new Date(rec.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                        {" · "}{rec.reports.length} report{rec.reports.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  {expanded.includes(rec.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {expanded.includes(rec.id) && (
                  <div className="px-5 pb-5">
                    <div className="mb-5 p-4 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                      <div className="flex items-center gap-2 mb-2">
                        <Paperclip size={15} style={{ color: "var(--accent)" }} />
                        <p className="font-bold">Test files</p>
                      </div>
                      {(filesByRecord[rec.id] || []).length === 0 ? (
                        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No test files uploaded yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {(filesByRecord[rec.id] || []).map((f: TestFile) => (
                            <div key={f.id} className="flex items-center justify-between gap-3 p-3 rounded-lg"
                              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border)" }}>
                              <div className="min-w-0">
                                <p className="font-semibold text-sm truncate">{f.original_filename}</p>
                                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                  {new Date(f.created_at).toLocaleString()} · {(f.size_bytes / 1024).toFixed(1)} KB
                                </p>
                              </div>
                              <a
                                className="btn-secondary"
                                href={`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/files/${f.id}/download`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Download
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {rec.reports.length === 0 ? (
                      <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No reports appended yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {rec.reports.map((rpt) => (
                          <div key={rpt.id} className="p-4 rounded-xl"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
                            <div className="flex items-center gap-2 mb-3">
                              <Stethoscope size={15} style={{ color: "var(--accent)" }} />
                              <span className="font-semibold text-sm">Dr. {rpt.doctor?.name}</span>
                              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                                · {new Date(rpt.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>{rpt.content}</p>
                            {rpt.diagnosis && (
                              <div className="flex items-start gap-2 mb-2">
                                <span className="text-xs font-bold" style={{ color: "#f59e0b", minWidth: 70 }}>DIAGNOSIS</span>
                                <span className="text-sm">{rpt.diagnosis}</span>
                              </div>
                            )}
                            {rpt.prescription && (
                              <div className="flex items-start gap-2">
                                <Pill size={13} style={{ color: "#10b981", marginTop: 2 }} />
                                <span className="text-sm">{rpt.prescription}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
