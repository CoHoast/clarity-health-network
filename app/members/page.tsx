"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MarketingHeader from "@/components/marketing/Header";
import MarketingFooter from "@/components/marketing/Footer";
import {
  Search,
  CreditCard,
  FileText,
  Calculator,
  MessageCircle,
  Heart,
  Clock,
  Shield,
  CheckCircle2,
  ArrowRight,
  Phone,
  Smartphone,
  Download,
  Video,
  Zap,
  Gift,
  Star,
} from "lucide-react";

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-50 to-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-50 to-teal-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
                FOR MEMBERS
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Your Benefits.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-600">
                  At Your Fingertips.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Access your healthcare benefits anytime, anywhere. Find providers, view claims,
                and manage your care—all from your member portal.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/member"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-teal-600 text-white hover:from-cyan-600 hover:to-teal-700 rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
                >
                  Member Portal
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/find-provider"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-white text-gray-900 border-2 border-gray-200 hover:border-teal-300 rounded-xl transition-all"
                >
                  <Search className="w-5 h-5" />
                  Find a Provider
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src="/doctor-patient-care.jpg"
                alt="Doctor with patient"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
              MEMBER TOOLS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our member portal puts powerful tools in your hands.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CreditCard,
                title: "Digital ID Card",
                description: "Access your member ID card instantly from your phone. Never worry about forgetting your card again.",
              },
              {
                icon: Search,
                title: "Find Providers",
                description: "Search our network of 50,000+ doctors, specialists, and facilities by location and specialty.",
              },
              {
                icon: FileText,
                title: "View Claims",
                description: "Track all your claims and EOBs in one place. See what's been paid, pending, or needs action.",
              },
              {
                icon: Calculator,
                title: "Cost Estimator",
                description: "Know what you'll pay before your visit. Get accurate cost estimates for procedures.",
              },
              {
                icon: Zap,
                title: "Pulse AI Assistant",
                description: "Get instant answers about your benefits, find providers, and check claims 24/7.",
              },
              {
                icon: Video,
                title: "$0 Virtual Care",
                description: "See a doctor from anywhere, anytime. No appointment needed for most conditions.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ID Card Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
                DIGITAL ID CARD
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Your Card, Always Ready
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Access your digital ID card anytime from your phone or tablet. 
                Show it at any provider visit—no physical card needed.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Always available on your phone",
                  "Share via email or text",
                  "Print if needed",
                  "Auto-updates when info changes",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/member"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-teal-700 transition-all shadow-lg shadow-cyan-500/25"
              >
                Access Your Card
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="flex justify-center">
              {/* ID Card Mock */}
              <div className="bg-gradient-to-br from-cyan-400 to-teal-600 rounded-2xl p-6 text-white shadow-2xl max-w-md w-full">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-teal-200 text-sm">Member ID Card</p>
                    <h3 className="text-xl font-bold">MedCare Health Network</h3>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold">C</span>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-xs text-teal-200">Member Name</p>
                    <p className="font-semibold">John Smith</p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs text-teal-200">Member ID</p>
                      <p className="font-mono">CHN-1234567</p>
                    </div>
                    <div>
                      <p className="text-xs text-teal-200">Group</p>
                      <p className="font-mono">GRP-001</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-teal-200">Effective Date</p>
                    <p className="font-semibold">01/01/2026</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-teal-200">Network</p>
                    <p className="font-semibold">PPO Nationwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Rewards */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
                <Gift className="w-4 h-4" />
                <span className="font-semibold">Wellness Rewards</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Get Rewarded for Staying Healthy
              </h2>
              <p className="text-xl text-orange-100 mb-8">
                Earn points and rewards just by taking care of yourself. Complete wellness 
                activities and redeem for gift cards, premium discounts, and more.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { activity: "Annual Physical", points: "+500 pts" },
                  { activity: "Flu Shot", points: "+200 pts" },
                  { activity: "Health Assessment", points: "+300 pts" },
                  { activity: "Fitness Goals", points: "+100 pts" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-lg p-3 flex justify-between items-center">
                    <span>{item.activity}</span>
                    <span className="font-bold text-yellow-300">{item.points}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/member"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
              >
                View Rewards Program
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gift className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Your Rewards</h3>
                  <p className="text-3xl font-bold text-amber-500 mt-2">2,450 pts</p>
                </div>
                <div className="space-y-3">
                  {[
                    { reward: "$25 Amazon Gift Card", pts: "2,500 pts" },
                    { reward: "Premium Discount", pts: "5,000 pts" },
                    { reward: "Fitness Tracker", pts: "10,000 pts" },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-900">{item.reward}</span>
                      <span className="text-sm font-medium text-gray-600">{item.pts}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
              MEMBER SUPPORT
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">We're Here to Help</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Multiple ways to get the support you need.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: MessageCircle, title: "Pulse AI Chat", desc: "Instant answers 24/7", link: "#" },
              { icon: Phone, title: "Call Us", desc: "1-800-MEDCARE", link: "tel:1-800-MEDCARE" },
              { icon: FileText, title: "Help Center", desc: "Browse FAQs & guides", link: "/contact" },
            ].map((item, i) => (
              <a key={i} href={item.link} className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow group">
                <div className="w-14 h-14 bg-teal-100 group-hover:bg-teal-200 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors">
                  <item.icon className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-cyan-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Access Your Benefits?
          </h2>
          <p className="text-xl text-teal-100 mb-10">
            Log in to your member portal to get started.
          </p>
          <Link
            href="/member"
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-white text-cyan-700 hover:bg-teal-50 rounded-xl shadow-lg transition-colors"
          >
            Go to Member Portal
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
