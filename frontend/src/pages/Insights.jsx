import React, { useEffect, useState } from "react";
import { Sparkles, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import Layout from "../components/Layout.jsx";
import api from "../api/axios.js";

const iconMap = {
  warning: { icon: AlertTriangle, color: "text-amber-600 bg-amber-50" },
  danger: { icon: AlertCircle, color: "text-rose-600 bg-rose-50" },
  success: { icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
};

export default function Insights() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    api.get("/insights").then((res) => setInsights(res.data));
  }, []);

  return (
    <Layout title="AI Insights" subtitle="Rule-based recommendations generated from your live data">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, i) => {
          const { icon: Icon, color } = iconMap[insight.type] || iconMap.warning;
          return (
            <div key={i} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg ${color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 leading-snug">{insight.title}</p>
                  <p className="text-sm text-slate-500 mt-1.5 flex items-start gap-1.5">
                    <Sparkles size={14} className="mt-0.5 text-brand-500 shrink-0" />
                    {insight.recommendation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        {insights.length === 0 && (
          <p className="text-slate-500 text-sm">No insights available yet — add more emissions or supplier data.</p>
        )}
      </div>
    </Layout>
  );
}

