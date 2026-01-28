import { describe, expect, it } from "vitest";

import { computeAverage, normalizeComment, validateFeedback } from "./roti-service.js";

describe("roti-service", () => {
  it("rejects rating below 1", () => {
    const result = validateFeedback({ rating: 0, comment: "ok" });
    expect(result.ok).toBe(false);
  });

  it("rejects rating above 5", () => {
    const result = validateFeedback({ rating: 6, comment: "ok" });
    expect(result.ok).toBe(false);
  });

  it("requires comment for rating 3", () => {
    const result = validateFeedback({ rating: 3, comment: "" });
    expect(result.ok).toBe(false);
  });

  it("accepts rating 4 without comment", () => {
    const result = validateFeedback({ rating: 4, comment: "" });
    expect(result.ok).toBe(true);
  });

  it("normalizes blank comment to null", () => {
    const normalized = normalizeComment("  ");
    expect(normalized).toBe(null);
  });

  it("computes average to one decimal", () => {
    const average = computeAverage([5, 4, 4]);
    expect(average).toBe(4.3);
  });
});
