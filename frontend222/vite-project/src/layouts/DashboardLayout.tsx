import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onNavigate={() => {}} />
      <div className="flex-1 p-6">
        <Header />
        <main className="mt-6">{children}</main>
      </div>
    </div>
  );
}
