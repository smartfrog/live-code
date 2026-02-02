export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateFeedback(rating: unknown, comment: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof rating !== "number" || !Number.isInteger(rating)) {
    errors.push("Rating must be an integer");
  } else if (rating < 1 || rating > 5) {
    errors.push("Rating must be between 1 and 5");
  }

  if (typeof comment !== "string") {
    errors.push("Comment must be a string");
  }

  if (typeof rating === "number" && typeof comment === "string") {
    if (rating >= 1 && rating <= 3 && comment.trim() === "") {
      errors.push("Comment is required for ratings 3 or below");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
