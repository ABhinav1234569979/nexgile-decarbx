import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";
import { useCanManage } from "../context/AuthContext.jsx";

const emptyForm = { source: "", scope: "Scope 1", facility: "", activity_type: "", quantity: "", emission_factor: "", date: "" };

export default function Emissions() {
  const canManage = useCanManage();
  const [rows, setRows] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get("/emissions").then((res) => setRows(res.data));
    api.get("/facilities").then((res) => setFacilities(res.data));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/emissions", form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save emission record.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this emission record? This cannot be undone.")) return;
    try {
      await api.delete(`/emissions/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete emission record.");
    }
  };

  const scopeBadge = (scope) => {
    const map = { "Scope 1": "bg-rose-100 text-rose-700", "Scope 2": "bg-amber-100 text-amber-700", "Scope 3": "bg-blue-100 text-blue-700" };
    return map[scope] || "bg-slate-100 text-slate-700";
  };

  return (
    <Layout title="Emissions Management" subtitle="Track and manage carbon emission records">
      {canManage && (
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Emission Record
          </button>
        </div>
      )}

      {showForm && canManage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Add Emission Record</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            {error && (
              <div className="bg-rose-50 text-rose-700 text-sm px-3 py-2 rounded-lg mb-3">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
              <input required placeholder="Emission Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <select value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option>Scope 1</option>
                <option>Scope 2</option>
                <option>Scope 3</option>
              </select>
              <select required value={form.facility} onChange={(e) => setForm({ ...form, facility: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Select Facility</option>
                {facilities.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
              </select>
              <input required placeholder="Activity Type" value={form.activity_type} onChange={(e) => setForm({ ...form, activity_type: e.target.value })} className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input required type="number" step="any" placeholder="Quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input required type="number" step="any" placeholder="Emission Factor" value={form.emission_factor} onChange={(e) => setForm({ ...form, emission_factor: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" disabled={saving} className="col-span-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm">
                {saving ? "Saving..." : "Save Record"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-4">Source</th>
              <th className="py-2 pr-4">Scope</th>
              <th className="py-2 pr-4">Facility</th>
              <th className="py-2 pr-4">Quantity</th>
              <th className="py-2 pr-4">Emission Factor</th>
              <th className="py-2 pr-4">CO₂ Emissions</th>
              <th className="py-2 pr-4">Date</th>
              {canManage && <th className="py-2 pr-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={canManage ? 8 : 7} className="py-8 text-center text-slate-500">
                  No emission records found. {canManage ? "Add your first record to start tracking." : "Check back once records have been added."}
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2.5 pr-4 font-medium text-slate-800">{r.source}</td>
                <td className="py-2.5 pr-4"><span className={`badge ${scopeBadge(r.scope)}`}>{r.scope}</span></td>
                <td className="py-2.5 pr-4">{r.facility}</td>
                <td className="py-2.5 pr-4">{r.quantity}</td>
                <td className="py-2.5 pr-4">{r.emission_factor}</td>
                <td className="py-2.5 pr-4 font-semibold">{r.co2_emissions.toLocaleString(undefined, { maximumFractionDigits: 1 })} kg CO₂e</td>
                <td className="py-2.5 pr-4">{r.date}</td>
                {canManage && (
                  <td className="py-2.5 pr-4">
                    <button onClick={() => handleDelete(r.id)} className="text-rose-500 hover:text-rose-700">
                      <Trash2 size={16} />
                    </button>
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


