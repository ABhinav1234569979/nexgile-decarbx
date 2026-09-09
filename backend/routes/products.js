import express from "express";
import db from "../db/connection.js";
import { authenticate } from "../middleware/auth.js";
import { authorize, CAN_MANAGE } from "../middleware/authorize.js";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM products").all());
});

router.post("/", authorize(...CAN_MANAGE), (req, res) => {
  const { name, material, manufacturing_emissions, transportation_emissions } = req.body;
  if (!name || !material || manufacturing_emissions === undefined || transportation_emissions === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }
  const mfg = Number(manufacturing_emissions);
  const transport = Number(transportation_emissions);
  if (Number.isNaN(mfg) || Number.isNaN(transport) || mfg < 0 || transport < 0) {
    return res.status(400).json({ error: "Emissions values must be non-negative numbers" });
  }
  const total_footprint = mfg + transport;
  const result = db.prepare(`
    INSERT INTO products (name, material, manufacturing_emissions, transportation_emissions, total_footprint)
    VALUES (?, ?, ?, ?, ?)
  `).run(name, material, mfg, transport, total_footprint);
  res.status(201).json(db.prepare("SELECT * FROM products WHERE id = ?").get(result.lastInsertRowid));
});

router.delete("/:id", authorize(...CAN_MANAGE), (req, res) => {
  const existing = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Product not found" });
  db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

export default router;
