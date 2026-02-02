import { Router } from "express";
import { createFeedback, getAllFeedbacks } from "../database.js";

const router = Router();

router.post("/", (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    res.status(400).json({ error: "Rating must be a number between 1 and 5" });
    return;
  }

  if (rating <= 3 && (!comment || comment.trim().length === 0)) {
    res.status(400).json({ error: "Comment is required when rating is 3 or below" });
    return;
  }

  try {
    const feedback = createFeedback({ rating, comment });
    res.status(201).json(feedback);
  } catch (error) {
    console.error("Failed to create feedback:", error);
    res.status(500).json({ error: "Failed to create feedback" });
  }
});

router.get("/", (_req, res) => {
  try {
    const feedbacks = getAllFeedbacks();
    res.json(feedbacks);
  } catch (error) {
    console.error("Failed to get feedbacks:", error);
    res.status(500).json({ error: "Failed to get feedbacks" });
  }
});

export default router;
