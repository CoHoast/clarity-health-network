"use client";

import { useState, useEffect } from "react";
import { Search, Download, Eye, Plus, Building2, MapPin, Phone, Mail, FileText, CheckCircle, Clock, XCircle, X, DollarSign, Edit, User, CreditCard, Save, Users, ChevronRight, Trash2, Upload, FileSpreadsheet, AlertCircle, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";
import { StatCard } from "@/components/admin/ui/StatCard";
import { StatCardSkeleton, TableRowSkeleton } from "@/components/admin/ui/Skeleton";
import { EmptyState, NoSearchResults } from "@/components/admin/ui/EmptyState";
import { useBulkSelect } from "@/lib/hooks/useBulkSelect";
import { BulkActionBar, bulkActionCreators } from "@/components/admin/ui/BulkActionBar";

// Practice = The office/group (has Pay-To, address, contract)
interface Practice {
  id: string;
  name: string;
  type: "Group Practice" | "Facility";
  specialty: string;
  // Location
  address: string;
  address2?: string; // Suite, Office, Building number
  city: string;
  county: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  fax: string;
  billingPhone: string;
  billingFax: string;
  email: string;
  contactName: string;
  // Correspondence Address (may differ from location)
  correspondenceAddress: string;
  correspondenceAddress2?: string; // Suite, Office, Building number
  correspondenceCity: string;
  correspondenceState: string;
  correspondenceZip: string;
  correspondenceCountry: string;
  correspondenceFax: string;
  // Pay-To (inherited by all providers)
  payToNpi: string;
  payToName: string;
  payToTaxId: string;
  payToAddress: string;
  payToAddress2?: string; // Suite, Office, Building number
  payToCity: string;
  payToState: string;
  payToZip: string;
  payToCountry: string;
  // Contract
  status: "active" | "pending" | "inactive";
  contractStart: string;
  contractEnd: string;
  discountType: string;
  discountRate: string;
  // Provider count from API
  providerCount: number;
}

// Network Organization
interface Network {
  id: string;
  name: string;
  description: string;
  state?: string; // Optional - networks can span multiple states
  providerCount: number;
  status: "active" | "inactive";
  createdDate: string;
}

// Provider = Individual doctor/clinician linked to a practice
interface Provider {
  id: string;
  practiceId: string;
  // Name fields - support both legacy (name) and new (firstName/lastName/title)
  name?: string; // Legacy: "Robert Smith" - will be parsed into firstName/lastName
  firstName?: string;
  lastName?: string;
  title?: string; // MD, DO, PhD, NP, PA, DPM, DC, etc.
  credential: string; // Full credential string
  npi: string;
  gender: "Male" | "Female" | "";
  specialty: string;
  primaryTaxonomy: string;
  primaryTaxonomyDesc: string;
  secondaryTaxonomy: string;
  secondaryTaxonomyDesc: string;
  tertiaryTaxonomy?: string;
  licenseState: string;
  licenseNumber: string;
  acceptingNewPatients: boolean;
  languages: string[]; // ISO 639-3 codes (eng, spa, cmn, etc.)
  networks?: string[]; // Array of network IDs
  clinicHours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  // Arizona provider fields
  referenceNumber?: string; // Entity #
  contractNumber?: string; // Contract #
  taxId?: string;
  practiceNpi?: string;
  isPrimaryCare?: boolean;
  isBehavioralHealth?: boolean;
  phone?: string;
  address?: string;
  address2?: string;
  city?: string;
  state?: string;
  zip?: string;
  visible?: boolean;
}

// Helper to parse names - handles both new and legacy formats
const parseProviderName = (p: Provider) => {
  if (p.firstName && p.lastName) {
    return { firstName: p.firstName, lastName: p.lastName, title: p.title || p.credential };
  }
  // Parse legacy name field
  const name = p.name || "";
  const parts = name.replace(/^Dr\.\s*/i, "").split(" ");
  const lastName = parts.pop() || "";
  const firstName = parts.join(" ") || "";
  return { firstName, lastName, title: p.title || p.credential };
};

// Helper to get display name
const getProviderDisplayName = (p: Provider) => {
  const { firstName, lastName, title } = parseProviderName(p);
  return `${firstName} ${lastName}, ${title}`;
};

const getProviderFullName = (p: Provider) => {
  const { firstName, lastName } = parseProviderName(p);
  return `${firstName} ${lastName}`;
};

// ISO 639-3 language code mapping
const languageNames: Record<string, string> = {
  eng: "English",
  spa: "Spanish",
  cmn: "Mandarin Chinese",
  yue: "Cantonese",
  kor: "Korean",
  vie: "Vietnamese",
  ara: "Arabic",
  rus: "Russian",
  por: "Portuguese",
  fra: "French",
  deu: "German",
  ita: "Italian",
  pol: "Polish",
  hin: "Hindi",
  urd: "Urdu",
  ben: "Bengali",
  jpn: "Japanese",
  tgl: "Tagalog",
  heb: "Hebrew",
  fas: "Persian/Farsi",
};

// Provider Title Options
const titleOptions = ["MD", "DO", "PhD", "NP", "PA", "DPM", "DC", "PT", "OT", "DDS", "DMD", "PharmD", "PsyD"];

// Network Organizations - Arizona Antidote
const networksData: Network[] = [
  { id: "NET-001", name: "Arizona Antidote", description: "Solidarity Health Network PPO - Arizona providers", state: "AZ", providerCount: 3600, status: "active", createdDate: "2026-03-19" },
];

const statusOptions = ["All", "Active", "Pending", "Inactive"];
const typeOptions = ["All Types", "Group Practice", "Facility"];

// Convert API provider to internal Provider format
function convertApiProvider(apiProvider: any, practiceId: string): Provider {
  return {
    id: apiProvider.id,
    practiceId,
    firstName: apiProvider.firstName,
    lastName: apiProvider.lastName,
    title: apiProvider.credentials,
    credential: apiProvider.credentials || 'MD',
    npi: apiProvider.npi,
    gender: apiProvider.gender === 'M' ? 'Male' : apiProvider.gender === 'F' ? 'Female' : '',
    specialty: apiProvider.specialty,
    primaryTaxonomy: apiProvider.taxonomyCode || '',
    primaryTaxonomyDesc: apiProvider.specialty,
    secondaryTaxonomy: apiProvider.secondaryTaxonomyCode || '',
    secondaryTaxonomyDesc: '',
    licenseState: 'AZ',
    licenseNumber: '',
    acceptingNewPatients: apiProvider.acceptingNewPatients,
    languages: apiProvider.languages || ['English'],
    networks: ['NET-001'],
    clinicHours: {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 5:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed',
    },
  };
}

// Convert API provider to Practice format (using billing info)
function convertApiProviderToPractice(apiProvider: any): Practice {
  const billing = apiProvider.billing || {};
  const location = apiProvider.locations?.[0] || {};
  
  return {
    id: `practice-${billing.taxId || apiProvider.npi}`,
    name: billing.name || `${apiProvider.lastName}, ${apiProvider.firstName} ${apiProvider.credentials || ''}`.trim(),
    type: 'Group Practice',
    specialty: apiProvider.specialty,
    address: location.address1 || '',
    address2: location.address2 || '',
    city: location.city || '',
    county: '',
    state: location.state || 'AZ',
    zip: location.zip || '',
    country: 'USA',
    phone: location.phone || '',
    fax: location.fax || '',
    billingPhone: billing.phone || '',
    billingFax: billing.fax || '',
    email: location.email || '',
    contactName: '',
    correspondenceAddress: billing.address1 || '',
    correspondenceAddress2: billing.address2 || '',
    correspondenceCity: billing.city || '',
    correspondenceState: billing.state || '',
    correspondenceZip: billing.zip || '',
    correspondenceCountry: 'USA',
    correspondenceFax: billing.fax || '',
    payToNpi: billing.npi || '',
    payToName: billing.name || '',
    payToTaxId: billing.taxId || '',
    payToAddress: billing.address1 || '',
    payToAddress2: billing.address2 || '',
    payToCity: billing.city || '',
    payToState: billing.state || '',
    payToZip: billing.zip || '',
    payToCountry: 'USA',
    status: 'active',
    contractStart: '2026-01-01',
    contractEnd: '2027-12-31',
    discountType: apiProvider.pricingTier || 'Tier1',
    discountRate: '35%',
    providerCount: 1, // Single provider converted to practice
  };
}

export default function ProvidersPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "providers" | "billing" | "payto" | "contract">("info");
  
  // State for Arizona providers loaded from API
  const [practices, setPractices] = useState<Practice[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [networks, setNetworks] = useState<Network[]>(networksData);
  const [apiStats, setApiStats] = useState({ total: 0, primaryCare: 0, behavioralHealth: 0, acceptingNew: 0 });
  const [showAddPractice, setShowAddPractice] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvData, setCsvData] = useState<Partial<Provider>[]>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [isEditingPractice, setIsEditingPractice] = useState(false);
  const [isEditingProvider, setIsEditingProvider] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNetworkAssign, setShowNetworkAssign] = useState(false);

  // Load Arizona providers from API
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch practices and providers in parallel
        const [practicesRes, providersRes] = await Promise.all([
          fetch('/api/practices?limit=500'),
          fetch('/api/providers?limit=100'),
        ]);
        
        const practicesData = await practicesRes.json();
        const providersData = await providersRes.json();
        
        // Load practices from API
        if (practicesData.practices && Array.isArray(practicesData.practices)) {
          const loadedPractices: Practice[] = practicesData.practices.map((p: any) => ({
            id: p.id,
            name: p.name || 'Unknown Practice',
            type: 'Group Practice' as const,
            npi: p.npi || '',
            taxId: p.taxId || '',
            specialty: 'Multi-Specialty',
            status: 'active' as const,
            address: p.address1 || '',
            city: p.city || '',
            state: p.state || '',
            zip: p.zip || '',
            country: 'USA',
            phone: p.phone || '',
            fax: p.fax || '',
            providerCount: p.providerCount || 0,
            providerIds: p.providerIds || [],
            // Pay-to defaults to same as practice
            payToName: p.name || '',
            payToAddress: p.address1 || '',
            payToCity: p.city || '',
            payToState: p.state || '',
            payToZip: p.zip || '',
            payToCountry: 'USA',
          }));
          setPractices(loadedPractices);
        }
        
        // Load providers from API
        if (providersData.providers && Array.isArray(providersData.providers)) {
          const loadedProviders: Provider[] = providersData.providers.map((p: any) => 
            convertApiProvider(p, `practice-${p.billing?.taxId || p.npi}`)
          );
          setProviders(loadedProviders);
          
          // Update stats from the full provider dataset
          setApiStats({
            total: providersData.pagination?.total || loadedProviders.length,
            primaryCare: providersData.providers.filter((p: any) => p.isPrimaryCare).length,
            behavioralHealth: providersData.providers.filter((p: any) => p.isBehavioralHealth).length,
            acceptingNew: providersData.providers.filter((p: any) => p.acceptingNewPatients).length,
          });
          
          // Update network provider count
          setNetworks(prev => prev.map(n => ({
            ...n,
            providerCount: providersData.pagination?.total || loadedProviders.length,
          })));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadData();
  }, []);

  // New practice form
  const [newPractice, setNewPractice] = useState<Partial<Practice>>({
    type: "Group Practice",
    status: "pending",
    country: "USA",
    payToCountry: "USA",
  });

  // New provider form
  const [newProvider, setNewProvider] = useState<Partial<Provider>>({
    credential: "MD",
    gender: "",
    acceptingNewPatients: true,
    languages: ["eng"],
    clinicHours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
  });

  const getProvidersForPractice = (practiceId: string) => {
    return providers.filter(p => p.practiceId === practiceId);
  };

  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      // Handle quoted CSV headers
      const headerLine = lines[0];
      const headers = headerLine.split(',').map(h => h.trim().toLowerCase().replace(/^"|"$/g, '').replace(/\s+/g, '_').replace(/#/g, ''));

      const errors: string[] = [];
      const parsed: Partial<Provider>[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        // Parse CSV line (handle commas in quoted values)
        const values: string[] = [];
        let current = '';
        let inQuotes = false;
        for (const char of lines[i]) {
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim().replace(/^"|"$/g, ''));

        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        // Map CSV columns to Provider fields (Arizona format)
        const firstName = row.first_name || row.firstname || '';
        const lastName = row.last_name || row.lastname || '';
        const fullName = row.name || row.provider_name || row.full_name || '';
        const name = fullName || `${firstName} ${lastName}`.trim();

        const provider: Partial<Provider> = {
          name,
          firstName,
          lastName,
          credential: row.credentials || row.credential || '',
          npi: row.npi || row.provider_npi || '',
          gender: row.gender || '',
          specialty: row.primary_spc_code || row.specialty || row.speciality || '',
          referenceNumber: row.entity_ || row.entity || row.reference_number || '',
          contractNumber: row.contract_ || row.contract || row.contract_number || '',
          taxId: row.tax_id || row.taxid || '',
          practiceNpi: row.practice_npi || row.practicenpi || '',
          primaryTaxonomy: row.primary_spc_code || row.primary_taxonomy || '',
          primaryTaxonomyDesc: row.primary_taxonomy_desc || '',
          secondaryTaxonomy: row.secondary_spc_code || row.secondary_taxonomy || '',
          secondaryTaxonomyDesc: row.secondary_taxonomy_desc || '',
          tertiaryTaxonomy: row.tertiary_spc_code || row.tertiary_taxonomy || '',
          isPrimaryCare: row.primary_care_flag === 'P' || row.primary_care === 'Y' || row.primary_care === 'true',
          isBehavioralHealth: row.behavioral_health_flag === 'B' || row.behavioral_health === 'Y' || row.behavioral_health === 'true',
          phone: row.phone || row.phone_number || '',
          address: row.address_1 || row.address1 || row.address || '',
          address2: row.address_2 || row.address2 || '',
          city: row.city || '',
          state: row.state || '',
          zip: row.zip || row.zipcode || row.zip_code || '',
          acceptingNewPatients: row.accept_new_patients === 'Y' || row.accept_new_patients === 'Yes' || row.accepting_new_patients?.toLowerCase() === 'yes' || row.accepting_new_patients?.toLowerCase() === 'true',
          languages: row.languages ? row.languages.split(';').map((l: string) => l.trim()) : ['English'],
          visible: row.visible === 'Y' || row.visible === 'Yes' || row.visible === 'true' || row.visible === '1',
        };

        // Validate required fields (only NPI and Name required)
        if (!name) errors.push(`Row ${i}: Missing provider name (First Name + Last Name or Name)`);
        if (!provider.npi) errors.push(`Row ${i}: Missing NPI`);

        if (name && provider.npi) {
          parsed.push(provider);
        }
      }

      setCsvData(parsed);
      setCsvErrors(errors);
    };
    reader.readAsText(file);
  };

  // Search also checks individual providers in the practice
  const filteredPractices = practices.filter(practice => {
    const practiceProviders = getProvidersForPractice(practice.id);
    const searchLower = searchQuery.toLowerCase();
    
    // Check practice fields
    const matchesPractice = practice.name.toLowerCase().includes(searchLower) ||
      practice.specialty.toLowerCase().includes(searchLower) ||
      practice.city.toLowerCase().includes(searchLower);
    
    // Check provider fields (name, NPI, specialty)
    const matchesProvider = practiceProviders.some(p => {
      const providerName = p.name || `${p.firstName || ''} ${p.lastName || ''}`;
      return providerName.toLowerCase().includes(searchLower) ||
        p.npi?.toLowerCase().includes(searchLower) ||
        p.specialty?.toLowerCase().includes(searchLower) ||
        p.credential?.toLowerCase().includes(searchLower);
    });
    
    const matchesSearch = matchesPractice || matchesProvider;
    const matchesStatus = statusFilter === "All" || practice.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === "All Types" || practice.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => a.name.localeCompare(b.name));

  // Bulk select for practices
  const {
    selectedIds,
    isSelected,
    isAllSelected,
    isSomeSelected,
    selectedCount,
    toggleSelect,
    toggleSelectAll,
    clearSelection,
    getSelectedItems,
  } = useBulkSelect({
    items: filteredPractices,
    getItemId: (practice) => practice.id,
  });

  // Bulk actions
  const bulkActions = [
    bulkActionCreators.assignNetwork(() => setShowNetworkAssign(true)),
    bulkActionCreators.export(() => {
      const selected = getSelectedItems();
      console.log("Exporting:", selected);
      // Export logic here
    }),
    bulkActionCreators.delete(() => {
      const selected = getSelectedItems();
      if (confirm(`Delete ${selected.length} practice(s)?`)) {
        console.log("Deleting:", selected);
        clearSelection();
      }
    }),
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Active</span>;
      case "pending":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      case "inactive":
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full"><XCircle className="w-3 h-3" />Inactive</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>Practices & Providers</h1>
          <p className={cn("mt-1", isDark ? "text-slate-400" : "text-slate-500")}>Manage network practices and their affiliated providers</p>
        </div>
        <div className="flex gap-3">
          <button className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            isDark ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          )}>
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowCsvUpload(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
              isDark ? "bg-slate-700 text-white hover:bg-slate-600" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            )}
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button 
            onClick={() => setShowAddPractice(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-500 hover:to-teal-500 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Practice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              label="Total Practices"
              value={practices.length}
              icon={<Building2 className="w-5 h-5" />}
              delay={0}
            />
            <StatCard
              label="Total Providers"
              value={apiStats.total || providers.length}
              icon={<Users className="w-5 h-5" />}
              delay={1}
            />
            <StatCard
              label="Primary Care"
              value={apiStats.primaryCare || providers.filter(p => p.specialty?.includes('Family') || p.specialty?.includes('Internal')).length}
              icon={<CheckCircle className="w-5 h-5" />}
              delay={2}
            />
            <StatCard
              label="Accepting Patients"
              value={apiStats.acceptingNew || providers.filter(p => p.acceptingNewPatients).length}
              icon={<User className="w-5 h-5" />}
              delay={3}
            />
          </>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5", isDark ? "text-slate-400" : "text-slate-500")} />
          <input
            type="text"
            placeholder="Search practices or providers by name, NPI, specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500",
              isDark 
                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400" 
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"
            )}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={cn(
            "px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500",
            isDark 
              ? "bg-slate-800 border-slate-700 text-white" 
              : "bg-white border-slate-200 text-slate-900"
          )}
        >
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className={cn(
            "px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500",
            isDark 
              ? "bg-slate-800 border-slate-700 text-white" 
              : "bg-white border-slate-200 text-slate-900"
          )}
        >
          {typeOptions.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Practices Table */}
      <div className={cn(
        "rounded-xl border overflow-hidden",
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200 shadow-sm"
      )}>
        {isLoading ? (
          <table className="w-full">
            <thead className={isDark ? "bg-slate-900/50" : "bg-slate-50"}>
              <tr>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Practice</th>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Type</th>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Location</th>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Providers</th>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Contract</th>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Status</th>
                <th className={cn("text-right px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-slate-700" : "divide-slate-200")}>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} columns={7} />
              ))}
            </tbody>
          </table>
        ) : filteredPractices.length === 0 ? (
          searchQuery ? (
            <NoSearchResults query={searchQuery} onClear={() => setSearchQuery("")} />
          ) : (
            <EmptyState
              icon={<Building2 className="w-8 h-8" />}
              title="No practices yet"
              description="Get started by adding your first practice to the network."
              action={{
                label: "Add Practice",
                onClick: () => setShowAddPractice(true),
              }}
            />
          )
        ) : (
          <table className="w-full">
            <thead className={isDark ? "bg-slate-900/50" : "bg-slate-50"}>
              <tr>
                <th className="w-10 px-4 py-4">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => { if (el) el.indeterminate = isSomeSelected; }}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Practice</th>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Type</th>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Location</th>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Providers</th>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Contract</th>
                <th className={cn("text-left px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Status</th>
                <th className={cn("text-right px-6 py-4 text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-slate-700" : "divide-slate-200")}>
              {filteredPractices.map(practice => {
                const practiceProviders = getProvidersForPractice(practice.id);
                const selected = isSelected(practice.id);
                return (
                <tr 
                  key={practice.id} 
                  className={cn(
                    "transition-colors",
                    selected 
                      ? (isDark ? "bg-blue-900/20" : "bg-blue-50") 
                      : (isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50")
                  )}
                >
                  <td className="w-10 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleSelect(practice.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/providers/${practice.id}`} className="flex items-center gap-3 group">
                      <div className={cn(
                        "p-2 rounded-lg",
                        isDark ? "bg-blue-500/20" : "bg-blue-50"
                      )}>
                        <Building2 className={cn("w-5 h-5", isDark ? "text-blue-400" : "text-blue-600")} />
                      </div>
                      <div>
                        <p className={cn("font-medium group-hover:text-blue-500 transition-colors", isDark ? "text-white" : "text-slate-900")}>{practice.name}</p>
                        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{practice.specialty}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      isDark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"
                    )}>{practice.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className={isDark ? "text-slate-300" : "text-slate-600"}>{practice.city}, {practice.state}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Users className={cn("w-4 h-4", isDark ? "text-blue-400" : "text-blue-600")} />
                      <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{practice.providerCount || 0}</span>
                      <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>providers</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={isDark ? "text-slate-300" : "text-slate-600"}>{practice.discountType}</p>
                    <p className={cn("text-sm", isDark ? "text-blue-400" : "text-blue-600")}>{practice.discountRate}</p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(practice.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/providers/${practice.id}`}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm",
                          isDark 
                            ? "text-slate-300 bg-slate-700 hover:bg-slate-600" 
                            : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                        )}
                        title="View Practice Details"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Link>
                      <Link
                        href={`/admin/providers/${practice.id}?edit=true`}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm",
                          isDark 
                            ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20" 
                            : "text-blue-600 bg-blue-50 hover:bg-blue-100"
                        )}
                        title="Edit Practice"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        )}
      </div>

      {/* Bulk Actions Bar */}
      <BulkActionBar
        selectedCount={selectedCount}
        itemLabel="practice"
        actions={bulkActions}
        onClear={clearSelection}
      />

      {/* Network Assignment Modal */}
      <AnimatePresence>
        {showNetworkAssign && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowNetworkAssign(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto border",
                isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn("p-6 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                <div className="flex items-center justify-between">
                  <h2 className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>Assign to Network</h2>
                  <button onClick={() => setShowNetworkAssign(false)} className={isDark ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <p className={cn("mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                  Assign {selectedCount} practice(s) to a network
                </p>
              </div>
              <div className="p-6 space-y-4">
                {networks.map(network => (
                  <button
                    key={network.id}
                    onClick={() => {
                      console.log("Assigning to network:", network.id, getSelectedItems());
                      setShowNetworkAssign(false);
                      clearSelection();
                    }}
                    className={cn(
                      "w-full p-4 rounded-lg border text-left transition-colors",
                      isDark 
                        ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700" 
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{network.name}</p>
                        <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{network.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className={cn("w-4 h-4", isDark ? "text-blue-400" : "text-blue-600")} />
                        <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{network.providerCount} providers</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Practice Detail Modal */}
      <AnimatePresence>
        {selectedPractice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setSelectedPractice(null); setSelectedProvider(null); setIsEditingPractice(false); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-700 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedPractice.name}</h2>
                  <p className="text-slate-400">{selectedPractice.specialty} • {selectedPractice.type}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedPractice.status)}
                  <button onClick={() => { setSelectedPractice(null); setSelectedProvider(null); setIsEditingPractice(false); }} className="text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-4 flex gap-2 border-b border-slate-700 overflow-x-auto">
                {[
                  { id: "info", label: "Practice Info", icon: Building2 },
                  { id: "providers", label: `Providers (${getProvidersForPractice(selectedPractice.id).length})`, icon: Users },
                  { id: "billing", label: "Billing", icon: DollarSign },
                  { id: "payto", label: "Pay-To Info", icon: CreditCard },
                  { id: "contract", label: "Contract", icon: FileText },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-400 border-blue-400"
                        : "text-slate-400 border-transparent hover:text-white"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "info" && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Location */}
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        Location Address
                      </h3>
                      <p className="text-slate-300">{selectedPractice.address}</p>
                      {selectedPractice.address2 && <p className="text-slate-300">{selectedPractice.address2}</p>}
                      <p className="text-slate-300">{selectedPractice.city}, {selectedPractice.county} County</p>
                      <p className="text-slate-300">{selectedPractice.state} {selectedPractice.zip}</p>
                      <p className="text-slate-400">{selectedPractice.country}</p>
                    </div>

                    {/* Main Office Contact */}
                    <div className="bg-slate-700/30 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-blue-400" />
                        Main Office
                      </h3>
                      <p className="text-slate-300">{selectedPractice.contactName}</p>
                      <p className="text-slate-300">Phone: {selectedPractice.phone}</p>
                      <p className="text-slate-300">Fax: {selectedPractice.fax}</p>
                      <p className="text-blue-400">{selectedPractice.email}</p>
                    </div>
                  </div>
                )}

                {activeTab === "billing" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Billing Department Contact */}
                      <div className="bg-slate-700/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Phone className="w-5 h-5 text-blue-400" />
                          Billing Department Contact
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Billing Phone</p>
                            <p className="text-lg text-white">{selectedPractice.billingPhone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Billing Fax</p>
                            <p className="text-lg text-white">{selectedPractice.billingFax}</p>
                          </div>
                        </div>
                      </div>

                      {/* Correspondence for Billing */}
                      <div className="bg-slate-700/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Mail className="w-5 h-5 text-blue-400" />
                          Billing Correspondence
                        </h3>
                        <div className="space-y-2">
                          <p className="text-slate-300">{selectedPractice.correspondenceAddress}</p>
                          {selectedPractice.correspondenceAddress2 && <p className="text-slate-300">{selectedPractice.correspondenceAddress2}</p>}
                          <p className="text-slate-300">{selectedPractice.correspondenceCity}, {selectedPractice.correspondenceState} {selectedPractice.correspondenceZip}</p>
                          <p className="text-slate-400">{selectedPractice.correspondenceCountry}</p>
                          <p className="text-slate-300 mt-2">Fax: {selectedPractice.correspondenceFax}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <p className="text-sm text-amber-300">
                        <strong>Note:</strong> For payment remittance details, see the Pay-To Info tab.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "providers" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">Affiliated Providers ({getProvidersForPractice(selectedPractice.id).length})</h3>
                      <button
                        onClick={() => setShowAddProvider(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors text-sm font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Add Provider
                      </button>
                    </div>

                    {/* Provider Cards - More Readable Layout */}
                    <div className="space-y-3">
                      {getProvidersForPractice(selectedPractice.id).map(provider => (
                        <div key={provider.id} className="bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors border border-slate-600/50 hover:border-blue-500/50">
                          <div className="flex items-start justify-between">
                            {/* Provider Info */}
                            <Link href={`/admin/providers/${selectedPractice.id}/${provider.id}`} className="flex items-start gap-4 group flex-1">
                              <div className={`p-3 rounded-xl ${provider.gender === "Female" ? "bg-pink-500/20" : "bg-blue-500/20"}`}>
                                <User className={`w-6 h-6 ${provider.gender === "Female" ? "text-pink-400" : "text-blue-400"}`} />
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <h4 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">{provider.name}, {provider.credential}</h4>
                                  <p className="text-slate-400">{provider.specialty}</p>
                                </div>
                                
                                {/* Key Details Row */}
                                <div className="flex flex-wrap gap-4 text-sm">
                                  <div>
                                    <span className="text-slate-500">NPI:</span>
                                    <span className="ml-1 text-white font-mono">{provider.npi}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">License:</span>
                                    <span className="ml-1 text-white">{provider.licenseState} {provider.licenseNumber}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Gender:</span>
                                    <span className="ml-1 text-white">{provider.gender || "N/A"}</span>
                                  </div>
                                </div>

                                {/* Taxonomy Codes */}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Primary:</span>
                                    <span className="text-xs font-mono text-blue-400">{provider.primaryTaxonomy}</span>
                                    <span className="text-xs text-blue-400">— {provider.primaryTaxonomyDesc}</span>
                                  </div>
                                  {provider.secondaryTaxonomy && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-slate-500">Secondary:</span>
                                      <span className="text-xs font-mono text-purple-400">{provider.secondaryTaxonomy}</span>
                                      <span className="text-xs text-purple-300">— {provider.secondaryTaxonomyDesc}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Languages */}
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">Languages:</span>
                                  <div className="flex flex-wrap gap-1">
                                    {provider.languages.map(lang => (
                                      <span key={lang} className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-xs rounded-full" style={{ color: 'white' }}>
                                        {languageNames[lang] || lang}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Link>

                            {/* Right Side - Status & Actions */}
                            <div className="flex flex-col items-end gap-3">
                              {/* Accepting Patients Badge */}
                              {provider.acceptingNewPatients ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">
                                  <CheckCircle className="w-4 h-4" />
                                  Accepting Patients
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-500/20 text-red-400 text-sm font-medium rounded-full">
                                  <XCircle className="w-4 h-4" />
                                  Not Accepting
                                </span>
                              )}

                              {/* Action Buttons */}
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => { setSelectedProvider(provider); setIsEditingProvider(false); }}
                                  className="flex items-center gap-2 px-3 py-2 bg-slate-600 text-white text-sm font-medium rounded-lg hover:bg-slate-500 transition-colors"
                                  title="View Provider Details"
                                >
                                  <Eye className="w-4 h-4" />
                                  View
                                </button>
                                <button
                                  onClick={() => { setSelectedProvider(provider); setIsEditingProvider(true); }}
                                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 transition-colors"
                                  title="Edit Provider"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {getProvidersForPractice(selectedPractice.id).length === 0 && (
                      <div className="text-center py-12 bg-slate-700/20 rounded-xl border border-slate-600/50">
                        <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-400 font-medium">No providers added yet</p>
                        <p className="text-slate-500 text-sm mt-1">Click "Add Provider" to add clinicians to this practice</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "payto" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-slate-700/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-blue-400" />
                          Pay-To Entity
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Pay-To Name</p>
                            <p className="text-lg text-white">{selectedPractice.payToName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Pay-To NPI</p>
                            <p className="text-lg text-white font-mono">{selectedPractice.payToNpi}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Pay-To Tax ID / EIN</p>
                            <p className="text-lg text-white font-mono">{selectedPractice.payToTaxId}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-700/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-400" />
                          Pay-To Address
                        </h3>
                        <div className="space-y-2">
                          <p className="text-lg text-white font-medium">{selectedPractice.payToName}</p>
                          <p className="text-lg text-blue-300">{selectedPractice.payToAddress}</p>
                          {selectedPractice.payToAddress2 && <p className="text-lg text-blue-300">{selectedPractice.payToAddress2}</p>}
                          <p className="text-lg text-blue-300">{selectedPractice.payToCity}, {selectedPractice.payToState} {selectedPractice.payToZip}</p>
                          <p className="text-blue-400">{selectedPractice.payToCountry}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                      <p className="text-sm text-amber-300">
                        <strong>Note:</strong> All providers affiliated with this practice inherit these Pay-To settings. Payments will be sent to the entity listed above.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "contract" && (
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-slate-700/30 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-400" />
                          Contract Terms
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Contract Period</p>
                            <p className="text-white">{selectedPractice.contractStart} to {selectedPractice.contractEnd}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Discount Type</p>
                            <p className="text-white">{selectedPractice.discountType}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Discount Rate</p>
                            <p className="text-2xl font-bold text-blue-400">{selectedPractice.discountRate}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Practice Modal */}
      <AnimatePresence>
        {showAddPractice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAddPractice(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Add New Practice</h2>
                <p className="text-slate-400 mt-1">Create a practice first, then add individual providers to it</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Basic Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Practice Name *"
                      value={newPractice.name || ""}
                      onChange={(e) => setNewPractice({...newPractice, name: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <select
                      value={newPractice.type || "Group Practice"}
                      onChange={(e) => setNewPractice({...newPractice, type: e.target.value as Practice["type"]})}
                      className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Group Practice">Group Practice</option>
                      <option value="Facility">Facility</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Primary Specialty *"
                    value={newPractice.specialty || ""}
                    onChange={(e) => setNewPractice({...newPractice, specialty: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Location</h3>
                  <input
                    type="text"
                    placeholder="Street Address *"
                    value={newPractice.address || ""}
                    onChange={(e) => setNewPractice({...newPractice, address: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-5 gap-2">
                    <input type="text" placeholder="City *" value={newPractice.city || ""} onChange={(e) => setNewPractice({...newPractice, city: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="County" value={newPractice.county || ""} onChange={(e) => setNewPractice({...newPractice, county: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="State *" value={newPractice.state || ""} onChange={(e) => setNewPractice({...newPractice, state: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Postal Code *" value={newPractice.zip || ""} onChange={(e) => setNewPractice({...newPractice, zip: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Country" value={newPractice.country || "USA"} onChange={(e) => setNewPractice({...newPractice, country: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* Correspondence Address */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Correspondence Address</h3>
                  <input
                    type="text"
                    placeholder="Correspondence Street Address"
                    value={newPractice.correspondenceAddress || ""}
                    onChange={(e) => setNewPractice({...newPractice, correspondenceAddress: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <input type="text" placeholder="City" value={newPractice.correspondenceCity || ""} onChange={(e) => setNewPractice({...newPractice, correspondenceCity: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="State" value={newPractice.correspondenceState || ""} onChange={(e) => setNewPractice({...newPractice, correspondenceState: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Postal Code" value={newPractice.correspondenceZip || ""} onChange={(e) => setNewPractice({...newPractice, correspondenceZip: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Country" value={newPractice.correspondenceCountry || "USA"} onChange={(e) => setNewPractice({...newPractice, correspondenceCountry: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <input type="tel" placeholder="Correspondence Fax" value={newPractice.correspondenceFax || ""} onChange={(e) => setNewPractice({...newPractice, correspondenceFax: e.target.value})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                {/* Main Office Contact */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Main Office Contact</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Contact Name *" value={newPractice.contactName || ""} onChange={(e) => setNewPractice({...newPractice, contactName: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="email" placeholder="Email *" value={newPractice.email || ""} onChange={(e) => setNewPractice({...newPractice, email: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="tel" placeholder="Main Office Phone *" value={newPractice.phone || ""} onChange={(e) => setNewPractice({...newPractice, phone: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="tel" placeholder="Main Office Fax" value={newPractice.fax || ""} onChange={(e) => setNewPractice({...newPractice, fax: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* Billing Department */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Billing Department</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="tel" placeholder="Billing Phone *" value={newPractice.billingPhone || ""} onChange={(e) => setNewPractice({...newPractice, billingPhone: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="tel" placeholder="Billing Fax" value={newPractice.billingFax || ""} onChange={(e) => setNewPractice({...newPractice, billingFax: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* Pay-To */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Pay-To Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Pay-To Name *" value={newPractice.payToName || ""} onChange={(e) => setNewPractice({...newPractice, payToName: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Pay-To NPI *" value={newPractice.payToNpi || ""} onChange={(e) => setNewPractice({...newPractice, payToNpi: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                  </div>
                  <input type="text" placeholder="Pay-To Tax ID / EIN *" value={newPractice.payToTaxId || ""} onChange={(e) => setNewPractice({...newPractice, payToTaxId: e.target.value})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                  <input type="text" placeholder="Pay-To Address *" value={newPractice.payToAddress || ""} onChange={(e) => setNewPractice({...newPractice, payToAddress: e.target.value})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="grid grid-cols-4 gap-2">
                    <input type="text" placeholder="City *" value={newPractice.payToCity || ""} onChange={(e) => setNewPractice({...newPractice, payToCity: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="State *" value={newPractice.payToState || ""} onChange={(e) => setNewPractice({...newPractice, payToState: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Postal Code *" value={newPractice.payToZip || ""} onChange={(e) => setNewPractice({...newPractice, payToZip: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="Country" value={newPractice.payToCountry || "USA"} onChange={(e) => setNewPractice({...newPractice, payToCountry: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* Contract */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Contract Terms</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Contract Start *</label>
                      <input type="date" value={newPractice.contractStart || ""} onChange={(e) => setNewPractice({...newPractice, contractStart: e.target.value})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Contract End *</label>
                      <input type="date" value={newPractice.contractEnd || ""} onChange={(e) => setNewPractice({...newPractice, contractEnd: e.target.value})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <select value={newPractice.discountType || ""} onChange={(e) => setNewPractice({...newPractice, discountType: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Discount Type *</option>
                      <option value="% Off Billed">% Off Billed</option>
                      <option value="% of Medicare">% of Medicare</option>
                      <option value="Case Rate">Case Rate</option>
                      <option value="Per Diem">Per Diem</option>
                      <option value="Fee Schedule">Fee Schedule</option>
                    </select>
                    <input type="text" placeholder="Discount Rate (e.g. 35%)" value={newPractice.discountRate || ""} onChange={(e) => setNewPractice({...newPractice, discountRate: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button onClick={() => setShowAddPractice(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-500 hover:to-teal-500 transition-colors">
                  <Save className="w-4 h-4" />
                  Create Practice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Provider Modal */}
      <AnimatePresence>
        {showAddProvider && selectedPractice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => setShowAddProvider(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white">Add Provider to Practice</h2>
                <p className="text-slate-400 mt-1">Adding provider to: <span className="text-blue-400">{selectedPractice.name}</span></p>
              </div>

              <div className="p-6 space-y-6">
                {/* Provider Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Provider Information</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Full Name *" value={newProvider.name || ""} onChange={(e) => setNewProvider({...newProvider, name: e.target.value})} className="col-span-2 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <select value={newProvider.credential || "MD"} onChange={(e) => setNewProvider({...newProvider, credential: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="MD">MD</option>
                      <option value="DO">DO</option>
                      <option value="NP">NP</option>
                      <option value="PA">PA</option>
                      <option value="DPM">DPM</option>
                      <option value="DC">DC</option>
                      <option value="PT">PT</option>
                      <option value="OT">OT</option>
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="NPI *" value={newProvider.npi || ""} onChange={(e) => setNewProvider({...newProvider, npi: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                    <select value={newProvider.gender || ""} onChange={(e) => setNewProvider({...newProvider, gender: e.target.value as Provider["gender"]})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                {/* Specialty & Taxonomy */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Specialty & Taxonomy</h3>
                  <input type="text" placeholder="Specialty *" value={newProvider.specialty || ""} onChange={(e) => setNewProvider({...newProvider, specialty: e.target.value})} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Primary Taxonomy Code *" value={newProvider.primaryTaxonomy || ""} onChange={(e) => setNewProvider({...newProvider, primaryTaxonomy: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                    <input type="text" placeholder="Primary Taxonomy Description" value={newProvider.primaryTaxonomyDesc || ""} onChange={(e) => setNewProvider({...newProvider, primaryTaxonomyDesc: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Secondary Taxonomy Code" value={newProvider.secondaryTaxonomy || ""} onChange={(e) => setNewProvider({...newProvider, secondaryTaxonomy: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                    <input type="text" placeholder="Secondary Taxonomy Description" value={newProvider.secondaryTaxonomyDesc || ""} onChange={(e) => setNewProvider({...newProvider, secondaryTaxonomyDesc: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* License */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">License Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input type="text" placeholder="License State * (e.g. OH)" value={newProvider.licenseState || ""} onChange={(e) => setNewProvider({...newProvider, licenseState: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="text" placeholder="License Number *" value={newProvider.licenseNumber || ""} onChange={(e) => setNewProvider({...newProvider, licenseNumber: e.target.value})} className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                  </div>
                </div>

                {/* Clinic Hours */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Clinic Hours</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(day => (
                      <div key={day} className="flex items-center gap-2">
                        <span className="text-slate-400 text-sm w-12 capitalize">{day.slice(0, 3)}</span>
                        <input
                          type="text"
                          placeholder="e.g. 8:00 AM - 5:00 PM"
                          value={(newProvider.clinicHours as any)?.[day] || ""}
                          onChange={(e) => setNewProvider({
                            ...newProvider,
                            clinicHours: { ...(newProvider.clinicHours as any), [day]: e.target.value }
                          })}
                          className="flex-1 px-2 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-white">Languages Spoken (ISO 639-3 codes)</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(languageNames).map(([code, name]) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          const langs = newProvider.languages || [];
                          if (langs.includes(code)) {
                            setNewProvider({...newProvider, languages: langs.filter(l => l !== code)});
                          } else {
                            setNewProvider({...newProvider, languages: [...langs, code]});
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          (newProvider.languages || []).includes(code)
                            ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                            : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600"
                        }`}
                      >
                        {name} ({code.toUpperCase()})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accepting Patients */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNewProvider({...newProvider, acceptingNewPatients: !newProvider.acceptingNewPatients})}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                      newProvider.acceptingNewPatients
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {newProvider.acceptingNewPatients ? (
                      <><CheckCircle className="w-4 h-4" />Accepting New Patients</>
                    ) : (
                      <><XCircle className="w-4 h-4" />Not Accepting New Patients</>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button onClick={() => setShowAddProvider(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:from-teal-500 hover:to-blue-500 transition-colors">
                  <Save className="w-4 h-4" />
                  Add Provider
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CSV Upload Modal */}
      <AnimatePresence>
        {showCsvUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowCsvUpload(false); setCsvData([]); setCsvErrors([]); }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-blue-400" />
                  Import Providers from CSV
                </h2>
                <p className="text-slate-400 mt-1">Upload a CSV file to bulk import providers</p>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Upload Area */}
                {csvData.length === 0 && (
                  <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
                    <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">Drop CSV file here or click to browse</p>
                    <p className="text-slate-400 text-sm mb-4">Supports .csv files with provider data</p>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCsvUpload}
                      className="hidden"
                      id="csv-upload"
                    />
                    <label
                      htmlFor="csv-upload"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Select CSV File
                    </label>
                  </div>
                )}

                {/* CSV Template Info */}
                {csvData.length === 0 && (
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-white">CSV Template</h3>
                      <button
                        onClick={() => {
                          const headers = [
                            'Entity #', 'Contract #', 'NPI', 'First Name', 'Last Name', 'Mid Init', 'Suffix',
                            'Address1', 'Address 2', 'City', 'State', 'Zip Code', 'County', 'Gender',
                            'Primary Spc Code', 'Primary Taxonomy Code', 'Secondary Spc Code', 'Secondary Taxonomy Code',
                            'Facility Type', 'Phone #', 'Fax', 'Email', 'Language',
                            'Accepts New Patients', 'Primary Care Flag', 'Behavioral Health Flag', 'Directory Display',
                            'Monday Hours', 'Tuesday Hours', 'Wednesday Hours', 'Thursday Hours', 'Friday Hours', 'Saturday Hours', 'Sunday Hours',
                            'Pricing Tier', 'Network Org', 'Start Date', 'End Date',
                            'Corresponding Addr 1', 'Corresponding Addr 2', 'Corresponding City', 'Corresponding State', 'Corresponding Zip',
                            'Contact Name', 'Corresponding Fax',
                            'Billing NPI', 'Billing Tax ID', 'Billing Name', 'Billing Addr 1', 'Billing Addr 2',
                            'Billing City', 'Billing State', 'Billing Zip', 'Billing Phone', 'Billing Fax'
                          ];
                          const csv = headers.join(',') + '\n';
                          const blob = new Blob([csv], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'provider-import-template.csv';
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download Template
                      </button>
                    </div>
                    
                    {/* Column sections */}
                    <div className="space-y-3 text-sm">
                      {/* Identity */}
                      <div>
                        <p className="text-slate-300 font-medium mb-1">Identity</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <span className="text-slate-400">Entity #</span>
                          <span className="text-slate-400">Contract #</span>
                          <span className="text-blue-400 font-medium">NPI *</span>
                          <span className="text-blue-400 font-medium">First Name *</span>
                          <span className="text-blue-400 font-medium">Last Name *</span>
                          <span className="text-slate-400">Mid Init</span>
                          <span className="text-slate-400">Suffix</span>
                        </div>
                      </div>
                      
                      {/* Location */}
                      <div>
                        <p className="text-slate-300 font-medium mb-1">Location</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <span className="text-slate-400">Address1</span>
                          <span className="text-slate-400">Address 2</span>
                          <span className="text-slate-400">City</span>
                          <span className="text-slate-400">State</span>
                          <span className="text-slate-400">Zip Code</span>
                          <span className="text-slate-400">County</span>
                        </div>
                      </div>
                      
                      {/* Specialty */}
                      <div>
                        <p className="text-slate-300 font-medium mb-1">Specialty & Contact</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <span className="text-slate-400">Gender</span>
                          <span className="text-slate-400">Primary Spc Code</span>
                          <span className="text-slate-400">Primary Taxonomy Code</span>
                          <span className="text-slate-400">Secondary Spc Code</span>
                          <span className="text-slate-400">Facility Type</span>
                          <span className="text-slate-400">Phone #</span>
                          <span className="text-slate-400">Fax</span>
                          <span className="text-slate-400">Email</span>
                          <span className="text-slate-400">Language</span>
                        </div>
                      </div>
                      
                      {/* Flags */}
                      <div>
                        <p className="text-slate-300 font-medium mb-1">Flags, Hours & Contract</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <span className="text-slate-400">Accepts New Patients</span>
                          <span className="text-slate-400">Primary Care Flag</span>
                          <span className="text-slate-400">Behavioral Health Flag</span>
                          <span className="text-slate-400">Directory Display</span>
                          <span className="text-slate-400">Mon-Sun Hours</span>
                          <span className="text-slate-400">Pricing Tier</span>
                          <span className="text-slate-400">Network Org</span>
                          <span className="text-slate-400">Start/End Date</span>
                        </div>
                      </div>
                      
                      {/* Billing */}
                      <div>
                        <p className="text-slate-300 font-medium mb-1">Correspondence & Billing</p>
                        <div className="flex flex-wrap gap-x-3 gap-y-1">
                          <span className="text-slate-400">Corresponding Address</span>
                          <span className="text-slate-400">Contact Name</span>
                          <span className="text-slate-400">Billing NPI/TaxID/Name/Address</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">* Required fields. Download template for full column list with 52 fields.</p>
                  </div>
                )}

                {/* Errors */}
                {csvErrors.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Import Warnings ({csvErrors.length})
                    </h3>
                    <div className="max-h-32 overflow-auto text-sm text-red-300 space-y-1">
                      {csvErrors.map((err, i) => (
                        <p key={i}>{err}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Preview Table */}
                {csvData.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-white mb-3">Preview ({csvData.length} providers)</h3>
                    <div className="bg-slate-700/30 rounded-lg overflow-hidden max-h-96 overflow-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-900/50 sticky top-0">
                          <tr>
                            <th className="text-left px-3 py-2 text-slate-400">Name</th>
                            <th className="text-left px-3 py-2 text-slate-400">Credential</th>
                            <th className="text-left px-3 py-2 text-slate-400">NPI</th>
                            <th className="text-left px-3 py-2 text-slate-400">Specialty</th>
                            <th className="text-left px-3 py-2 text-slate-400">License</th>
                            <th className="text-left px-3 py-2 text-slate-400">Languages</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50">
                          {csvData.map((provider, i) => (
                            <tr key={i} className="hover:bg-slate-700/20">
                              <td className="px-3 py-2 text-white">{provider.name}</td>
                              <td className="px-3 py-2 text-slate-300">{provider.credential}</td>
                              <td className="px-3 py-2 text-slate-300 font-mono">{provider.npi}</td>
                              <td className="px-3 py-2 text-slate-300">{provider.specialty}</td>
                              <td className="px-3 py-2 text-slate-300">{provider.licenseState} {provider.licenseNumber}</td>
                              <td className="px-3 py-2 text-slate-300">{provider.languages?.join(', ')}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Practice Selection */}
                {csvData.length > 0 && (
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Assign to Practice</h3>
                    <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Select a practice...</option>
                      {practices.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="p-6 border-t border-slate-700 flex justify-between">
                <button 
                  onClick={() => { setCsvData([]); setCsvErrors([]); }}
                  className={`px-4 py-2 text-slate-400 hover:text-white transition-colors ${csvData.length === 0 ? 'invisible' : ''}`}
                >
                  Clear & Upload New
                </button>
                <div className="flex gap-3">
                  <button onClick={() => { setShowCsvUpload(false); setCsvData([]); setCsvErrors([]); }} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                  <button 
                    disabled={csvData.length === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      csvData.length > 0 
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-500 hover:to-teal-500' 
                        : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    Import {csvData.length} Providers
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Provider Detail Modal - Enhanced with Tabs */}
      <AnimatePresence>
        {selectedProvider && (() => {
          const providerPractice = practices.find(p => p.id === selectedProvider.practiceId);
          return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" onClick={() => { setSelectedProvider(null); setIsEditingProvider(false); }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-800 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-auto border border-slate-700"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${selectedProvider.gender === "Female" ? "bg-pink-500/20" : "bg-blue-500/20"}`}>
                      <User className={`w-8 h-8 ${selectedProvider.gender === "Female" ? "text-pink-400" : "text-blue-400"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-white">{selectedProvider.name}, {selectedProvider.credential}</h2>
                        {isEditingProvider && (
                          <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                            Editing
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400">{selectedProvider.specialty}</p>
                      {providerPractice && (
                        <p className="text-blue-400 text-sm mt-1 flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {providerPractice.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {selectedProvider.acceptingNewPatients ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 text-sm rounded-full">
                        <CheckCircle className="w-4 h-4" />Accepting Patients
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 text-sm rounded-full">
                        <XCircle className="w-4 h-4" />Not Accepting
                      </span>
                    )}
                    <button onClick={() => { setSelectedProvider(null); setIsEditingProvider(false); }} className="text-slate-400 hover:text-white">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Provider Detail Tabs */}
                <ProviderDetailTabs 
                  provider={selectedProvider} 
                  practice={providerPractice}
                  isEditing={isEditingProvider}
                  setIsEditing={setIsEditingProvider}
                />

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                  <button onClick={() => { setSelectedProvider(null); setIsEditingProvider(false); }} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Close</button>
                  {!isEditingProvider ? (
                    <button 
                      onClick={() => setIsEditingProvider(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Provider
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

// Separate component for Provider Detail Tabs to keep code organized
function ProviderDetailTabs({ provider, practice, isEditing, setIsEditing }: { 
  provider: Provider; 
  practice: Practice | undefined;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
}) {
  const [providerTab, setProviderTab] = useState<"overview" | "taxonomy" | "hours" | "location" | "billing">("overview");

  return (
    <>
      {/* Tab Navigation */}
      <div className="px-6 pt-4 flex gap-2 border-b border-slate-700 overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: User },
          { id: "taxonomy", label: "Taxonomy & License", icon: FileText },
          { id: "hours", label: "Office Hours", icon: Clock },
          { id: "location", label: "Location & Contact", icon: MapPin },
          { id: "billing", label: "Billing Info", icon: DollarSign },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setProviderTab(tab.id as typeof providerTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              providerTab === tab.id
                ? "text-blue-400 border-blue-400"
                : "text-slate-400 border-transparent hover:text-white"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {providerTab === "overview" && (
          <div className="space-y-6">
            {/* Basic Info Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-400" />
                  Provider Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Full Name</span>
                    <span className="text-white font-medium">{provider.name}, {provider.credential}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NPI</span>
                    <span className="text-white font-mono">{provider.npi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gender</span>
                    <span className="text-white">{provider.gender || "Not Specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Specialty</span>
                    <span className="text-white">{provider.specialty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Credential</span>
                    <span className="text-blue-400 font-medium">{provider.credential}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  License Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">License State</span>
                    <span className="text-white">{provider.licenseState}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">License Number</span>
                    <span className="text-white font-mono">{provider.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Accepting New Patients</span>
                    {provider.acceptingNewPatients ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                        <CheckCircle className="w-3 h-3" />Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                        <XCircle className="w-3 h-3" />No
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M21 12l-5 10-2-4-4-2 10-5z"/>
                </svg>
                Languages Spoken
              </h3>
              <div className="flex flex-wrap gap-2">
                {provider.languages.map(lang => (
                  <span key={lang} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full text-sm font-medium" style={{ color: 'white' }}>
                    {languageNames[lang] || lang} ({lang.toUpperCase()})
                  </span>
                ))}
              </div>
            </div>

            {/* Practice Info (linked) */}
            {practice && (
              <div className="bg-slate-700/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  Affiliated Practice
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{practice.name}</p>
                    <p className="text-slate-400 text-sm">{practice.specialty} • {practice.type}</p>
                    <p className="text-slate-500 text-sm">{practice.city}, {practice.state}</p>
                  </div>
                  {practice.status === "active" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                      <CheckCircle className="w-3 h-3" />Active Contract
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Taxonomy & License Tab */}
        {providerTab === "taxonomy" && (
          <div className="space-y-6">
            {/* Primary Taxonomy */}
            <div className="bg-slate-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Primary Taxonomy
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Taxonomy Code</p>
                  <p className="text-xl text-white font-mono">{provider.primaryTaxonomy || "Not Set"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Description</p>
                  <p className="text-lg text-blue-400">{provider.primaryTaxonomyDesc || "No description"}</p>
                </div>
              </div>
            </div>

            {/* Secondary Taxonomy */}
            <div className="bg-slate-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Secondary Taxonomy
              </h3>
              {provider.secondaryTaxonomy ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Taxonomy Code</p>
                    <p className="text-xl text-white font-mono">{provider.secondaryTaxonomy}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Description</p>
                    <p className="text-lg text-purple-400">{provider.secondaryTaxonomyDesc}</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 italic">No secondary taxonomy specified</p>
              )}
            </div>

            {/* License Details */}
            <div className="bg-slate-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                License Details
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1">License State</p>
                  <p className="text-xl text-white">{provider.licenseState}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">License Number</p>
                  <p className="text-xl text-white font-mono">{provider.licenseNumber}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Office Hours Tab */}
        {providerTab === "hours" && (
          <div className="space-y-6">
            <div className="bg-slate-700/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Clinic Hours
              </h3>
              <div className="space-y-3">
                {Object.entries(provider.clinicHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                    <span className="text-slate-300 capitalize font-medium">{day}</span>
                    <span className={`font-medium ${
                      hours === "Closed" || hours === "closed" 
                        ? "text-red-400" 
                        : hours.includes("Surgery") || hours.includes("Lab") || hours.includes("Cath")
                          ? "text-amber-400"
                          : "text-green-400"
                    }`}>
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
              <p className="text-sm text-amber-300">
                <strong>Note:</strong> Hours may vary. Contact the practice directly to confirm availability.
              </p>
            </div>
          </div>
        )}

        {/* Location & Contact Tab */}
        {providerTab === "location" && (
          <div className="space-y-6">
            {practice ? (
              <>
                {/* Practice Location */}
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    Practice Location
                  </h3>
                  <div className="space-y-2">
                    <p className="text-lg text-white font-medium">{practice.name}</p>
                    <p className="text-slate-300">{practice.address}</p>
                    <p className="text-slate-300">{practice.city}, {practice.county} County</p>
                    <p className="text-slate-300">{practice.state} {practice.zip}</p>
                    <p className="text-slate-400">{practice.country}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-blue-400" />
                      Main Office Contact
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Contact Name</p>
                        <p className="text-white">{practice.contactName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Phone</p>
                        <p className="text-blue-400 font-medium">{practice.phone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Fax</p>
                        <p className="text-white">{practice.fax}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Email</p>
                        <p className="text-blue-400">{practice.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-400" />
                      Correspondence Address
                    </h3>
                    <div className="space-y-2">
                      <p className="text-slate-300">{practice.correspondenceAddress}</p>
                      <p className="text-slate-300">{practice.correspondenceCity}, {practice.correspondenceState} {practice.correspondenceZip}</p>
                      <p className="text-slate-400">{practice.correspondenceCountry}</p>
                      <div className="pt-2">
                        <p className="text-xs text-slate-500 mb-1">Correspondence Fax</p>
                        <p className="text-white">{practice.correspondenceFax}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No practice linked to this provider</p>
              </div>
            )}
          </div>
        )}

        {/* Billing Info Tab */}
        {providerTab === "billing" && (
          <div className="space-y-6">
            {practice ? (
              <>
                {/* Billing Department */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-green-400" />
                      Billing Department
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Billing Phone</p>
                        <p className="text-xl text-white">{practice.billingPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Billing Fax</p>
                        <p className="text-xl text-white">{practice.billingFax}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-700/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-400" />
                      Pay-To Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Pay-To Name</p>
                        <p className="text-white font-medium">{practice.payToName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Pay-To NPI</p>
                        <p className="text-white font-mono">{practice.payToNpi}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Tax ID / EIN</p>
                        <p className="text-white font-mono">{practice.payToTaxId}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pay-To Address */}
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-400" />
                    Pay-To / Remittance Address
                  </h3>
                  <div className="space-y-2">
                    <p className="text-lg text-white font-medium">{practice.payToName}</p>
                    <p className="text-blue-400">{practice.payToAddress}</p>
                    <p className="text-blue-400">{practice.payToCity}, {practice.payToState} {practice.payToZip}</p>
                    <p className="text-blue-300">{practice.payToCountry}</p>
                  </div>
                </div>

                {/* Contract Info */}
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-400" />
                    Contract Terms
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Contract Period</p>
                      <p className="text-white">{practice.contractStart}</p>
                      <p className="text-slate-400 text-sm">to {practice.contractEnd}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Discount Type</p>
                      <p className="text-white">{practice.discountType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Discount Rate</p>
                      <p className="text-2xl text-blue-400 font-bold">{practice.discountRate}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-sm text-amber-300">
                    <strong>Note:</strong> Billing and Pay-To information is inherited from the practice. All providers at this practice share the same billing settings.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No practice linked to this provider</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
