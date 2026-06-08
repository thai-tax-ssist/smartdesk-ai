'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/agency', label: 'Overview', icon: '📊', exact: true },
  { href: '/agency/users', label: 'My Users', icon: '👥' },
  { href: '/agency/usage', label: 'Usage Stats', icon: '📈' },
  { href: '/agency/billing', label: 'Billing', icon: '💳' },
  { href: '/agency/settings', label: 'Brand Settings', icon: '🎨' },
];

interface AgencyNavProps {
  agencyName?: string;
  logoUrl?: string;
  userName?: string;
  userEmail?: string;
}

export function AgencyNav({ agencyName, logoUrl, userName, userEmail }: AgencyNavProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          {logoUrl ? (
            <img src={logoUrl} alt={agencyName} className="h-8 object-contain" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">{agencyName?.[0] || 'A'}</span>
            </div>
          )}
          <span className="font-bold text-white text-sm truncate" style={{ fontFamily: 'Sora, sans-serif' }}>
            {agencyName || 'Agency'}
          </span>
        </div>
        <p className="text-xs text-slate-600">Powered by SmartDesk.ai</p>
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
                active ? 'bg-violet-600/20 text-violet-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-sm font-bold text-violet-400">
            {userName?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate">{userName || userEmail}</p>
            <p className="text-xs text-violet-400">Agency Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default AgencyNav;
