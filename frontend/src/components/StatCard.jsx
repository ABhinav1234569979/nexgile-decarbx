import React from "react";

export default function StatCard({ icon: Icon, label, value, unit, accent = "brand" }) {
  const accentMap = {
    brand: "bg-brand-50 text-brand-600",
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="card flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">
          {value} <span className="text-sm font-medium text-slate-400">{unit}</span>
        </p>
      </div>
      <div className={`p-3 rounded-lg ${accentMap[accent]}`}>
        <Icon size={22} />
      </div>
    </div>
  );
}
