"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function MarketingFooter() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">C</span>
              </div>
              <div>
                <span className="text-xl font-bold text-white">MedCare</span>
                <span className="text-xs text-slate-400 block -mt-1">HEALTH NETWORK</span>
              </div>
            </div>
            <p className="text-slate-400 mb-6 max-w-sm">
              Quality healthcare made affordable. Join our network of 50,000+ providers 
              and start saving up to 40% on medical expenses.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 bg-slate-800 hover:bg-teal-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Find a Provider", href: "/find-provider" },
                { name: "Member Portal", href: "/member" },
                { name: "Provider Portal", href: "/provider" },
                { name: "How It Works", href: "/how-it-works" },
                { name: "About Us", href: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-teal-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { name: "For Members", href: "/members" },
                { name: "For Providers", href: "/providers" },
                { name: "For Employers", href: "/employers" },
                { name: "Contact Us", href: "/contact" },
                { name: "FAQ", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-slate-400 hover:text-teal-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">1-800-MEDCARE</p>
                  <p className="text-sm text-slate-400">24/7 Support</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white">support@medcarehealth.com</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-400">Cleveland, OH</p>
                  <p className="text-slate-400">Serving all 50 states</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2026 MedCare Health Network. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-teal-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-slate-400 hover:text-teal-400 transition-colors">Terms of Service</Link>
              <Link href="/hipaa" className="text-slate-400 hover:text-teal-400 transition-colors">HIPAA Notice</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
