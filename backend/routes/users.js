import express from "express";
import db from "../db/connection.js";
import { authenticate } from "../middleware/auth.js";
import { authorize, ROLES } from "../middleware/authorize.js";

const router = express.Router();
router.use(authenticate);

// Admin-only. Never return the password hash.
router.get("/", authorize(ROLES.ADMIN), (req, res) => {
  const users = db.prepare("SELECT id, name, email, role FROM users").all();
  res.json(users);
});

// Admin-only. Change a user's role.
router.put("/:id/role", authorize(ROLES.ADMIN), (req, res) => {
  const { role } = req.body;
  const validRoles = Object.values(ROLES);
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: `Role must be one of: ${validRoles.join(", ")}` });
  }
  const existing = db.prepare("SELECT id FROM users WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "User not found" });

  if (Number(req.params.id) === req.user.id && role !== ROLES.ADMIN) {
    return res.status(400).json({ error: "You cannot remove your own Admin access" });
  }

  db.prepare("UPDATE users SET role = ? WHERE id = ?").run(role, req.params.id);
  const updated = db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(req.params.id);
  res.json(updated);
});

export default router;
