import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export interface Feedback {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
}

const dataDir = process.env.NODE_ENV === "production" 
  ? "/app/data" 
  : path.join(process.cwd(), "../../data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "feedbacks.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

export function getAllFeedbacks(): Feedback[] {
  return db.prepare("SELECT * FROM feedbacks ORDER BY created_at DESC").all() as Feedback[];
}

export function createFeedback(rating: number, comment: string): Feedback {
  const stmt = db.prepare("INSERT INTO feedbacks (rating, comment) VALUES (?, ?)");
  const result = stmt.run(rating, comment);
  return db.prepare("SELECT * FROM feedbacks WHERE id = ?").get(result.lastInsertRowid) as Feedback;
}

export function getAverageRating(): number | null {
  const result = db.prepare("SELECT AVG(rating) as avg FROM feedbacks").get() as { avg: number | null };
  return result.avg;
}

export function getFeedbackCount(): number {
  const result = db.prepare("SELECT COUNT(*) as count FROM feedbacks").get() as { count: number };
  return result.count;
}
