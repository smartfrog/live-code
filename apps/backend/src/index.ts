import path from "path";
import { fileURLToPath } from "url";

import express, { Request, Response } from "express";

import { insertFeedback, listFeedbacks } from "./roti-db.js";
import { calculateAverage, validateFeedback } from "./roti-service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// API routes
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/hello", (_req: Request, res: Response) => {
  res.json({ message: "Hello from backend!", env: process.env.NODE_ENV || "development" });
});

app.get("/api/roti", (_req: Request, res: Response) => {
  const feedbacks = listFeedbacks();
  const average = calculateAverage(feedbacks.map((feedback) => feedback.rating));

  res.json({
    average,
    count: feedbacks.length,
    feedbacks,
  });
});

app.post("/api/roti", (req: Request, res: Response) => {
  try {
    const feedback = validateFeedback(req.body);
    const created = insertFeedback(feedback);
    res.status(201).json(created);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    res.status(400).json({ error: message });
  }
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
