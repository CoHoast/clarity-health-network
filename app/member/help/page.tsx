"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Heart,
  DollarSign,
  Stethoscope,
  Shield,
  Clock,
  Users,
  Zap,
  ExternalLink,
  PlayCircle,
  BookOpen,
} from "lucide-react";

const helpCategories = [
  {
    icon: CreditCard,
    title: "ID Cards & Membership",
    description: "Get your digital ID, add dependents, update info",
    articles: 12,
    color: "teal",
  },
  {
    icon: FileText,
    title: "Claims & Billing",
    description: "Submit claims, check status, understand EOBs",
    articles: 18,
    color: "blue",
  },
  {
    icon: Heart,
    title: "Benefits & Coverage",
    description: "Understand your plan, coverage limits, exclusions",
    articles: 15,
    color: "pink",
  },
  {
    icon: Stethoscope,
    title: "Finding Care",
    description: "Find providers, urgent care, specialists",
    articles: 10,
    color: "emerald",
  },
  {
    icon: DollarSign,
    title: "Costs & Payments",
    description: "Deductibles, copays, out-of-pocket max explained",
    articles: 14,
    color: "purple",
  },
  {
    icon: Shield,
    title: "Account & Security",
    description: "Password, 2FA, privacy settings",
    articles: 8,
    color: "orange",
  },
];

const popularArticles = [
  { title: "How do I find an in-network provider?", views: "5.2k", category: "Finding Care" },
  { title: "Understanding your Explanation of Benefits (EOB)", views: "4.8k", category: "Claims" },
  { title: "What is a deductible and how does it work?", views: "4.5k", category: "Costs" },
  { title: "How to submit a claim for reimbursement", views: "3.9k", category: "Claims" },
  { title: "Adding a dependent to your plan", views: "3.2k", category: "Membership" },
  { title: "What's covered under preventive care?", views: "2.8k", category: "Benefits" },
];

const faqs = [
  {
    q: "How do I get a new ID card?",
    a: "You can view and download your digital ID card anytime from the ID Card section of your member portal. You can also add it to your Apple Wallet or Google Pay, email yourself a copy, or request a physical card to be mailed to you."
  },
  {
    q: "Do I need a referral to see a specialist?",
    a: "No! With your Clarity Health PPO plan, you have direct access to any in-network specialist without needing a referral from your primary care physician. This gives you the flexibility to manage your own care."
  },
  {
    q: "How long does it take to process a claim?",
    a: "Most claims are processed within 5-7 business days of receipt. Complex claims may take up to 30 days. You can track your claim status in real-time through the Claims section of your member portal."
  },
  {
    q: "What should I do in a medical emergency?",
    a: "For life-threatening emergencies, call 911 or go to the nearest emergency room. Your ER visits are covered at any hospital nationwide. Your $250 ER copay is waived if you are admitted to the hospital."
  },
  {
    q: "How do I check if a provider is in-network?",
    a: "Use our Find a Provider tool in your member portal or on our website. You can search by name, specialty, or location. You can also call Member Services at 1-800-555-0123 to verify network status."
  },
  {
    q: "What is the difference between deductible and out-of-pocket maximum?",
    a: "Your deductible is the amount you pay before your plan starts paying (e.g., $500). After meeting your deductible, you pay coinsurance (e.g., 20%). Your out-of-pocket maximum is the most you'll pay in a year (e.g., $3,500). After reaching this, your plan covers 100%."
  },
];

const videoTutorials = [
  { title: "Navigating Your Member Portal", duration: "3:45" },
  { title: "How to Submit a Claim", duration: "2:30" },
  { title: "Understanding Your Benefits", duration: "4:15" },
  { title: "Using Telehealth Services", duration: "2:00" },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">How can we help you?</h1>
        <p className="text-gray-500">Search our help center or browse categories below</p>
      </div>

      {/* Search */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search for help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <button className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-colors">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Chat with Pulse AI</p>
            <p className="text-teal-100 text-sm">Get instant answers</p>
          </div>
        </button>
        <button className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">Call Support</p>
            <p className="text-gray-500 text-sm">1-800-555-0123</p>
          </div>
        </button>
        <button className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">Email Us</p>
            <p className="text-gray-500 text-sm">support@clarityhealth.com</p>
          </div>
        </button>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {helpCategories.map((category, i) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all text-left group"
              >
                <div className={`w-12 h-12 bg-${category.color}-100 rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon className={`w-6 h-6 text-${category.color}-600`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                    {category.title}
                  </p>
                  <p className="text-sm text-gray-500 mb-1">{category.description}</p>
                  <p className="text-xs text-teal-600">{category.articles} articles</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-teal-600 transition-colors shrink-0 mt-1" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Popular Articles</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {popularArticles.map((article, i) => (
            <button
              key={i}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{article.title}</p>
                  <p className="text-sm text-gray-500">{article.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">{article.views} views</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Video Tutorials */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Video Tutorials</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {videoTutorials.map((video, i) => (
            <button
              key={i}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-teal-300 hover:shadow-md transition-all group"
            >
              <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-8 h-8 text-white" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </span>
              </div>
              <div className="p-3">
                <p className="font-medium text-gray-900 text-sm">{video.title}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                {expandedFaq === i ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>
              {expandedFaq === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="px-6 pb-4"
                >
                  <p className="text-gray-600 bg-gray-50 rounded-lg p-4">{faq.a}</p>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Card */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">Still need help?</h3>
            <p className="text-gray-400">
              Our Member Services team is available Monday-Friday, 8am-8pm EST, 
              and Saturday 9am-5pm EST.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="px-6 py-3 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2">
              <Phone className="w-5 h-5" />
              1-800-555-0123
            </button>
            <Link
              href="/member/messages"
              className="px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <MessageSquare className="w-5 h-5" />
              Send Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
