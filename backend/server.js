import "./config/env.js"; // must stay first — see comment inside that file

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import emissionsRoutes from "./routes/emissions.js";
import facilitiesRoutes from "./routes/facilities.js";
import suppliersRoutes from "./routes/suppliers.js";
import productsRoutes from "./routes/products.js";
import insightsRoutes from "./routes/insights.js";
import complianceRoutes from "./routes/compliance.js";
import usersRoutes from "./routes/users.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/emissions", emissionsRoutes);
app.use("/api/facilities", facilitiesRoutes);
app.use("/api/suppliers", suppliersRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/insights", insightsRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/users", usersRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Unknown route.
app.use("/api", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Generic error handler — catches anything thrown/rejected in a route
// that wasn't already handled, and avoids leaking internals to the client.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});

app.listen(PORT, () => {
  console.log(`Nexgile-DecarbX backend running on http://localhost:${PORT}`);
});
