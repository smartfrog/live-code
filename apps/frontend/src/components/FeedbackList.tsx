interface Feedback {
  id: number;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface FeedbackListProps {
  feedbacks: Feedback[];
}

function getRatingColor(rating: number): string {
  if (rating >= 4) {
    return "bg-gradient-to-br from-green-400 to-emerald-500";
  }
  if (rating === 3) {
    return "bg-gradient-to-br from-yellow-400 to-orange-400";
  }
  return "bg-gradient-to-br from-red-400 to-rose-500";
}

export function FeedbackList({ feedbacks }: FeedbackListProps) {
  if (feedbacks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
        Recent Feedback
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="bg-gray-50 rounded-lg p-3 flex items-start gap-3"
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${getRatingColor(feedback.rating)}`}>
              {feedback.rating}
            </div>
            <div className="flex-1 min-w-0">
              {feedback.comment ? (
                <p className="text-gray-700 text-sm">{feedback.comment}</p>
              ) : (
                <p className="text-gray-400 text-sm italic">No comment</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {new Date(feedback.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
