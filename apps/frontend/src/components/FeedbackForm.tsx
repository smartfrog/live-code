import { useState } from "react";

interface FeedbackFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
}

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiresComment = rating !== null && rating <= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (rating === null) {
      setError("Please select a rating");
      return;
    }

    if (requiresComment && !comment.trim()) {
      setError("Comment is required for ratings of 3 or below");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setRating(null);
      setComment("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          How would you rate this talk?
        </label>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={`w-12 h-12 rounded-xl text-lg font-bold transition-all duration-200 ${
                rating === value
                  ? "bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg scale-110"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
          <span>Waste of time</span>
          <span>Excellent!</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comment {requiresComment && <span className="text-red-500">*</span>}
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={requiresComment ? "Please tell us how we can improve..." : "Share your thoughts (optional)"}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200"
          rows={3}
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-600 text-sm bg-green-50 px-4 py-2 rounded-lg">
          Thank you for your feedback!
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || rating === null}
        className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02]"
      >
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
}
