import { useEffect, useMemo, useState, type FormEvent } from "react";

interface Feedback {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
}

interface RotiResponse {
  average: number;
  feedbacks: Feedback[];
}

const ratingOptions = [1, 2, 3, 4, 5];

function App() {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [average, setAverage] = useState(0);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCommentRequired = rating !== null && rating <= 3;
  const trimmedComment = comment.trim();

  const averageDisplay = useMemo(() => {
    if (feedbacks.length === 0) return "—";
    return average.toFixed(1);
  }, [average, feedbacks.length]);

  const canSubmit =
    rating !== null && (!isCommentRequired || trimmedComment.length > 0) && !isSubmitting;

  const loadFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/roti");
      if (!response.ok) throw new Error("Erreur API");
      const data = (await response.json()) as RotiResponse;
      setAverage(data.average);
      setFeedbacks(data.feedbacks);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating === null) {
      setSubmitError("Merci de choisir une note.");
      return;
    }
    if (isCommentRequired && trimmedComment.length === 0) {
      setSubmitError("Merci d'ajouter un commentaire.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/roti", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: trimmedComment.length > 0 ? trimmedComment : null,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error || "Impossible d'envoyer le feedback.");
      }

      setRating(null);
      setComment("");
      setSubmitError(null);
      await loadFeedbacks();
    } catch (err) {
      setSubmitError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 text-ink">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-3xl bg-white/80 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">
                Live Vibe Coding
              </p>
              <h1 className="font-display text-3xl font-semibold sm:text-4xl">
                ROTI du talk
              </h1>
              <p className="text-base text-slate">
                Laissez votre note en direct, c'est rapide et anonyme.
              </p>
            </div>
            <div className="rounded-2xl border border-mist bg-cloud px-6 py-4 text-center">
              <p className="text-xs uppercase tracking-[0.2em] text-slate">Moyenne</p>
              <p className="font-display text-4xl font-semibold text-ink">{averageDisplay}</p>
              <p className="text-xs text-slate">{feedbacks.length} retours</p>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl bg-white p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold">Votre feedback</h2>
            <p className="mt-1 text-sm text-slate">
              Note de 1 (pas utile) a 5 (indispensable).
            </p>

            <form className="mt-6 flex flex-col gap-6" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-semibold text-slate">Votre note</label>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ratingOptions.map((value) => {
                    const isActive = rating === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg font-semibold transition ${
                          isActive
                            ? "border-accent bg-accent text-white shadow-soft"
                            : "border-mist bg-white text-ink hover:border-accent hover:text-accent"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate">Commentaire</label>
                  {isCommentRequired && (
                    <span className="text-xs font-semibold text-accent">Obligatoire</span>
                  )}
                </div>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Ce qui vous a plu ou ce qui peut etre ameliore..."
                  rows={4}
                  className="mt-3 w-full resize-none rounded-2xl border border-mist bg-cloud p-4 text-sm text-ink focus:border-accent focus:outline-none"
                />
              </div>

              {submitError && <p className="text-sm text-red-600">{submitError}</p>}

              <button
                type="submit"
                disabled={!canSubmit}
                className="flex items-center justify-center rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition enabled:hover:bg-accentDark disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer mon feedback"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl bg-white/80 p-6 shadow-soft backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">Feedbacks</h2>
              {loading && <span className="text-xs text-slate">Chargement...</span>}
            </div>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

            <div className="mt-6 flex flex-col gap-4">
              {!loading && feedbacks.length === 0 && (
                <div className="rounded-2xl border border-dashed border-mist bg-cloud p-4 text-sm text-slate">
                  Aucun feedback pour le moment.
                </div>
              )}

              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="rounded-2xl border border-mist bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {feedback.rating}/5
                    </span>
                    <span className="text-xs text-slate">
                      {new Date(feedback.createdAt).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate">
                    {feedback.comment ? feedback.comment : "(Pas de commentaire)"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
