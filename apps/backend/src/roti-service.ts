export interface FeedbackInput {
  rating: unknown;
  comment: unknown;
}

export interface ValidatedFeedback {
  rating: number;
  comment: string;
}

export function validateFeedback(input: FeedbackInput): ValidatedFeedback {
  if (typeof input.rating !== "number" || !Number.isInteger(input.rating)) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  if (input.rating < 1 || input.rating > 5) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  const comment = typeof input.comment === "string" ? input.comment.trim() : "";

  if (input.rating <= 3 && comment.length === 0) {
    throw new Error("Comment is required when rating is 3 or below");
  }

  return { rating: input.rating, comment };
}

export function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const total = values.reduce((sum, value) => sum + value, 0);
  const average = total / values.length;
  return Math.round(average * 10) / 10;
}
