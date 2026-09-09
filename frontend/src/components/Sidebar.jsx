import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Flame,
  Building2,
  Truck,
  Package,
  Sparkles,
  ShieldCheck,
  UserCircle,
  LogOut,
  Leaf,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/emissions", label: "Emissions", icon: Flame },
  { to: "/facilities", label: "Facilities", icon: Building2 },
  { to: "/suppliers", label: "Suppliers", icon: Truck },
  { to: "/products", label: "Products", icon: Package },
  { to: "/insights", label: "AI Insights", icon: Sparkles },
  { to: "/compliance", label: "Compliance", icon: ShieldCheck },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-sidebar text-slate-200 min-h-screen flex flex-col fixed left-0 top-0">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-slate-700/50">
        <div className="bg-brand-500 p-2 rounded-lg">
          <Leaf size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-sm leading-tight">Nexgile-DecarbX</h1>
          <p className="text-[11px] text-slate-400">Environmental Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-slate-700/50">
        <div className="px-3 py-2 mb-2">
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <p className="text-xs text-slate-400 truncate">{user?.role}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-rose-600/20 hover:text-rose-400 w-full transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
