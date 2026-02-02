import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../../data");
const DB_PATH = path.join(DATA_DIR, "roti.db");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface Feedback {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface CreateFeedbackInput {
  rating: number;
  comment?: string;
}

export function createFeedback(input: CreateFeedbackInput): Feedback {
  const stmt = db.prepare(
    "INSERT INTO feedbacks (rating, comment) VALUES (?, ?)"
  );
  const result = stmt.run(input.rating, input.comment || null);
  
  return db.prepare("SELECT * FROM feedbacks WHERE id = ?").get(result.lastInsertRowid) as Feedback;
}

export function getAllFeedbacks(): Feedback[] {
  return db.prepare("SELECT * FROM feedbacks ORDER BY created_at DESC").all() as Feedback[];
}

export function getAverageRating(): number {
  const result = db.prepare("SELECT AVG(rating) as average FROM feedbacks").get() as { average: number | null };
  return result.average ? Math.round(result.average * 10) / 10 : 0;
}

export function getFeedbackCount(): number {
  const result = db.prepare("SELECT COUNT(*) as count FROM feedbacks").get() as { count: number };
  return result.count;
}
