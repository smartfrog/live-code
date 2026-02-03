export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateFeedback(rating: unknown, comment: unknown): ValidationResult {
  if (typeof rating !== "number" || !Number.isInteger(rating)) {
    return { valid: false, error: "Rating must be an integer" };
  }

  if (rating < 1 || rating > 5) {
    return { valid: false, error: "Rating must be between 1 and 5" };
  }

  if (rating <= 3) {
    if (typeof comment !== "string" || comment.trim() === "") {
      return { valid: false, error: "Comment is required when rating is 3 or below" };
    }
  }

  return { valid: true };
}
