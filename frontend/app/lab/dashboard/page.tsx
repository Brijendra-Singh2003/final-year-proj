"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { getMyLabAssignments } from "@/lib/api";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function LabDashboard() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    getMyLabAssignments()
      .then((res) => setCount(res.data.filter((a: { status: string }) => a.status === "assigned").length))
      .catch(() => setCount(0));
  }, []);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Lab <span className="gradient-text">Dashboard</span></h1>
        <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
          Upload assigned test results for patients.
        </p>

        <div className="glass p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ background: "var(--accent-glow)" }}>
              <FileText size={18} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <p className="font-bold">Active assignments</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {count === null ? "Loading…" : `${count} waiting for upload`}
              </p>
            </div>
          </div>
          <Link href="/lab/assignments" className="btn-primary">
            View assignments
          </Link>
        </div>
      </main>
    </div>
  );
}

