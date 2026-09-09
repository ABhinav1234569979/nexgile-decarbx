import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, Lock, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const demoAccounts = [
  { role: "Admin", email: "admin@nexgile.com", password: "admin123" },
  { role: "Sustainability Manager", email: "manager@nexgile.com", password: "manager123" },
  { role: "Analyst", email: "analyst@nexgile.com", password: "analyst123" },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-sidebar p-10 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-brand-500 p-2 rounded-lg">
                <Leaf size={22} />
              </div>
              <span className="font-bold text-lg">Nexgile-DecarbX</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">Environmental Intelligence Platform</h2>
            <p className="text-slate-400 text-sm">
              Enterprise carbon accounting, supplier risk tracking, and AI-driven
              sustainability insights in one dashboard.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">
              Demo accounts
            </p>
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc)}
                className="w-full text-left text-xs bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 transition-colors"
              >
                <span className="font-semibold text-white">{acc.role}</span>
                <br />
                <span className="text-slate-400">{acc.email} / {acc.password}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-10 flex flex-col justify-center">
          <h3 className="text-xl font-bold text-slate-900 mb-1">Welcome back</h3>
          <p className="text-sm text-slate-500 mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="••••••••"
                />
              </div>
            </div>
            {error && <p className="text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-2.5 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

