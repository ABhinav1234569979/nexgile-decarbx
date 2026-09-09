import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";

const statusStyle = {
  Compliant: "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Pending: "bg-rose-100 text-rose-700",
};

export default function Compliance() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/compliance").then((res) => setItems(res.data));
  }, []);

  return (
    <Layout title="Compliance" subtitle="Regulatory framework readiness tracking">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.framework} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="bg-slate-100 text-slate-600 p-2.5 rounded-lg"><ShieldCheck size={20} /></div>
              <span className={`badge ${statusStyle[item.status]}`}>{item.status}</span>
            </div>
            <h3 className="font-bold text-lg text-slate-800">{item.framework}</h3>
            <p className="text-sm text-slate-500 mt-1">{item.fullName}</p>
          </div>
        ))}
      </div>
    </Layout>
  );
}

