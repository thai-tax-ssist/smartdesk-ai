'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarProps {
  conversations?: { id: string; title?: string; created_at: string }[];
  queriesUsed?: number;
  queriesLimit?: number;
  userName?: string;
  userEmail?: string;
  plan?: string;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/chat', label: 'New Chat', icon: '✨' },
  { href: '/billing', label: 'Billing', icon: '💳' },
];

export function Sidebar({ conversations = [], queriesUsed = 0, queriesLimit = 200, userName, userEmail, plan }: SidebarProps) {
  const pathname = usePathname();
  const unlimited = queriesLimit === -1;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
      <div className="p-4 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>SmartDesk.ai</span>
        </Link>
      </div>

      <nav className="p-3 border-b border-slate-800">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              pathname === item.href || pathname.startsWith(item.href + '/')
                ? 'bg-indigo-600/20 text-indigo-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            )}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto p-3">
        <p className="text-xs font-medium text-slate-500 px-3 mb-2 uppercase tracking-wider">Recent Chats</p>
        {conversations.slice(0, 20).map(conv => (
          <Link
            key={conv.id}
            href={`/chat/${conv.id}`}
            className={cn(
              'block px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors truncate',
              pathname === `/chat/${conv.id}` && 'bg-slate-800 text-white'
            )}
          >
            {conv.title || 'New conversation'}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-slate-800 space-y-3">
        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Queries used</span>
            <span>{unlimited ? '∞' : `${queriesUsed}/${queriesLimit}`}</span>
          </div>
          {!unlimited && (
            <div className="w-full bg-slate-700 rounded-full h-1.5">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(100, (queriesUsed / queriesLimit) * 100)}%` }}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-medium text-white">
            {userName?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{userName || userEmail}</p>
            <p className="text-xs text-slate-400 capitalize">{plan || 'trial'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
