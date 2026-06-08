interface InterviewProgressProps {
  current: number;
  total: number;
}

export function InterviewProgress({ current, total }: InterviewProgressProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-6 rounded-full transition-all ${
              i < current ? 'bg-indigo-500' : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-indigo-400 font-medium">
        Question {current} of {total}
      </span>
    </div>
  );
}
