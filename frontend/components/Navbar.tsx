"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Activity, LogOut, Calendar, FileText, Users, Search, LayoutDashboard } from "lucide-react";

const NAV_LINKS = {
  patient: [
    { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patient/search", label: "Find Doctors", icon: Search },
    { href: "/patient/records", label: "My Records", icon: FileText },
  ],
  doctor: [
    { href: "/doctor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/doctor/appointments", label: "Appointments", icon: Calendar },
    { href: "/doctor/patients", label: "My Patients", icon: Users },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const links = NAV_LINKS[user.role] || [];

  return (
    <nav
      style={{
        background: "rgba(10,15,30,0.9)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href={`/${user.role}/dashboard`} className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <div className="p-1.5 rounded-lg" style={{ background: "var(--accent-glow)" }}>
            <Activity size={20} style={{ color: "var(--accent)" }} />
          </div>
          <span className="font-bold gradient-text text-lg">MedConnect</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="btn-ghost" style={{ padding: "0.4rem 0.875rem" }}>
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{user.name}</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              <span className={`badge badge-${user.role}`}>{user.role}</span>
            </p>
          </div>
          <button id="logout-btn" onClick={logout} className="btn-ghost" style={{ padding: "0.4rem 0.75rem" }}>
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </nav>
  );
}
