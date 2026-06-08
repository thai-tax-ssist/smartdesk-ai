'use client';
import { useEffect, useState } from 'react';

interface EarlyBirdCounterProps {
  count: number;
  maxCount: number;
  isOpen: boolean;
}

export function EarlyBirdCounter({ count, maxCount, isOpen }: EarlyBirdCounterProps) {
  const [progress, setProgress] = useState(0);
  const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(pct), 100);
    return () => clearTimeout(timer);
  }, [pct]);

  const color = !isOpen ? '#ef4444' : pct >= 90 ? '#f59e0b' : '#10b981';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-40 h-40">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#1e293b" strokeWidth="12" />
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeLinecap="round"
            transform="rotate(-90 80 80)"
            style={{ transition: 'stroke-dasharray 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white">{count}/{maxCount}</span>
          <span className="text-xs text-gray-400">spots taken</span>
        </div>
      </div>
      <div className="text-center">
        {isOpen ? (
          <span className="text-green-400 font-semibold">{maxCount - count} spots remaining</span>
        ) : (
          <span className="text-red-400 font-bold uppercase tracking-wider">CLOSED</span>
        )}
      </div>
    </div>
  );
}

export default EarlyBirdCounter;
