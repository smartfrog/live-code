import { useEffect, useState } from "react";
import "./App.css";
import { FeedbackForm } from "./components/FeedbackForm";
import { FeedbackList } from "./components/FeedbackList";
import { AverageRating } from "./components/AverageRating";

interface Feedback {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface FeedbacksResponse {
  feedbacks: Feedback[];
  averageRating: number | null;
}

function App() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch("/api/feedbacks");
      if (!res.ok) throw new Error("Failed to fetch feedbacks");
      const data: FeedbacksResponse = await res.json();
      setFeedbacks(data.feedbacks);
      setAverageRating(data.averageRating);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleSubmit = async (rating: number, comment: string) => {
    const res = await fetch("/api/feedbacks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment: comment || null }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to submit feedback");
    }

    await fetchFeedbacks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            ROTI Feedback
          </h1>
          <p className="text-gray-500 mt-2">Return On Time Invested</p>
        </header>

        {error && (
          <div className="mb-6 text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <AverageRating average={averageRating} count={feedbacks.length} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <FeedbackForm onSubmit={handleSubmit} />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <FeedbackList feedbacks={feedbacks} />
        </div>
      </div>
    </div>
  );
}

export default App;
