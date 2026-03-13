"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import MarketingHeader from "@/components/marketing/Header";
import MarketingFooter from "@/components/marketing/Footer";
import {
  Users,
  DollarSign,
  Shield,
  CheckCircle2,
  ArrowRight,
  Building2,
  BarChart3,
  Heart,
  Headphones,
  FileText,
  Settings,
  Phone,
  Mail,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react";

export default function EmployersPage() {
  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-50 to-white py-20 lg:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-50 to-orange-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-60" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="inline-block px-4 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
                FOR EMPLOYERS
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Better Benefits.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                  Better Value.
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Give your employees access to quality healthcare at costs that work for your business.
                Clarity Health Network makes it possible.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 rounded-xl shadow-lg shadow-amber-500/25 transition-all"
                >
                  Request a Quote
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-white text-gray-900 border-2 border-gray-200 hover:border-amber-300 rounded-xl transition-all"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <img
                src="/medical-team.jpg"
                alt="Happy employees"
                className="rounded-3xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Employers Choose Clarity
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Control costs while giving employees access to quality healthcare.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: DollarSign,
                title: "Cost Savings",
                description: "Save 20-40% compared to traditional PPO networks with our competitive negotiated rates.",
              },
              {
                icon: Users,
                title: "Extensive Network",
                description: "50,000+ providers across all 50 states ensures your employees have access wherever they are.",
              },
              {
                icon: Heart,
                title: "Employee Satisfaction",
                description: "Quality care and easy-to-use tools mean happier, healthier employees.",
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
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
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
              <span className="inline-block px-4 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
                EMPLOYER TOOLS
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Easy Administration
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Managing employee benefits shouldn't be complicated. Our employer portal makes it simple.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Settings, title: "Self-Service Portal", desc: "Add/remove employees, manage plans" },
                  { icon: BarChart3, title: "Real-Time Analytics", desc: "Track utilization and costs" },
                  { icon: FileText, title: "Custom Reports", desc: "Generate reports on demand" },
                  { icon: Headphones, title: "Dedicated Support", desc: "Named account manager" },
                ].map((feature, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <feature.icon className="w-6 h-6 text-amber-600" />
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
                src="/doctor-glasses.jpg"
                alt="Business professional"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4">
              PLAN OPTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Flexible Plans for Every Business
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Essentials",
                price: "Contact us",
                description: "For small businesses getting started",
                features: ["Nationwide provider network", "Basic claims processing", "Employee self-service", "Standard support"],
                highlighted: false,
              },
              {
                name: "Professional",
                price: "Contact us",
                description: "For growing companies",
                features: ["Everything in Essentials", "Advanced analytics", "$0 virtual care", "Wellness programs", "Dedicated account manager"],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: ["Everything in Professional", "Custom integrations", "White-label options", "Priority support", "Custom reporting"],
                highlighted: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-8 ${plan.highlighted ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white' : 'bg-gray-50'}`}
              >
                <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-amber-100' : 'text-gray-600'}`}>{plan.description}</p>
                <p className={`text-3xl font-bold mb-6 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.price}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-5 h-5 ${plan.highlighted ? 'text-amber-200' : 'text-amber-500'}`} />
                      <span className={plan.highlighted ? 'text-white' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`inline-flex items-center justify-center w-full gap-2 px-6 py-3 font-semibold rounded-xl transition-colors ${
                    plan.highlighted
                      ? 'bg-white text-amber-600 hover:bg-amber-50'
                      : 'bg-amber-500 text-white hover:bg-amber-600'
                  }`}
                >
                  Get Quote <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-br from-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "1,000+", label: "Employer Clients" },
              { value: "500K+", label: "Covered Employees" },
              { value: "35%", label: "Avg. Cost Savings" },
              { value: "96%", label: "Renewal Rate" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-amber-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Offer Better Benefits?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Get a customized quote for your organization today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 rounded-xl shadow-lg shadow-amber-500/25 transition-all"
            >
              Request a Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold bg-white text-gray-900 border-2 border-gray-200 hover:border-amber-300 rounded-xl transition-all"
            >
              <Phone className="w-5 h-5" />
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
