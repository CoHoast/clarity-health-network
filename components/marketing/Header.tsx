"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, ChevronDown, Search } from "lucide-react";

const navigation = [
  { name: "About", href: "/about" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Members", href: "/members" },
  { name: "Providers", href: "/providers" },
  { name: "Employers", href: "/employers" },
  { name: "Find a Doctor", href: "/find-provider" },
  { name: "Contact", href: "/contact" },
];

export default function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      {/* Top bar */}
      <div className="bg-slate-900 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              1-800-555-0199
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline">Provider Network Support</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin-login" className="hover:text-teal-400 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img src="/truecare-logo.png" alt="TrueCare Health Network" className="h-14 w-auto" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-cyan-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/find-provider"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-teal-700 transition-all shadow-md shadow-cyan-500/20"
            >
              <Search className="w-4 h-4" />
              Find a Provider
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100 pt-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-gray-600 hover:text-cyan-600 hover:bg-teal-50 rounded-lg font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href="/find-provider"
                className="block px-4 py-3 mt-4 text-center bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Find a Provider
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
