import { useEffect, useState } from "react";

interface Feedback {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
}

interface FeedbacksResponse {
  feedbacks: Feedback[];
  average: number | null;
  count: number;
}

function StarRating({ rating, onSelect }: { rating: number; onSelect: (r: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onSelect(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-4xl transition-transform hover:scale-110 focus:outline-none"
        >
          {star <= (hover || rating) ? (
            <span className="text-yellow-400">&#9733;</span>
          ) : (
            <span className="text-gray-300">&#9734;</span>
          )}
        </button>
      ))}
    </div>
  );
}

function DisplayStars({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star}>{star <= rating ? "★" : "☆"}</span>
      ))}
    </span>
  );
}

function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/feedbacks");
      if (!res.ok) throw new Error("Failed to fetch feedbacks");
      const data: FeedbacksResponse = await res.json();
      setFeedbacks(data.feedbacks);
      setAverage(data.average);
      setCount(data.count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (rating <= 3 && comment.trim() === "") {
      setError("Comment is required for ratings 3 or below");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.errors?.[0] || "Failed to submit");
      }

      setRating(0);
      setComment("");
      setSuccess(true);
      await fetchFeedbacks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSubmitting(false);
    }
  };

  const commentRequired = rating >= 1 && rating <= 3;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-indigo-900 mb-2">
          Rate This Talk
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Your feedback helps us improve
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              How was it?
            </label>
            <StarRating rating={rating} onSelect={setRating} />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment {commentRequired && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={commentRequired ? "Please tell us why..." : "Optional feedback..."}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition"
              rows={3}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              Thank you for your feedback!
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Sending..." : "Submit Feedback"}
          </button>
        </form>

        {count > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div>
                <span className="text-2xl font-bold text-indigo-900">
                  {average?.toFixed(1)}
                </span>
                <span className="text-gray-400 text-sm">/5</span>
              </div>
              <div className="text-right">
                <DisplayStars rating={Math.round(average || 0)} />
                <p className="text-sm text-gray-500">{count} review{count > 1 ? "s" : ""}</p>
              </div>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <DisplayStars rating={fb.rating} />
                    <span className="text-xs text-gray-400">
                      {new Date(fb.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {fb.comment && (
                    <p className="text-sm text-gray-600">{fb.comment}</p>
                  )}
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
