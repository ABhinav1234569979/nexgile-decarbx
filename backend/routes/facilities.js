import express from "express";
import db from "../db/connection.js";
import { authenticate } from "../middleware/auth.js";
import { authorize, CAN_MANAGE } from "../middleware/authorize.js";

const router = express.Router();
router.use(authenticate);

// Admin, Manager, and Analyst can all view facilities.
router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM facilities").all());
});

// Only Admin/Manager can create, edit, or delete facilities.
router.post("/", authorize(...CAN_MANAGE), (req, res) => {
  const { name, location, type } = req.body;
  if (!name || !location || !type) return res.status(400).json({ error: "All fields are required" });
  const result = db.prepare("INSERT INTO facilities (name, location, type) VALUES (?, ?, ?)").run(name, location, type);
  res.status(201).json(db.prepare("SELECT * FROM facilities WHERE id = ?").get(result.lastInsertRowid));
});

router.put("/:id", authorize(...CAN_MANAGE), (req, res) => {
  const { name, location, type } = req.body;
  if (!name || !location || !type) return res.status(400).json({ error: "All fields are required" });
  const existing = db.prepare("SELECT * FROM facilities WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Facility not found" });
  db.prepare("UPDATE facilities SET name = ?, location = ?, type = ? WHERE id = ?").run(name, location, type, req.params.id);
  res.json(db.prepare("SELECT * FROM facilities WHERE id = ?").get(req.params.id));
});

router.delete("/:id", authorize(...CAN_MANAGE), (req, res) => {
  const existing = db.prepare("SELECT * FROM facilities WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Facility not found" });
  db.prepare("DELETE FROM facilities WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

export default router;
