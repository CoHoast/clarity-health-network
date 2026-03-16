"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Shield,
  DollarSign,
  Stethoscope,
  Activity,
  Brain,
  Eye,
  Baby,
  Pill,
  Ambulance,
  Building2,
  Video,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Info,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

const benefitCategories = [
  {
    id: "preventive",
    icon: Shield,
    title: "Preventive Care",
    description: "Annual checkups, screenings, and immunizations",
    color: "teal",
    items: [
      { service: "Annual Physical Exam", inNetwork: "$0", outNetwork: "40% after deductible" },
      { service: "Well-Woman Visit", inNetwork: "$0", outNetwork: "40% after deductible" },
      { service: "Immunizations", inNetwork: "$0", outNetwork: "40% after deductible" },
      { service: "Cancer Screenings", inNetwork: "$0", outNetwork: "40% after deductible" },
      { service: "Cholesterol Screening", inNetwork: "$0", outNetwork: "40% after deductible" },
    ],
  },
  {
    id: "primary",
    icon: Stethoscope,
    title: "Primary Care",
    description: "Office visits with your primary care physician",
    color: "blue",
    items: [
      { service: "Office Visit", inNetwork: "$25 copay", outNetwork: "40% after deductible" },
      { service: "Sick Visit", inNetwork: "$25 copay", outNetwork: "40% after deductible" },
      { service: "Chronic Care Management", inNetwork: "$25 copay", outNetwork: "40% after deductible" },
      { service: "Lab Work (in-office)", inNetwork: "$0", outNetwork: "40% after deductible" },
    ],
  },
  {
    id: "specialist",
    icon: Activity,
    title: "Specialist Care",
    description: "Visits with specialists and subspecialists",
    color: "purple",
    items: [
      { service: "Specialist Visit", inNetwork: "$50 copay", outNetwork: "40% after deductible" },
      { service: "Cardiology", inNetwork: "$50 copay", outNetwork: "40% after deductible" },
      { service: "Orthopedics", inNetwork: "$50 copay", outNetwork: "40% after deductible" },
      { service: "Dermatology", inNetwork: "$50 copay", outNetwork: "40% after deductible" },
      { service: "Endocrinology", inNetwork: "$50 copay", outNetwork: "40% after deductible" },
    ],
  },
  {
    id: "mental",
    icon: Brain,
    title: "Behavioral Health",
    description: "Mental health and substance abuse services",
    color: "indigo",
    items: [
      { service: "Outpatient Therapy", inNetwork: "$25 copay", outNetwork: "40% after deductible" },
      { service: "Psychiatry Visit", inNetwork: "$50 copay", outNetwork: "40% after deductible" },
      { service: "Inpatient Mental Health", inNetwork: "20% after deductible", outNetwork: "40% after deductible" },
      { service: "Substance Abuse Treatment", inNetwork: "20% after deductible", outNetwork: "40% after deductible" },
    ],
  },
  {
    id: "emergency",
    icon: Ambulance,
    title: "Emergency & Urgent Care",
    description: "Emergency room and urgent care visits",
    color: "red",
    items: [
      { service: "Emergency Room", inNetwork: "$250 copay (waived if admitted)", outNetwork: "$250 copay" },
      { service: "Urgent Care", inNetwork: "$50 copay", outNetwork: "40% after deductible" },
      { service: "Ambulance", inNetwork: "20% after deductible", outNetwork: "20% after deductible" },
    ],
  },
  {
    id: "hospital",
    icon: Building2,
    title: "Hospital Services",
    description: "Inpatient and outpatient hospital care",
    color: "emerald",
    items: [
      { service: "Inpatient Stay", inNetwork: "20% after deductible", outNetwork: "40% after deductible" },
      { service: "Outpatient Surgery", inNetwork: "20% after deductible", outNetwork: "40% after deductible" },
      { service: "Imaging (MRI, CT)", inNetwork: "20% after deductible", outNetwork: "40% after deductible" },
      { service: "Lab Work", inNetwork: "$0", outNetwork: "40% after deductible" },
    ],
  },
  {
    id: "rx",
    icon: Pill,
    title: "Prescription Drugs",
    description: "Pharmacy benefits and medication coverage",
    color: "orange",
    items: [
      { service: "Generic Drugs", inNetwork: "$10 copay", outNetwork: "Not covered" },
      { service: "Preferred Brand", inNetwork: "$35 copay", outNetwork: "Not covered" },
      { service: "Non-Preferred Brand", inNetwork: "$70 copay", outNetwork: "Not covered" },
      { service: "Specialty Drugs", inNetwork: "20% up to $200", outNetwork: "Not covered" },
      { service: "Mail Order (90-day)", inNetwork: "2.5x copay", outNetwork: "Not covered" },
    ],
  },
  {
    id: "vision",
    icon: Eye,
    title: "Vision Care",
    description: "Eye exams, glasses, and contacts",
    color: "cyan",
    items: [
      { service: "Routine Eye Exam", inNetwork: "$0 (1 per year)", outNetwork: "Not covered" },
      { service: "Eyeglasses", inNetwork: "$150 allowance", outNetwork: "Not covered" },
      { service: "Contact Lenses", inNetwork: "$150 allowance", outNetwork: "Not covered" },
    ],
  },
  {
    id: "telehealth",
    icon: Video,
    title: "Virtual Care",
    description: "Telehealth and virtual visits",
    color: "violet",
    items: [
      { service: "Virtual Primary Care", inNetwork: "$0", outNetwork: "N/A" },
      { service: "Virtual Urgent Care", inNetwork: "$0", outNetwork: "N/A" },
      { service: "Virtual Therapy", inNetwork: "$25 copay", outNetwork: "N/A" },
      { service: "24/7 Nurse Line", inNetwork: "$0", outNetwork: "$0" },
    ],
  },
];

export default function BenefitsPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("preventive");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = benefitCategories.filter(
    (cat) =>
      cat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.items.some((item) =>
        item.service.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Benefits</h1>
          <p className="text-gray-500 mt-1">TrueCare Health PPO Plan • Effective Jan 1, 2024</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Download Summary
        </button>
      </div>

      {/* Deductible & Out-of-Pocket Summary */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Individual Deductible</span>
            <span className="text-xs bg-teal-50 text-cyan-700 px-2 py-0.5 rounded-full">65%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$325 <span className="text-base font-normal text-gray-400">/ $500</span></p>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full" style={{ width: "65%" }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">$175 remaining</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Family Deductible</span>
            <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">55%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$825 <span className="text-base font-normal text-gray-400">/ $1,500</span></p>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" style={{ width: "55%" }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">$675 remaining</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Individual OOP Max</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">28%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$980 <span className="text-base font-normal text-gray-400">/ $3,500</span></p>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: "28%" }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">$2,520 remaining</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Family OOP Max</span>
            <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">18%</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">$1,260 <span className="text-base font-normal text-gray-400">/ $7,000</span></p>
          <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: "18%" }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">$5,740 remaining</p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search benefits (e.g., 'MRI', 'therapy', 'prescription')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
      </div>

      {/* Benefit Categories */}
      <div className="space-y-4">
        {filteredCategories.map((category) => {
          const isExpanded = expandedCategory === category.id;
          const IconComponent = category.icon;
          
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-${category.color}-100 rounded-xl flex items-center justify-center`}>
                    <IconComponent className={`w-6 h-6 text-${category.color}-600`} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900">{category.title}</h3>
                    <p className="text-sm text-gray-500">{category.description}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="border-t border-gray-200"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            In-Network
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Out-of-Network
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {category.items.map((item, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{item.service}</td>
                            <td className="px-6 py-4">
                              <span className={`text-sm font-medium ${
                                item.inNetwork === "$0" ? "text-green-600" : "text-gray-900"
                              }`}>
                                {item.inNetwork}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{item.outNetwork}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Plan Details */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900">Plan Details</h2>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Plan Name</p>
              <p className="font-medium text-gray-900">TrueCare Health PPO</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Plan Type</p>
              <p className="font-medium text-gray-900">Preferred Provider Organization (PPO)</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Coverage Level</p>
              <p className="font-medium text-gray-900">Family</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Plan Year</p>
              <p className="font-medium text-gray-900">Jan 1, 2024 - Dec 31, 2024</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Group Number</p>
              <p className="font-mono text-gray-900">GRP-78901</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Coinsurance (In-Network)</p>
              <p className="font-medium text-gray-900">Plan pays 80%, you pay 20%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Coinsurance (Out-of-Network)</p>
              <p className="font-medium text-gray-900">Plan pays 60%, you pay 40%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Referral Required?</p>
              <p className="font-medium text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> No referrals needed
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center shrink-0">
            <Phone className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-teal-900">Questions about your benefits?</h3>
            <p className="text-sm text-cyan-700 mt-1">
              Our Member Services team is here to help you understand your coverage. 
              Call us at <span className="font-semibold">1-800-555-0123</span> or chat with Pulse AI.
            </p>
          </div>
          <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
