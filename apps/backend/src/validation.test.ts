import { describe, it, expect } from "vitest";
import { validateFeedback } from "./validation.js";

describe("validateFeedback", () => {
  describe("rating validation", () => {
    it("rejects non-integer rating", () => {
      expect(validateFeedback(3.5, null)).toEqual({
        valid: false,
        error: "Rating must be an integer",
      });
    });

    it("rejects non-number rating", () => {
      expect(validateFeedback("3", null)).toEqual({
        valid: false,
        error: "Rating must be an integer",
      });
    });

    it("rejects rating below 1", () => {
      expect(validateFeedback(0, null)).toEqual({
        valid: false,
        error: "Rating must be between 1 and 5",
      });
    });

    it("rejects rating above 5", () => {
      expect(validateFeedback(6, null)).toEqual({
        valid: false,
        error: "Rating must be between 1 and 5",
      });
    });
  });

  describe("comment requirement for low ratings", () => {
    it("requires comment when rating is 1", () => {
      expect(validateFeedback(1, null)).toEqual({
        valid: false,
        error: "Comment is required when rating is 3 or below",
      });
    });

    it("requires comment when rating is 2", () => {
      expect(validateFeedback(2, "")).toEqual({
        valid: false,
        error: "Comment is required when rating is 3 or below",
      });
    });

    it("requires comment when rating is 3", () => {
      expect(validateFeedback(3, "   ")).toEqual({
        valid: false,
        error: "Comment is required when rating is 3 or below",
      });
    });

    it("accepts rating 3 with comment", () => {
      expect(validateFeedback(3, "Could be better")).toEqual({ valid: true });
    });
  });

  describe("valid feedbacks", () => {
    it("accepts rating 4 without comment", () => {
      expect(validateFeedback(4, null)).toEqual({ valid: true });
    });

    it("accepts rating 5 without comment", () => {
      expect(validateFeedback(5, null)).toEqual({ valid: true });
    });

    it("accepts rating 5 with comment", () => {
      expect(validateFeedback(5, "Excellent!")).toEqual({ valid: true });
    });
  });
});
