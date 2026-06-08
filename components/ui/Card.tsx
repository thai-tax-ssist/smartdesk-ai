import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

export function Card({ className, glow, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-slate-800/50 border border-slate-700/50 rounded-xl p-6',
        glow && 'shadow-lg shadow-indigo-500/10 border-indigo-500/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
