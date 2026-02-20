import React from "react";
import DashboardLayout from "../components/DashboardLayout";

const StatCard = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow-sm">
    <div className="text-sm text-gray-500">{title}</div>
    <div className="mt-2 text-2xl font-bold text-gray-800">{value}</div>
  </div>
);

export default function PatientDashboard() {
  return (
    <DashboardLayout title="Patient Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Upcoming Appointments" value={3} />
        <StatCard title="Active Prescriptions" value={2} />
        <StatCard title="Unread Messages" value={1} />
      </div>

      <section className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Next Appointment</h3>
        <div className="bg-white p-4 rounded shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">With</div>
              <div className="text-md font-medium">Dr. Jane Doe</div>
              <div className="text-sm text-gray-500">Cardiology</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Date</div>
              <div className="font-medium">Mar 03, 2026 — 10:30 AM</div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
