import React from 'react';

export default function Header({ title }: { title?: string }) {
  return (
    <header className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-indigo-50">
          <svg className="w-8 h-8 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#eef2ff" />
            <path d="M7 12h10M12 7v10" stroke="#4f46e5" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="text-lg font-semibold">{title || 'Dashboard'}</div>
          <div className="text-sm text-gray-500">Welcome to Smart Health Portal</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-sm text-gray-600 hover:text-gray-800">Help</button>
        <div className="flex items-center gap-2">
          <img src="/avatar.png" alt="avatar" className="w-8 h-8 rounded-full" />
          <div className="text-sm">John Doe</div>
        </div>
      </div>
    </header>
  );
}
