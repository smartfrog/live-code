import { describe, expect, it } from "vitest";

import { calculateAverage, validateFeedback } from "./roti-service.js";

describe("validateFeedback", () => {
  it("rejects ratings below 1", () => {
    expect(() => validateFeedback({ rating: 0, comment: "ok" })).toThrow(
      "Rating must be an integer between 1 and 5"
    );
  });

  it("rejects ratings above 5", () => {
    expect(() => validateFeedback({ rating: 6, comment: "ok" })).toThrow(
      "Rating must be an integer between 1 and 5"
    );
  });

  it("rejects non-integer ratings", () => {
    expect(() => validateFeedback({ rating: 2.5, comment: "ok" })).toThrow(
      "Rating must be an integer between 1 and 5"
    );
  });

  it("requires a comment for ratings at or below 3", () => {
    expect(() => validateFeedback({ rating: 3, comment: "  " })).toThrow(
      "Comment is required when rating is 3 or below"
    );
  });

  it("allows empty comment for ratings above 3", () => {
    expect(validateFeedback({ rating: 4, comment: "  " })).toEqual({
      rating: 4,
      comment: "",
    });
  });
});

describe("calculateAverage", () => {
  it("returns zero for empty input", () => {
    expect(calculateAverage([])).toBe(0);
  });

  it("calculates average to one decimal", () => {
    expect(calculateAverage([5, 4, 4])).toBe(4.3);
  });
});
