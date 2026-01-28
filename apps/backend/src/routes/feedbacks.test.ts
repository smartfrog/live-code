import { describe, it, expect } from "vitest";
import { validateFeedback } from "../db.js";

describe("validateFeedback", () => {
  it("should return null for valid rating 5 without comment", () => {
    expect(validateFeedback(5, null)).toBeNull();
  });

  it("should return null for valid rating 4 without comment", () => {
    expect(validateFeedback(4, "")).toBeNull();
  });

  it("should return null for rating 3 with comment", () => {
    expect(validateFeedback(3, "Could be better")).toBeNull();
  });

  it("should return null for rating 1 with comment", () => {
    expect(validateFeedback(1, "Not good")).toBeNull();
  });

  it("should return error for rating 3 without comment", () => {
    expect(validateFeedback(3, null)).toBe("Comment is required for ratings of 3 or below");
  });

  it("should return error for rating 2 with empty comment", () => {
    expect(validateFeedback(2, "")).toBe("Comment is required for ratings of 3 or below");
  });

  it("should return error for rating 1 with whitespace-only comment", () => {
    expect(validateFeedback(1, "   ")).toBe("Comment is required for ratings of 3 or below");
  });

  it("should return error for rating below 1", () => {
    expect(validateFeedback(0, "Comment")).toBe("Rating must be between 1 and 5");
  });

  it("should return error for rating above 5", () => {
    expect(validateFeedback(6, "Comment")).toBe("Rating must be between 1 and 5");
  });

  it("should return error for negative rating", () => {
    expect(validateFeedback(-1, "Comment")).toBe("Rating must be between 1 and 5");
  });
});
