import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            <span className="font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>SmartDesk.ai</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="text-sm text-slate-500">
            © 2025 SmartDesk.ai — Built for Irish & European businesses 🇮🇪
          </p>
        </div>
      </div>
    </footer>
  );
}
