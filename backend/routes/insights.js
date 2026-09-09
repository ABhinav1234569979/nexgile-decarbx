import express from "express";
import db from "../db/connection.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  const insights = [];

  const byScope = db.prepare("SELECT scope, SUM(co2_emissions) as total FROM emissions GROUP BY scope").all();
  if (byScope.length) {
    const highest = byScope.reduce((a, b) => (b.total > a.total ? b : a));
    if (highest.scope === "Scope 2") {
      insights.push({
        type: "warning",
        title: "Electricity consumption is the largest contributor to your carbon footprint.",
        recommendation: "Consider renewable energy sources and energy efficiency initiatives.",
      });
    } else if (highest.scope === "Scope 1") {
      insights.push({
        type: "warning",
        title: "Direct fuel combustion (Scope 1) is your largest emissions source.",
        recommendation: "Evaluate fleet electrification and equipment upgrades to cut direct emissions.",
      });
    } else {
      insights.push({
        type: "warning",
        title: "Value chain activities (Scope 3) dominate your emissions profile.",
        recommendation: "Engage suppliers and logistics partners on emissions reduction commitments.",
      });
    }
  }

  const riskySuppliers = db.prepare("SELECT * FROM suppliers WHERE score < 60").all();
  riskySuppliers.forEach((s) => {
    insights.push({
      type: "danger",
      title: `High-risk supplier detected: ${s.name}.`,
      recommendation: "Review the supplier's sustainability practices.",
    });
  });

  const monthly = db.prepare(`
    SELECT strftime('%m', date) as month, SUM(co2_emissions) as total
    FROM emissions GROUP BY month ORDER BY month
  `).all();
  if (monthly.length >= 2) {
    const last = monthly[monthly.length - 1].total;
    const prev = monthly[monthly.length - 2].total;
    if (last > prev) {
      insights.push({
        type: "warning",
        title: "Carbon emissions are trending upward.",
        recommendation: "Analyze high-emission activities and implement reduction strategies.",
      });
    } else {
      insights.push({
        type: "success",
        title: "Carbon emissions are trending downward month-over-month.",
        recommendation: "Maintain current reduction initiatives and document best practices.",
      });
    }
  }

  const goodSuppliers = db.prepare("SELECT COUNT(*) as c FROM suppliers WHERE score >= 80").get();
  if (goodSuppliers.c > 0) {
    insights.push({
      type: "success",
      title: `${goodSuppliers.c} supplier(s) rated as sustainability leaders.`,
      recommendation: "Consider expanding procurement volume with these high-scoring suppliers.",
    });
  }

  res.json(insights);
});

export default router;
