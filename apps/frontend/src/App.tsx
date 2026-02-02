import { useEffect, useState } from "react";
import "./App.css";

interface Feedback {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface Stats {
  average: number | null;
  count: number;
}

function StarRating({
  rating,
  onRate,
  interactive = true,
}: {
  rating: number;
  onRate?: (value: number) => void;
  interactive?: boolean;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1 justify-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`text-4xl transition-transform ${
            interactive
              ? "cursor-pointer hover:scale-110"
              : "cursor-default"
          }`}
        >
          <span
            className={
              star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

function App() {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<Stats>({ average: null, count: 0 });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const commentRequired = rating > 0 && rating <= 3;
  const isValid = rating > 0 && (!commentRequired || comment.trim() !== "");

  const fetchData = async () => {
    try {
      const [feedbacksRes, statsRes] = await Promise.all([
        fetch("/api/feedbacks"),
        fetch("/api/feedbacks/stats"),
      ]);
      setFeedbacks(await feedbacksRes.json());
      setStats(await statsRes.json());
    } catch {
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment.trim() || undefined }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setRating(0);
      setComment("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="max-w-lg mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            ROTI Feedback
          </h1>
          <p className="text-gray-600">Return On Time Invested</p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              How was this talk?
            </label>
            <StarRating rating={rating} onRate={setRating} />
            {rating > 0 && (
              <p className="text-center mt-2 text-sm text-gray-500">
                {["Poor", "Below Average", "Average", "Good", "Excellent!"][rating - 1]}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Comment {commentRequired && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                commentRequired
                  ? "Please tell us how we can improve..."
                  : "Share your thoughts (optional)"
              }
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition"
            />
            {commentRequired && comment.trim() === "" && (
              <p className="text-red-500 text-sm mt-1">
                Comment is required for ratings of 3 or below
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
              Thank you for your feedback!
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid || submitting}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>

        {stats.count > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Average Rating
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold text-indigo-600">
                {stats.average?.toFixed(1)}
              </span>
              <span className="text-2xl text-yellow-400">★</span>
            </div>
            <p className="text-gray-500 mt-1">
              {stats.count} {stats.count === 1 ? "vote" : "votes"}
            </p>
          </div>
        )}

        {feedbacks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Feedbacks
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <StarRating rating={feedback.rating} interactive={false} />
                  </div>
                  {feedback.comment && (
                    <p className="text-gray-600 text-sm mt-2">
                      {feedback.comment}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(feedback.created_at + "Z").toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
