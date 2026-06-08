'use client';
import { useEffect, useState } from 'react';

interface StatsCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: string;
  prefix?: string;
  suffix?: string;
  accent?: 'red' | 'green' | 'yellow';
}

export function StatsCard({ label, value, change, icon, prefix = '', suffix = '', accent }: StatsCardProps) {
  const [displayed, setDisplayed] = useState(0);
  const numeric = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.]/g, '')) || 0;

  useEffect(() => {
    let start = 0;
    const end = numeric;
    if (end === 0) return;
    const step = end / 30;
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplayed(end); clearInterval(timer); }
      else setDisplayed(Math.floor(start));
    }, 20);
    return () => clearInterval(timer);
  }, [numeric]);

  const valueColor = accent === 'red' ? 'text-red-400' : accent === 'green' ? 'text-green-400' : 'text-white';

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-2xl font-bold mb-1 ${valueColor}`}>
        {prefix}{displayed.toLocaleString()}{suffix}
      </p>
      {change !== undefined && (
        <p className={`text-xs flex items-center gap-1 ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <span>{change >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(change)}% vs last month</span>
        </p>
      )}
    </div>
  );
}

export default StatsCard;
