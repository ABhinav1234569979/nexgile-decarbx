import express from "express";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

router.get("/", (req, res) => {
  res.json([
    { framework: "CSRD", fullName: "Corporate Sustainability Reporting Directive", status: "Compliant" },
    { framework: "TCFD", fullName: "Task Force on Climate-related Financial Disclosures", status: "In Progress" },
    { framework: "CBAM", fullName: "Carbon Border Adjustment Mechanism", status: "Pending" },
  ]);
});

export default router;
