import { Router } from "express";
import { getAverageRating, getFeedbackCount } from "../database.js";

const router = Router();

router.get("/", (_req, res) => {
  try {
    const average = getAverageRating();
    const count = getFeedbackCount();
    res.json({ average, count });
  } catch (error) {
    console.error("Failed to get stats:", error);
    res.status(500).json({ error: "Failed to get stats" });
  }
});

export default router;
