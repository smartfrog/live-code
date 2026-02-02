import express, { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import { getAllFeedbacks, createFeedback, getAverageRating, getFeedbackCount } from "./database.js";
import { validateFeedback } from "./validation.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/feedbacks", (_req: Request, res: Response) => {
  const feedbacks = getAllFeedbacks();
  const average = getAverageRating();
  const count = getFeedbackCount();
  res.json({ feedbacks, average, count });
});

app.post("/api/feedbacks", (req: Request, res: Response) => {
  const { rating, comment } = req.body;
  
  const validation = validateFeedback(rating, comment);
  if (!validation.valid) {
    res.status(400).json({ errors: validation.errors });
    return;
  }

  const feedback = createFeedback(rating, comment);
  res.status(201).json(feedback);
});

const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));

app.get("*", (_req: Request, res: Response) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
