"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, Download, Upload, Plus, Search, X, CheckCircle, 
  Edit, Trash2, Calendar, Settings, TestTube, FileText, Users,
  Percent, DollarSign, Save, Copy, AlertTriangle, ChevronDown,
  Play, RotateCcw, Info
} from "lucide-react";

// Tab types
type TabType = "schedules" | "codes" | "contracts" | "modifiers" | "test";

// Fee Schedule data
const initialFeeSchedules = [
  { id: "FS-001", name: "Primary Care", type: "percent_medicare", rate: 120, providers: 234, effective: "2024-01-01", lastUpdated: "2024-03-01", codes: 1245, status: "active" },
  { id: "FS-002", name: "Specialty Care", type: "percent_medicare", rate: 125, providers: 156, effective: "2024-01-01", lastUpdated: "2024-03-05", codes: 2341, status: "active" },
  { id: "FS-003", name: "Facility/Hospital", type: "case_rate", rate: 0, providers: 45, effective: "2024-01-01", lastUpdated: "2024-02-15", codes: 3456, status: "active" },
  { id: "FS-004", name: "Imaging Services", type: "percent_medicare", rate: 110, providers: 89, effective: "2024-01-01", lastUpdated: "2024-03-01", codes: 567, status: "active" },
  { id: "FS-005", name: "Urgent Care", type: "percent_medicare", rate: 110, providers: 67, effective: "2024-01-01", lastUpdated: "2024-02-28", codes: 423, status: "active" },
  { id: "FS-006", name: "Lab Services", type: "percent_medicare", rate: 100, providers: 34, effective: "2024-01-01", lastUpdated: "2024-03-10", codes: 890, status: "active" },
];

// CPT Codes data
const initialCptCodes = [
  { code: "99213", description: "Office visit, established patient, low complexity", category: "E&M", medicareRate: 92.00, status: "active" },
  { code: "99214", description: "Office visit, established patient, moderate complexity", category: "E&M", medicareRate: 138.00, status: "active" },
  { code: "99215", description: "Office visit, established patient, high complexity", category: "E&M", medicareRate: 186.00, status: "active" },
  { code: "99203", description: "New patient visit, low complexity", category: "E&M", medicareRate: 112.00, status: "active" },
  { code: "99204", description: "New patient visit, moderate complexity", category: "E&M", medicareRate: 172.00, status: "active" },
  { code: "99205", description: "New patient visit, high complexity", category: "E&M", medicareRate: 232.00, status: "active" },
  { code: "99385", description: "Preventive visit, 18-39 years", category: "Preventive", medicareRate: 156.00, status: "active" },
  { code: "99386", description: "Preventive visit, 40-64 years", category: "Preventive", medicareRate: 178.00, status: "active" },
  { code: "99387", description: "Preventive visit, 65+ years", category: "Preventive", medicareRate: 198.00, status: "active" },
  { code: "70553", description: "MRI brain with/without contrast", category: "Imaging", medicareRate: 425.00, status: "active" },
  { code: "71046", description: "Chest X-ray, 2 views", category: "Imaging", medicareRate: 32.00, status: "active" },
  { code: "73721", description: "MRI lower extremity joint", category: "Imaging", medicareRate: 385.00, status: "active" },
  { code: "80053", description: "Comprehensive metabolic panel", category: "Lab", medicareRate: 14.00, status: "active" },
  { code: "85025", description: "Complete blood count (CBC)", category: "Lab", medicareRate: 11.00, status: "active" },
  { code: "87086", description: "Urine culture", category: "Lab", medicareRate: 12.00, status: "active" },
  { code: "36415", description: "Venipuncture", category: "Procedure", medicareRate: 3.00, status: "active" },
  { code: "90834", description: "Psychotherapy, 45 minutes", category: "Mental Health", medicareRate: 112.00, status: "active" },
  { code: "90837", description: "Psychotherapy, 60 minutes", category: "Mental Health", medicareRate: 151.00, status: "active" },
  { code: "97110", description: "Therapeutic exercises", category: "PT/OT", medicareRate: 38.00, status: "active" },
  { code: "97140", description: "Manual therapy techniques", category: "PT/OT", medicareRate: 36.00, status: "active" },
];

// Provider Contracts data
const initialProviderContracts = [
  { id: "PC-001", provider: "Cleveland Clinic Main Campus", npi: "1234567890", rateType: "percent_medicare", rateValue: 130, feeSchedule: "Specialty Care", effective: "2024-01-01", expiry: "2025-12-31", status: "active" },
  { id: "PC-002", provider: "University Hospitals", npi: "2345678901", rateType: "percent_medicare", rateValue: 125, feeSchedule: "Specialty Care", effective: "2024-01-01", expiry: "2025-12-31", status: "active" },
  { id: "PC-003", provider: "MetroHealth System", npi: "3456789012", rateType: "percent_medicare", rateValue: 115, feeSchedule: "Primary Care", effective: "2024-01-01", expiry: "2025-12-31", status: "active" },
  { id: "PC-004", provider: "Main Street Family Medicine", npi: "4567890123", rateType: "percent_medicare", rateValue: 120, feeSchedule: "Primary Care", effective: "2024-01-01", expiry: "2025-12-31", status: "active" },
  { id: "PC-005", provider: "Lakewood Imaging Center", npi: "5678901234", rateType: "percent_billed", rateValue: 65, feeSchedule: "Imaging Services", effective: "2024-01-01", expiry: "2025-12-31", status: "active" },
  { id: "PC-006", provider: "Quest Diagnostics", npi: "6789012345", rateType: "fee_schedule", rateValue: 0, feeSchedule: "Lab Services", effective: "2024-01-01", expiry: "2025-12-31", status: "active" },
  { id: "PC-007", provider: "Akron General Hospital", npi: "7890123456", rateType: "case_rate", rateValue: 0, feeSchedule: "Facility/Hospital", effective: "2024-01-01", expiry: "2025-12-31", status: "active" },
  { id: "PC-008", provider: "MinuteClinic CVS", npi: "8901234567", rateType: "percent_medicare", rateValue: 110, feeSchedule: "Urgent Care", effective: "2024-01-01", expiry: "2025-12-31", status: "active" },
  { id: "PC-009", provider: "Dr. Sarah Johnson - Cardiology", npi: "9012345678", rateType: "per_diem", rateValue: 850, feeSchedule: "Specialty Care", effective: "2024-01-01", expiry: "2025-12-31", status: "active" },
  { id: "PC-010", provider: "Northeast Ohio Orthopedics", npi: "0123456789", rateType: "percent_medicare", rateValue: 135, feeSchedule: "Specialty Care", effective: "2024-01-01", expiry: "2025-12-31", status: "active" },
];

// Modifier Rules data
const initialModifierRules = [
  { id: "MOD-001", code: "50", name: "Bilateral Procedure", adjustment: 150, type: "percent", description: "Applied to procedures performed on both sides of the body", status: "active" },
  { id: "MOD-002", code: "51", name: "Multiple Procedures", adjustment: 50, type: "percent", description: "Second and subsequent procedures reduced by 50%", status: "active" },
  { id: "MOD-003", code: "59", name: "Distinct Procedural Service", adjustment: 100, type: "percent", description: "No reduction - separate and distinct procedure", status: "active" },
  { id: "MOD-004", code: "80", name: "Assistant Surgeon", adjustment: 16, type: "percent", description: "Assistant surgeon receives 16% of primary surgeon fee", status: "active" },
  { id: "MOD-005", code: "81", name: "Minimum Assistant Surgeon", adjustment: 10, type: "percent", description: "Minimum assistant surgeon services", status: "active" },
  { id: "MOD-006", code: "82", name: "Assistant Surgeon (Unavailable)", adjustment: 16, type: "percent", description: "When qualified resident not available", status: "active" },
  { id: "MOD-007", code: "26", name: "Professional Component", adjustment: 26, type: "percent", description: "Professional component only (interpretation)", status: "active" },
  { id: "MOD-008", code: "TC", name: "Technical Component", adjustment: 74, type: "percent", description: "Technical component only (equipment/facility)", status: "active" },
  { id: "MOD-009", code: "25", name: "Significant E&M", adjustment: 100, type: "percent", description: "Significant, separately identifiable E&M service", status: "active" },
  { id: "MOD-010", code: "76", name: "Repeat Procedure Same Physician", adjustment: 100, type: "percent", description: "Repeat procedure by same physician", status: "active" },
  { id: "MOD-011", code: "77", name: "Repeat Procedure Different Physician", adjustment: 100, type: "percent", description: "Repeat procedure by different physician", status: "active" },
  { id: "MOD-012", code: "22", name: "Increased Procedural Services", adjustment: 120, type: "percent", description: "Work required substantially exceeds typical", status: "active" },
];

// Rate type labels
const rateTypeLabels: Record<string, string> = {
  percent_medicare: "% of Medicare",
  percent_billed: "% of Billed",
  fee_schedule: "Fee Schedule",
  per_diem: "Per Diem",
  case_rate: "Case Rate",
};

export default function FeeSchedulesPage() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("schedules");
  const [feeSchedules, setFeeSchedules] = useState(initialFeeSchedules);
  const [cptCodes, setCptCodes] = useState(initialCptCodes);
  const [providerContracts, setProviderContracts] = useState(initialProviderContracts);
  const [modifierRules, setModifierRules] = useState(initialModifierRules);
  
  // Modal states
  const [showAddScheduleModal, setShowAddScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<typeof feeSchedules[0] | null>(null);
  const [showAddCodeModal, setShowAddCodeModal] = useState(false);
  const [editingCode, setEditingCode] = useState<typeof cptCodes[0] | null>(null);
  const [showAddContractModal, setShowAddContractModal] = useState(false);
  const [editingContract, setEditingContract] = useState<typeof providerContracts[0] | null>(null);
  const [showAddModifierModal, setShowAddModifierModal] = useState(false);
  const [editingModifier, setEditingModifier] = useState<typeof modifierRules[0] | null>(null);
  
  // Test repricing state
  const [testCptCode, setTestCptCode] = useState("99214");
  const [testProvider, setTestProvider] = useState("PC-004");
  const [testUnits, setTestUnits] = useState(1);
  const [testModifiers, setTestModifiers] = useState<string[]>([]);
  const [testResult, setTestResult] = useState<{
    baseRate: number;
    providerRate: number;
    modifierAdjustment: number;
    finalAmount: number;
    breakdown: string[];
  } | null>(null);
  
  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Success toast
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Calculate repricing
  const calculateRepricing = () => {
    const code = cptCodes.find(c => c.code === testCptCode);
    const contract = providerContracts.find(c => c.id === testProvider);
    
    if (!code || !contract) {
      return;
    }

    const breakdown: string[] = [];
    let baseRate = code.medicareRate;
    breakdown.push(`Medicare Base Rate: $${baseRate.toFixed(2)}`);

    // Apply provider rate
    let providerRate = baseRate;
    if (contract.rateType === "percent_medicare") {
      providerRate = baseRate * (contract.rateValue / 100);
      breakdown.push(`Provider Rate (${contract.rateValue}% Medicare): $${providerRate.toFixed(2)}`);
    } else if (contract.rateType === "percent_billed") {
      // Assume billed is 200% of Medicare for demo
      const billedAmount = baseRate * 2;
      providerRate = billedAmount * (contract.rateValue / 100);
      breakdown.push(`Billed Amount (assumed): $${billedAmount.toFixed(2)}`);
      breakdown.push(`Provider Rate (${contract.rateValue}% Billed): $${providerRate.toFixed(2)}`);
    } else if (contract.rateType === "per_diem") {
      providerRate = contract.rateValue;
      breakdown.push(`Per Diem Rate: $${providerRate.toFixed(2)}`);
    } else {
      breakdown.push(`Fee Schedule Rate: $${providerRate.toFixed(2)}`);
    }

    // Apply modifiers
    let modifierAdjustment = 1;
    testModifiers.forEach(modCode => {
      const modifier = modifierRules.find(m => m.code === modCode);
      if (modifier) {
        modifierAdjustment *= (modifier.adjustment / 100);
        breakdown.push(`Modifier ${modCode} (${modifier.name}): ${modifier.adjustment}%`);
      }
    });

    // Apply units
    let finalAmount = providerRate * modifierAdjustment * testUnits;
    if (testUnits > 1) {
      breakdown.push(`Units: ${testUnits}`);
    }
    breakdown.push(`Final Allowed Amount: $${finalAmount.toFixed(2)}`);

    setTestResult({
      baseRate,
      providerRate,
      modifierAdjustment,
      finalAmount,
      breakdown,
    });
  };

  const tabs = [
    { id: "schedules" as TabType, label: "Fee Schedules", icon: Calculator },
    { id: "codes" as TabType, label: "CPT Codes", icon: FileText },
    { id: "contracts" as TabType, label: "Provider Contracts", icon: Users },
    { id: "modifiers" as TabType, label: "Modifier Rules", icon: Settings },
    { id: "test" as TabType, label: "Test Repricing", icon: TestTube },
  ];

  const filteredCodes = cptCodes.filter(code => 
    code.code.includes(searchQuery) || 
    code.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    code.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContracts = providerContracts.filter(contract =>
    contract.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.npi.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Success Toast */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Repricing Configuration</h1>
          <p className="text-slate-400">Manage fee schedules, CPT codes, provider contracts, and repricing rules</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-500"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "schedules" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-400">
              {feeSchedules.length} fee schedules configured
            </div>
            <button
              onClick={() => setShowAddScheduleModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600"
            >
              <Plus className="w-4 h-4" />
              Add Fee Schedule
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 hover:border-blue-600/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{schedule.name}</h3>
                      <p className="text-xs text-slate-500">{schedule.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingSchedule(schedule)}
                      className="p-2 text-slate-400 hover:text-blue-500 hover:bg-slate-700 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setFeeSchedules(feeSchedules.filter(s => s.id !== schedule.id));
                        showSuccess("Fee schedule deleted");
                      }}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rate Type</span>
                    <span className="text-white">{rateTypeLabels[schedule.type]}</span>
                  </div>
                  {schedule.type === "percent_medicare" && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Rate</span>
                      <span className="text-blue-500 font-medium">{schedule.rate}%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-400">Providers</span>
                    <span className="text-white">{schedule.providers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Codes</span>
                    <span className="text-white">{schedule.codes.toLocaleString()}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                  <p className="text-xs text-slate-500">Effective: {schedule.effective}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    schedule.status === "active" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-slate-500/20 text-slate-400"
                  }`}>
                    {schedule.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "codes" && (
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search CPT codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => setShowAddCodeModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600"
            >
              <Plus className="w-4 h-4" />
              Add Code
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Description</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Category</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Medicare Rate</th>
                  <th className="px-4 py-3 text-center text-xs text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredCodes.map((code) => (
                  <tr key={code.code} className="hover:bg-slate-800/80">
                    <td className="px-4 py-3 font-mono text-blue-500">{code.code}</td>
                    <td className="px-4 py-3 text-white">{code.description}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-700 rounded text-sm text-slate-300">{code.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-green-400 font-medium">${code.medicareRate.toFixed(2)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        code.status === "active" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-slate-500/20 text-slate-400"
                      }`}>
                        {code.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditingCode(code)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-700 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setCptCodes(cptCodes.filter(c => c.code !== code.code));
                            showSuccess("CPT code deleted");
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-sm text-slate-500">
            Showing {filteredCodes.length} of {cptCodes.length} codes
          </p>
        </div>
      )}

      {activeTab === "contracts" && (
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search providers or NPI..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              onClick={() => setShowAddContractModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600"
            >
              <Plus className="w-4 h-4" />
              Add Contract
            </button>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Provider</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">NPI</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Rate Type</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Rate Value</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Fee Schedule</th>
                  <th className="px-4 py-3 text-center text-xs text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-slate-800/80">
                    <td className="px-4 py-3 text-white font-medium">{contract.provider}</td>
                    <td className="px-4 py-3 font-mono text-slate-400">{contract.npi}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-600/20 text-blue-500 rounded text-sm">
                        {rateTypeLabels[contract.rateType]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-green-400 font-medium">
                      {contract.rateType === "percent_medicare" || contract.rateType === "percent_billed" 
                        ? `${contract.rateValue}%`
                        : contract.rateType === "per_diem" || contract.rateType === "case_rate"
                        ? contract.rateValue > 0 ? `$${contract.rateValue}` : "Varies"
                        : "—"
                      }
                    </td>
                    <td className="px-4 py-3 text-slate-300">{contract.feeSchedule}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        contract.status === "active" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-slate-500/20 text-slate-400"
                      }`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditingContract(contract)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-700 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setProviderContracts(providerContracts.filter(c => c.id !== contract.id));
                            showSuccess("Contract deleted");
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "modifiers" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-slate-400">
              {modifierRules.length} modifier rules configured
            </div>
            <button
              onClick={() => setShowAddModifierModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600"
            >
              <Plus className="w-4 h-4" />
              Add Modifier Rule
            </button>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Code</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Description</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Adjustment</th>
                  <th className="px-4 py-3 text-center text-xs text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {modifierRules.map((modifier) => (
                  <tr key={modifier.id} className="hover:bg-slate-800/80">
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded font-mono font-bold">
                        {modifier.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">{modifier.name}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm max-w-md truncate">{modifier.description}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${modifier.adjustment < 100 ? "text-red-400" : modifier.adjustment > 100 ? "text-green-400" : "text-slate-300"}`}>
                        {modifier.adjustment}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        modifier.status === "active" 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-slate-500/20 text-slate-400"
                      }`}>
                        {modifier.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setEditingModifier(modifier)}
                          className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-slate-700 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setModifierRules(modifierRules.filter(m => m.id !== modifier.id));
                            showSuccess("Modifier rule deleted");
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "test" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Test Input */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <TestTube className="w-5 h-5 text-blue-500" />
              Test Repricing Calculator
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">CPT Code</label>
                <select
                  value={testCptCode}
                  onChange={(e) => setTestCptCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600"
                >
                  {cptCodes.map(code => (
                    <option key={code.code} value={code.code}>
                      {code.code} - {code.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Provider Contract</label>
                <select
                  value={testProvider}
                  onChange={(e) => setTestProvider(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600"
                >
                  {providerContracts.map(contract => (
                    <option key={contract.id} value={contract.id}>
                      {contract.provider} ({rateTypeLabels[contract.rateType]} - {contract.rateValue > 0 ? `${contract.rateValue}%` : "Varies"})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Units</label>
                <input
                  type="number"
                  value={testUnits}
                  onChange={(e) => setTestUnits(parseInt(e.target.value) || 1)}
                  min={1}
                  className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Modifiers</label>
                <div className="flex flex-wrap gap-2">
                  {modifierRules.slice(0, 6).map(mod => (
                    <button
                      key={mod.code}
                      onClick={() => {
                        setTestModifiers(prev => 
                          prev.includes(mod.code)
                            ? prev.filter(m => m !== mod.code)
                            : [...prev, mod.code]
                        );
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        testModifiers.includes(mod.code)
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {mod.code}
                    </button>
                  ))}
                </div>
                {testModifiers.length > 0 && (
                  <p className="text-sm text-slate-400 mt-2">
                    Selected: {testModifiers.join(", ")}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={calculateRepricing}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600"
                >
                  <Play className="w-4 h-4" />
                  Calculate
                </button>
                <button
                  onClick={() => {
                    setTestResult(null);
                    setTestModifiers([]);
                    setTestUnits(1);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-600"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Test Results */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-green-400" />
              Repricing Result
            </h3>
            {testResult ? (
              <div className="space-y-4">
                {/* Final Amount */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-400 mb-1">Allowed Amount</p>
                  <p className="text-4xl font-bold text-green-400">${testResult.finalAmount.toFixed(2)}</p>
                </div>

                {/* Breakdown */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-300 mb-3">Calculation Breakdown</p>
                  <div className="space-y-2">
                    {testResult.breakdown.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-5 h-5 bg-blue-600/20 rounded-full flex items-center justify-center text-xs text-blue-500">
                          {i + 1}
                        </div>
                        <span className="text-slate-300">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comparison */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">Medicare</p>
                    <p className="text-lg font-bold text-slate-300">${testResult.baseRate.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">Provider Rate</p>
                    <p className="text-lg font-bold text-blue-500">${testResult.providerRate.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-400">Savings vs Billed*</p>
                    <p className="text-lg font-bold text-green-400">
                      {Math.round((1 - testResult.finalAmount / (testResult.baseRate * 2)) * 100)}%
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-500">*Assuming billed amount is 200% of Medicare</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500">
                <Info className="w-12 h-12 mb-3 opacity-50" />
                <p>Enter claim details and click Calculate</p>
                <p className="text-sm">to see repricing breakdown</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Fee Schedule Modal */}
      <AnimatePresence>
        {(showAddScheduleModal || editingSchedule) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAddScheduleModal(false); setEditingSchedule(null); }} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">
                  {editingSchedule ? "Edit Fee Schedule" : "Add Fee Schedule"}
                </h3>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newSchedule = {
                  id: editingSchedule?.id || `FS-${String(feeSchedules.length + 1).padStart(3, "0")}`,
                  name: formData.get("name") as string,
                  type: formData.get("type") as string,
                  rate: parseInt(formData.get("rate") as string) || 0,
                  providers: editingSchedule?.providers || 0,
                  effective: formData.get("effective") as string,
                  lastUpdated: new Date().toISOString().split("T")[0],
                  codes: editingSchedule?.codes || 0,
                  status: "active",
                };
                if (editingSchedule) {
                  setFeeSchedules(feeSchedules.map(s => s.id === editingSchedule.id ? newSchedule : s));
                  showSuccess("Fee schedule updated");
                } else {
                  setFeeSchedules([...feeSchedules, newSchedule]);
                  showSuccess("Fee schedule added");
                }
                setShowAddScheduleModal(false);
                setEditingSchedule(null);
              }} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editingSchedule?.name}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="e.g., Primary Care"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Rate Type</label>
                  <select
                    name="type"
                    defaultValue={editingSchedule?.type || "percent_medicare"}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="percent_medicare">% of Medicare</option>
                    <option value="percent_billed">% of Billed</option>
                    <option value="fee_schedule">Fee Schedule</option>
                    <option value="per_diem">Per Diem</option>
                    <option value="case_rate">Case Rate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Rate (%)</label>
                  <input
                    name="rate"
                    type="number"
                    defaultValue={editingSchedule?.rate || 100}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Effective Date</label>
                  <input
                    name="effective"
                    type="date"
                    defaultValue={editingSchedule?.effective || new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => { setShowAddScheduleModal(false); setEditingSchedule(null); }} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">
                    {editingSchedule ? "Save Changes" : "Add Schedule"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add/Edit CPT Code Modal */}
      <AnimatePresence>
        {(showAddCodeModal || editingCode) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAddCodeModal(false); setEditingCode(null); }} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">
                  {editingCode ? "Edit CPT Code" : "Add CPT Code"}
                </h3>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newCode = {
                  code: formData.get("code") as string,
                  description: formData.get("description") as string,
                  category: formData.get("category") as string,
                  medicareRate: parseFloat(formData.get("rate") as string),
                  status: "active",
                };
                if (editingCode) {
                  setCptCodes(cptCodes.map(c => c.code === editingCode.code ? newCode : c));
                  showSuccess("CPT code updated");
                } else {
                  setCptCodes([...cptCodes, newCode]);
                  showSuccess("CPT code added");
                }
                setShowAddCodeModal(false);
                setEditingCode(null);
              }} className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">CPT Code</label>
                  <input
                    name="code"
                    type="text"
                    defaultValue={editingCode?.code}
                    required
                    disabled={!!editingCode}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white disabled:opacity-50"
                    placeholder="99213"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <input
                    name="description"
                    type="text"
                    defaultValue={editingCode?.description}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="Office visit, established patient"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingCode?.category || "E&M"}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="E&M">E&M</option>
                    <option value="Preventive">Preventive</option>
                    <option value="Imaging">Imaging</option>
                    <option value="Lab">Lab</option>
                    <option value="Procedure">Procedure</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="PT/OT">PT/OT</option>
                    <option value="DME">DME</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Medicare Rate ($)</label>
                  <input
                    name="rate"
                    type="number"
                    step="0.01"
                    defaultValue={editingCode?.medicareRate}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="92.00"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => { setShowAddCodeModal(false); setEditingCode(null); }} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">
                    {editingCode ? "Save Changes" : "Add Code"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add/Edit Contract Modal */}
      <AnimatePresence>
        {(showAddContractModal || editingContract) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAddContractModal(false); setEditingContract(null); }} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">
                  {editingContract ? "Edit Provider Contract" : "Add Provider Contract"}
                </h3>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newContract = {
                  id: editingContract?.id || `PC-${String(providerContracts.length + 1).padStart(3, "0")}`,
                  provider: formData.get("provider") as string,
                  npi: formData.get("npi") as string,
                  rateType: formData.get("rateType") as string,
                  rateValue: parseInt(formData.get("rateValue") as string) || 0,
                  feeSchedule: formData.get("feeSchedule") as string,
                  effective: formData.get("effective") as string,
                  expiry: formData.get("expiry") as string,
                  status: "active",
                };
                if (editingContract) {
                  setProviderContracts(providerContracts.map(c => c.id === editingContract.id ? newContract : c));
                  showSuccess("Contract updated");
                } else {
                  setProviderContracts([...providerContracts, newContract]);
                  showSuccess("Contract added");
                }
                setShowAddContractModal(false);
                setEditingContract(null);
              }} className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-1">Provider Name</label>
                    <input
                      name="provider"
                      type="text"
                      defaultValue={editingContract?.provider}
                      required
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="Cleveland Clinic"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">NPI</label>
                    <input
                      name="npi"
                      type="text"
                      defaultValue={editingContract?.npi}
                      required
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Fee Schedule</label>
                    <select
                      name="feeSchedule"
                      defaultValue={editingContract?.feeSchedule || "Primary Care"}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      {feeSchedules.map(fs => (
                        <option key={fs.id} value={fs.name}>{fs.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Rate Type</label>
                    <select
                      name="rateType"
                      defaultValue={editingContract?.rateType || "percent_medicare"}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="percent_medicare">% of Medicare</option>
                      <option value="percent_billed">% of Billed</option>
                      <option value="fee_schedule">Fee Schedule</option>
                      <option value="per_diem">Per Diem</option>
                      <option value="case_rate">Case Rate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Rate Value</label>
                    <input
                      name="rateValue"
                      type="number"
                      defaultValue={editingContract?.rateValue || 100}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Effective Date</label>
                    <input
                      name="effective"
                      type="date"
                      defaultValue={editingContract?.effective || new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Expiry Date</label>
                    <input
                      name="expiry"
                      type="date"
                      defaultValue={editingContract?.expiry || "2025-12-31"}
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => { setShowAddContractModal(false); setEditingContract(null); }} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">
                    {editingContract ? "Save Changes" : "Add Contract"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add/Edit Modifier Modal */}
      <AnimatePresence>
        {(showAddModifierModal || editingModifier) && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowAddModifierModal(false); setEditingModifier(null); }} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-lg font-semibold text-white">
                  {editingModifier ? "Edit Modifier Rule" : "Add Modifier Rule"}
                </h3>
              </div>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newModifier = {
                  id: editingModifier?.id || `MOD-${String(modifierRules.length + 1).padStart(3, "0")}`,
                  code: formData.get("code") as string,
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  adjustment: parseInt(formData.get("adjustment") as string),
                  type: "percent",
                  status: "active",
                };
                if (editingModifier) {
                  setModifierRules(modifierRules.map(m => m.id === editingModifier.id ? newModifier : m));
                  showSuccess("Modifier rule updated");
                } else {
                  setModifierRules([...modifierRules, newModifier]);
                  showSuccess("Modifier rule added");
                }
                setShowAddModifierModal(false);
                setEditingModifier(null);
              }} className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Modifier Code</label>
                    <input
                      name="code"
                      type="text"
                      defaultValue={editingModifier?.code}
                      required
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Adjustment (%)</label>
                    <input
                      name="adjustment"
                      type="number"
                      defaultValue={editingModifier?.adjustment || 100}
                      required
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      placeholder="150"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={editingModifier?.name}
                    required
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="Bilateral Procedure"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingModifier?.description}
                    rows={2}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    placeholder="Describe when this modifier applies..."
                  />
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-sm text-blue-400">
                    <strong>100%</strong> = no change | <strong>&lt;100%</strong> = reduction | <strong>&gt;100%</strong> = increase
                  </p>
                </div>
                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => { setShowAddModifierModal(false); setEditingModifier(null); }} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600">
                    {editingModifier ? "Save Changes" : "Add Modifier"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
