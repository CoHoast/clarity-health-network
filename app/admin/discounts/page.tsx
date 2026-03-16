"use client";

import { useState } from "react";
import { DollarSign, Search, Plus, Edit, Trash2, Eye, Download, Building2, CheckCircle, X, Check, AlertTriangle, User, Percent, FileText, Filter, Upload, FileSpreadsheet } from "lucide-react";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DiscountSchedule {
  id: string;
  name: string;
  type: string;
  defaultRate: string;
  providersUsing: number;
  services: { service: string; rate: string }[];
  createdDate: string;
  lastModified: string;
}

interface CptRate {
  cpt: string;
  description: string;
  rate: string;
}

interface ProviderRate {
  id: string;
  providerId: string;
  providerName: string;
  practiceName: string;
  npi: string;
  rateType: "flat" | "custom";
  flatRate?: string;
  serviceRates?: {
    professional?: string;
    inpatient?: string;
    outpatient?: string;
    urgentCare?: string;
    labServices?: string;
    imaging?: string;
    mentalHealth?: string;
    physicalTherapy?: string;
    dme?: string;
  };
  cptRates?: CptRate[];
  effectiveDate: string;
  expirationDate?: string;
  notes?: string;
  lastModified: string;
}

const discountSchedules: DiscountSchedule[] = [
  {
    id: "DS-001",
    name: "Standard PPO Discount",
    type: "% Off Billed",
    defaultRate: "35%",
    providersUsing: 1247,
    services: [
      { service: "Office Visit (99213)", rate: "35%" },
      { service: "Office Visit (99214)", rate: "35%" },
      { service: "Office Visit (99215)", rate: "35%" },
      { service: "Preventive Visit", rate: "40%" },
      { service: "Lab Services", rate: "45%" },
    ],
    createdDate: "2024-01-01",
    lastModified: "2026-02-15"
  },
  {
    id: "DS-002",
    name: "Hospital Facility Rates",
    type: "% of Medicare",
    defaultRate: "140%",
    providersUsing: 89,
    services: [
      { service: "Inpatient (DRG)", rate: "145% Medicare" },
      { service: "Outpatient Surgery", rate: "135% Medicare" },
      { service: "ER Visit", rate: "150% Medicare" },
      { service: "Observation", rate: "140% Medicare" },
    ],
    createdDate: "2024-01-01",
    lastModified: "2026-01-20"
  },
  {
    id: "DS-003",
    name: "Imaging Center Schedule",
    type: "Case Rate",
    defaultRate: "See Schedule",
    providersUsing: 156,
    services: [
      { service: "MRI - Brain", rate: "$425" },
      { service: "MRI - Spine", rate: "$475" },
      { service: "CT Scan - Head", rate: "$285" },
      { service: "CT Scan - Abdomen", rate: "$350" },
      { service: "X-Ray", rate: "$45" },
      { service: "Ultrasound", rate: "$125" },
    ],
    createdDate: "2024-03-15",
    lastModified: "2026-02-01"
  },
  {
    id: "DS-004",
    name: "Laboratory Services",
    type: "% Off Billed",
    defaultRate: "50%",
    providersUsing: 234,
    services: [
      { service: "Basic Metabolic Panel", rate: "55%" },
      { service: "Complete Blood Count", rate: "55%" },
      { service: "Lipid Panel", rate: "50%" },
      { service: "Thyroid Panel", rate: "50%" },
      { service: "Urinalysis", rate: "60%" },
    ],
    createdDate: "2024-01-01",
    lastModified: "2026-01-10"
  },
  {
    id: "DS-005",
    name: "Specialist Enhanced",
    type: "% of Medicare",
    defaultRate: "125%",
    providersUsing: 412,
    services: [
      { service: "Cardiology Consult", rate: "130% Medicare" },
      { service: "Orthopedic Consult", rate: "125% Medicare" },
      { service: "Neurology Consult", rate: "130% Medicare" },
      { service: "Surgery - Minor", rate: "120% Medicare" },
    ],
    createdDate: "2024-06-01",
    lastModified: "2026-02-20"
  },
  {
    id: "DS-006",
    name: "Urgent Care Flat Rate",
    type: "Flat Rate",
    defaultRate: "See Schedule",
    providersUsing: 67,
    services: [
      { service: "Level 1 - Minor", rate: "$95" },
      { service: "Level 2 - Moderate", rate: "$145" },
      { service: "Level 3 - Complex", rate: "$195" },
      { service: "Laceration Repair", rate: "$175" },
      { service: "X-Ray (included)", rate: "$0" },
    ],
    createdDate: "2025-01-01",
    lastModified: "2026-01-15"
  },
];

const providerRates: ProviderRate[] = [
  {
    id: "PR-001",
    providerId: "P-1234",
    providerName: "Dr. Sarah Johnson",
    practiceName: "Main Street Medical Group",
    npi: "1234567890",
    rateType: "custom",
    serviceRates: {
      professional: "145% Medicare",
      inpatient: "140% Medicare",
      outpatient: "135% Medicare",
      urgentCare: "150% Medicare",
      labServices: "125% Medicare",
      imaging: "130% Medicare",
    },
    cptRates: [
      { cpt: "99213", description: "Office Visit - Established, Low", rate: "$85" },
      { cpt: "99214", description: "Office Visit - Established, Moderate", rate: "$125" },
      { cpt: "99215", description: "Office Visit - Established, High", rate: "$175" },
    ],
    effectiveDate: "2026-01-01",
    notes: "Negotiated rates based on high volume referrals. CPT flat rates for common office visits.",
    lastModified: "2026-02-15"
  },
  {
    id: "PR-002",
    providerId: "P-2345",
    providerName: "Dr. Michael Chen",
    practiceName: "Valley Orthopedics",
    npi: "2345678901",
    rateType: "flat",
    flatRate: "130% Medicare",
    cptRates: [
      { cpt: "27447", description: "Total Knee Arthroplasty", rate: "$4,500" },
      { cpt: "27130", description: "Total Hip Arthroplasty", rate: "$5,200" },
      { cpt: "29881", description: "Knee Arthroscopy w/ Meniscectomy", rate: "$1,800" },
      { cpt: "20610", description: "Joint Injection - Major", rate: "$150" },
    ],
    effectiveDate: "2025-06-01",
    expirationDate: "2027-05-31",
    notes: "2-year contract with flat rates for major orthopedic procedures",
    lastModified: "2025-06-01"
  },
  {
    id: "PR-003",
    providerId: "P-3456",
    providerName: "Cleveland Regional Hospital",
    practiceName: "Cleveland Regional Hospital",
    npi: "3456789012",
    rateType: "custom",
    serviceRates: {
      professional: "150% Medicare",
      inpatient: "155% Medicare",
      outpatient: "140% Medicare",
      urgentCare: "145% Medicare",
      labServices: "120% Medicare",
      imaging: "135% Medicare",
    },
    cptRates: [
      { cpt: "99283", description: "ER Visit - Moderate", rate: "$350" },
      { cpt: "99284", description: "ER Visit - High", rate: "$550" },
      { cpt: "99285", description: "ER Visit - Severe", rate: "$850" },
      { cpt: "70553", description: "MRI Brain w/ & w/o Contrast", rate: "$650" },
      { cpt: "74177", description: "CT Abdomen/Pelvis w/ Contrast", rate: "$475" },
    ],
    effectiveDate: "2026-01-01",
    notes: "Major hospital facility - tiered rates with CPT overrides for ER and imaging",
    lastModified: "2026-01-15"
  },
  {
    id: "PR-004",
    providerId: "P-4567",
    providerName: "Dr. Emily Rodriguez",
    practiceName: "Family Care Associates",
    npi: "4567890123",
    rateType: "custom",
    serviceRates: {
      professional: "135% Medicare",
      labServices: "115% Medicare",
      imaging: "120% Medicare",
    },
    effectiveDate: "2025-09-01",
    lastModified: "2025-09-01"
  },
  {
    id: "PR-005",
    providerId: "P-5678",
    providerName: "Lakeside Imaging Center",
    practiceName: "Lakeside Imaging Center",
    npi: "5678901234",
    rateType: "flat",
    flatRate: "125% Medicare",
    effectiveDate: "2026-02-01",
    notes: "Imaging-only facility",
    lastModified: "2026-02-01"
  },
  {
    id: "PR-006",
    providerId: "P-6789",
    providerName: "Urgent Care Plus",
    practiceName: "Urgent Care Plus",
    npi: "6789012345",
    rateType: "custom",
    serviceRates: {
      professional: "140% Medicare",
      urgentCare: "160% Medicare",
      labServices: "110% Medicare",
      imaging: "115% Medicare",
    },
    effectiveDate: "2026-01-15",
    notes: "Extended hours premium",
    lastModified: "2026-01-15"
  },
];

const discountTypes = ["All Types", "% Off Billed", "% of Medicare", "Case Rate", "Flat Rate"];

const serviceCategories = [
  { key: "professional", label: "Professional Services", description: "Office visits, consults, procedures" },
  { key: "inpatient", label: "Hospital Inpatient", description: "Inpatient stays, DRG-based" },
  { key: "outpatient", label: "Hospital Outpatient", description: "Outpatient surgery, ER visits" },
  { key: "urgentCare", label: "Urgent Care", description: "Walk-in urgent care visits" },
  { key: "labServices", label: "Lab Services", description: "Lab tests, bloodwork, pathology" },
  { key: "imaging", label: "Imaging", description: "X-ray, MRI, CT, ultrasound" },
  { key: "mentalHealth", label: "Mental Health", description: "Therapy, psychiatry" },
  { key: "physicalTherapy", label: "Physical Therapy", description: "PT, OT, rehab services" },
  { key: "dme", label: "DME", description: "Durable medical equipment" },
];

export default function DiscountSchedulesPage() {
  const [activeTab, setActiveTab] = useState<"schedules" | "providers">("schedules");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [rateTypeFilter, setRateTypeFilter] = useState<"all" | "flat" | "custom">("all");
  const [selectedSchedule, setSelectedSchedule] = useState<DiscountSchedule | null>(null);
  const [selectedProviderRate, setSelectedProviderRate] = useState<ProviderRate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showProviderRateModal, setShowProviderRateModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [serviceRows, setServiceRows] = useState([{ service: "", rate: "" }]);
  const [cptRows, setCptRows] = useState([{ cpt: "", description: "", rate: "" }]);
  const [csvPreview, setCsvPreview] = useState<{ cpt: string; description: string; rate: string }[] | null>(null);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Provider rate form state
  const [newProviderRate, setNewProviderRate] = useState({
    rateType: "flat" as "flat" | "custom",
    flatRate: "",
    serviceRates: {} as Record<string, string>,
    cptRates: [] as { cpt: string; description: string; rate: string }[],
    effectiveDate: "",
    expirationDate: "",
    notes: ""
  });

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setShowCreateModal(false);
        setShowProviderRateModal(false);
        setServiceRows([{ service: "", rate: "" }]);
        setCptRows([{ cpt: "", description: "", rate: "" }]);
        setCsvPreview(null);
        setCsvError(null);
        setNewProviderRate({
          rateType: "flat",
          flatRate: "",
          serviceRates: {},
          cptRates: [],
          effectiveDate: "",
          expirationDate: "",
          notes: ""
        });
      }, 1500);
    }, 1000);
  };

  const addCptRow = () => {
    setCptRows([...cptRows, { cpt: "", description: "", rate: "" }]);
  };

  const removeCptRow = (index: number) => {
    if (cptRows.length > 1) {
      setCptRows(cptRows.filter((_, i) => i !== index));
    } else {
      setCptRows([{ cpt: "", description: "", rate: "" }]);
    }
  };

  const addServiceRow = () => {
    setServiceRows([...serviceRows, { service: "", rate: "" }]);
  };

  const removeServiceRow = (index: number) => {
    if (serviceRows.length > 1) {
      setServiceRows(serviceRows.filter((_, i) => i !== index));
    }
  };

  // CSV Upload handlers
  const parseCSV = (text: string): { cpt: string; description: string; rate: string }[] => {
    const lines = text.trim().split('\n');
    const results: { cpt: string; description: string; rate: string }[] = [];
    
    // Skip header row if present
    const startIndex = lines[0]?.toLowerCase().includes('cpt') ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle both comma and tab delimiters
      const delimiter = line.includes('\t') ? '\t' : ',';
      const parts = line.split(delimiter).map(p => p.trim().replace(/^["']|["']$/g, ''));
      
      if (parts.length >= 2) {
        results.push({
          cpt: parts[0] || '',
          description: parts[1] || '',
          rate: parts[2] || ''
        });
      }
    }
    
    return results;
  };

  const handleFileUpload = (file: File) => {
    setCsvError(null);
    
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setCsvError('Please upload a CSV or TXT file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCSV(text);
        
        if (parsed.length === 0) {
          setCsvError('No valid data found in file');
          return;
        }
        
        setCsvPreview(parsed);
      } catch (err) {
        setCsvError('Failed to parse file. Please check the format.');
      }
    };
    reader.onerror = () => {
      setCsvError('Failed to read file');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const confirmCsvImport = () => {
    if (csvPreview) {
      setCptRows(csvPreview);
      setCsvPreview(null);
    }
  };

  const cancelCsvImport = () => {
    setCsvPreview(null);
    setCsvError(null);
  };

  const filteredSchedules = discountSchedules.filter(schedule => {
    const matchesSearch = schedule.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "All Types" || schedule.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const filteredProviderRates = providerRates.filter(pr => {
    const matchesSearch = 
      pr.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.practiceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pr.npi.includes(searchQuery);
    const matchesType = rateTypeFilter === "all" || pr.rateType === rateTypeFilter;
    return matchesSearch && matchesType;
  });

  const totalProviders = discountSchedules.reduce((sum, s) => sum + s.providersUsing, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <DollarSign className="w-7 h-7 text-green-500" />
            Rates &amp; Discounts
          </h1>
          <p className="text-slate-400 mt-1">
            {activeTab === "schedules" 
              ? `${discountSchedules.length} schedules • ${totalProviders.toLocaleString()} providers assigned`
              : `${providerRates.length} custom provider rates`
            }
          </p>
        </div>
        <button
          onClick={() => activeTab === "schedules" ? setShowCreateModal(true) : setShowProviderRateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 font-medium rounded-lg hover:bg-teal-700 transition-colors"
          style={{ color: 'white' }}
        >
          <Plus className="w-4 h-4" />
          {activeTab === "schedules" ? "New Schedule" : "Add Provider Rate"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-800 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("schedules")}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 ${
            activeTab === "schedules"
              ? "bg-teal-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <FileText className="w-4 h-4" />
          Discount Schedules
        </button>
        <button
          onClick={() => setActiveTab("providers")}
          className={`px-4 py-2 rounded-md font-medium text-sm transition-colors flex items-center gap-2 ${
            activeTab === "providers"
              ? "bg-teal-600 text-white"
              : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <User className="w-4 h-4" />
          Provider Rates
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder={activeTab === "schedules" ? "Search schedules..." : "Search by provider name, practice, or NPI..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        {activeTab === "schedules" ? (
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {discountTypes.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        ) : (
          <select
            value={rateTypeFilter}
            onChange={(e) => setRateTypeFilter(e.target.value as "all" | "flat" | "custom")}
            className="px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Rate Types</option>
            <option value="flat">Flat Rate</option>
            <option value="custom">Custom by Service</option>
          </select>
        )}
        <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "schedules" ? (
        /* Schedules Grid */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 hover:border-green-500/50 transition-colors cursor-pointer"
              onClick={() => setSelectedSchedule(schedule)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-400" />
                </div>
                <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs font-medium rounded-full">{schedule.type}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">{schedule.name}</h3>
              <p className="text-green-400 text-2xl font-bold mb-4">{schedule.defaultRate}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Providers Using:</span>
                  <span className="text-cyan-400 font-medium">{schedule.providersUsing.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Service Rates:</span>
                  <span className="text-slate-300">{schedule.services.length} defined</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Modified:</span>
                  <span className="text-slate-300">{schedule.lastModified}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedSchedule(schedule); }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View Rates
                </button>
                <button 
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Provider Rates Table */
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Provider</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">NPI</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Rate Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Rates</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Effective</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredProviderRates.map((pr) => (
                <tr key={pr.id} className="hover:bg-slate-800/80">
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-white font-medium">{pr.providerName}</p>
                      <p className="text-slate-500 text-sm">{pr.practiceName}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-300 font-mono text-sm">{pr.npi}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      pr.rateType === "flat" 
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}>
                      {pr.rateType === "flat" ? "Flat Rate" : "Custom by Service"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      {pr.rateType === "flat" ? (
                        <span className="text-green-400 font-semibold">{pr.flatRate}</span>
                      ) : (
                        <button
                          onClick={() => setSelectedProviderRate(pr)}
                          className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          {Object.keys(pr.serviceRates || {}).length} categories
                        </button>
                      )}
                      {pr.cptRates && pr.cptRates.length > 0 && (
                        <p className="text-xs text-amber-400">+ {pr.cptRates.length} CPT overrides</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <p className="text-slate-300">{pr.effectiveDate}</p>
                      {pr.expirationDate && (
                        <p className="text-slate-500">to {pr.expirationDate}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedProviderRate(pr)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProviderRates.length === 0 && (
            <div className="p-8 text-center">
              <User className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No provider rates found</p>
              <p className="text-slate-500 text-sm mt-1">Add custom rates for specific providers</p>
            </div>
          )}
        </div>
      )}

      {/* Schedule Detail Modal */}
      <AnimatePresence>
        {selectedSchedule && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSchedule(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedSchedule.name}</h2>
                  <p className="text-slate-400">{selectedSchedule.type} • Default: {selectedSchedule.defaultRate}</p>
                </div>
                <button onClick={() => setSelectedSchedule(null)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-white">{selectedSchedule.providersUsing.toLocaleString()}</p>
                    <p className="text-sm text-slate-400">Providers</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-400">{selectedSchedule.defaultRate}</p>
                    <p className="text-sm text-slate-400">Default Rate</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-cyan-400">{selectedSchedule.services.length}</p>
                    <p className="text-sm text-slate-400">Service Rates</p>
                  </div>
                </div>

                {/* Service Rates Table */}
                <h3 className="text-white font-semibold mb-3">Service-Specific Rates</h3>
                <div className="bg-slate-900 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Service</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {selectedSchedule.services.map((service, i) => (
                        <tr key={i} className="hover:bg-slate-800/50">
                          <td className="px-4 py-3 text-slate-300">{service.service}</td>
                          <td className="px-4 py-3 text-right text-green-400 font-medium">{service.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-6 border-t border-slate-700 flex justify-between">
                <button className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  View Assigned Providers
                </button>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Schedule
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Provider Rate Detail Modal */}
      <AnimatePresence>
        {selectedProviderRate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedProviderRate(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedProviderRate.providerName}</h2>
                  <p className="text-slate-400">{selectedProviderRate.practiceName} • NPI: {selectedProviderRate.npi}</p>
                </div>
                <button onClick={() => setSelectedProviderRate(null)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                {/* Rate Type Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    selectedProviderRate.rateType === "flat" 
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-purple-500/20 text-purple-400"
                  }`}>
                    {selectedProviderRate.rateType === "flat" ? "Flat Rate" : "Custom by Service Category"}
                  </span>
                  <span className="text-slate-400 text-sm">
                    Effective: {selectedProviderRate.effectiveDate}
                    {selectedProviderRate.expirationDate && ` - ${selectedProviderRate.expirationDate}`}
                  </span>
                </div>

                {selectedProviderRate.rateType === "flat" ? (
                  <div className="bg-slate-700/50 rounded-xl p-8 text-center">
                    <Percent className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-4xl font-bold text-green-400">{selectedProviderRate.flatRate}</p>
                    <p className="text-slate-400 mt-2">Applied to all service categories</p>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-white font-semibold mb-3">Service Category Rates</h3>
                    <div className="bg-slate-900 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Description</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {serviceCategories.map((cat) => {
                            const rate = selectedProviderRate.serviceRates?.[cat.key as keyof typeof selectedProviderRate.serviceRates];
                            return (
                              <tr key={cat.key} className={rate ? "hover:bg-slate-800/50" : "opacity-50"}>
                                <td className="px-4 py-3 text-slate-300 font-medium">{cat.label}</td>
                                <td className="px-4 py-3 text-slate-500 text-sm">{cat.description}</td>
                                <td className="px-4 py-3 text-right">
                                  {rate ? (
                                    <span className="text-green-400 font-semibold">{rate}</span>
                                  ) : (
                                    <span className="text-slate-600">—</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* CPT-Specific Rates */}
                {selectedProviderRate.cptRates && selectedProviderRate.cptRates.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      CPT-Specific Flat Rates
                      <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">Override</span>
                    </h3>
                    <div className="bg-slate-900 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">CPT Code</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Description</th>
                            <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Flat Rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                          {selectedProviderRate.cptRates.map((cpt, i) => (
                            <tr key={i} className="hover:bg-slate-800/50">
                              <td className="px-4 py-3 font-mono text-amber-400 font-medium">{cpt.cpt}</td>
                              <td className="px-4 py-3 text-slate-300">{cpt.description}</td>
                              <td className="px-4 py-3 text-right text-green-400 font-semibold">{cpt.rate}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">CPT-specific rates override service category rates for these procedures</p>
                  </div>
                )}

                {selectedProviderRate.notes && (
                  <div className="mt-6 bg-slate-700/30 rounded-lg p-4">
                    <p className="text-slate-400 text-sm">
                      <span className="text-slate-300 font-medium">Notes:</span> {selectedProviderRate.notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Rates
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Schedule Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !saving && setShowCreateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {!saving && !saved ? (
                <>
                  <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Create New Discount Schedule</h2>
                      <p className="text-slate-400 text-sm">Define rates for a group of providers or services</p>
                    </div>
                    <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 overflow-auto max-h-[60vh] space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Schedule Name *</label>
                      <input 
                        type="text" 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                        placeholder="e.g., Primary Care Standard Rates"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Rate Type *</label>
                        <select className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500">
                          <option value="">Select type...</option>
                          <option>% Off Billed</option>
                          <option>% of Medicare</option>
                          <option>Case Rate</option>
                          <option>Flat Rate</option>
                          <option>Per Diem</option>
                          <option>Fee Schedule</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Default Rate *</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500"
                          placeholder="e.g., 35% or $150"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <textarea 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 h-20 resize-none"
                        placeholder="Brief description of this discount schedule..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Provider Type</label>
                      <select className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500">
                        <option value="">All Provider Types</option>
                        <option>Primary Care</option>
                        <option>Specialists</option>
                        <option>Hospitals/Facilities</option>
                        <option>Urgent Care</option>
                        <option>Imaging Centers</option>
                        <option>Laboratories</option>
                        <option>Mental Health</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-300">Service-Specific Rates</label>
                        <button 
                          type="button"
                          onClick={addServiceRow}
                          className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Add Service
                        </button>
                      </div>
                      <div className="space-y-2">
                        {serviceRows.map((row, index) => (
                          <div key={index} className="flex gap-2">
                            <input 
                              type="text" 
                              className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 text-sm"
                              placeholder="Service name or CPT code"
                              value={row.service}
                              onChange={(e) => {
                                const newRows = [...serviceRows];
                                newRows[index].service = e.target.value;
                                setServiceRows(newRows);
                              }}
                            />
                            <input 
                              type="text" 
                              className="w-32 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 text-sm"
                              placeholder="Rate"
                              value={row.rate}
                              onChange={(e) => {
                                const newRows = [...serviceRows];
                                newRows[index].rate = e.target.value;
                                setServiceRows(newRows);
                              }}
                            />
                            <button 
                              type="button"
                              onClick={() => removeServiceRow(index)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                              disabled={serviceRows.length === 1}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-500 mt-2">Leave blank to use default rate for all services</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Effective Date</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="applyToNew" className="rounded bg-slate-600 border-slate-500 text-teal-500 focus:ring-teal-500" />
                      <label htmlFor="applyToNew" className="text-slate-300 text-sm">Automatically apply to new providers of this type</label>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-blue-300 font-medium">Rate Changes</p>
                        <p className="text-blue-200/70 mt-1">Existing provider contracts will not be affected. New rates apply only to new contracts or renewals.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                    <button
                      onClick={() => setShowCreateModal(false)}
                      className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Schedule
                    </button>
                  </div>
                </>
              ) : saving ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Creating schedule...</p>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <p className="text-white font-medium">Schedule Created!</p>
                  <p className="text-slate-400 text-sm mt-1">You can now assign providers to this schedule</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Provider Rate Modal */}
      <AnimatePresence>
        {showProviderRateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !saving && setShowProviderRateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {!saving && !saved ? (
                <>
                  <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Add Provider Discount Rate</h2>
                      <p className="text-slate-400 text-sm">Set custom rates for a specific provider</p>
                    </div>
                    <button onClick={() => setShowProviderRateModal(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 overflow-auto max-h-[70vh] space-y-5">
                    {/* Provider Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Select Provider *</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                          placeholder="Search by provider name, practice, or NPI..."
                        />
                      </div>
                    </div>

                    {/* Rate Type Selection */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-3">Rate Type *</label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setNewProviderRate({...newProviderRate, rateType: "flat"})}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            newProviderRate.rateType === "flat"
                              ? "border-teal-500 bg-teal-500/10"
                              : "border-slate-600 hover:border-slate-500"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              newProviderRate.rateType === "flat" ? "bg-teal-500/20" : "bg-slate-700"
                            }`}>
                              <Percent className={`w-5 h-5 ${newProviderRate.rateType === "flat" ? "text-teal-400" : "text-slate-400"}`} />
                            </div>
                            <span className="text-white font-medium">Flat Rate</span>
                          </div>
                          <p className="text-slate-400 text-sm">Single rate applies to all service categories</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProviderRate({...newProviderRate, rateType: "custom"})}
                          className={`p-4 rounded-xl border-2 text-left transition-all ${
                            newProviderRate.rateType === "custom"
                              ? "border-teal-500 bg-teal-500/10"
                              : "border-slate-600 hover:border-slate-500"
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              newProviderRate.rateType === "custom" ? "bg-teal-500/20" : "bg-slate-700"
                            }`}>
                              <Filter className={`w-5 h-5 ${newProviderRate.rateType === "custom" ? "text-teal-400" : "text-slate-400"}`} />
                            </div>
                            <span className="text-white font-medium">Custom by Service</span>
                          </div>
                          <p className="text-slate-400 text-sm">Different rates for each service category</p>
                        </button>
                      </div>
                    </div>

                    {/* Flat Rate Input */}
                    {newProviderRate.rateType === "flat" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Rate (% of Medicare) *</label>
                        <div className="relative w-64">
                          <input 
                            type="text" 
                            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                            placeholder="e.g., 150"
                            value={newProviderRate.flatRate}
                            onChange={(e) => setNewProviderRate({...newProviderRate, flatRate: e.target.value})}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">% Medicare</span>
                        </div>
                      </div>
                    )}

                    {/* Custom Service Rates */}
                    {newProviderRate.rateType === "custom" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-3">Service Category Rates (% of Medicare)</label>
                        <div className="bg-slate-900 rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Description</th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase w-40">Rate</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                              {serviceCategories.map((cat) => (
                                <tr key={cat.key} className="hover:bg-slate-800/50">
                                  <td className="px-4 py-3 text-slate-300 font-medium">{cat.label}</td>
                                  <td className="px-4 py-3 text-slate-500 text-sm">{cat.description}</td>
                                  <td className="px-4 py-3 text-right">
                                    <div className="relative">
                                      <input 
                                        type="text" 
                                        className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-right placeholder:text-slate-500 focus:border-teal-500 text-sm"
                                        placeholder="—"
                                        value={newProviderRate.serviceRates[cat.key] || ""}
                                        onChange={(e) => setNewProviderRate({
                                          ...newProviderRate,
                                          serviceRates: {
                                            ...newProviderRate.serviceRates,
                                            [cat.key]: e.target.value
                                          }
                                        })}
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Leave blank to exclude category. Enter percentage value (e.g., "150" for 150% of Medicare)</p>
                      </div>
                    )}

                    {/* CPT-Specific Flat Rates */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-400" />
                          CPT-Specific Flat Rates
                          <span className="text-xs text-slate-500 font-normal">(Optional)</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept=".csv,.txt"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file);
                              e.target.value = '';
                            }}
                          />
                          <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
                          >
                            <Upload className="w-4 h-4" />
                            Upload CSV
                          </button>
                          <button 
                            type="button"
                            onClick={addCptRow}
                            className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <Plus className="w-4 h-4" />
                            Add Row
                          </button>
                        </div>
                      </div>

                      {/* CSV Preview */}
                      {csvPreview && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-amber-300 font-medium flex items-center gap-2">
                              <FileSpreadsheet className="w-4 h-4" />
                              Preview: {csvPreview.length} CPT codes found
                            </p>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={cancelCsvImport}
                                className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={confirmCsvImport}
                                className="px-3 py-1 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                              >
                                Import All
                              </button>
                            </div>
                          </div>
                          <div className="max-h-40 overflow-auto bg-slate-900 rounded-lg">
                            <table className="w-full text-sm">
                              <thead className="sticky top-0 bg-slate-800">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs text-slate-400">CPT</th>
                                  <th className="px-3 py-2 text-left text-xs text-slate-400">Description</th>
                                  <th className="px-3 py-2 text-right text-xs text-slate-400">Rate</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-700">
                                {csvPreview.slice(0, 10).map((row, i) => (
                                  <tr key={i}>
                                    <td className="px-3 py-2 text-amber-400 font-mono">{row.cpt}</td>
                                    <td className="px-3 py-2 text-slate-300">{row.description}</td>
                                    <td className="px-3 py-2 text-right text-green-400">{row.rate}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {csvPreview.length > 10 && (
                              <p className="text-center text-slate-500 text-xs py-2">
                                ... and {csvPreview.length - 10} more rows
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* CSV Error */}
                      {csvError && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                          <p className="text-red-300 text-sm">{csvError}</p>
                          <button
                            type="button"
                            onClick={() => setCsvError(null)}
                            className="ml-auto text-red-400 hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}

                      {/* Drag and Drop Zone (when no CPT rows) */}
                      {cptRows.length === 1 && !cptRows[0].cpt && !csvPreview && (
                        <div
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-4 ${
                            isDragging 
                              ? 'border-amber-500 bg-amber-500/10' 
                              : 'border-slate-600 hover:border-slate-500'
                          }`}
                        >
                          <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-amber-400' : 'text-slate-500'}`} />
                          <p className="text-slate-400 text-sm">
                            Drag & drop a CSV file here, or{' '}
                            <button 
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-amber-400 hover:text-amber-300"
                            >
                              browse
                            </button>
                          </p>
                          <p className="text-slate-500 text-xs mt-2">
                            Format: CPT Code, Description, Rate (e.g., 99213, Office Visit, $85)
                          </p>
                        </div>
                      )}

                      <div className="bg-slate-900 rounded-lg p-4 space-y-3">
                        {(cptRows.length > 1 || cptRows[0]?.cpt) && (
                          <p className="text-xs text-slate-500 mb-3">CPT flat rates override category rates for specific procedure codes</p>
                        )}
                        {cptRows.map((row, index) => (
                          <div key={index} className="flex gap-2">
                            <input 
                              type="text" 
                              className="w-28 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-amber-500 text-sm font-mono"
                              placeholder="CPT Code"
                              value={row.cpt}
                              onChange={(e) => {
                                const newRows = [...cptRows];
                                newRows[index].cpt = e.target.value;
                                setCptRows(newRows);
                              }}
                            />
                            <input 
                              type="text" 
                              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-amber-500 text-sm"
                              placeholder="Description (e.g., Office Visit - Established)"
                              value={row.description}
                              onChange={(e) => {
                                const newRows = [...cptRows];
                                newRows[index].description = e.target.value;
                                setCptRows(newRows);
                              }}
                            />
                            <input 
                              type="text" 
                              className="w-28 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-amber-500 text-sm text-right"
                              placeholder="$0.00"
                              value={row.rate}
                              onChange={(e) => {
                                const newRows = [...cptRows];
                                newRows[index].rate = e.target.value;
                                setCptRows(newRows);
                              }}
                            />
                            <button 
                              type="button"
                              onClick={() => removeCptRow(index)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Effective Date *</label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                          value={newProviderRate.effectiveDate}
                          onChange={(e) => setNewProviderRate({...newProviderRate, effectiveDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Expiration Date</label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                          value={newProviderRate.expirationDate}
                          onChange={(e) => setNewProviderRate({...newProviderRate, expirationDate: e.target.value})}
                        />
                        <p className="text-xs text-slate-500 mt-1">Leave blank for no expiration</p>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Notes</label>
                      <textarea 
                        className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 h-20 resize-none"
                        placeholder="Contract details, negotiation notes, etc..."
                        value={newProviderRate.notes}
                        onChange={(e) => setNewProviderRate({...newProviderRate, notes: e.target.value})}
                      />
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-amber-300 font-medium">Provider Override</p>
                        <p className="text-amber-200/70 mt-1">This custom rate will override any discount schedule assigned to the provider. Remove the custom rate to revert to schedule defaults.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                    <button
                      onClick={() => setShowProviderRateModal(false)}
                      className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave}
                      className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Provider Rate
                    </button>
                  </div>
                </>
              ) : saving ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Saving provider rate...</p>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <p className="text-white font-medium">Provider Rate Added!</p>
                  <p className="text-slate-400 text-sm mt-1">Custom rates are now active for this provider</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
