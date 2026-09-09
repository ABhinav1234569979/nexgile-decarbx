import React from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, Mail, Shield, LogOut } from "lucide-react";
import Layout from "../components/Layout.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Layout title="Profile" subtitle="Your account information">
      <div className="card max-w-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-brand-50 text-brand-600 p-4 rounded-full">
            <UserCircle size={32} />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-800">{user?.name}</h3>
            <span className="badge bg-slate-100 text-slate-600 mt-1">{user?.role}</span>
          </div>
        </div>
        <div className="space-y-3 text-sm border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-slate-600">
            <Mail size={16} /> {user?.email}
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Shield size={16} /> Role: {user?.role}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-medium py-2.5 rounded-lg transition-colors"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </Layout>
  );
}

