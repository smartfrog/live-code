import path from "path";
import { fileURLToPath } from "url";

import express, { Request, Response } from "express";

import { getDb } from "./roti-db.js";
import { computeAverage, normalizeComment, validateFeedback } from "./roti-service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;
const db = getDb();

interface FeedbackRow {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

app.use(express.json());

app.get("/api/roti", (_req: Request, res: Response) => {
  try {
    const rows = db
      .prepare("SELECT id, rating, comment, created_at FROM feedbacks ORDER BY created_at DESC")
      .all() as FeedbackRow[];

    const feedbacks = rows.map((row) => ({
      id: row.id,
      rating: row.rating,
      comment: row.comment ?? null,
      createdAt: row.created_at,
    }));

    const average = computeAverage(feedbacks.map((feedback) => feedback.rating));

    res.json({ average, feedbacks });
  } catch (error) {
    console.error("Failed to fetch feedbacks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/roti", (req: Request, res: Response) => {
  const rating = Number(req.body?.rating);
  const comment = normalizeComment(req.body?.comment);
  const validation = validateFeedback({ rating, comment });

  if (!validation.ok) {
    res.status(400).json({ error: validation.error });
    return;
  }

  try {
    const createdAt = new Date().toISOString();
    const result = db
      .prepare("INSERT INTO feedbacks (rating, comment, created_at) VALUES (?, ?, ?)")
      .run(rating, comment, createdAt);

    res.status(201).json({
      id: Number(result.lastInsertRowid),
      rating,
      comment,
      createdAt,
    });
  } catch (error) {
    console.error("Failed to save feedback:", error);
    res.status(500).json({ error: "Internal server error" });
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
