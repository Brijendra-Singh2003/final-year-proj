"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Activity, LogOut, Calendar, FileText, Users, Search, LayoutDashboard } from "lucide-react";

const NAV_LINKS = {
  patient: [
    { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patient/search",    label: "Find Doctors", icon: Search },
    { href: "/patient/records",   label: "My Records",  icon: FileText },
  ],
  doctor: [
    { href: "/doctor/dashboard",     label: "Dashboard",    icon: LayoutDashboard },
    { href: "/doctor/appointments",  label: "Appointments", icon: Calendar },
    { href: "/doctor/patients",      label: "My Patients",  icon: Users },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users",     label: "Users",     icon: Users },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const links = NAV_LINKS[user.role] || [];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-border shadow-[0_2px_12px_rgba(0,0,0,0.05)]">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href={`/${user.role}/dashboard`} className="flex items-center gap-2.5 no-underline">
          <div className="bg-accent-subtle border border-accent-medium p-1.5 rounded-[10px]">
            <Activity size={20} className="text-accent" />
          </div>
          <span className="gradient-text font-extrabold text-lg font-display">MedConnect</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="btn-ghost px-3.5 py-1.5">
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3.5">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-text-primary">{user.name}</p>
            <span className={`badge badge-${user.role}`}>{user.role}</span>
          </div>
          <button
            id="logout-btn"
            onClick={logout}
            className="btn-ghost px-2.5 py-1.5"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </nav>
  );
}
