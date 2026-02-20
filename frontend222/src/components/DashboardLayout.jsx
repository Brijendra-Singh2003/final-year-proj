import React from "react";
import { Link } from "react-router-dom";

export default function DashboardLayout({ children, title = "Dashboard" }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white border-r hidden md:block">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600">HealthSys</h1>
        </div>
        <nav className="px-4 py-6">
          <ul className="space-y-2 text-gray-700">
            <li>
              <Link to="/dashboard" className="flex items-center p-2 rounded hover:bg-indigo-50">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/dashboard/patient" className="flex items-center p-2 rounded hover:bg-indigo-50">
                Patient View
              </Link>
            </li>
            <li>
              <Link to="/dashboard/doctor" className="flex items-center p-2 rounded hover:bg-indigo-50">
                Doctor View
              </Link>
            </li>
            <li>
              <Link to="/dashboard/admin" className="flex items-center p-2 rounded hover:bg-indigo-50">
                Admin View
              </Link>
            </li>
            <li>
              <Link to="/appointments" className="flex items-center p-2 rounded hover:bg-indigo-50">
                Appointments
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-1">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center space-x-4">
            <button className="text-sm text-gray-600 hover:text-gray-800">Profile</button>
            <button className="text-sm text-red-500 hover:text-red-600">Logout</button>
          </div>
        </header>

        <main className="p-6">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
