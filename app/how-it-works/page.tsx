"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MarketingHeader from "@/components/marketing/Header";
import MarketingFooter from "@/components/marketing/Footer";
import {
  Search,
  CreditCard,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Users,
  Shield,
  Clock,
  FileText,
  Phone,
  Stethoscope,
  Building2,
  Star,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-50 to-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-50 to-teal-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
              HOW IT WORKS
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 max-w-3xl mx-auto">
              Simple Steps to
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-600">
                Better Healthcare Savings
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Getting started with TrueCare Health Network is easy. 
              Follow these simple steps to start saving on your healthcare today.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-20">
            {[
              {
                step: "01",
                title: "Find an In-Network Provider",
                description: "Use our easy search tool to find doctors, specialists, hospitals, and other healthcare providers in your area. Filter by specialty, location, ratings, and more.",
                features: ["50,000+ providers nationwide", "Search by specialty or condition", "View ratings and reviews", "Check availability"],
                image: "/doctor-tablet.jpg",
                icon: Search,
              },
              {
                step: "02",
                title: "Show Your Member ID",
                description: "At your appointment, present your TrueCare Health Network member ID card. Your provider will verify your network status and apply our negotiated rates.",
                features: ["Digital ID available 24/7", "Instant verification", "No referrals needed", "Direct specialist access"],
                image: "/doctor-patient-care.jpg",
                icon: CreditCard,
              },
              {
                step: "03",
                title: "Save on Your Care",
                description: "Pay reduced rates on your healthcare services. Our negotiated discounts mean you save up to 40% compared to standard rates—with no hidden fees.",
                features: ["Up to 40% savings", "Transparent pricing", "No surprise bills", "Easy payment options"],
                image: "/doctors-trio.jpg",
                icon: DollarSign,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
              >
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-6xl font-bold text-teal-100">{item.step}</span>
                    <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-2xl flex items-center justify-center">
                      <item.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-lg text-gray-600 mb-6">{item.description}</p>
                  <ul className="space-y-3">
                    {item.features.map((feature, fi) => (
                      <li key={fi} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="rounded-2xl shadow-xl w-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
              MEMBER BENEFITS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Members Love Us
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: DollarSign, title: "Save Up to 40%", desc: "On medical expenses with negotiated rates" },
              { icon: Users, title: "50,000+ Providers", desc: "Doctors, specialists, and hospitals" },
              { icon: Shield, title: "Quality Assured", desc: "All providers are credentialed" },
              { icon: Clock, title: "24/7 Support", desc: "We're always here to help" },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-cyan-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-teal-50 text-cyan-700 rounded-full text-sm font-medium mb-4">
              COMMON QUESTIONS
            </span>
            <h2 className="text-3xl font-bold text-gray-900">Quick Answers</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "Do I need a referral to see a specialist?",
                a: "No! You have direct access to any in-network specialist without needing a referral from your primary care physician.",
              },
              {
                q: "How quickly can I start using my benefits?",
                a: "Your benefits are active immediately upon enrollment. You can start finding providers and saving right away.",
              },
              {
                q: "Can I use the network for any type of care?",
                a: "Yes! Our network covers primary care, specialists, hospitals, labs, imaging, urgent care, and more across all 50 states.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-2">{faq.q}</h4>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/contact" className="text-cyan-600 font-medium hover:text-cyan-700">
              Have more questions? Contact us →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-cyan-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Saving?
          </h2>
          <p className="text-xl text-teal-100 mb-10">
            Join thousands of members who are already saving on their healthcare.
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
    </div>
  );
}
