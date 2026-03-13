"use client";

import { useState } from "react";
import { Search, Download, Info, ChevronDown, ChevronUp } from "lucide-react";

const feeSchedule = [
  { code: "99213", description: "Office visit, established patient, low complexity", yourRate: 85.00, medicare: 76.15, category: "E&M" },
  { code: "99214", description: "Office visit, established patient, moderate complexity", yourRate: 125.00, medicare: 110.43, category: "E&M" },
  { code: "99215", description: "Office visit, established patient, high complexity", yourRate: 175.00, medicare: 148.52, category: "E&M" },
  { code: "99203", description: "Office visit, new patient, low complexity", yourRate: 110.00, medicare: 97.89, category: "E&M" },
  { code: "99204", description: "Office visit, new patient, moderate complexity", yourRate: 165.00, medicare: 150.21, category: "E&M" },
  { code: "99205", description: "Office visit, new patient, high complexity", yourRate: 210.00, medicare: 187.33, category: "E&M" },
  { code: "36415", description: "Venipuncture", yourRate: 12.00, medicare: 3.00, category: "Lab" },
  { code: "81002", description: "Urinalysis, non-automated", yourRate: 8.00, medicare: 3.49, category: "Lab" },
  { code: "85025", description: "CBC with differential", yourRate: 25.00, medicare: 10.59, category: "Lab" },
  { code: "80053", description: "Comprehensive metabolic panel", yourRate: 35.00, medicare: 14.49, category: "Lab" },
  { code: "71046", description: "Chest X-ray, 2 views", yourRate: 75.00, medicare: 26.11, category: "Radiology" },
  { code: "93000", description: "ECG with interpretation", yourRate: 55.00, medicare: 17.28, category: "Cardiology" },
  { code: "90471", description: "Immunization administration", yourRate: 25.00, medicare: 21.70, category: "Preventive" },
  { code: "96372", description: "Therapeutic injection", yourRate: 30.00, medicare: 22.53, category: "Procedures" },
];

const categories = ["All", "E&M", "Lab", "Radiology", "Cardiology", "Preventive", "Procedures"];

export default function FeeSchedulePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

  const filteredFees = feeSchedule.filter((fee) => {
    const matchesSearch =
      fee.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || fee.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedFees = [...filteredFees].sort((a, b) => {
    if (!sortConfig) return 0;
    const aVal = a[sortConfig.key as keyof typeof a];
    const bVal = b[sortConfig.key as keyof typeof b];
    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortConfig?.key !== column) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fee Schedule</h1>
          <p className="text-gray-600">Your contracted rates with Clarity Health Network</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors">
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-800 font-medium">Contract Effective Date: January 1, 2024</p>
          <p className="text-blue-700 text-sm mt-1">
            Rates shown are your contracted amounts. Medicare rates shown for reference only.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-slate-700 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fee Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  onClick={() => handleSort("code")}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-1">
                    CPT Code <SortIcon column="code" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th
                  onClick={() => handleSort("yourRate")}
                  className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center justify-end gap-1">
                    Your Rate <SortIcon column="yourRate" />
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Medicare
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedFees.map((fee) => (
                <tr key={fee.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono font-semibold text-gray-900">{fee.code}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900">{fee.description}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                      {fee.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="font-semibold text-gray-900">${fee.yourRate.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-gray-500">${fee.medicare.toFixed(2)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-sm text-gray-500 text-center">
        Showing {sortedFees.length} of {feeSchedule.length} codes • Last updated March 1, 2024
      </p>
    </div>
  );
}
