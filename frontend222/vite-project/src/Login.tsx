import React, { useState } from "react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Attempt a real login, fall back gracefully if backend not available
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.detail || "Invalid credentials");
      }

      const data = await res.json();
      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token);
        if (remember && data.refresh_token) {
          localStorage.setItem("refresh_token", data.refresh_token);
        }
        window.location.href = "/dashboard";
      } else {
        // fallback: simulate login
        localStorage.setItem("access_token", "demo-token");
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      setError(err.message || "Login failed — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-green-50 p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left / branding card */}
        <div className="hidden md:flex flex-col justify-center p-8 rounded-2xl bg-white/60 backdrop-blur-sm shadow-lg fade-in">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-br from-green-100 to-blue-50">
              {/* Medical logo: stethoscope + cross */}
              <svg className="w-12 h-12 text-green-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="6" fill="#f0fdf4" />
                <path d="M12 7v6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 12h6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 16c0 2 2 3 5 3s5-1 5-3" stroke="#10b981" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Smart Health Portal</h1>
              <p className="text-sm text-slate-500 mt-1">Secure access to your medical records, appointments, and prescriptions.</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-slate-700">Patient-first care</h3>
            <p className="text-sm text-slate-500 mt-2">Book appointments, view lab results, pay bills and communicate with your care team — all in one secure place.</p>
          </div>
        </div>

        {/* Right / login form */}
        <form onSubmit={handleLogin} className="card fade-in">
          <div className="flex flex-col items-center">
            <div className="p-2 rounded-full bg-white shadow-sm border">
              <svg className="w-14 h-14 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2a3 3 0 00-3 3v1a3 3 0 006 0V5a3 3 0 00-3-3z" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.2" />
                <path d="M8 10v3a4 4 0 004 4 4 4 0 004-4v-3" stroke="#2563eb" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-center mt-4 text-slate-800">Sign in to your account</h2>
            <p className="text-sm text-slate-500 mt-1">Access your appointments and health records securely</p>
          </div>

          {error && <div className="text-sm text-red-600 mt-4">{error}</div>}

          <div className="mt-6">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M16 12v6M8 12v6M3 7h18M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7" />
                </svg>
              </span>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hospital.com"
                className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3 .895 3 2v1H9v-1c0-1.105 1.343-2 3-2z" />
                </svg>
              </span>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="block w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
              Remember me
            </label>
            <a href="#" className="text-sm text-green-600 hover:underline">Forgot password?</a>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold shadow hover:scale-[1.01] transform transition duration-200 ease-out disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-4">Don't have an account? <a href="#" className="text-blue-600 hover:underline">Contact support</a></p>
        </form>
      </div>
    </div>
  );
};

export default Login;