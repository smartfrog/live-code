import { useState, useEffect, FormEvent } from "react";

import "./App.css";

interface Feedback {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface Stats {
  average: number;
  count: number;
}

function App() {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<Stats>({ average: 0, count: 0 });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feedbacksRes, statsRes] = await Promise.all([
        fetch("/api/feedbacks"),
        fetch("/api/stats"),
      ]);

      if (feedbacksRes.ok) {
        const feedbacksData = await feedbacksRes.json();
        setFeedbacks(feedbacksData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit feedback");
      }

      setSuccess("Thank you for your feedback!");
      setRating(0);
      setComment("");
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const showCommentField = rating > 0 && rating <= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ROTI Feedback</h1>
          <p className="text-gray-600">Rate this talk and help us improve</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Average Rating</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-indigo-600">
                  {stats.average.toFixed(1)}
                </span>
                <span className="text-gray-400">/ 5</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Total Feedback</p>
              <span className="text-2xl font-semibold text-gray-700">
                {stats.count}
              </span>
            </div>
          </div>
          
          {/* Star visualization */}
          <div className="flex gap-1 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className={`h-2 flex-1 rounded-full ${
                  star <= Math.round(stats.average)
                    ? "bg-yellow-400"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you rate this talk?
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`w-12 h-12 rounded-full text-2xl transition-all duration-200 ${
                      rating >= star
                        ? "bg-yellow-400 text-white scale-110 shadow-lg"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <p className="text-center mt-2 text-sm text-gray-500">
                {["", "Needs improvement", "Below expectations", "Meets expectations", "Exceeds expectations", "Outstanding!"][rating]}
              </p>
            </div>

            {/* Comment */}
            {rating > 0 && (
              <div className={`mb-6 ${showCommentField ? "animate-fade-in" : ""}`}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {showCommentField ? (
                    <>Please tell us how we can improve<span className="text-red-500 ml-1">*</span></>
                  ) : (
                    "Comment (optional)"
                  )}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={showCommentField ? "Your feedback helps us improve..." : "What did you like most? (optional)"}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24"
                  required={showCommentField}
                />
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={rating === 0 || isSubmitting}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                rating === 0 || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>

        {/* Feedbacks List */}
        {feedbacks.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Feedback
            </h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= feedback.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-400 ml-auto">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  {feedback.comment && (
                    <p className="text-gray-700 text-sm">{feedback.comment}</p>
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
