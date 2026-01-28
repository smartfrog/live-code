interface AverageRatingProps {
  average: number | null;
  count: number;
}

export function AverageRating({ average, count }: AverageRatingProps) {
  if (average === null || count === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No ratings yet. Be the first!</p>
      </div>
    );
  }

  const percentage = (average / 5) * 100;

  return (
    <div className="text-center py-6">
      <div className="text-5xl font-bold bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
        {average.toFixed(1)}
      </div>
      <div className="text-sm text-gray-500 mt-1">out of 5</div>
      
      <div className="mt-4 mx-auto max-w-xs">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      <div className="text-sm text-gray-400 mt-3">
        Based on {count} {count === 1 ? "response" : "responses"}
      </div>
    </div>
  );
}
