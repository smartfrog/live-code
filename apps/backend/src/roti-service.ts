export interface FeedbackInput {
  rating: number;
  comment?: string | null;
}

export interface Feedback {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

export function validateFeedback(input: FeedbackInput): ValidationResult {
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return { ok: false, error: "La note doit etre entre 1 et 5." };
  }

  const trimmedComment = input.comment?.trim() ?? "";
  if (input.rating <= 3 && trimmedComment.length === 0) {
    return { ok: false, error: "Le commentaire est obligatoire pour une note de 1 a 3." };
  }

  return { ok: true };
}

export function normalizeComment(comment?: string | null) {
  const trimmedComment = comment?.trim();
  return trimmedComment && trimmedComment.length > 0 ? trimmedComment : null;
}

export function computeAverage(ratings: number[]) {
  if (ratings.length === 0) return 0;
  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  const average = total / ratings.length;
  return Math.round(average * 10) / 10;
}
