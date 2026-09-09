import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Flame, Factory, Zap, Truck } from "lucide-react";
import Layout from "../components/Layout.jsx";
import StatCard from "../components/StatCard.jsx";
import api from "../api/axios.js";

const monthNames = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun" };
const COLORS = ["#059669", "#0284c7", "#d97706"];

export default function Dashboard() {
  const [byScope, setByScope] = useState([]);
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    api.get("/emissions/summary").then((res) => {
      setByScope(res.data.byScope);
      setMonthly(
        res.data.monthly.map((m) => ({ month: monthNames[m.month] || m.month, total: Math.round(m.total) }))
      );
    });
  }, []);

  const totalEmissions = byScope.reduce((sum, s) => sum + s.total, 0);
  const scopeMap = Object.fromEntries(byScope.map((s) => [s.scope, s.total]));

  const pieData = byScope.map((s) => ({ name: s.scope, value: Math.round(s.total) }));

  return (
    <Layout title="Dashboard" subtitle="Overview of your organization's carbon footprint">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Flame} label="Total Carbon Emissions" value={Math.round(totalEmissions).toLocaleString()} unit="tCO₂e" accent="brand" />
        <StatCard icon={Factory} label="Scope 1" value={Math.round(scopeMap["Scope 1"] || 0).toLocaleString()} unit="tCO₂e" accent="rose" />
        <StatCard icon={Zap} label="Scope 2" value={Math.round(scopeMap["Scope 2"] || 0).toLocaleString()} unit="tCO₂e" accent="amber" />
        <StatCard icon={Truck} label="Scope 3" value={Math.round(scopeMap["Scope 3"] || 0).toLocaleString()} unit="tCO₂e" accent="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Emissions by Scope</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-slate-800 mb-4">Monthly Emissions Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-800">2026 Carbon Reduction Target</h3>
          <span className="badge bg-brand-100 text-brand-700">Target: -20%</span>
        </div>
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-500">Current Progress</span>
          <span className="font-semibold text-slate-800">65%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3">
          <div className="bg-brand-600 h-3 rounded-full transition-all" style={{ width: "65%" }} />
        </div>
      </div>
    </Layout>
  );
}

