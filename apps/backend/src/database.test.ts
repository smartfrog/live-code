import { describe, it, expect, beforeEach, afterAll } from "vitest";
import {
  createFeedback,
  getAllFeedbacks,
  getStats,
  validateFeedbackInput,
  resetDb,
  closeDb,
} from "./database.js";

describe("database", () => {
  beforeEach(() => {
    resetDb();
  });

  afterAll(() => {
    closeDb();
  });

  describe("validateFeedbackInput", () => {
    it("should return null for valid rating 5 without comment", () => {
      const result = validateFeedbackInput({ rating: 5 });
      expect(result).toBeNull();
    });

    it("should return null for valid rating 4 without comment", () => {
      const result = validateFeedbackInput({ rating: 4 });
      expect(result).toBeNull();
    });

    it("should return null for rating 3 with comment", () => {
      const result = validateFeedbackInput({ rating: 3, comment: "Could be better" });
      expect(result).toBeNull();
    });

    it("should return error for rating below 1", () => {
      const result = validateFeedbackInput({ rating: 0 });
      expect(result).toBe("Rating must be between 1 and 5");
    });

    it("should return error for rating above 5", () => {
      const result = validateFeedbackInput({ rating: 6 });
      expect(result).toBe("Rating must be between 1 and 5");
    });

    it("should return error for rating 3 without comment", () => {
      const result = validateFeedbackInput({ rating: 3 });
      expect(result).toBe("Comment is required for ratings of 3 or below");
    });

    it("should return error for rating 1 without comment", () => {
      const result = validateFeedbackInput({ rating: 1 });
      expect(result).toBe("Comment is required for ratings of 3 or below");
    });

    it("should return error for rating 2 with empty comment", () => {
      const result = validateFeedbackInput({ rating: 2, comment: "   " });
      expect(result).toBe("Comment is required for ratings of 3 or below");
    });
  });

  describe("createFeedback", () => {
    it("should create feedback with rating 5", () => {
      const feedback = createFeedback({ rating: 5 });
      expect(feedback.rating).toBe(5);
      expect(feedback.comment).toBeNull();
      expect(feedback.id).toBeDefined();
    });

    it("should create feedback with rating and comment", () => {
      const feedback = createFeedback({ rating: 3, comment: "Needs improvement" });
      expect(feedback.rating).toBe(3);
      expect(feedback.comment).toBe("Needs improvement");
    });

    it("should throw error for invalid rating", () => {
      expect(() => createFeedback({ rating: 0 })).toThrow("Rating must be between 1 and 5");
    });

    it("should throw error for rating 3 without comment", () => {
      expect(() => createFeedback({ rating: 3 })).toThrow(
        "Comment is required for ratings of 3 or below"
      );
    });
  });

  describe("getAllFeedbacks", () => {
    it("should return empty array when no feedbacks", () => {
      const feedbacks = getAllFeedbacks();
      expect(feedbacks).toEqual([]);
    });

    it("should return all feedbacks", () => {
      createFeedback({ rating: 5 });
      createFeedback({ rating: 4, comment: "Good" });
      createFeedback({ rating: 2, comment: "Not great" });

      const feedbacks = getAllFeedbacks();
      expect(feedbacks).toHaveLength(3);
      
      const ratings = feedbacks.map((f) => f.rating).sort();
      expect(ratings).toEqual([2, 4, 5]);
    });
  });

  describe("getStats", () => {
    it("should return null average when no feedbacks", () => {
      const stats = getStats();
      expect(stats.average).toBeNull();
      expect(stats.count).toBe(0);
    });

    it("should calculate correct average", () => {
      createFeedback({ rating: 5 });
      createFeedback({ rating: 4 });
      createFeedback({ rating: 3, comment: "OK" });

      const stats = getStats();
      expect(stats.average).toBe(4);
      expect(stats.count).toBe(3);
    });

    it("should round average to 2 decimal places", () => {
      createFeedback({ rating: 5 });
      createFeedback({ rating: 5 });
      createFeedback({ rating: 4 });

      const stats = getStats();
      expect(stats.average).toBe(4.67);
      expect(stats.count).toBe(3);
    });
  });
});
