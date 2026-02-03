import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DATA_DIR = process.env.DATA_DIR || "./data";

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const dbPath = path.join(DATA_DIR, "feedbacks.db");
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating INTEGER NOT NULL,
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
  return result.avg;
}

export function getFeedbackCount(): number {
  const result = db.prepare("SELECT COUNT(*) as count FROM feedbacks").get() as { count: number };
  return result.count;
}

export function insertFeedback(rating: number, comment: string | null): Feedback {
  const stmt = db.prepare("INSERT INTO feedbacks (rating, comment) VALUES (?, ?)");
  const result = stmt.run(rating, comment);
  return db.prepare("SELECT * FROM feedbacks WHERE id = ?").get(result.lastInsertRowid) as Feedback;
}
