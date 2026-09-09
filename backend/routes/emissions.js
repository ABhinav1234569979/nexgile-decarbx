import express from "express";
import db from "../db/connection.js";
import { authenticate } from "../middleware/auth.js";
import { authorize, CAN_MANAGE } from "../middleware/authorize.js";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM emissions ORDER BY date DESC").all();
  res.json(rows);
});

router.get("/summary", (req, res) => {
  const rows = db.prepare("SELECT scope, SUM(co2_emissions) as total FROM emissions GROUP BY scope").all();
  const monthly = db.prepare(`
    SELECT strftime('%m', date) as month, SUM(co2_emissions) as total
    FROM emissions GROUP BY month ORDER BY month
  `).all();
  res.json({ byScope: rows, monthly });
});

router.post("/", authorize(...CAN_MANAGE), (req, res) => {
  const { source, scope, facility, activity_type, quantity, emission_factor, date } = req.body;
  if (!source || !scope || !facility || !activity_type || !quantity || !emission_factor || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const numericQuantity = Number(quantity);
  const numericFactor = Number(emission_factor);
  if (Number.isNaN(numericQuantity) || Number.isNaN(numericFactor) || numericQuantity < 0 || numericFactor < 0) {
    return res.status(400).json({ error: "Quantity and emission factor must be non-negative numbers" });
  }
  const co2_emissions = numericQuantity * numericFactor;
  const stmt = db.prepare(`
    INSERT INTO emissions (source, scope, facility, activity_type, quantity, emission_factor, co2_emissions, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(source, scope, facility, activity_type, numericQuantity, numericFactor, co2_emissions, date);
  const created = db.prepare("SELECT * FROM emissions WHERE id = ?").get(result.lastInsertRowid);
  res.status(201).json(created);
});

router.delete("/:id", authorize(...CAN_MANAGE), (req, res) => {
  const existing = db.prepare("SELECT * FROM emissions WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Emission record not found" });
  db.prepare("DELETE FROM emissions WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

export default router;
