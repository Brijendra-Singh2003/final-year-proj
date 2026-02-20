import React from "react";
import DashboardLayout from "../components/DashboardLayout";

const SmallStat = ({ label, value }) => (
  <div className="bg-white p-3 rounded shadow-sm">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="mt-1 text-xl font-semibold text-gray-800">{value}</div>
  </div>
);

export default function DoctorDashboard() {
  return (
    <DashboardLayout title="Doctor Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SmallStat label="Today" value={6} />
        <SmallStat label="This Week" value={28} />
        <SmallStat label="Pending Lab Results" value={4} />
        <SmallStat label="Unread Messages" value={5} />
      </div>

      <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white p-4 rounded shadow-sm">
          <h4 className="font-semibold mb-2">Upcoming Appointments</h4>
          <ul className="divide-y">
            <li className="py-3 flex justify-between items-center">
              <div>
                <div className="font-medium">John Smith</div>
                <div className="text-sm text-gray-500">General Checkup</div>
              </div>
              <div className="text-sm text-gray-600">Mar 03, 2026 — 09:00</div>
            </li>
            <li className="py-3 flex justify-between items-center">
              <div>
                <div className="font-medium">Mary Johnson</div>
                <div className="text-sm text-gray-500">Follow-up</div>
              </div>
              <div className="text-sm text-gray-600">Mar 03, 2026 — 09:45</div>
            </li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow-sm">
          <h4 className="font-semibold mb-2">Quick Actions</h4>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 bg-indigo-50 rounded">Create Prescription</button>
            <button className="w-full text-left px-3 py-2 bg-indigo-50 rounded">Request Lab</button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
