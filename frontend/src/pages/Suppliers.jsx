import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";
import { useCanManage } from "../context/AuthContext.jsx";

const emptyForm = { name: "", industry: "", country: "", score: "" };

const statusBadge = (status) => {
  const map = {
    Good: "bg-emerald-100 text-emerald-700",
    "Needs Improvement": "bg-amber-100 text-amber-700",
    "High Risk": "bg-rose-100 text-rose-700",
  };
  return map[status] || "bg-slate-100 text-slate-700";
};

export default function Suppliers() {
  const canManage = useCanManage();
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/suppliers").then((res) => setRows(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/suppliers", { ...form, score: Number(form.score) });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save supplier.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this supplier? This cannot be undone.")) return;
    try {
      await api.delete(`/suppliers/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete supplier.");
    }
  };

  return (
    <Layout title="Supplier Management" subtitle="Monitor supplier sustainability performance">
      {canManage && (
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus size={16} /> Add Supplier
          </button>
        </div>
      )}

      {showForm && canManage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Add Supplier</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            {error && (
              <div className="bg-rose-50 text-rose-700 text-sm px-3 py-2 rounded-lg mb-3">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Supplier Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input required placeholder="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input required placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input required type="number" min="0" max="100" placeholder="Sustainability Score (0-100)" value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" disabled={saving} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm">
                {saving ? "Saving..." : "Save Supplier"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-4">Supplier</th>
              <th className="py-2 pr-4">Industry</th>
              <th className="py-2 pr-4">Country</th>
              <th className="py-2 pr-4">Score</th>
              <th className="py-2 pr-4">Status</th>
              {canManage && <th className="py-2 pr-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="py-8 text-center text-slate-500">
                  No suppliers found. {canManage ? "Add your first supplier to start monitoring sustainability performance." : "Check back once suppliers have been added."}
                </td>
              </tr>
            )}
            {rows.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2.5 pr-4 font-medium text-slate-800">{s.name}</td>
                <td className="py-2.5 pr-4">{s.industry}</td>
                <td className="py-2.5 pr-4">{s.country}</td>
                <td className="py-2.5 pr-4">{s.score}</td>
                <td className="py-2.5 pr-4"><span className={`badge ${statusBadge(s.status)}`}>{s.status}</span></td>
                {canManage && (
                  <td className="py-2.5 pr-4">
                    <button onClick={() => handleDelete(s.id)} className="text-rose-500 hover:text-rose-700"><Trash2 size={16} /></button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}


