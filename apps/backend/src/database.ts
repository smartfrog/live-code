import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dataDir = process.env.NODE_ENV === "production" 
  ? "/app/data" 
  : path.join(__dirname, "..", "data");

const dbPath = path.join(dataDir, "roti.db");

export interface Feedback {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface FeedbackInput {
  rating: number;
  comment?: string;
}

export interface FeedbackStats {
  average: number | null;
  count: number;
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath);
    initSchema();
  }
  return db;
}

function initSchema(): void {
  const database = db!;
  database.exec(`
    CREATE TABLE IF NOT EXISTS feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

export function validateFeedbackInput(input: FeedbackInput): string | null {
  if (input.rating < 1 || input.rating > 5) {
    return "Rating must be between 1 and 5";
  }
  if (input.rating <= 3 && (!input.comment || input.comment.trim() === "")) {
    return "Comment is required for ratings of 3 or below";
  }
  return null;
}

export function createFeedback(input: FeedbackInput): Feedback {
  const validationError = validateFeedbackInput(input);
  if (validationError) {
    throw new Error(validationError);
  }

  const database = getDb();
  const stmt = database.prepare(
    "INSERT INTO feedbacks (rating, comment) VALUES (?, ?)"
  );
  const result = stmt.run(input.rating, input.comment || null);
  
  return getFeedbackById(result.lastInsertRowid as number)!;
}

export function getFeedbackById(id: number): Feedback | null {
  const database = getDb();
  const stmt = database.prepare("SELECT * FROM feedbacks WHERE id = ?");
  return stmt.get(id) as Feedback | null;
}

export function getAllFeedbacks(): Feedback[] {
  const database = getDb();
  const stmt = database.prepare("SELECT * FROM feedbacks ORDER BY created_at DESC");
  return stmt.all() as Feedback[];
}

export function getStats(): FeedbackStats {
  const database = getDb();
  const stmt = database.prepare(
    "SELECT AVG(rating) as average, COUNT(*) as count FROM feedbacks"
  );
  const result = stmt.get() as { average: number | null; count: number };
  return {
    average: result.average ? Math.round(result.average * 100) / 100 : null,
    count: result.count,
  };
}

export function closeDb(): void {
  if (db) {
    db.close();
    db = null;
  }
}

export function resetDb(): void {
  const database = getDb();
  database.exec("DELETE FROM feedbacks");
}
