import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, Building2, MapPin } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";
import { useCanManage } from "../context/AuthContext.jsx";

const emptyForm = { name: "", location: "", type: "Office" };

export default function Facilities() {
  const canManage = useCanManage();
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/facilities").then((res) => setRows(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/facilities", form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save facility.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this facility? This cannot be undone.")) return;
    try {
      await api.delete(`/facilities/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete facility.");
    }
  };

  return (
    <Layout title="Facilities" subtitle="Manage your organization's operational sites">
      {canManage && (
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus size={16} /> Add Facility
          </button>
        </div>
      )}

      {showForm && canManage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Add Facility</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            {error && (
              <div className="bg-rose-50 text-rose-700 text-sm px-3 py-2 rounded-lg mb-3">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Facility Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input required placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                <option>Office</option>
                <option>Manufacturing</option>
                <option>Warehouse</option>
                <option>R&D</option>
              </select>
              <button type="submit" disabled={saving} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm">
                {saving ? "Saving..." : "Save Facility"}
              </button>
            </form>
          </div>
        </div>
      )}

      {rows.length === 0 ? (
        <div className="card text-center py-12">
          <Building2 className="mx-auto text-slate-300 mb-3" size={36} />
          <h3 className="font-medium text-slate-700">No facilities found.</h3>
          <p className="text-sm text-slate-500 mt-1">
            {canManage ? "Start tracking your organization's facilities to monitor emissions." : "Check back once facilities have been added."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rows.map((f) => (
            <div key={f.id} className="card hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-brand-50 text-brand-600 p-2.5 rounded-lg"><Building2 size={20} /></div>
                {canManage && (
                  <button onClick={() => handleDelete(f.id)} className="text-rose-500 hover:text-rose-700"><Trash2 size={16} /></button>
                )}
              </div>
              <h3 className="font-semibold text-slate-800">{f.name}</h3>
              <p className="text-sm text-slate-500 flex items-center gap-1 mt-1"><MapPin size={13} /> {f.location}</p>
              <span className="badge bg-slate-100 text-slate-600 mt-3">{f.type}</span>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}


