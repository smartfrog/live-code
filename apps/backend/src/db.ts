import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "../data/roti.db");

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Feedback {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

export function getAllFeedbacks(): Feedback[] {
  return db.prepare("SELECT * FROM feedbacks ORDER BY created_at DESC").all() as Feedback[];
}

export function getAverageRating(): number | null {
  const result = db.prepare("SELECT AVG(rating) as avg FROM feedbacks").get() as { avg: number | null };
  return result.avg ? Math.round(result.avg * 10) / 10 : null;
}

export function createFeedback(rating: number, comment: string | null): Feedback {
  const stmt = db.prepare("INSERT INTO feedbacks (rating, comment) VALUES (?, ?)");
  const result = stmt.run(rating, comment);
  return db.prepare("SELECT * FROM feedbacks WHERE id = ?").get(result.lastInsertRowid) as Feedback;
}

export function validateFeedback(rating: number, comment: string | null): string | null {
  if (rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5";
  }
  if (rating <= 3 && (!comment || comment.trim() === "")) {
    return "Comment is required for ratings of 3 or below";
  }
  return null;
}

export default db;
