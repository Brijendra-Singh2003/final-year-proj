import React from 'react'
import StatsCard from './components/StatsCard'
import RecentAppointments from './components/RecentAppointments'

const Dashboard: React.FC = () => {
  const userName = localStorage.getItem('user_name') || 'Dr. Alex'

  // mock stats; in a real app these would come from API calls
  const stats = {
    totalAppointments: 128,
    upcomingAppointments: 6,
    totalPatients: 5420,
    activePrescriptions: 214,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Welcome back, <span className="text-green-600">{userName}</span></h1>
            <p className="text-sm text-slate-500 mt-1">Here's what's happening with your practice today.</p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white rounded-lg shadow-sm text-sm text-slate-700">Settings</button>
            <div className="w-10 h-10 bg-white rounded-full shadow flex items-center justify-center">A</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Total Appointments" value={stats.totalAppointments} icon={(
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M8 7V3M16 7V3M3 11h18M5 21h14a2 2 0 002-2V7H3v12a2 2 0 002 2z"/></svg>
          )} />

          <StatsCard title="Upcoming" value={stats.upcomingAppointments} accent="from-blue-400 to-indigo-500" icon={(
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/></svg>
          )} />

          <StatsCard title="Total Patients" value={stats.totalPatients} accent="from-purple-400 to-pink-400" icon={(
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16 11c1.657 0 3-1.343 3-3S17.657 5 16 5s-3 1.343-3 3 1.343 3 3 3zM6 11c1.657 0 3-1.343 3-3S7.657 5 6 5 3 6.343 3 8s1.343 3 3 3zM6 13c-2.667 0-8 1.333-8 4v2h20v-2c0-2.667-5.333-4-8-4z"/></svg>
          )} />

          <StatsCard title="Active Prescriptions" value={stats.activePrescriptions} accent="from-green-400 to-emerald-500" icon={(
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8"/></svg>
          )} />
        </div>

        {/* Main grid: recent + actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentAppointments />
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Quick Actions</h3>

              <div className="flex flex-col gap-3">
                <button className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow hover:scale-[1.01] transform transition">Book Appointment</button>
                <button className="w-full py-3 rounded-lg bg-white border text-slate-700 hover:bg-slate-50 transition">Add Patient</button>
                <button className="w-full py-3 rounded-lg bg-white border text-slate-700 hover:bg-slate-50 transition">Upload Report</button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Notifications</h3>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>New lab result for <strong>Emily Stone</strong></li>
                <li>Appointment <strong>A-1002</strong> needs confirmation</li>
                <li>Prescription renewal request from <strong>Liam Smith</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
import React from 'react';
import DashboardLayout from './layouts/DashboardLayout';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="small">Upcoming Appointments</div>
          <div className="text-2xl font-bold mt-2">3</div>
        </div>
        <div className="card">
          <div className="small">Active Prescriptions</div>
          <div className="text-2xl font-bold mt-2">2</div>
        </div>
        <div className="card">
          <div className="small">Unread Messages</div>
          <div className="text-2xl font-bold mt-2">1</div>
        </div>
      </div>

      <div className="mt-6 card">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="small mt-2">No recent activity to show.</p>
      </div>
    </DashboardLayout>
  );
}
