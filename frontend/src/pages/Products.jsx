import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";
import { useCanManage } from "../context/AuthContext.jsx";

const emptyForm = { name: "", material: "", manufacturing_emissions: "", transportation_emissions: "" };

export default function Products() {
  const canManage = useCanManage();
  const [rows, setRows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => api.get("/products").then((res) => setRows(res.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/products", form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete product.");
    }
  };

  return (
    <Layout title="Product Carbon Footprint" subtitle="Track embodied emissions across your product catalog">
      {canManage && (
        <div className="flex justify-end mb-4">
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus size={16} /> Add Product
          </button>
        </div>
      )}

      {showForm && canManage && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Add Product</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            {error && (
              <div className="bg-rose-50 text-rose-700 text-sm px-3 py-2 rounded-lg mb-3">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input required placeholder="Material" value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input required type="number" step="any" placeholder="Manufacturing Emissions (kg CO₂e)" value={form.manufacturing_emissions} onChange={(e) => setForm({ ...form, manufacturing_emissions: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <input required type="number" step="any" placeholder="Transportation Emissions (kg CO₂e)" value={form.transportation_emissions} onChange={(e) => setForm({ ...form, transportation_emissions: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" disabled={saving} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg text-sm">
                {saving ? "Saving..." : "Save Product"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Material</th>
              <th className="py-2 pr-4">Manufacturing</th>
              <th className="py-2 pr-4">Transportation</th>
              <th className="py-2 pr-4">Total Footprint</th>
              {canManage && <th className="py-2 pr-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={canManage ? 6 : 5} className="py-8 text-center text-slate-500">
                  No products found. {canManage ? "Add your first product to start tracking its footprint." : "Check back once products have been added."}
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2.5 pr-4 font-medium text-slate-800">{p.name}</td>
                <td className="py-2.5 pr-4">{p.material}</td>
                <td className="py-2.5 pr-4">{p.manufacturing_emissions} kg CO₂e</td>
                <td className="py-2.5 pr-4">{p.transportation_emissions} kg CO₂e</td>
                <td className="py-2.5 pr-4 font-semibold">{p.total_footprint} kg CO₂e</td>
                {canManage && (
                  <td className="py-2.5 pr-4">
                    <button onClick={() => handleDelete(p.id)} className="text-rose-500 hover:text-rose-700"><Trash2 size={16} /></button>
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


