import { useEffect, useMemo, useState, type FormEvent } from "react";

interface RotiFeedback {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface RotiResponse {
  average: number;
  count: number;
  feedbacks: RotiFeedback[];
}

const ratings = [1, 2, 3, 4, 5];

function App() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [data, setData] = useState<RotiResponse>({ average: 0, count: 0, feedbacks: [] });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentRequired = useMemo(() => rating <= 3, [rating]);

  const loadFeedbacks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/roti");
      if (!response.ok) throw new Error("Failed to load ROTI feedbacks");
      const payload = (await response.json()) as RotiResponse;
      setData(payload);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : "Unexpected error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (commentRequired && comment.trim().length === 0) {
      setError("Comment is required when rating is 3 or below");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/roti", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, comment }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Failed to submit feedback");
      }

      setComment("");
      setRating(5);
      await loadFeedbacks();
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Unexpected error";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-4 py-10 sm:px-8 lg:flex-row lg:items-start">
        <div className="flex w-full flex-col gap-6 lg:w-[45%]">
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl shadow-slate-200/60">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.35em] text-teal-600">ROTI Live</p>
              <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                Live voting
              </span>
            </div>
            <h1 className="mt-6 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Rate the talk in seconds
            </h1>
            <p className="mt-3 text-sm text-slate-600 sm:text-base">
              Drop a quick ROTI score and help us capture the room energy. Comments are
              required when the rating is 3 or below.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl shadow-slate-200/60"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Your ROTI</h2>
              <span className="text-xs text-slate-500">1 = low, 5 = amazing</span>
            </div>

            <div className="mt-4 grid grid-cols-5 gap-2">
              {ratings.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className={`rounded-2xl border px-0 py-3 text-lg font-semibold transition ${
                    rating === value
                      ? "border-teal-500 bg-teal-50 text-teal-700"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium text-slate-700" htmlFor="comment">
                Comment {commentRequired && <span className="text-amber-600">(required)</span>}
              </label>
              <textarea
                id="comment"
                rows={4}
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Share the key takeaway or suggestion..."
                className="mt-3 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200"
              />
              {commentRequired && (
                <p className="mt-2 text-xs text-amber-600">
                  Please add a short comment if the rating is 3 or below.
                </p>
              )}
            </div>

            {error && (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Submit feedback"}
            </button>
          </form>
        </div>

        <div className="flex w-full flex-col gap-6 lg:w-[55%]">
          <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl shadow-slate-200/60">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Live ROTI</h2>
              <span className="text-xs text-slate-500">
                {data.count} {data.count === 1 ? "vote" : "votes"}
              </span>
            </div>
            <div className="mt-5 flex items-end gap-4">
              <span className="text-5xl font-semibold text-slate-900">{data.average.toFixed(1)}</span>
              <div className="pb-1 text-sm text-slate-500">Average rating</div>
            </div>
            {isLoading && <p className="mt-4 text-sm text-slate-500">Loading feedbacks...</p>}
          </div>

          <div className="flex flex-col gap-4">
            {data.feedbacks.length === 0 && !isLoading ? (
              <div className="rounded-3xl border border-dashed border-slate-200/80 bg-white/70 p-6 text-sm text-slate-500">
                No feedback yet. Be the first to share a ROTI score.
              </div>
            ) : (
              data.feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-xl shadow-slate-200/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-600">
                      ROTI {feedback.rating}
                    </span>
                    <span className="text-xs text-slate-400">{feedback.createdAt.slice(11, 16)}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-700">
                    {feedback.comment.length > 0 ? feedback.comment : "No comment provided."}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
