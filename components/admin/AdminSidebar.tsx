'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Overview', icon: '📊', exact: true },
  { href: '/admin/agencies', label: 'Agencies', icon: '🏢' },
  { href: '/admin/users', label: 'All Users', icon: '👥' },
  { href: '/admin/revenue', label: 'Revenue', icon: '💰' },
  { href: '/admin/tickets', label: 'Support Tickets', icon: '🎟️' },
  { href: '/admin/early-bird', label: 'Early Bird', icon: '🔥' },
];

interface AdminSidebarProps {
  userName?: string;
  userEmail?: string;
}

export function AdminSidebar({ userName, userEmail }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>SmartDesk.ai</span>
        </div>
        <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider">
          ⭐ Super Admin
        </span>
      </div>

      <nav className="flex-1 p-3 overflow-y-auto">
        {navItems.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mb-0.5',
                active ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <Link href="/dashboard" className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 transition-colors mb-3">
          ← View as User
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-sm font-bold text-amber-400">
            {userName?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{userName || userEmail}</p>
            <p className="text-xs text-amber-400">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
