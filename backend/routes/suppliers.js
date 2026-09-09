import express from "express";
import db from "../db/connection.js";
import { authenticate } from "../middleware/auth.js";
import { authorize, CAN_MANAGE } from "../middleware/authorize.js";

const router = express.Router();
router.use(authenticate);

function statusFor(score) {
  if (score >= 80) return "Good";
  if (score >= 60) return "Needs Improvement";
  return "High Risk";
}

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM suppliers").all();
  res.json(rows.map((r) => ({ ...r, status: statusFor(r.score) })));
});

router.post("/", authorize(...CAN_MANAGE), (req, res) => {
  const { name, industry, country, score } = req.body;
  if (!name || !industry || !country || score === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const numericScore = Number(score);
  if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
    return res.status(400).json({ error: "Score must be a number between 0 and 100" });
  }
  const result = db.prepare("INSERT INTO suppliers (name, industry, country, score) VALUES (?, ?, ?, ?)").run(name, industry, country, numericScore);
  const row = db.prepare("SELECT * FROM suppliers WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json({ ...row, status: statusFor(row.score) });
});

router.delete("/:id", authorize(...CAN_MANAGE), (req, res) => {
  const existing = db.prepare("SELECT * FROM suppliers WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Supplier not found" });
  db.prepare("DELETE FROM suppliers WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

export default router;
