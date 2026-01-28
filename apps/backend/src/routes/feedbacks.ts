import { Router, Request, Response } from "express";
import { getAllFeedbacks, getAverageRating, createFeedback, validateFeedback } from "../db.js";

const router = Router();

router.get("/", (_req: Request, res: Response) => {
  const feedbacks = getAllFeedbacks();
  const averageRating = getAverageRating();
  res.json({ feedbacks, averageRating });
});

router.post("/", (req: Request, res: Response) => {
  const { rating, comment } = req.body;

  const error = validateFeedback(rating, comment);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  const feedback = createFeedback(rating, comment || null);
  res.status(201).json(feedback);
});

export default router;
