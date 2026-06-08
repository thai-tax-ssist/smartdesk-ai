import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a472a] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#1a472a] font-bold text-sm">M</div>
              <span className="font-bold text-lg">Mr. Document</span>
            </div>
            <p className="text-green-200 text-sm">Your Documents, Sorted.</p>
            <p className="text-green-300 text-sm mt-2">Cork, Ireland 🍀</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-green-200">
            <Link href="/#services" className="hover:text-white">Services</Link>
            <Link href="/#how-it-works" className="hover:text-white">How it works</Link>
            <Link href="/#pricing" className="hover:text-white">Pricing</Link>
            <Link href="/#contact" className="hover:text-white">Contact</Link>
            <Link href="/dashboard" className="hover:text-white">Client Login</Link>
          </div>
          <div className="text-sm text-green-200">
            <p className="font-medium text-white mb-2">Contact</p>
            <p>shalongthaifood@gmail.com</p>
            <p className="mt-1">Cork, Ireland</p>
          </div>
        </div>
        <div className="border-t border-green-700 mt-8 pt-6 text-center text-green-300 text-sm">
          © 2025 Mr. Document. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
