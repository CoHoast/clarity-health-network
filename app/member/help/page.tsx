"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

const helpCategories = [
  {
    id: "membership",
    icon: CreditCard,
    title: "ID Cards & Membership",
    description: "Get your digital ID, add dependents, update info",
    articles: 12,
    color: "teal",
  },
  {
    id: "claims",
    icon: FileText,
    title: "Claims & Billing",
    description: "Submit claims, check status, understand EOBs",
    articles: 18,
    color: "blue",
  },
  {
    id: "benefits",
    icon: Heart,
    title: "Benefits & Coverage",
    description: "Understand your plan, coverage limits, exclusions",
    articles: 15,
    color: "pink",
  },
  {
    id: "care",
    icon: Stethoscope,
    title: "Finding Care",
    description: "Find providers, urgent care, specialists",
    articles: 10,
    color: "emerald",
  },
  {
    id: "costs",
    icon: DollarSign,
    title: "Costs & Payments",
    description: "Deductibles, copays, out-of-pocket max explained",
    articles: 14,
    color: "purple",
  },
  {
    id: "account",
    icon: Shield,
    title: "Account & Security",
    description: "Password, 2FA, privacy settings",
    articles: 8,
    color: "orange",
  },
];

// Articles for each category
const categoryArticles: Record<string, { title: string; summary: string; readTime: string }[]> = {
  membership: [
    { title: "How to access your digital ID card", summary: "Learn how to view, download, and share your digital ID card from the member portal.", readTime: "2 min" },
    { title: "Adding a dependent to your plan", summary: "Step-by-step guide to adding a spouse, child, or other dependent to your health plan.", readTime: "4 min" },
    { title: "Updating your personal information", summary: "How to change your address, phone number, email, or other contact information.", readTime: "2 min" },
    { title: "Adding your ID card to Apple Wallet or Google Pay", summary: "Quick guide to adding your digital health insurance card to your phone's wallet.", readTime: "2 min" },
    { title: "Requesting a physical ID card", summary: "How to request a replacement physical ID card to be mailed to your address.", readTime: "1 min" },
    { title: "Understanding your member ID number", summary: "What your member ID means and how it's used by providers and pharmacies.", readTime: "3 min" },
    { title: "Setting up authorized representatives", summary: "How to give family members permission to manage your account or access your information.", readTime: "3 min" },
    { title: "Changing your primary care provider (PCP)", summary: "How to select or change your PCP through the member portal.", readTime: "2 min" },
  ],
  claims: [
    { title: "How to submit a claim for reimbursement", summary: "Complete guide to submitting out-of-network or out-of-pocket claims for reimbursement.", readTime: "5 min" },
    { title: "Understanding your Explanation of Benefits (EOB)", summary: "Learn how to read your EOB and understand what was paid and what you owe.", readTime: "6 min" },
    { title: "Checking the status of a claim", summary: "How to track your claim from submission to payment in the member portal.", readTime: "2 min" },
    { title: "Why was my claim denied?", summary: "Common reasons for claim denials and what you can do about them.", readTime: "4 min" },
    { title: "How to appeal a denied claim", summary: "Step-by-step process for appealing a claim denial and what documentation you need.", readTime: "5 min" },
    { title: "Coordination of benefits with multiple plans", summary: "How claims are processed when you have coverage from more than one health plan.", readTime: "4 min" },
    { title: "Understanding claim timelines", summary: "How long it takes to process different types of claims and what to expect.", readTime: "3 min" },
    { title: "Submitting claims for out-of-network care", summary: "How to file claims when you see a provider outside the network.", readTime: "4 min" },
  ],
  benefits: [
    { title: "Understanding your PPO plan benefits", summary: "Overview of what your MedCare Health PPO plan covers and how it works.", readTime: "5 min" },
    { title: "What's covered under preventive care?", summary: "Complete list of preventive services covered at 100% with no cost to you.", readTime: "4 min" },
    { title: "Mental health and behavioral health coverage", summary: "Your coverage for therapy, counseling, psychiatry, and substance abuse treatment.", readTime: "4 min" },
    { title: "Prescription drug coverage and formulary", summary: "How your prescription benefits work and how to find covered medications.", readTime: "5 min" },
    { title: "Emergency room vs urgent care: When to go where", summary: "Understanding the difference and how coverage applies to each.", readTime: "3 min" },
    { title: "Coverage for specialist visits", summary: "How specialist visits are covered with your PPO plan (no referral needed!).", readTime: "3 min" },
    { title: "Maternity and newborn care coverage", summary: "What's covered during pregnancy, delivery, and for your newborn.", readTime: "5 min" },
    { title: "Vision and dental: What's included?", summary: "Understanding any vision or dental benefits included with your health plan.", readTime: "3 min" },
  ],
  care: [
    { title: "How do I find an in-network provider?", summary: "Using the Find a Provider tool to search for doctors, specialists, and facilities.", readTime: "3 min" },
    { title: "What is telehealth and how do I use it?", summary: "Access virtual doctor visits 24/7 from your phone or computer.", readTime: "4 min" },
    { title: "Finding an urgent care center near you", summary: "When to use urgent care and how to find in-network locations.", readTime: "2 min" },
    { title: "Getting a referral to a specialist", summary: "Good news: With a PPO, you don't need a referral! Here's how it works.", readTime: "2 min" },
    { title: "Scheduling an appointment through the portal", summary: "How to book appointments directly with providers through your member portal.", readTime: "3 min" },
    { title: "Finding a pharmacy in your network", summary: "How to find pharmacies that accept your plan and get the best prices.", readTime: "2 min" },
    { title: "What to do in a medical emergency", summary: "Important information about emergency care coverage and what to do.", readTime: "2 min" },
    { title: "Getting care while traveling", summary: "How your coverage works when you're away from home or out of state.", readTime: "3 min" },
  ],
  costs: [
    { title: "What is a deductible and how does it work?", summary: "Understanding your annual deductible and how it affects your costs.", readTime: "4 min" },
    { title: "Copays vs coinsurance: What's the difference?", summary: "Learn about the two types of cost-sharing and when each applies.", readTime: "3 min" },
    { title: "Understanding your out-of-pocket maximum", summary: "The most you'll pay in a year and how it protects you from high costs.", readTime: "3 min" },
    { title: "How to estimate your costs before a visit", summary: "Using the Cost Estimator tool to know what you'll pay upfront.", readTime: "3 min" },
    { title: "Why do costs vary by provider?", summary: "Understanding why the same service can cost different amounts at different providers.", readTime: "4 min" },
    { title: "Setting up a payment plan", summary: "Options for paying medical bills over time if you need flexibility.", readTime: "2 min" },
    { title: "Health Savings Account (HSA) basics", summary: "If you have an HSA-eligible plan, learn how to use your tax-advantaged savings.", readTime: "4 min" },
    { title: "Getting help with medical bills", summary: "Resources available if you're struggling to pay for medical care.", readTime: "3 min" },
  ],
  account: [
    { title: "How to reset your password", summary: "Quick steps to reset your member portal password if you've forgotten it.", readTime: "1 min" },
    { title: "Setting up two-factor authentication (2FA)", summary: "Add an extra layer of security to your account with 2FA.", readTime: "3 min" },
    { title: "Managing your notification preferences", summary: "Control how and when you receive alerts about claims, appointments, and more.", readTime: "2 min" },
    { title: "Downloading your health records", summary: "How to access and download your claims history and health information.", readTime: "3 min" },
    { title: "Understanding your privacy rights", summary: "Your HIPAA rights and how we protect your personal health information.", readTime: "4 min" },
    { title: "Linking family member accounts", summary: "How to manage coverage for dependents from your account.", readTime: "3 min" },
    { title: "Closing or deactivating your account", summary: "What to do if you're leaving the plan or need to close your account.", readTime: "2 min" },
    { title: "Updating your communication preferences", summary: "Choose between email, text, mail, or phone for different types of communications.", readTime: "2 min" },
  ],
};

const popularArticles = [
  { title: "How do I find an in-network provider?", views: "5.2k", category: "Finding Care", categoryId: "care" },
  { title: "Understanding your Explanation of Benefits (EOB)", views: "4.8k", category: "Claims", categoryId: "claims" },
  { title: "What is a deductible and how does it work?", views: "4.5k", category: "Costs", categoryId: "costs" },
  { title: "How to submit a claim for reimbursement", views: "3.9k", category: "Claims", categoryId: "claims" },
  { title: "Adding a dependent to your plan", views: "3.2k", category: "Membership", categoryId: "membership" },
  { title: "What's covered under preventive care?", views: "2.8k", category: "Benefits", categoryId: "benefits" },
];

const faqs = [
  {
    q: "How do I get a new ID card?",
    a: "You can view and download your digital ID card anytime from the ID Card section of your member portal. You can also add it to your Apple Wallet or Google Pay, email yourself a copy, or request a physical card to be mailed to you."
  },
  {
    q: "Do I need a referral to see a specialist?",
    a: "No! With your MedCare Health PPO plan, you have direct access to any in-network specialist without needing a referral from your primary care physician. This gives you the flexibility to manage your own care."
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
  const [showPulseChat, setShowPulseChat] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<{ title: string; summary: string; readTime: string } | null>(null);

  const currentCategory = helpCategories.find(c => c.id === selectedCategory);
  const currentArticles = selectedCategory ? categoryArticles[selectedCategory] || [] : [];

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
        <button 
          onClick={() => setShowPulseChat(true)}
          className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-colors"
        >
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <div className="text-left">
            <p className="font-semibold">Chat with Pulse AI</p>
            <p className="text-teal-100 text-sm">Get instant answers</p>
          </div>
        </button>
        <button 
          onClick={() => window.open('tel:+18005550123', '_self')}
          className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Phone className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">Call Support</p>
            <p className="text-gray-500 text-sm">1-800-555-0123</p>
          </div>
        </button>
        <button 
          onClick={() => window.location.href = 'mailto:support@medcarehealth.com?subject=Support Request'}
          className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">Email Us</p>
            <p className="text-gray-500 text-sm">support@medcarehealth.com</p>
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
                onClick={() => setSelectedCategory(category.id)}
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
              onClick={() => {
                setSelectedCategory(article.categoryId);
                const fullArticle = categoryArticles[article.categoryId]?.find(a => a.title === article.title);
                if (fullArticle) setSelectedArticle(fullArticle);
              }}
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
            <button 
              onClick={() => window.open('tel:+18005550123', '_self')}
              className="px-6 py-3 bg-white text-gray-900 font-medium rounded-xl hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
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

      {/* Pulse AI Chat Panel */}
      <AnimatePresence>
        {showPulseChat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowPulseChat(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-teal-500 to-emerald-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Pulse AI</h3>
                    <p className="text-xs text-teal-100">Your health assistant</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPulseChat(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm max-w-[85%]">
                  <p className="text-gray-900">Hi John! 👋 I'm Pulse, your AI health assistant. I can help you with:</p>
                  <ul className="mt-2 text-gray-700 text-sm space-y-1">
                    <li>• Understanding your benefits</li>
                    <li>• Finding in-network providers</li>
                    <li>• Explaining your claims</li>
                    <li>• Estimating costs</li>
                  </ul>
                  <p className="text-gray-900 mt-2">What can I help you with today?</p>
                  <p className="text-xs text-gray-400 mt-2">Just now</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {["Check my benefits", "Find a doctor", "Explain my EOB", "Track a claim", "Cost estimate", "ID card help"].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-teal-300 hover:bg-teal-50 transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask Pulse anything..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Category Articles Modal */}
      <AnimatePresence>
        {selectedCategory && !selectedArticle && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCategory(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-500" />
                </button>
                <div className="flex items-center gap-3">
                  {currentCategory && (
                    <div className={`w-10 h-10 bg-${currentCategory.color}-100 rounded-xl flex items-center justify-center`}>
                      <currentCategory.icon className={`w-5 h-5 text-${currentCategory.color}-600`} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{currentCategory?.title}</h3>
                    <p className="text-sm text-gray-500">{currentArticles.length} articles</p>
                  </div>
                </div>
              </div>

              {/* Articles List */}
              <div className="overflow-y-auto max-h-[calc(85vh-80px)]">
                <div className="divide-y divide-gray-100">
                  {currentArticles.map((article, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedArticle(article)}
                      className="w-full px-6 py-4 flex items-start gap-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                        <FileText className="w-4 h-4 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 mb-1">{article.title}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{article.summary}</p>
                        <p className="text-xs text-teal-600 mt-2">{article.readTime} read</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 mt-2" />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setSelectedArticle(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-gray-600"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="text-sm">Back to articles</span>
                </button>
                <button
                  onClick={() => { setSelectedArticle(null); setSelectedCategory(null); }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Article Content */}
              <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6">
                <div className="flex items-center gap-2 text-sm text-teal-600 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{selectedArticle.readTime} read</span>
                  <span className="text-gray-300">•</span>
                  <span>{currentCategory?.title}</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
                
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-600 text-lg mb-6">{selectedArticle.summary}</p>
                  
                  {/* Mock article content */}
                  <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Overview</h2>
                  <p className="text-gray-600 mb-4">
                    This article provides detailed information to help you understand this topic and take the appropriate actions. 
                    As a MedCare Health member, you have access to comprehensive resources and support.
                  </p>

                  <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Step-by-Step Guide</h2>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
                    <li>Log in to your member portal at member.medcarehealth.com</li>
                    <li>Navigate to the relevant section from your dashboard</li>
                    <li>Follow the on-screen instructions to complete your request</li>
                    <li>Review and confirm your information</li>
                    <li>You'll receive a confirmation email within 24 hours</li>
                  </ol>

                  <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Important Information</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 text-sm">
                      💡 <strong>Tip:</strong> You can also complete this action through the MedCare Health mobile app, 
                      available for iOS and Android devices.
                    </p>
                  </div>

                  <h2 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Need More Help?</h2>
                  <p className="text-gray-600 mb-4">
                    If you have additional questions or need assistance, our Member Services team is here to help:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
                    <li>Call us at 1-800-555-0123 (Mon-Fri 8am-8pm, Sat 9am-5pm EST)</li>
                    <li>Chat with Pulse AI for instant answers 24/7</li>
                    <li>Send a secure message through the member portal</li>
                  </ul>
                </div>

                {/* Helpful? */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-3">Was this article helpful?</p>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-green-100 hover:text-green-700 transition-colors text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Yes, thanks!
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      Not really
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
