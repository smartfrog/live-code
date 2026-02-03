import { useEffect, useState } from "react";
import "./App.css";

interface Feedback {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface FeedbacksResponse {
  feedbacks: Feedback[];
  average: number | null;
  count: number;
}

function getRatingBadgeClass(rating: number): string {
  if (rating >= 4) return "bg-green-100 text-green-700";
  if (rating === 3) return "bg-yellow-100 text-yellow-700";
  return "bg-red-100 text-red-700";
}

function App() {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [average, setAverage] = useState<number | null>(null);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const commentRequired = rating !== null && rating <= 3;

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
    if (rating === null) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment: comment || null }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit");
      }

      setRating(null);
      setComment("");
      setSuccess(true);
      await fetchFeedbacks();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = rating !== null && (!commentRequired || comment.trim() !== "");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-center text-3xl font-bold text-blue-900">
          ROTI
        </h1>
        <p className="mb-8 text-center text-blue-600">
          Return On Time Invested
        </p>

        <form onSubmit={handleSubmit} className="mb-8 rounded-xl bg-white p-6 shadow-lg">
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Votre note
            </label>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold transition-all ${
                    rating === value
                      ? "bg-blue-600 text-white shadow-lg scale-110"
                      : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Commentaire {commentRequired && <span className="text-red-500">*</span>}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={commentRequired ? "Dites-nous comment améliorer..." : "Optionnel"}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              rows={3}
            />
            {commentRequired && (
              <p className="mt-1 text-sm text-red-500">
                Commentaire obligatoire pour une note de 3 ou moins
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">
              Merci pour votre feedback !
            </div>
          )}

          <button
            type="submit"
            disabled={!canSubmit || loading}
            className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {loading ? "Envoi..." : "Soumettre"}
          </button>
        </form>

        {count > 0 && (
          <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Moyenne</p>
                <p className="text-3xl font-bold text-blue-600">
                  {average?.toFixed(1)} <span className="text-lg text-gray-400">/ 5</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Votes</p>
                <p className="text-3xl font-bold text-blue-600">{count}</p>
              </div>
            </div>
          </div>
        )}

        {feedbacks.length > 0 && (
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Feedbacks</h2>
            <div className="space-y-3">
              {feedbacks.map((fb) => (
                <div key={fb.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${getRatingBadgeClass(fb.rating)}`}>
                      {fb.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(fb.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {fb.comment && (
                    <p className="mt-1 text-sm text-gray-600">{fb.comment}</p>
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
