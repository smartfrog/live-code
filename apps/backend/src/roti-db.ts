import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Database from "better-sqlite3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDbPath = path.join(__dirname, "../data/roti.sqlite");
const dbPath = process.env.ROTI_DB_PATH || defaultDbPath;

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS roti_feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

export interface RotiFeedbackRecord {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface RotiFeedbackRow {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export function insertFeedback(input: { rating: number; comment: string }): RotiFeedbackRecord {
  const createdAt = new Date().toISOString();
  const statement = db.prepare(
    "INSERT INTO roti_feedback (rating, comment, created_at) VALUES (?, ?, ?)"
  );
  const result = statement.run(input.rating, input.comment, createdAt);

  return {
    id: Number(result.lastInsertRowid),
    rating: input.rating,
    comment: input.comment,
    createdAt,
  };
}

export function listFeedbacks(): RotiFeedbackRecord[] {
  const rows = db
    .prepare(
      "SELECT id, rating, comment, created_at as createdAt FROM roti_feedback ORDER BY datetime(created_at) DESC"
    )
    .all() as RotiFeedbackRow[];

  return rows.map((row) => ({
    id: Number(row.id),
    rating: Number(row.rating),
    comment: String(row.comment),
    createdAt: String(row.createdAt),
  }));
}
