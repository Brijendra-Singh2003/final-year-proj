"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { getMyLabAssignments, uploadLabTestResult } from "@/lib/api";
import { FileText, UploadCloud } from "lucide-react";

type Assignment = {
  id: number;
  record_id: number;
  patient_id: number;
  doctor_id: number;
  lab_user_id: number;
  status: "assigned" | "uploaded" | "cancelled" | "expired";
  created_at: string;
  expires_at?: string | null;
  consumed_at?: string | null;
};

export default function LabAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<number | null>(null);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await getMyLabAssignments();
      setAssignments(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const active = useMemo(
    () => assignments.filter((a) => a.status === "assigned"),
    [assignments]
  );
  const others = useMemo(
    () => assignments.filter((a) => a.status !== "assigned"),
    [assignments]
  );

  const onPickFile = async (assignmentId: number, f: File | null) => {
    if (!f) return;
    setUploadingId(assignmentId);
    try {
      await uploadLabTestResult(assignmentId, f);
      alert("Uploaded successfully");
      refresh();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      alert(e?.response?.data?.detail || "Upload failed");
    } finally {
      setUploadingId(null);
    }
  };

  const Card = ({ a }: { a: Assignment }) => (
    <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-bold">Assignment #{a.id}</p>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Record {a.record_id} · Patient {a.patient_id}
            {a.expires_at ? ` · Expires ${new Date(a.expires_at).toLocaleString()}` : ""}
          </p>
        </div>
        <span className={`badge badge-${a.status}`}>{a.status}</span>
      </div>

      {a.status === "assigned" && (
        <div className="mt-4 flex items-center gap-3">
          <label className="btn-secondary cursor-pointer">
            <UploadCloud size={15} />
            {uploadingId === a.id ? "Uploading…" : "Upload file"}
            <input
              type="file"
              className="hidden"
              disabled={uploadingId === a.id}
              onChange={(e) => onPickFile(a.id, e.target.files?.[0] || null)}
            />
          </label>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            One upload only. Ask the doctor to re-assign for another upload.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Lab <span className="gradient-text">Assignments</span></h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
          Upload test results for assignments created by doctors.
        </p>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading…</p>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} style={{ color: "var(--accent)" }} />
                <h2 className="font-bold">Active</h2>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>({active.length})</span>
              </div>
              {active.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No active assignments.</p>
              ) : (
                <div className="space-y-3">{active.map((a) => <Card key={a.id} a={a} />)}</div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText size={16} style={{ color: "var(--text-secondary)" }} />
                <h2 className="font-bold">History</h2>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>({others.length})</span>
              </div>
              {others.length === 0 ? (
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No history yet.</p>
              ) : (
                <div className="space-y-3">{others.map((a) => <Card key={a.id} a={a} />)}</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

