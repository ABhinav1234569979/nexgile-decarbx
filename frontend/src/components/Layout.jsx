import React from "react";
import Sidebar from "./Sidebar.jsx";

export default function Layout({ children, title, subtitle }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 flex-1 min-h-screen p-8">
        {title && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
