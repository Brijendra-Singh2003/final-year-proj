import React from 'react';
import { useState } from 'react';
import { HomeIcon, CalendarIcon, UserGroupIcon, UserIcon, DocumentTextIcon, ClipboardDocumentCheckIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const ICONS: Record<string, any> = {
  '/dashboard': HomeIcon,
  '/appointments': CalendarIcon,
  '/appointments/book': CalendarIcon,
  '/doctors': UserGroupIcon,
  '/patients': UserIcon,
  '/prescriptions': ClipboardDocumentCheckIcon,
  '/records/upload': DocumentTextIcon,
  '/profile': UserIcon,
  '/logout': ArrowRightOnRectangleIcon
};

export default function Sidebar({ onNavigate }: { onNavigate?: (p: string) => void }) {
  const [active, setActive] = useState('/dashboard');
  const nav = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/appointments', label: 'Appointments' },
    { to: '/doctors', label: 'Doctors' },
    { to: '/patients', label: 'Patients' },
    { to: '/prescriptions', label: 'Prescriptions' },
    { to: '/records/upload', label: 'Medical Records' },
    { to: '/profile', label: 'Profile' },
    { to: '/logout', label: 'Logout' }
  ];

  return (
    <aside className="w-64 bg-white border-r h-screen p-4">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-indigo-50">
            <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="6" fill="#eef2ff" /><path d="M7 12h10M12 7v10" stroke="#4f46e5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div>
            <div className="text-sm text-gray-500">Hospital Portal</div>
            <div className="font-semibold">Smart Health</div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {nav.map((n) => {
          const Icon = ICONS[n.to] || HomeIcon;
          const isActive = active === n.to;
          return (
            <button
              key={n.to}
              onClick={() => { setActive(n.to); onNavigate && onNavigate(n.to); }}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm w-full text-left ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon className="w-5 h-5" />
              <span>{n.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
