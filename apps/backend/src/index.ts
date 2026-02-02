import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

import {
  createFeedback,
  getAllFeedbacks,
  getStats,
  validateFeedbackInput,
  FeedbackInput,
} from "./database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// API routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/feedbacks", (_req: Request, res: Response) => {
  const feedbacks = getAllFeedbacks();
  res.json(feedbacks);
});

app.get("/api/feedbacks/stats", (_req: Request, res: Response) => {
  const stats = getStats();
  res.json(stats);
});

app.post("/api/feedbacks", (req: Request, res: Response) => {
  const input: FeedbackInput = req.body;

  const validationError = validateFeedbackInput(input);
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const feedback = createFeedback(input);
  res.status(201).json(feedback);
});

// Serve frontend static files
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

// SPA fallback
app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
