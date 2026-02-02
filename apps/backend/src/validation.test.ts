import { describe, it, expect } from "vitest";
import { validateFeedback } from "./validation.js";

describe("validateFeedback", () => {
  it("should accept valid rating 5 without comment", () => {
    const result = validateFeedback(5, "");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should accept valid rating 4 without comment", () => {
    const result = validateFeedback(4, "");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should accept valid rating 3 with comment", () => {
    const result = validateFeedback(3, "Could be better");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should accept valid rating 1 with comment", () => {
    const result = validateFeedback(1, "Not useful");
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("should reject rating 3 without comment", () => {
    const result = validateFeedback(3, "");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Comment is required for ratings 3 or below");
  });

  it("should reject rating 2 without comment", () => {
    const result = validateFeedback(2, "");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Comment is required for ratings 3 or below");
  });

  it("should reject rating 1 without comment", () => {
    const result = validateFeedback(1, "");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Comment is required for ratings 3 or below");
  });

  it("should reject rating below 1", () => {
    const result = validateFeedback(0, "Comment");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Rating must be between 1 and 5");
  });

  it("should reject rating above 5", () => {
    const result = validateFeedback(6, "Comment");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Rating must be between 1 and 5");
  });

  it("should reject non-integer rating", () => {
    const result = validateFeedback(3.5, "Comment");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Rating must be an integer");
  });

  it("should reject non-number rating", () => {
    const result = validateFeedback("5", "Comment");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Rating must be an integer");
  });

  it("should reject non-string comment", () => {
    const result = validateFeedback(5, 123);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Comment must be a string");
  });

  it("should reject whitespace-only comment for low rating", () => {
    const result = validateFeedback(2, "   ");
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Comment is required for ratings 3 or below");
  });
});
