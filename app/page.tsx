"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import MarketingHeader from "@/components/marketing/Header";
import MarketingFooter from "@/components/marketing/Footer";
import USAMap from "@/components/USAMap";
import {
  Search,
  Users,
  DollarSign,
  Shield,
  Heart,
  Building2,
  MapPin,
  Phone,
  CheckCircle2,
  ArrowRight,
  Star,
  Clock,
  FileText,
  Stethoscope,
  Activity,
  Award,
  MessageCircle,
  CreditCard,
  Globe,
  Zap,
  Video,
  Smartphone,
  Gift,
  ChevronDown,
  ChevronUp,
  Play,
  Pill,
  Calculator,
  BookOpen,
  TrendingUp,
  Sparkles,
  X,
  Headphones,
  Trophy,
  Medal,
  Lightbulb,
  BadgeCheck,
  UserCheck,
  Wallet,
} from "lucide-react";

export default function HomePage() {
  const [estimatorValue, setEstimatorValue] = useState(5000);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showChat, setShowChat] = useState(false);

  const estimatedSavings = Math.round(estimatorValue * 0.35);

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      {/* Hero - Clean White with Photo */}
      <section className="relative bg-gradient-to-br from-slate-50 to-white overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-50 to-teal-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-60" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-teal-50 to-cyan-50 rounded-full translate-y-1/2 -translate-x-1/3 opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 text-cyan-700 rounded-full mb-6">
                <BadgeCheck className="w-4 h-4" />
                <span className="text-sm font-medium">Trusted by 500,000+ Members Nationwide</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Quality Healthcare.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-600">
                  Affordable Access.
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-lg">
                Join our nationwide network of 50,000+ trusted providers. 
                Save up to 40% on healthcare costs with transparent pricing and exceptional care.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link
                  href="/find-provider"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-teal-600 text-white hover:from-cyan-600 hover:to-teal-700 rounded-xl shadow-lg shadow-cyan-500/25 transition-all"
                >
                  <Search className="w-5 h-5" />
                  Find a Provider
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-white text-gray-900 border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 rounded-xl transition-all"
                >
                  Member Login
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-8 border-t border-gray-100">
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 border-2 border-white flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{String.fromCharCode(64 + i)}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 font-semibold text-gray-900">4.9</span>
                  </div>
                  <p className="text-sm text-gray-500">From 10,000+ member reviews</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Main hero image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/hero-family.jpg"
                  alt="Happy family enjoying life"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating stats cards */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">$2,400</p>
                    <p className="text-sm text-gray-500">Average Annual Savings</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-5 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">50,000+</p>
                    <p className="text-sm text-gray-500">Network Providers</p>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -left-8 -translate-y-1/2 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-900">All 50 States</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16">
            {[
              { icon: Shield, label: "HIPAA Compliant" },
              { icon: Award, label: "NCQA Accredited" },
              { icon: BadgeCheck, label: "A+ BBB Rating" },
              { icon: Globe, label: "Nationwide Coverage" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-600">
                <badge.icon className="w-5 h-5 text-cyan-600" />
                <span className="font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-br from-cyan-500 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "50,000+", label: "Network Providers", icon: Stethoscope },
              { value: "500+", label: "Hospitals & Facilities", icon: Building2 },
              { value: "40%", label: "Average Savings", icon: Wallet },
              { value: "98%", label: "Member Satisfaction", icon: Heart },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-4xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-teal-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Getting Started is Easy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Access quality healthcare at lower costs in three simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Search,
                title: "Find a Provider",
                description: "Search our network of 50,000+ doctors, specialists, and hospitals across all 50 states.",
              },
              {
                step: "02",
                icon: CreditCard,
                title: "Show Your ID Card",
                description: "Present your TrueCare Health Network ID card at your appointment to access network rates.",
              },
              {
                step: "03",
                icon: DollarSign,
                title: "Save Money",
                description: "Pay reduced rates—up to 40% less than non-network prices—thanks to our negotiated discounts.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-gray-50 rounded-2xl p-8 hover:bg-teal-50/50 transition-colors group"
              >
                <span className="absolute top-6 right-6 text-6xl font-bold text-gray-100 group-hover:text-teal-100 transition-colors">
                  {item.step}
                </span>
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
                WHY CHOOSE US
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Everything You Need for Better Healthcare
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're committed to making healthcare accessible and affordable for everyone, 
                with tools and support that put you in control.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  { icon: DollarSign, title: "Significant Savings", desc: "Up to 40% off medical expenses" },
                  { icon: Users, title: "Extensive Network", desc: "50,000+ providers nationwide" },
                  { icon: Shield, title: "Quality Assured", desc: "All providers credentialed" },
                  { icon: Clock, title: "24/7 Support", desc: "Always here when you need us" },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-cyan-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="/doctors-trio.jpg"
                alt="Healthcare professionals"
                className="rounded-3xl shadow-xl"
              />
              {/* Floating card */}
              <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Verified Network</span>
                </div>
                <p className="text-sm text-gray-600">
                  All providers are credentialed and meet our quality standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nationwide Coverage */}
      <section className="py-20 bg-gradient-to-br from-sky-900 to-sky-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-white/10 text-teal-300 rounded-full text-sm font-medium mb-4">
              NATIONWIDE COVERAGE
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Care Wherever You Are
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Access our network of trusted providers in all 50 states.
            </p>
          </div>

          <USAMap />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              { value: "50", label: "States" },
              { value: "500+", label: "Cities" },
              { value: "50K+", label: "Providers" },
              { value: "99%", label: "Population Access" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 bg-white/5 rounded-xl">
                <p className="text-3xl font-bold text-teal-400">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
              OUR SERVICES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Care Solutions
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                image: "/doctor-patient-care.jpg",
                title: "Primary Care",
                description: "Annual checkups, preventive care, and chronic condition management.",
                link: "/find-provider",
              },
              {
                image: "/doctor-tablet.jpg",
                title: "Specialist Care",
                description: "Direct access to cardiologists, orthopedists, dermatologists, and more.",
                link: "/find-provider",
              },
              {
                image: "/doctor-exam.jpg",
                title: "Virtual Care",
                description: "$0 telehealth visits with board-certified physicians, 24/7.",
                link: "/members",
              },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link 
                    href={service.link}
                    className="inline-flex items-center gap-2 text-cyan-600 font-medium hover:text-cyan-700"
                  >
                    Learn More <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cost Estimator */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
                SAVINGS CALCULATOR
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                See How Much You Could Save
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Use our calculator to estimate your potential savings with TrueCare Health Network.
              </p>
              <ul className="space-y-3">
                {[
                  "Average 35% savings on medical services",
                  "Up to 60% off lab work and imaging",
                  "No hidden fees or surprises",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Savings Calculator</h3>
              
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Annual Healthcare Spending
                </label>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="500"
                  value={estimatorValue}
                  onChange={(e) => setEstimatorValue(Number(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>$1,000</span>
                  <span>$50,000</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Current Spending</p>
                  <p className="text-2xl font-bold text-gray-900">${estimatorValue.toLocaleString()}</p>
                </div>
                <div className="bg-teal-50 rounded-xl p-4">
                  <p className="text-sm text-cyan-700 mb-1">Your Savings</p>
                  <p className="text-2xl font-bold text-cyan-700">${estimatedSavings.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-500 to-teal-600 rounded-xl p-4 text-white text-center mb-6">
                <p className="text-sm opacity-80">With TrueCare Health Network</p>
                <p className="text-3xl font-bold">${(estimatorValue - estimatedSavings).toLocaleString()}</p>
                <p className="text-sm opacity-80">per year</p>
              </div>

              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Get Your Personalized Quote
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
              GET STARTED
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Access Your Portal
            </h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Members */}
            <div className="bg-gradient-to-br from-cyan-400 to-teal-600 rounded-2xl p-8 text-white">
              <Heart className="w-10 h-10 mb-6 text-teal-200" />
              <h3 className="text-2xl font-bold mb-4">For Members</h3>
              <p className="text-teal-100 mb-6">
                Access your benefits, find providers, view claims, and manage your healthcare.
              </p>
              <ul className="space-y-3 mb-8">
                {["Digital ID Cards", "Find In-Network Doctors", "View Claims & EOBs", "24/7 Pulse AI Support"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-teal-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/member" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-cyan-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors">
                Member Portal <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Providers */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-8 text-white">
              <Building2 className="w-10 h-10 mb-6 text-slate-400" />
              <h3 className="text-2xl font-bold mb-4">For Providers</h3>
              <p className="text-slate-300 mb-6">
                Verify eligibility, submit claims, check payment status, and access resources.
              </p>
              <ul className="space-y-3 mb-8">
                {["Real-time Eligibility", "Electronic Claims", "14-Day Payments", "Credentialing Status"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-slate-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/provider" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-800 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                Provider Portal <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Employers */}
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
              <Users className="w-10 h-10 mb-6 text-amber-200" />
              <h3 className="text-2xl font-bold mb-4">For Employers</h3>
              <p className="text-amber-100 mb-6">
                Offer quality healthcare benefits with our comprehensive PPO network.
              </p>
              <ul className="space-y-3 mb-8">
                {["Competitive Group Rates", "Flexible Plan Options", "Easy Administration", "Dedicated Support"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/employers" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-amber-700 font-semibold rounded-xl hover:bg-amber-50 transition-colors">
                Learn More <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Members Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "TrueCare Health Network saved me over $4,000 on my back surgery. The process was seamless.",
                name: "Michael Thompson",
                role: "Member since 2022",
                savings: "$4,200",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
              },
              {
                quote: "Finding a quality doctor was so easy. I love being able to see my claims right on my phone.",
                name: "Jennifer Martinez",
                role: "Member since 2023",
                savings: "$1,850",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
              },
              {
                quote: "As a provider, I love how fast the payments are. 14-day ERA—that's unheard of.",
                name: "Dr. Robert Chen",
                role: "Network Provider",
                savings: "14-day payments",
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop",
              },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-lg transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Saved</p>
                    <p className="font-bold text-cyan-600">{testimonial.savings}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How do I know if my doctor is in the network?",
                a: "Use our Find a Provider tool on our website or mobile app. You can search by name, specialty, or location."
              },
              {
                q: "How much will I save with TrueCare Health Network?",
                a: "Members typically save 25-40% compared to out-of-network rates. Use our Cost Estimator for personalized estimates."
              },
              {
                q: "Do I need a referral to see a specialist?",
                a: "No referrals are required. You have direct access to any in-network specialist."
              },
              {
                q: "What is virtual care and is it included?",
                a: "Virtual care allows you to see a doctor via video 24/7 for common conditions. It's $0 for most plans."
              },
            ].map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-left">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500 shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-cyan-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Saving on Healthcare?
          </h2>
          <p className="text-xl text-teal-100 mb-10">
            Join thousands of members who trust TrueCare Health Network for quality, affordable care.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/find-provider"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-white text-cyan-700 hover:bg-teal-50 rounded-xl shadow-lg transition-colors"
            >
              <Search className="w-5 h-5" />
              Find a Provider
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 hover:bg-white/10 rounded-xl transition-colors"
            >
              <Phone className="w-5 h-5" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />

      {/* Floating Chat Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-cyan-400 to-teal-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center z-40"
      >
        {showChat ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Widget */}
      {showChat && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 border border-gray-200"
        >
          <div className="bg-gradient-to-r from-cyan-400 to-teal-500 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 text-yellow-300" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Pulse AI</p>
                <p className="text-teal-100 text-xs">Online now</p>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 h-64 overflow-y-auto bg-gray-50">
            <div className="flex gap-2 mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center shrink-0">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <div className="bg-white rounded-lg rounded-tl-sm p-3 shadow-sm border border-gray-100">
                <p className="text-gray-900 text-sm">Hi! I'm Pulse, your AI assistant. How can I help you today?</p>
              </div>
            </div>
            <div className="space-y-2">
              {["Find a doctor", "Check my benefits", "View my claims", "Get a cost estimate"].map((action, i) => (
                <button key={i} className="w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-teal-300 transition-colors">
                  {action}
                </button>
              ))}
            </div>
          </div>
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
              <button className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
