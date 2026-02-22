"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getMyRecords } from "@/lib/api";
import { FileText, ChevronDown, ChevronUp, Pill, Stethoscope } from "lucide-react";

interface Report {
  id: number; content: string; diagnosis?: string; prescription?: string;
  created_at: string; doctor: { name: string; specialty?: string };
}
interface Record { id: number; summary?: string; created_at: string; reports: Report[]; }

export default function RecordsPage() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number[]>([]);

  useEffect(() => {
    getMyRecords().then((res) => setRecords(res.data)).finally(() => setLoading(false));
  }, []);

  const toggle = (id: number) =>
    setExpanded((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

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
