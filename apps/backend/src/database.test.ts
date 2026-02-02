import { describe, it, expect } from "vitest";

import {
  createFeedback,
  getAllFeedbacks,
  getAverageRating,
  getFeedbackCount,
} from "./database.js";

describe("Feedback Database", () => {
  describe("createFeedback", () => {
    it("should create a feedback with rating and comment", () => {
      const feedback = createFeedback({ rating: 5, comment: "Great talk!" });
      
      expect(feedback.rating).toBe(5);
      expect(feedback.comment).toBe("Great talk!");
      expect(feedback.id).toBeDefined();
      expect(feedback.created_at).toBeDefined();
    });

    it("should create a feedback without comment for high ratings", () => {
      const feedback = createFeedback({ rating: 4 });
      
      expect(feedback.rating).toBe(4);
      expect(feedback.comment).toBeNull();
    });

    it("should create a feedback with minimum rating", () => {
      const feedback = createFeedback({ rating: 1, comment: "Needs improvement" });
      
      expect(feedback.rating).toBe(1);
    });

    it("should create a feedback with maximum rating", () => {
      const feedback = createFeedback({ rating: 5 });
      
      expect(feedback.rating).toBe(5);
    });
  });

  describe("getAllFeedbacks", () => {
    it("should return an array of feedbacks", () => {
      const feedbacks = getAllFeedbacks();
      expect(feedbacks).toBeInstanceOf(Array);
    });

    it("should include newly created feedbacks", () => {
      const initialCount = getFeedbackCount();
      createFeedback({ rating: 3, comment: "Test feedback" });

      const feedbacks = getAllFeedbacks();
      expect(feedbacks.length).toBeGreaterThanOrEqual(initialCount + 1);
    });
  });

  describe("getAverageRating", () => {
    it("should return a number", () => {
      const average = getAverageRating();
      expect(typeof average).toBe("number");
    });

    it("should calculate average correctly", () => {
      createFeedback({ rating: 4 });
      createFeedback({ rating: 5 });
      
      const average = getAverageRating();
      expect(average).toBeGreaterThan(0);
      expect(average).toBeLessThanOrEqual(5);
    });
  });

  describe("getFeedbackCount", () => {
    it("should return a number", () => {
      const count = getFeedbackCount();
      expect(typeof count).toBe("number");
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it("should return correct count after creating feedbacks", () => {
      const initialCount = getFeedbackCount();
      createFeedback({ rating: 5 });
      
      const newCount = getFeedbackCount();
      expect(newCount).toBe(initialCount + 1);
    });
  });
});
