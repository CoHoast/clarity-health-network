"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MarketingHeader from "@/components/marketing/Header";
import MarketingFooter from "@/components/marketing/Footer";
import {
  Building2,
  DollarSign,
  Clock,
  Shield,
  CheckCircle2,
  ArrowRight,
  FileText,
  UserCheck,
  Zap,
  BarChart3,
  Upload,
  Phone,
  Mail,
  Users,
  CreditCard,
  Globe,
} from "lucide-react";

export default function ProvidersPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-50 to-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-4">
                FOR PROVIDERS
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Partner with
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">
                  MedCare Health Network
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join our network of 50,000+ providers. Get faster payments, streamlined claims,
                and access to millions of members seeking quality care.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/provider"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-teal-600 to-emerald-600 text-white hover:from-teal-700 hover:to-emerald-700 rounded-xl shadow-lg shadow-teal-500/25 transition-all"
                >
                  Provider Portal
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-white text-gray-900 border-2 border-gray-200 hover:border-teal-300 rounded-xl transition-all"
                >
                  Join Our Network
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src="/doctors-trio.jpg"
                alt="Medical professionals"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-4">
              PROVIDER BENEFITS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Providers Choose MedCare
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Fast payments, simple processes, dedicated support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Clock,
                title: "14-Day Payments",
                description: "Get paid faster than industry average.",
                stat: "14 days",
              },
              {
                icon: Zap,
                title: "Instant Eligibility",
                description: "Real-time verification at point of service.",
                stat: "Real-time",
              },
              {
                icon: FileText,
                title: "Easy Claims",
                description: "Submit and track claims electronically.",
                stat: "100% digital",
              },
              {
                icon: Users,
                title: "More Patients",
                description: "Access to millions of network members.",
                stat: "500K+ members",
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-teal-600" />
                </div>
                <p className="text-2xl font-bold text-teal-600 mb-2">{benefit.stat}</p>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-4">
                PROVIDER PORTAL
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Powerful Tools at Your Fingertips
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our provider portal streamlines your administrative tasks so you can focus on patient care.
              </p>
              <div className="space-y-6">
                {[
                  { icon: UserCheck, title: "Eligibility Verification", desc: "Verify member eligibility instantly" },
                  { icon: Upload, title: "Claims Submission", desc: "Submit claims electronically 24/7" },
                  { icon: CreditCard, title: "Payment Tracking", desc: "Track payments and remittances" },
                  { icon: BarChart3, title: "Reports & Analytics", desc: "Access detailed performance reports" },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href="/provider"
                className="inline-flex items-center gap-2 px-6 py-3 mt-8 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all shadow-lg shadow-teal-500/25"
              >
                Access Provider Portal
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="/doctor-tablet.jpg"
                alt="Provider using tablet"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Claim Paid</p>
                    <p className="text-sm text-gray-500">14-day turnaround</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Network */}
      <section className="py-20 bg-gradient-to-br from-teal-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Join Our Growing Network
              </h2>
              <p className="text-xl text-teal-100 mb-8">
                Becoming a MedCare Health Network provider is simple. Our credentialing process is streamlined and efficient.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  "Online credentialing application",
                  "Average approval in 30 days",
                  "Dedicated provider relations team",
                  "No membership fees",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal-200" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-colors"
              >
                Start Application
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="bg-white rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Credentialing Timeline</h3>
              <div className="space-y-6">
                {[
                  { step: "1", title: "Submit Application", desc: "Complete online application", time: "Day 1" },
                  { step: "2", title: "Verification", desc: "We verify credentials", time: "Days 2-14" },
                  { step: "3", title: "Committee Review", desc: "Credentialing committee review", time: "Days 15-25" },
                  { step: "4", title: "Approval", desc: "Welcome to the network!", time: "Day 30" },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="font-bold text-teal-600">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <span className="text-sm text-teal-600 font-medium">{item.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-4">
              PROVIDER SUPPORT
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Phone, title: "Provider Hotline", desc: "1-800-MEDCARE x2", action: "Call Now" },
              { icon: Mail, title: "Email Support", desc: "providers@medcarehealth.com", action: "Send Email" },
              { icon: FileText, title: "Help Center", desc: "Guides & Resources", action: "Browse" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{item.desc}</p>
                <button className="text-teal-600 font-medium hover:text-teal-700">{item.action} →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
