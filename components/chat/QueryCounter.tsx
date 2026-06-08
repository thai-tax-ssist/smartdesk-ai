import Link from 'next/link';

interface QueryCounterProps {
  used: number;
  limit: number;
  plan: string;
}

export function QueryCounter({ used, limit, plan }: QueryCounterProps) {
  if (limit === -1) {
    return (
      <div className="text-xs text-slate-400">
        <span className="text-emerald-400 font-medium">∞</span> Unlimited queries
      </div>
    );
  }

  const pct = Math.min(100, (used / limit) * 100);
  const remaining = limit - used;
  const low = pct > 80;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{remaining} queries left</span>
        <span>{used}/{limit}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-1">
        <div
          className={`h-1 rounded-full transition-all ${low ? 'bg-amber-500' : 'bg-indigo-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {low && (
        <Link href="/billing" className="text-xs text-amber-400 hover:text-amber-300">
          Upgrade to get more →
        </Link>
      )}
    </div>
  );
}
