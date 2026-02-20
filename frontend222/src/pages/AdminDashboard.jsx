import React from "react";
import DashboardLayout from "../components/DashboardLayout";

const AdminStat = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="mt-2 text-3xl font-bold text-gray-800">{value}</div>
  </div>
);

export default function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AdminStat title="Total Patients" value={1240} />
        <AdminStat title="Total Doctors" value={62} />
        <AdminStat title="Pending Bills" value={18} />
      </div>

      <section className="mt-6 bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-3">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">API Latency</div>
            <div className="text-xl font-medium">120ms</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">DB Connections</div>
            <div className="text-xl font-medium">12 / 100</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Background Jobs</div>
            <div className="text-xl font-medium">3 running</div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
