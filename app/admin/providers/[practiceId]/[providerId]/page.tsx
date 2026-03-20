"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";
import { useAudit } from "@/lib/useAudit";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, User, MapPin, Phone, Mail, FileText, DollarSign, Edit, Save, X,
  CheckCircle, Clock, Briefcase, GraduationCap, Globe, Calendar, Stethoscope,
  CreditCard, Building2, Languages, Shield, Plus, Trash2, Upload, Download, Eye
} from "lucide-react";

// Provider data (in real app, this would come from API)
const providersData: Record<string, any> = {
  "PRV-001": {
    id: "PRV-001",
    practiceId: "PRC-001",
    practiceName: "Cleveland Family Medicine",
    contractNumber: "CF1001",
    referenceNumber: "", // Entity # from Solidarity
    isPrimaryCare: true,
    isBehavioralHealth: false,
    firstName: "Robert",
    lastName: "Smith",
    title: "MD",
    npi: "1111111111",
    gender: "Male",
    specialty: "Family Medicine",
    primaryTaxonomy: "207Q00000X",
    primaryTaxonomyDesc: "Family Medicine",
    secondaryTaxonomy: "",
    secondaryTaxonomyDesc: "",
    licenseState: "OH",
    licenseNumber: "MD-35-123456",
    licenseExpiration: "2026-12-31",
    deaNumber: "AS1234567",
    deaExpiration: "2025-06-30",
    acceptingNewPatients: true,
    languages: ["eng", "spa"],
    boardCertified: true,
    boardCertification: "American Board of Family Medicine",
    medicalSchool: "Ohio State University College of Medicine",
    graduationYear: "2010",
    residency: "Cleveland Clinic - Family Medicine",
    // Malpractice Insurance
    malpracticeCarrier: "Medical Protective Company",
    malpracticePolicyNumber: "MPR-2024-123456",
    malpracticeExpiration: "2026-06-30",
    malpracticeCoverage: "$1M / $3M",
    // Hospital Affiliations
    hospitalAffiliations: [
      { name: "Cleveland Clinic Main Campus", privileges: "Active", department: "Family Medicine" },
      { name: "University Hospitals Cleveland", privileges: "Courtesy", department: "Primary Care" },
    ],
    // Office Location (if different from practice)
    officeAddress: "123 Medical Center Dr",
    officeAddress2: "Suite 205",
    officeCity: "Cleveland",
    officeState: "OH",
    officeZip: "44101",
    officePhone: "(555) 123-4567",
    officeFax: "(555) 123-4568",
    networks: ["NET-001", "NET-001"],
    clinicHours: {
      monday: "8:00 AM - 5:00 PM",
      tuesday: "8:00 AM - 5:00 PM",
      wednesday: "8:00 AM - 5:00 PM",
      thursday: "8:00 AM - 5:00 PM",
      friday: "8:00 AM - 3:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    status: "active",
    pricingTier: 1,
    // Individual rates (can override practice rates)
    useCustomRates: false,
    rateType: "flat",
    flatRate: "135",
    serviceRates: {
      professional: "140",
      inpatient: "125",
      outpatient: "130",
      urgentCare: "145",
      labServices: "110",
      imaging: "120",
      mentalHealth: "135",
      physicalTherapy: "130",
      dme: "100",
    },
  },
  "PRV-002": {
    id: "PRV-002",
    practiceId: "PRC-001",
    practiceName: "Cleveland Family Medicine",
    contractNumber: "CF1002",
    referenceNumber: "", // Entity # from Solidarity
    isPrimaryCare: true,
    isBehavioralHealth: false,
    firstName: "Jennifer",
    lastName: "Adams",
    title: "MD",
    npi: "1111111112",
    gender: "Female",
    specialty: "Family Medicine",
    primaryTaxonomy: "207Q00000X",
    primaryTaxonomyDesc: "Family Medicine",
    secondaryTaxonomy: "207QA0505X",
    secondaryTaxonomyDesc: "Adult Medicine",
    licenseState: "OH",
    licenseNumber: "MD-35-123457",
    licenseExpiration: "2027-03-15",
    deaNumber: "AJ2345678",
    deaExpiration: "2026-01-15",
    acceptingNewPatients: true,
    languages: ["eng", "spa"],
    boardCertified: true,
    boardCertification: "American Board of Family Medicine",
    medicalSchool: "Case Western Reserve University",
    graduationYear: "2012",
    residency: "University Hospitals - Family Medicine",
    // Malpractice Insurance
    malpracticeCarrier: "The Doctors Company",
    malpracticePolicyNumber: "TDC-2024-789012",
    malpracticeExpiration: "2026-09-15",
    malpracticeCoverage: "$1M / $3M",
    // Hospital Affiliations
    hospitalAffiliations: [
      { name: "University Hospitals Cleveland", privileges: "Active", department: "Family Medicine" },
      { name: "MetroHealth Medical Center", privileges: "Active", department: "Primary Care" },
    ],
    // Office Location
    officeAddress: "456 Health Plaza",
    officeAddress2: "Suite 310",
    officeCity: "Beachwood",
    officeState: "OH",
    officeZip: "44122",
    officePhone: "(555) 234-5678",
    officeFax: "(555) 234-5679",
    networks: ["NET-001", "NET-001", "NET-001"],
    clinicHours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "Closed",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "9:00 AM - 12:00 PM",
      sunday: "Closed",
    },
    status: "active",
    pricingTier: 2,
    useCustomRates: true,
    rateType: "custom",
    flatRate: "140",
    serviceRates: {
      professional: "145",
      inpatient: "130",
      outpatient: "135",
      urgentCare: "150",
      labServices: "115",
      imaging: "125",
      mentalHealth: "140",
      physicalTherapy: "135",
      dme: "105",
    },
  },
};

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
  jpn: "Japanese",
  tgl: "Tagalog",
  heb: "Hebrew",
};

const networkNames: Record<string, string> = {
  "NET-001": "Arizona Antidote",
};

const titleOptions = ["MD", "DO", "PhD", "NP", "PA", "DPM", "DC", "PT", "OT", "DDS", "DMD", "PharmD", "PsyD"];

const serviceCategories = [
  { key: "professional", label: "Professional Services" },
  { key: "inpatient", label: "Inpatient" },
  { key: "outpatient", label: "Outpatient" },
  { key: "urgentCare", label: "Urgent Care" },
  { key: "labServices", label: "Lab Services" },
  { key: "imaging", label: "Imaging" },
  { key: "mentalHealth", label: "Mental Health" },
  { key: "physicalTherapy", label: "Physical Therapy" },
  { key: "dme", label: "DME" },
];

export default function ProviderDetailPage() {
  const { isDark } = useTheme();
  const { logViewProvider, logUpdateProvider } = useAudit();
  const params = useParams();
  const practiceId = params.practiceId as string;
  const providerId = params.providerId as string;
  
  // Provider data state - load from API
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoggedView, setHasLoggedView] = useState(false);

  const [activeSection, setActiveSection] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Rates
  const [useCustomRates, setUseCustomRates] = useState(false);
  const [discountBasis, setDiscountBasis] = useState<"medicare" | "billed">("medicare");
  const [rateType, setRateType] = useState<"flat" | "custom" | "cpt">("flat");
  const [flatRate, setFlatRate] = useState("135");
  const [serviceRates, setServiceRates] = useState<Record<string, string>>({});
  const [cptRates, setCptRates] = useState<{ code: string; description: string; rate: string }[]>([
    { code: "99213", description: "Office visit, established patient, low complexity", rate: "145" },
    { code: "99214", description: "Office visit, established patient, moderate complexity", rate: "150" },
  ]);
  const cptFileInputRef = useRef<HTMLInputElement>(null);
  
  // Contract Pricing from imported CSV
  const [contractPricing, setContractPricing] = useState<{
    contractNumber: string;
    rateType: string;
    rateDescription: string;
    defaultRates: { pctMedicare: number; pctBilled: number };
    rateTypeIndicators: { type: string; rate: number; rateSource: string; pctMedicare: number; pctBilled: number }[];
    cptRates: { cptCode: string; pricedAmt: number; revenueCode: string | null }[];
    revenueCodes: string[];
    cptCount: number;
  } | null>(null);
  const [pricingLoading, setPricingLoading] = useState(false);

  // Load provider data from API
  React.useEffect(() => {
    async function loadProvider() {
      try {
        // Extract NPI from providerId (format: prov-XXXXXXXXXX or PRV-XXXXXXXXXX)
        const npi = providerId.replace(/^(prov-|PRV-)/i, '');
        
        // Fetch provider by NPI
        const res = await fetch(`/api/providers?search=${npi}&limit=1`);
        const data = await res.json();
        
        if (data.providers && data.providers.length > 0) {
          const p = data.providers[0];
          const providerData = {
            id: providerId,
            practiceId: practiceId,
            practiceName: p.billing?.name || '',
            contractNumber: p.contractNumber || '',
            referenceNumber: p.referenceNumber || '',
            isPrimaryCare: p.isPrimaryCare || false,
            isBehavioralHealth: p.isBehavioralHealth || false,
            firstName: p.firstName || '',
            lastName: p.lastName || '',
            middleInitial: p.middleInitial || '',
            title: p.credentials || p.credential || 'MD',
            npi: p.npi || npi,
            gender: p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : '',
            specialty: p.specialty || 'General Practice',
            specialtyCode: p.specialtyCode || '',
            primaryTaxonomy: p.taxonomyCode || '',
            primaryTaxonomyDesc: p.specialty || '',
            secondarySpecialtyCode: p.secondarySpecialtyCode || '',
            secondaryTaxonomy: p.secondaryTaxonomyCode || '',
            secondaryTaxonomyDesc: '',
            facilityType: p.facilityType || '',
            licenseState: p.locations?.[0]?.state || 'AZ',
            licenseNumber: '',
            licenseExpiration: '',
            deaNumber: '',
            deaExpiration: '',
            acceptingNewPatients: p.acceptingNewPatients || false,
            directoryDisplay: p.directoryDisplay || false,
            languages: p.languages || ['English'],
            boardCertified: false,
            boardCertification: '',
            medicalSchool: '',
            graduationYear: '',
            residency: '',
            malpracticeCarrier: '',
            malpracticePolicyNumber: '',
            malpracticeExpiration: '',
            malpracticeCoverage: '',
            hospitalAffiliations: [],
            // Primary location
            officeAddress: p.locations?.[0]?.address1 || '',
            officeAddress2: p.locations?.[0]?.address2 || '',
            officeCity: p.locations?.[0]?.city || '',
            officeState: p.locations?.[0]?.state || 'AZ',
            officeZip: p.locations?.[0]?.zip || '',
            officeCounty: p.locations?.[0]?.county || '',
            officePhone: p.locations?.[0]?.phone || '',
            officeFax: p.locations?.[0]?.fax || '',
            officeEmail: p.locations?.[0]?.email || '',
            // Contract info
            networkOrg: p.networkOrg || '',
            contractStartDate: p.contractStartDate || '',
            contractEndDate: p.contractEndDate || '',
            pricingTier: p.pricingTier || '',
            // Corresponding address
            correspondingAddress: p.correspondingAddress || {
              address1: '', address2: '', city: '', state: '', zip: '', fax: '', contactName: ''
            },
            // Billing info
            billing: p.billing || {
              npi: '', taxId: '', name: '', address1: '', address2: '', city: '', state: '', zip: '', phone: '', fax: ''
            },
            networks: ['arizona-antidote'],
            clinicHours: p.locations?.[0]?.hours || {
              monday: '',
              tuesday: '',
              wednesday: '',
              thursday: '',
              friday: '',
              saturday: '',
              sunday: '',
            },
            status: 'active',
            useCustomRates: false,
            rateType: 'flat',
            flatRate: '135',
            serviceRates: {
              professional: '140',
              inpatient: '125',
              outpatient: '130',
              urgentCare: '145',
              labServices: '110',
              imaging: '120',
              mentalHealth: '135',
              physicalTherapy: '130',
              dme: '100',
            },
            // Additional locations
            locations: p.locations || [],
          };
          setProvider(providerData);
          setEditData(providerData);
          setUseCustomRates(providerData.useCustomRates);
          setServiceRates(providerData.serviceRates);
        } else {
          // Fallback to mock data if not found
          setProvider(providersData["PRV-001"]);
          setEditData(providersData["PRV-001"]);
        }
      } catch (error) {
        console.error('Failed to load provider:', error);
        setProvider(providersData["PRV-001"]);
        setEditData(providersData["PRV-001"]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProvider();
  }, [providerId, practiceId]);

  // Log PHI access when provider is viewed
  React.useEffect(() => {
    if (provider && !hasLoggedView) {
      logViewProvider(provider.npi || providerId, `${provider.firstName} ${provider.lastName}, ${provider.title}`);
      setHasLoggedView(true);
    }
  }, [provider, hasLoggedView, logViewProvider, providerId]);

  // Load contract pricing when provider loads
  React.useEffect(() => {
    async function loadContractPricing() {
      if (!provider?.contractNumber) return;
      
      setPricingLoading(true);
      try {
        const res = await fetch(`/api/contract-pricing/${provider.contractNumber}`);
        if (res.ok) {
          const data = await res.json();
          setContractPricing(data);
          
          // Auto-enable custom rates if contract has any pricing
          const hasContractPricing = 
            (data.cptRates && data.cptRates.length > 0) ||
            (data.rateTypeIndicators && data.rateTypeIndicators.length > 0) ||
            data.defaultRates.pctMedicare > 0 ||
            data.defaultRates.pctBilled > 0;
          
          if (hasContractPricing) {
            setUseCustomRates(true);
          }
          
          // Map rate type indicators to service categories
          const newServiceRates: Record<string, string> = {
            professional: '',
            inpatient: '',
            outpatient: '',
            urgentCare: '',
            labServices: '',
            imaging: '',
            mentalHealth: '',
            physicalTherapy: '',
            dme: '',
          };
          
          // Map I, O, P indicators to service categories
          if (data.rateTypeIndicators && data.rateTypeIndicators.length > 0) {
            data.rateTypeIndicators.forEach((indicator: any) => {
              const rate = String(indicator.rate);
              if (indicator.type === 'I') {
                newServiceRates.inpatient = rate;
              } else if (indicator.type === 'O') {
                newServiceRates.outpatient = rate;
              } else if (indicator.type === 'P') {
                newServiceRates.professional = rate;
              } else if (indicator.type === 'DEFAULT') {
                // Apply default to professional if not already set
                if (!newServiceRates.professional) {
                  newServiceRates.professional = rate;
                }
              }
            });
            setRateType("custom");
            setServiceRates(newServiceRates);
          }
          
          // Auto-set rate type and values based on contract
          if (data.cptRates && data.cptRates.length > 0) {
            setRateType("cpt");
            // Map contract CPT rates to display format (these are actual CPT codes with fixed prices)
            setCptRates(data.cptRates.map((r: any) => ({
              code: r.cptCode,
              description: r.revenueCode ? `Revenue Code: ${r.revenueCode}` : '',
              rate: String(r.pricedAmt)
            })));
          } else if (data.defaultRates.pctMedicare > 0 && !data.rateTypeIndicators?.length) {
            setRateType("flat");
            setDiscountBasis("medicare");
            setFlatRate(String(data.defaultRates.pctMedicare));
          } else if (data.defaultRates.pctBilled > 0 && !data.rateTypeIndicators?.length) {
            setRateType("flat");
            setDiscountBasis("billed");
            setFlatRate(String(data.defaultRates.pctBilled));
          }
        }
      } catch (error) {
        console.error('Failed to load contract pricing:', error);
      } finally {
        setPricingLoading(false);
      }
    }
    
    loadContractPricing();
  }, [provider?.contractNumber]);

  // Handle CSV upload for CPT rates
  const handleCptCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(line => line.trim());
      
      // Skip header row if present
      const startIndex = lines[0].toLowerCase().includes("cpt") || 
                         lines[0].toLowerCase().includes("code") ? 1 : 0;
      
      const newRates: { code: string; description: string; rate: string }[] = [];
      
      for (let i = startIndex; i < lines.length; i++) {
        const parts = lines[i].split(",").map(p => p.trim().replace(/^"|"$/g, ""));
        if (parts.length >= 3) {
          newRates.push({
            code: parts[0],
            description: parts[1],
            rate: parts[2].replace("%", ""),
          });
        }
      }
      
      if (newRates.length > 0) {
        setCptRates([...cptRates, ...newRates]);
      }
    };
    reader.readAsText(file);
    
    // Reset input so same file can be uploaded again
    if (cptFileInputRef.current) {
      cptFileInputRef.current.value = "";
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare update payload
      const updateData = {
        firstName: editData.firstName,
        lastName: editData.lastName,
        middleInitial: editData.middleInitial,
        credentials: editData.title,
        npi: editData.npi,
        gender: editData.gender === 'Male' ? 'M' : editData.gender === 'Female' ? 'F' : '',
        specialty: editData.specialty,
        specialtyCode: editData.specialtyCode,
        secondarySpecialtyCode: editData.secondarySpecialtyCode,
        facilityType: editData.facilityType,
        taxonomyCode: editData.primaryTaxonomy,
        secondaryTaxonomyCode: editData.secondaryTaxonomy,
        acceptingNewPatients: editData.acceptingNewPatients,
        directoryDisplay: editData.directoryDisplay,
        isPrimaryCare: editData.isPrimaryCare,
        isBehavioralHealth: editData.isBehavioralHealth,
        pricingTier: editData.pricingTier,
        networkOrg: editData.networkOrg,
        contractNumber: editData.contractNumber,
        referenceNumber: editData.referenceNumber,
        contractStartDate: editData.contractStartDate,
        contractEndDate: editData.contractEndDate,
        languages: editData.languages,
        billing: editData.billing,
        correspondingAddress: editData.correspondingAddress,
        // Credentials
        licenseState: editData.licenseState,
        licenseNumber: editData.licenseNumber,
        licenseExpiration: editData.licenseExpiration,
        deaNumber: editData.deaNumber,
        deaExpiration: editData.deaExpiration,
        boardCertified: editData.boardCertified,
        boardCertification: editData.boardCertification,
        // Education
        medicalSchool: editData.medicalSchool,
        graduationYear: editData.graduationYear,
        residency: editData.residency,
        // Malpractice
        malpracticeCarrier: editData.malpracticeCarrier,
        malpracticePolicyNumber: editData.malpracticePolicyNumber,
        malpracticeExpiration: editData.malpracticeExpiration,
        malpracticeCoverage: editData.malpracticeCoverage,
        // Hospital affiliations
        hospitalAffiliations: editData.hospitalAffiliations,
      };

      // Call API to update provider
      const res = await fetch(`/api/providers/${provider.npi}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        throw new Error('Failed to update provider');
      }

      const result = await res.json();
      
      // Update local state with saved data
      setProvider({ ...provider, ...editData });
      setSaved(true);
      setIsEditing(false);
      
      // Log audit event
      logUpdateProvider(
        provider.npi || providerId,
        `${editData.firstName} ${editData.lastName}, ${editData.title}`,
        'profile data'
      );
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save provider:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: "overview", label: "Overview", icon: User },
    { id: "credentials", label: "Credentials & Licenses", icon: GraduationCap },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "malpractice", label: "Malpractice", icon: Shield },
    { id: "hospitals", label: "Hospital Affiliations", icon: Building2 },
    { id: "location", label: "Office Location", icon: MapPin },
    { id: "education", label: "Education", icon: Briefcase },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "rates", label: "Rates & Discounts", icon: DollarSign },
    { id: "networks", label: "Networks", icon: Globe },
  ];

  // Sample documents for this provider
  const providerDocuments = [
    { id: "doc-1", type: "license", name: "State Medical License", uploadedDate: "2024-01-15", expires: "2026-12-31", status: "current" },
    { id: "doc-2", type: "dea", name: "DEA Registration", uploadedDate: "2024-01-15", expires: "2025-06-30", status: "current" },
    { id: "doc-3", type: "board_cert", name: "Board Certification", uploadedDate: "2024-01-10", expires: null, status: "current" },
    { id: "doc-4", type: "malpractice_coi", name: "Malpractice Insurance COI", uploadedDate: "2024-03-01", expires: "2026-06-30", status: "current" },
    { id: "doc-5", type: "cv", name: "Curriculum Vitae", uploadedDate: "2024-01-10", expires: null, status: "current" },
    { id: "doc-6", type: "w9", name: "W-9 Form", uploadedDate: "2024-01-10", expires: null, status: "current" },
  ];

  const [viewingDocument, setViewingDocument] = useState<string | null>(null);

  const statusColors = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    inactive: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-700 rounded-lg animate-pulse" />
          <div className="w-14 h-14 bg-slate-700 rounded-full animate-pulse" />
          <div>
            <div className="h-8 w-64 bg-slate-700 rounded animate-pulse mb-2" />
            <div className="h-4 w-48 bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="h-96 bg-slate-800 rounded-xl animate-pulse" />
      </div>
    );
  }

  // Not found state
  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <User className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Provider Not Found</h2>
        <p className="text-slate-400 mb-4">The provider with ID &quot;{providerId}&quot; could not be found.</p>
        <Link href={`/admin/providers/${practiceId}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
          Back to Practice
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Link
            href={`/admin/providers/${practiceId}`}
            className="mt-1 p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {provider.firstName[0]}{provider.lastName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {provider.firstName} {provider.lastName}, {provider.title}
                </h1>
                <p className="text-slate-400">{provider.specialty}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[provider.status as keyof typeof statusColors]}`}>
                {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <Link href={`/admin/providers/${practiceId}`} className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {provider.practiceName}
              </Link>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">NPI: {provider.npi}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">ID: {provider.id}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-green-400"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Saved!</span>
            </motion.div>
          )}
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-600 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Provider
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeSection === section.id
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Provider Overview
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">First Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                ) : (
                  <p className="text-slate-900 font-medium">{provider.firstName}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Last Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                ) : (
                  <p className="text-slate-900 font-medium">{provider.lastName}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Title / Credential</p>
                {isEditing ? (
                  <select
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    {titleOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                ) : (
                  <p className="text-slate-900">{provider.title}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">NPI Number</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.npi}
                    onChange={(e) => setEditData({ ...editData, npi: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                ) : (
                  <p className="text-slate-900 font-mono">{provider.npi}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Contract Number</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.contractNumber || ""}
                    onChange={(e) => setEditData({ ...editData, contractNumber: e.target.value.toUpperCase().slice(0, 6) })}
                    maxLength={6}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono uppercase"
                    placeholder="ABC123"
                  />
                ) : (
                  <p className="text-slate-900 font-mono font-bold text-blue-600">{provider.contractNumber || "—"}</p>
                )}
              </div>
              {/* Revenue Codes - from contract pricing */}
              {contractPricing?.revenueCodes && contractPricing.revenueCodes.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-1">Revenue Codes</p>
                  <div className="flex flex-wrap gap-1">
                    {contractPricing.revenueCodes.map(rc => (
                      <span key={rc} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-mono rounded">
                        {rc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Reference Number</p>
                <p className="text-[10px] text-slate-400 mb-1">(Entity #)</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.referenceNumber || ""}
                    onChange={(e) => setEditData({ ...editData, referenceNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    placeholder="Entity #"
                  />
                ) : (
                  <p className="text-slate-900 font-mono font-bold text-emerald-600">{provider.referenceNumber || "—"}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Gender</p>
                {isEditing ? (
                  <select
                    value={editData.gender}
                    onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="">Not Specified</option>
                  </select>
                ) : (
                  <p className="text-slate-900">{provider.gender}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Accepting New Patients</p>
                {isEditing ? (
                  <select
                    value={editData.acceptingNewPatients ? "yes" : "no"}
                    onChange={(e) => setEditData({ ...editData, acceptingNewPatients: e.target.value === "yes" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    provider.acceptingNewPatients 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-red-500/20 text-red-400"
                  }`}>
                    {provider.acceptingNewPatients ? "Yes" : "No"}
                  </span>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Primary Care</p>
                {isEditing ? (
                  <select
                    value={editData.isPrimaryCare ? "yes" : "no"}
                    onChange={(e) => setEditData({ ...editData, isPrimaryCare: e.target.value === "yes" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    provider.isPrimaryCare 
                      ? "bg-blue-500/20 text-blue-400" 
                      : "bg-slate-500/20 text-slate-400"
                  }`}>
                    {provider.isPrimaryCare ? "Yes" : "No"}
                  </span>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Behavioral Health</p>
                {isEditing ? (
                  <select
                    value={editData.isBehavioralHealth ? "yes" : "no"}
                    onChange={(e) => setEditData({ ...editData, isBehavioralHealth: e.target.value === "yes" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    provider.isBehavioralHealth 
                      ? "bg-purple-500/20 text-purple-400" 
                      : "bg-slate-500/20 text-slate-400"
                  }`}>
                    {provider.isBehavioralHealth ? "Yes" : "No"}
                  </span>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Pricing Tier</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.pricingTier || ""}
                    onChange={(e) => setEditData({ ...editData, pricingTier: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                ) : (
                  <p className="text-slate-900 font-medium">{provider.pricingTier || "—"}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Middle Initial</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.middleInitial || ""}
                    onChange={(e) => setEditData({ ...editData, middleInitial: e.target.value })}
                    maxLength={1}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                ) : (
                  <p className="text-slate-900">{provider.middleInitial || "—"}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Specialty Code</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.specialtyCode || ""}
                    onChange={(e) => setEditData({ ...editData, specialtyCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                ) : (
                  <p className="text-slate-900 font-mono">{provider.specialtyCode || "—"}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Secondary Specialty</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.secondarySpecialtyCode || ""}
                    onChange={(e) => setEditData({ ...editData, secondarySpecialtyCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                ) : (
                  <p className="text-slate-900 font-mono">{provider.secondarySpecialtyCode || "—"}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Facility Type</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.facilityType || ""}
                    onChange={(e) => setEditData({ ...editData, facilityType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                ) : (
                  <p className="text-slate-900">{provider.facilityType || "—"}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Network Org</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.networkOrg || ""}
                    onChange={(e) => setEditData({ ...editData, networkOrg: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                  />
                ) : (
                  <p className="text-slate-900 font-mono">{provider.networkOrg || "—"}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Contract Start</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.contractStartDate || ""}
                    onChange={(e) => setEditData({ ...editData, contractStartDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    placeholder="YYYY-MM-DD"
                  />
                ) : (
                  <p className="text-slate-900">{provider.contractStartDate || "—"}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Contract End</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.contractEndDate || ""}
                    onChange={(e) => setEditData({ ...editData, contractEndDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    placeholder="YYYY-MM-DD"
                  />
                ) : (
                  <p className="text-slate-900">{provider.contractEndDate || "—"}</p>
                )}
              </div>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Directory Display</p>
                {isEditing ? (
                  <select
                    value={editData.directoryDisplay ? "yes" : "no"}
                    onChange={(e) => setEditData({ ...editData, directoryDisplay: e.target.value === "yes" })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                ) : (
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    provider.directoryDisplay 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-slate-500/20 text-slate-400"
                  }`}>
                    {provider.directoryDisplay ? "Yes" : "No"}
                  </span>
                )}
              </div>
            </div>
            
            {/* Billing Information */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-400" />
                Billing Information
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Billing Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.billing?.name || ""}
                      onChange={(e) => setEditData({ ...editData, billing: { ...editData.billing, name: e.target.value } })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  ) : (
                    <p className="text-slate-900 font-medium">{provider.billing?.name || "—"}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Billing NPI</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.billing?.npi || ""}
                      onChange={(e) => setEditData({ ...editData, billing: { ...editData.billing, npi: e.target.value } })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  ) : (
                    <p className="text-slate-900 font-mono">{provider.billing?.npi || "—"}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Tax ID</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.billing?.taxId || ""}
                      onChange={(e) => setEditData({ ...editData, billing: { ...editData.billing, taxId: e.target.value } })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                    />
                  ) : (
                    <p className="text-slate-900 font-mono">{provider.billing?.taxId || "—"}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Billing Phone</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.billing?.phone || ""}
                      onChange={(e) => setEditData({ ...editData, billing: { ...editData.billing, phone: e.target.value } })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  ) : (
                    <p className="text-slate-900">{provider.billing?.phone || "—"}</p>
                  )}
                </div>
              </div>
              <div className="mt-3 grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Address Line 1</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.billing?.address1 || ""}
                      onChange={(e) => setEditData({ ...editData, billing: { ...editData.billing, address1: e.target.value } })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  ) : (
                    <p className="text-slate-900">{provider.billing?.address1 || "—"}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Address Line 2</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.billing?.address2 || ""}
                      onChange={(e) => setEditData({ ...editData, billing: { ...editData.billing, address2: e.target.value } })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  ) : (
                    <p className="text-slate-900">{provider.billing?.address2 || "—"}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">City</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.billing?.city || ""}
                      onChange={(e) => setEditData({ ...editData, billing: { ...editData.billing, city: e.target.value } })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  ) : (
                    <p className="text-slate-900">{provider.billing?.city || "—"}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">State</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.billing?.state || ""}
                        onChange={(e) => setEditData({ ...editData, billing: { ...editData.billing, state: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.billing?.state || "—"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">ZIP</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.billing?.zip || ""}
                        onChange={(e) => setEditData({ ...editData, billing: { ...editData.billing, zip: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.billing?.zip || "—"}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-1">Billing Fax</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.billing?.fax || ""}
                    onChange={(e) => setEditData({ ...editData, billing: { ...editData.billing, fax: e.target.value } })}
                    className="w-full md:w-1/4 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                  />
                ) : (
                  <p className="text-slate-900">{provider.billing?.fax || "—"}</p>
                )}
              </div>
            </div>

            {/* Corresponding Address */}
            {(provider.correspondingAddress?.address1 || isEditing) && (
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  Corresponding Address
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Address Line 1</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.correspondingAddress?.address1 || ""}
                        onChange={(e) => setEditData({ ...editData, correspondingAddress: { ...editData.correspondingAddress, address1: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.correspondingAddress?.address1 || "—"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Address Line 2</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.correspondingAddress?.address2 || ""}
                        onChange={(e) => setEditData({ ...editData, correspondingAddress: { ...editData.correspondingAddress, address2: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.correspondingAddress?.address2 || "—"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">City</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.correspondingAddress?.city || ""}
                        onChange={(e) => setEditData({ ...editData, correspondingAddress: { ...editData.correspondingAddress, city: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.correspondingAddress?.city || "—"}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">State</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.correspondingAddress?.state || ""}
                          onChange={(e) => setEditData({ ...editData, correspondingAddress: { ...editData.correspondingAddress, state: e.target.value } })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900">{provider.correspondingAddress?.state || "—"}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">ZIP</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.correspondingAddress?.zip || ""}
                          onChange={(e) => setEditData({ ...editData, correspondingAddress: { ...editData.correspondingAddress, zip: e.target.value } })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900">{provider.correspondingAddress?.zip || "—"}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-3 grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Contact Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.correspondingAddress?.contactName || ""}
                        onChange={(e) => setEditData({ ...editData, correspondingAddress: { ...editData.correspondingAddress, contactName: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.correspondingAddress?.contactName || "—"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Fax</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.correspondingAddress?.fax || ""}
                        onChange={(e) => setEditData({ ...editData, correspondingAddress: { ...editData.correspondingAddress, fax: e.target.value } })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.correspondingAddress?.fax || "—"}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Taxonomy & Languages */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-blue-400" />
                  Taxonomy Codes
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Primary Taxonomy Description</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.primaryTaxonomyDesc || ""}
                        onChange={(e) => setEditData({ ...editData, primaryTaxonomyDesc: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        placeholder="e.g., Family Medicine"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.primaryTaxonomyDesc || "—"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Primary Taxonomy Code</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.primaryTaxonomy || ""}
                        onChange={(e) => setEditData({ ...editData, primaryTaxonomy: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                        placeholder="e.g., 207Q00000X"
                      />
                    ) : (
                      <p className="text-slate-400 text-sm font-mono">{provider.primaryTaxonomy || "—"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Secondary Taxonomy Description</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.secondaryTaxonomyDesc || ""}
                        onChange={(e) => setEditData({ ...editData, secondaryTaxonomyDesc: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        placeholder="e.g., Internal Medicine"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.secondaryTaxonomyDesc || "—"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Secondary Taxonomy Code</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.secondaryTaxonomy || ""}
                        onChange={(e) => setEditData({ ...editData, secondaryTaxonomy: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                        placeholder="e.g., 207RA0000X"
                      />
                    ) : (
                      <p className="text-slate-400 text-sm font-mono">{provider.secondaryTaxonomy || "—"}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-blue-400" />
                  Languages Spoken
                </h3>
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {(editData.languages || []).map((lang: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-full flex items-center gap-2">
                          {languageNames[lang] || lang}
                          <button
                            type="button"
                            onClick={() => setEditData({ 
                              ...editData, 
                              languages: editData.languages.filter((_: string, i: number) => i !== idx) 
                            })}
                            className="hover:text-red-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <select
                        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        onChange={(e) => {
                          if (e.target.value && !editData.languages?.includes(e.target.value)) {
                            setEditData({ 
                              ...editData, 
                              languages: [...(editData.languages || []), e.target.value] 
                            });
                          }
                          e.target.value = "";
                        }}
                        defaultValue=""
                      >
                        <option value="">Add language...</option>
                        {Object.entries(languageNames)
                          .filter(([code]) => !editData.languages?.includes(code))
                          .map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                          ))
                        }
                      </select>
                    </div>
                    <p className="text-xs text-slate-500">Click × to remove, or select from dropdown to add</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {(provider.languages || []).length > 0 ? (
                      provider.languages.map((lang: string) => (
                        <span key={lang} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-full">
                          {languageNames[lang] || lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-500">No languages specified</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Credentials Section */}
        {activeSection === "credentials" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              Credentials & Licenses
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">State License</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">License State</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.licenseState}
                          onChange={(e) => setEditData({ ...editData, licenseState: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900">{provider.licenseState}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">License Number</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.licenseNumber}
                          onChange={(e) => setEditData({ ...editData, licenseNumber: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900 font-mono">{provider.licenseNumber}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Expiration Date</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.licenseExpiration}
                        onChange={(e) => setEditData({ ...editData, licenseExpiration: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.licenseExpiration}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">DEA Registration</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">DEA Number</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.deaNumber}
                        onChange={(e) => setEditData({ ...editData, deaNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                      />
                    ) : (
                      <p className="text-slate-900 font-mono">{provider.deaNumber}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Expiration Date</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.deaExpiration}
                        onChange={(e) => setEditData({ ...editData, deaExpiration: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.deaExpiration}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6 md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Board Certification</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Board Certified</p>
                    {isEditing ? (
                      <select
                        value={editData.boardCertified ? "yes" : "no"}
                        onChange={(e) => setEditData({ ...editData, boardCertified: e.target.value === "yes" })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        provider.boardCertified 
                          ? "bg-green-500/20 text-green-400" 
                          : "bg-slate-600 text-slate-400"
                      }`}>
                        {provider.boardCertified ? "Yes" : "No"}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Certifying Board</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.boardCertification}
                        onChange={(e) => setEditData({ ...editData, boardCertification: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.boardCertification}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Documents Section */}
        {activeSection === "documents" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Credentialing Documents
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors">
                <Upload className="w-4 h-4" />
                Upload Document
              </button>
            </div>

            <div className="grid gap-4">
              {providerDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => setViewingDocument(doc.type)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{doc.name}</p>
                      <p className="text-sm text-slate-500">
                        Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}
                        {doc.expires && ` • Expires: ${doc.expires}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Current
                    </span>
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <Eye className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document Viewer Modal */}
        <AnimatePresence>
          {viewingDocument && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
              onClick={() => setViewingDocument(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-3xl bg-white rounded-xl overflow-hidden max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {viewingDocument === "license" && "State Medical License"}
                      {viewingDocument === "dea" && "DEA Registration Certificate"}
                      {viewingDocument === "board_cert" && "Board Certification"}
                      {viewingDocument === "malpractice_coi" && "Malpractice Insurance COI"}
                      {viewingDocument === "cv" && "Curriculum Vitae"}
                      {viewingDocument === "w9" && "W-9 Form"}
                    </h3>
                    <p className="text-sm text-slate-500">{provider.firstName} {provider.lastName}, {provider.title}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                    <button
                      onClick={() => setViewingDocument(null)}
                      className="p-2 hover:bg-slate-100 rounded-lg"
                    >
                      <X className="w-5 h-5 text-slate-500" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto p-6 bg-slate-100 min-h-[500px]">
                  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
                    {/* License Document */}
                    {viewingDocument === "license" && (
                      <div className="text-center space-y-6">
                        <div className="border-b-2 border-blue-600 pb-4">
                          <div className="flex justify-center mb-2">
                            <Shield className="w-12 h-12 text-blue-600" />
                          </div>
                          <h2 className="text-xl font-bold text-blue-800">STATE OF {provider.licenseState}</h2>
                          <h3 className="text-lg font-semibold text-blue-700">STATE MEDICAL BOARD</h3>
                        </div>
                        <div className="py-4">
                          <p className="text-sm uppercase tracking-wider text-slate-500 mb-2">License to Practice Medicine</p>
                          <p className="text-2xl font-bold text-slate-900">{provider.firstName} {provider.lastName}, {provider.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-3 bg-slate-50 rounded">
                            <p className="text-xs text-slate-500">License Number</p>
                            <p className="font-mono font-bold text-slate-900">{provider.licenseNumber}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded">
                            <p className="text-xs text-slate-500">Expiration Date</p>
                            <p className="font-bold text-slate-900">{provider.licenseExpiration}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* DEA Document */}
                    {viewingDocument === "dea" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                          <div>
                            <h2 className="text-lg font-bold text-slate-900">U.S. DEPARTMENT OF JUSTICE</h2>
                            <h3 className="text-sm font-semibold text-slate-600">Drug Enforcement Administration</h3>
                          </div>
                          <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-amber-600" />
                          </div>
                        </div>
                        <div className="text-center py-4">
                          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">DEA Registration Certificate</p>
                          <p className="text-xl font-bold mt-2 text-slate-900">{provider.firstName} {provider.lastName}, {provider.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-50 rounded">
                            <p className="text-xs text-slate-500">DEA Number</p>
                            <p className="font-mono font-bold text-slate-900">{provider.deaNumber}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded">
                            <p className="text-xs text-slate-500">Expiration</p>
                            <p className="font-bold text-slate-900">{provider.deaExpiration}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded">
                            <p className="text-xs text-slate-500">Schedules</p>
                            <p className="font-bold text-slate-900">2, 2N, 3, 3N, 4, 5</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded">
                            <p className="text-xs text-slate-500">Business Activity</p>
                            <p className="font-bold text-slate-900">Practitioner</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Board Certification */}
                    {viewingDocument === "board_cert" && (
                      <div className="text-center space-y-6">
                        <div className="border-b-2 border-green-600 pb-4">
                          <h2 className="text-xl font-bold text-green-800">AMERICAN BOARD OF MEDICAL SPECIALTIES</h2>
                        </div>
                        <div className="py-6">
                          <p className="text-sm text-slate-500">This is to certify that</p>
                          <p className="text-2xl font-bold my-3 text-slate-900">{provider.firstName} {provider.lastName}, {provider.title}</p>
                          <p className="text-sm text-slate-500">having completed the prescribed requirements, is hereby certified by the</p>
                          <p className="text-lg font-semibold text-green-700 mt-2">{provider.boardCertification}</p>
                        </div>
                      </div>
                    )}

                    {/* Malpractice COI */}
                    {viewingDocument === "malpractice_coi" && (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                          <div>
                            <h2 className="text-lg font-bold text-slate-900">{provider.malpracticeCarrier}</h2>
                            <p className="text-sm text-slate-500">Certificate of Insurance</p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Active</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded">
                          <p className="text-sm text-slate-500 mb-1">Named Insured</p>
                          <p className="font-bold text-slate-900">{provider.firstName} {provider.lastName}, {provider.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-50 rounded">
                            <p className="text-xs text-slate-500">Policy Number</p>
                            <p className="font-mono font-bold text-slate-900">{provider.malpracticePolicyNumber}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded">
                            <p className="text-xs text-slate-500">Coverage</p>
                            <p className="font-bold text-green-600">{provider.malpracticeCoverage}</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded col-span-2">
                            <p className="text-xs text-slate-500">Expiration Date</p>
                            <p className="font-bold text-slate-900">{provider.malpracticeExpiration}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CV */}
                    {viewingDocument === "cv" && (
                      <div className="space-y-6">
                        <div className="text-center border-b pb-4 border-slate-200">
                          <h1 className="text-2xl font-bold text-slate-900">{provider.firstName} {provider.lastName}, {provider.title}</h1>
                          <p className="text-sm text-slate-500 mt-1">{provider.specialty}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold border-b pb-1 mb-2 text-blue-600 border-blue-200">Education</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-700">{provider.medicalSchool}</span>
                              <span className="text-slate-500">{provider.graduationYear}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-700">{provider.residency}</span>
                              <span className="text-slate-500">{parseInt(provider.graduationYear) + 3}-{parseInt(provider.graduationYear) + 6}</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold border-b pb-1 mb-2 text-blue-600 border-blue-200">Certifications</h3>
                          <ul className="text-sm text-slate-700 space-y-1">
                            <li>• {provider.boardCertification}</li>
                            <li>• State License: {provider.licenseNumber}</li>
                            <li>• DEA Registration: {provider.deaNumber}</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* W-9 */}
                    {viewingDocument === "w9" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-lg font-bold text-slate-900">Form W-9</h2>
                            <p className="text-xs text-slate-500">Request for Taxpayer Identification Number</p>
                          </div>
                        </div>
                        <div className="border-t border-b py-4 border-slate-200">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-slate-500">Name</p>
                              <p className="font-bold text-slate-900">{provider.firstName} {provider.lastName}, {provider.title}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Business Name</p>
                              <p className="font-bold text-slate-900">{provider.practiceName}</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-slate-50 rounded">
                            <p className="text-xs text-slate-500">Tax Classification</p>
                            <p className="font-bold text-slate-900">Individual/Sole Proprietor</p>
                          </div>
                          <div className="p-3 bg-slate-50 rounded">
                            <p className="text-xs text-slate-500">TIN (masked)</p>
                            <p className="font-mono font-bold text-slate-900">**-***{Math.floor(1000 + Math.random() * 9000)}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Malpractice Section */}
        {activeSection === "malpractice" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Malpractice Insurance
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Policy Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Insurance Carrier</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.malpracticeCarrier || ""}
                        onChange={(e) => setEditData({ ...editData, malpracticeCarrier: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.malpracticeCarrier || "—"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Policy Number</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.malpracticePolicyNumber || ""}
                        onChange={(e) => setEditData({ ...editData, malpracticePolicyNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono"
                      />
                    ) : (
                      <p className="text-slate-900 font-mono">{provider.malpracticePolicyNumber || "—"}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Coverage Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Coverage Limits</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.malpracticeCoverage || ""}
                        onChange={(e) => setEditData({ ...editData, malpracticeCoverage: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        placeholder="$1M / $3M"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.malpracticeCoverage || "—"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Expiration Date</p>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editData.malpracticeExpiration || ""}
                        onChange={(e) => setEditData({ ...editData, malpracticeExpiration: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.malpracticeExpiration || "—"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hospital Affiliations Section */}
        {activeSection === "hospitals" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                Hospital Affiliations
              </h2>
              {isEditing && (
                <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Affiliation
                </button>
              )}
            </div>

            <div className="space-y-4">
              {(provider.hospitalAffiliations || []).map((hospital: any, index: number) => (
                <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-medium">{hospital.name}</p>
                      <p className="text-slate-400 text-sm">{hospital.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      hospital.privileges === "Active" 
                        ? "bg-green-500/20 text-green-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {hospital.privileges} Privileges
                    </span>
                    {isEditing && (
                      <button className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {(!provider.hospitalAffiliations || provider.hospitalAffiliations.length === 0) && (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-slate-400">No hospital affiliations on file</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Office Location Section */}
        {activeSection === "location" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Office Location
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Address</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Address Line 1</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.officeAddress || ""}
                        onChange={(e) => setEditData({ ...editData, officeAddress: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.officeAddress || "Same as practice"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Address Line 2 (Suite/Office)</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.officeAddress2 || ""}
                        onChange={(e) => setEditData({ ...editData, officeAddress2: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.officeAddress2 || "—"}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">City</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.officeCity || ""}
                          onChange={(e) => setEditData({ ...editData, officeCity: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900">{provider.officeCity || "—"}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">State</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.officeState || ""}
                          onChange={(e) => setEditData({ ...editData, officeState: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900">{provider.officeState || "—"}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">ZIP</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.officeZip || ""}
                          onChange={(e) => setEditData({ ...editData, officeZip: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                        />
                      ) : (
                        <p className="text-slate-900">{provider.officeZip || "—"}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Contact</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    <p className="text-slate-900">{provider.officePhone || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Fax</p>
                    <p className="text-slate-900">{provider.officeFax || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    <p className="text-slate-900">{provider.officeEmail || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">County</p>
                    <p className="text-slate-900">{provider.officeCounty || "—"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Locations */}
            {provider.locations && provider.locations.length > 1 && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">
                  Additional Locations ({provider.locations.length - 1})
                </h3>
                <div className="space-y-4">
                  {provider.locations.slice(1).map((loc: any, idx: number) => (
                    <div key={loc.id || idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                          <p className="text-xs text-slate-500">Address</p>
                          <p className="text-slate-900 font-medium">
                            {loc.address1}{loc.address2 && `, ${loc.address2}`}
                          </p>
                          <p className="text-slate-600">
                            {loc.city}, {loc.state} {loc.zip}
                            {loc.county && ` (${loc.county} County)`}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Phone</p>
                          <p className="text-slate-900">{loc.phone || "—"}</p>
                          {loc.fax && (
                            <>
                              <p className="text-xs text-slate-500 mt-2">Fax</p>
                              <p className="text-slate-900">{loc.fax}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinic Hours */}
            {provider.clinicHours && Object.values(provider.clinicHours).some((h: any) => h) && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Clinic Hours</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <div key={day}>
                      <p className="text-xs text-slate-500 capitalize">{day}</p>
                      <p className="text-slate-900">{provider.clinicHours?.[day] || "—"}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Education Section */}
        {activeSection === "education" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-400" />
              Education & Training
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Medical School</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Institution</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.medicalSchool}
                        onChange={(e) => setEditData({ ...editData, medicalSchool: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.medicalSchool}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Graduation Year</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.graduationYear}
                        onChange={(e) => setEditData({ ...editData, graduationYear: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.graduationYear}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">Residency</h3>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Program</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.residency}
                      onChange={(e) => setEditData({ ...editData, residency: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                    />
                  ) : (
                    <p className="text-slate-900">{provider.residency}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Section */}
        {activeSection === "schedule" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Clinic Schedule
            </h2>

            <div className="bg-white border border-slate-200 rounded-lg p-6">
              <div className="grid gap-3">
                {Object.entries(provider.clinicHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between py-2 border-b border-slate-600/50 last:border-0">
                    <span className="text-slate-900 font-medium capitalize">{day}</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.clinicHours[day]}
                        onChange={(e) => setEditData({
                          ...editData,
                          clinicHours: { ...editData.clinicHours, [day]: e.target.value }
                        })}
                        className="px-3 py-1 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-right w-48"
                      />
                    ) : (
                      <span className={`${hours === "Closed" ? "text-slate-500" : "text-blue-400"}`}>
                        {hours as string}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rates Section */}
        {activeSection === "rates" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                Provider Discount Rates
              </h2>
            </div>

            {/* Contract Pricing Info Banner */}
            {pricingLoading ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-blue-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-blue-100 rounded w-64"></div>
              </div>
            ) : contractPricing ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
                        Contract #{contractPricing.contractNumber}
                      </span>
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded">
                        {contractPricing.rateType}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700">{contractPricing.rateDescription}</p>
                    {contractPricing.revenueCodes.length > 0 && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-500">Revenue Codes:</span>
                        {contractPricing.revenueCodes.map(rc => (
                          <span key={rc} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                            {rc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {contractPricing.defaultRates.pctMedicare > 0 && (
                      <p className="text-2xl font-bold text-blue-600">{contractPricing.defaultRates.pctMedicare}%</p>
                    )}
                    {contractPricing.defaultRates.pctMedicare > 0 && (
                      <p className="text-xs text-slate-500">of Medicare</p>
                    )}
                    {contractPricing.defaultRates.pctBilled > 0 && contractPricing.defaultRates.pctMedicare === 0 && (
                      <>
                        <p className="text-2xl font-bold text-indigo-600">{contractPricing.defaultRates.pctBilled}%</p>
                        <p className="text-xs text-slate-500">of Billed Charges</p>
                      </>
                    )}
                    {contractPricing.cptCount > 0 && (
                      <p className="text-xs text-slate-500 mt-1">{contractPricing.cptCount} CPT codes</p>
                    )}
                  </div>
                </div>
              </div>
            ) : provider?.contractNumber ? (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-700">
                  No pricing data found for Contract #{provider.contractNumber}
                </p>
              </div>
            ) : null}

            {/* Contract Default Rates Detail */}
            {contractPricing && (contractPricing.rateTypeIndicators?.length > 0 || contractPricing.defaultRates.pctMedicare > 0 || contractPricing.defaultRates.pctBilled > 0) && (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-blue-500" />
                  Contract Rate Schedule
                </h3>
                
                {/* Rate Type Indicators (I, O, P, DEFAULT) */}
                {contractPricing.rateTypeIndicators?.length > 0 ? (
                  <div className="space-y-3">
                    {contractPricing.rateTypeIndicators.map((indicator, idx) => (
                      <div key={idx} className={`rounded-lg p-4 border ${
                        indicator.rateSource === 'medicare' 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'bg-indigo-50 border-indigo-200'
                      }`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                              indicator.type === 'I' ? 'bg-orange-100 text-orange-700' :
                              indicator.type === 'O' ? 'bg-green-100 text-green-700' :
                              indicator.type === 'P' ? 'bg-purple-100 text-purple-700' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {indicator.type === 'I' ? 'Inpatient' :
                               indicator.type === 'O' ? 'Outpatient' :
                               indicator.type === 'P' ? 'Professional' :
                               'Default Rate'}
                            </span>
                            <span className="text-sm text-slate-600">
                              {indicator.rateSource === 'medicare' ? '% of Medicare' : '% of Billed Charges'}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className={`text-3xl font-bold ${
                              indicator.rateSource === 'medicare' ? 'text-blue-700' : 'text-indigo-700'
                            }`}>
                              {indicator.rate}%
                            </p>
                          </div>
                        </div>
                        {indicator.pctMedicare > 0 && indicator.pctBilled > 0 && (
                          <p className="text-xs text-slate-500 mt-2">
                            Fallback: {indicator.pctBilled}% of billed charges if Medicare rate unavailable
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {contractPricing.defaultRates.pctMedicare > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-xs text-blue-600 font-medium mb-1">% of Medicare</p>
                        <p className="text-3xl font-bold text-blue-700">{contractPricing.defaultRates.pctMedicare}%</p>
                        <p className="text-xs text-slate-500 mt-2">
                          Applied when no specific CPT rate exists
                        </p>
                      </div>
                    )}
                    {contractPricing.defaultRates.pctBilled > 0 && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <p className="text-xs text-indigo-600 font-medium mb-1">% of Billed Charges</p>
                        <p className="text-3xl font-bold text-indigo-700">{contractPricing.defaultRates.pctBilled}%</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {contractPricing.defaultRates.pctMedicare > 0 ? "Fallback when Medicare rate = 0" : "Applied to all services"}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Show CPT count if any */}
                {contractPricing.cptCount > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-900">{contractPricing.cptCount}</span> specific CPT codes with fixed pricing 
                      <span className="text-slate-500"> (see Custom Rates section below)</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Custom Rates Toggle */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-900 font-medium">Use Custom Rates for This Provider</p>
                <p className="text-slate-400 text-sm">Override practice-level rates with provider-specific rates</p>
              </div>
              <button
                onClick={() => setUseCustomRates(!useCustomRates)}
                className={`w-14 h-8 rounded-full transition-colors relative ${
                  useCustomRates ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-slate-600"
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${
                  useCustomRates ? "translate-x-7" : "translate-x-1"
                }`} />
              </button>
            </div>

            {useCustomRates ? (
              <>
                {/* Discount Basis Selection */}
                <div className="bg-white border border-slate-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-slate-900 mb-3">Discount Basis</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setDiscountBasis("medicare")}
                      className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors border-2 ${
                        discountBasis === "medicare" 
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-teal-600 text-white" 
                          : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      % of Medicare
                    </button>
                    <button
                      onClick={() => setDiscountBasis("billed")}
                      className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors border-2 ${
                        discountBasis === "billed" 
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-teal-600 text-white" 
                          : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
                      }`}
                    >
                      % of Billed Charges
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {discountBasis === "medicare" 
                      ? "Rates are calculated as a percentage of the Medicare allowable amount"
                      : "Rates are calculated as a percentage off the provider's billed charges"
                    }
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setRateType("flat")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      rateType === "flat" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    Flat Rate
                  </button>
                  <button
                    onClick={() => setRateType("custom")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      rateType === "custom" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    Custom by Category
                  </button>
                  <button
                    onClick={() => setRateType("cpt")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      rateType === "cpt" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    Custom by CPT Code
                  </button>
                </div>

                {rateType === "flat" ? (
                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">
                      Flat {discountBasis === "medicare" ? "% of Medicare" : "% Off Billed Charges"}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-xs">
                        <div className="relative">
                          <input
                            type="number"
                            value={flatRate}
                            onChange={(e) => setFlatRate(e.target.value)}
                            className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-2xl font-bold"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">%</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">
                          {discountBasis === "medicare" ? "of Medicare rate" : "off billed charges"}
                        </p>
                      </div>
                      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex-1">
                        <p className="text-sm text-indigo-700">
                          {discountBasis === "medicare" 
                            ? `Example: For a $100 Medicare allowable, you pay $${parseFloat(flatRate) || 0}`
                            : `Example: For a $100 billed charge, you pay $${100 - (parseFloat(flatRate) || 0)}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Rates by Service Category</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {serviceCategories.map((cat) => (
                        <div key={cat.key} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                          <label className="block text-sm text-slate-400 mb-2">{cat.label}</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={serviceRates[cat.key] || ""}
                              onChange={(e) => setServiceRates({ ...serviceRates, [cat.key]: e.target.value })}
                              className="w-full px-3 py-2 pr-10 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rateType === "cpt" && (
                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Custom Rates by CPT Code</h3>
                        <p className="text-slate-400 text-xs mt-1">Set specific rates for individual procedure codes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Hidden file input for CSV upload */}
                        <input
                          ref={cptFileInputRef}
                          type="file"
                          accept=".csv"
                          onChange={handleCptCsvUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => cptFileInputRef.current?.click()}
                          className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-500 transition-colors"
                          title="Upload CSV with columns: CPT Code, Description, Rate %"
                        >
                          <Upload className="w-4 h-4" />
                          Upload CSV
                        </button>
                        <button
                          onClick={() => setCptRates([...cptRates, { code: "", description: "", rate: "" }])}
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add CPT Code
                        </button>
                      </div>
                    </div>
                    
                    {/* CSV format hint */}
                    <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="text-xs text-slate-500">
                        <strong>CSV Format:</strong> CPT Code, Description, Rate % (e.g., <code className="bg-slate-200 px-1 rounded">99213, Office visit low complexity, 145</code>)
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="grid grid-cols-12 gap-3 text-xs text-slate-500 font-medium px-1">
                        <div className="col-span-2">CPT Code</div>
                        <div className="col-span-7">Description</div>
                        <div className="col-span-2">Rate (%)</div>
                        <div className="col-span-1"></div>
                      </div>
                      
                      {cptRates.map((cpt, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-center">
                          <div className="col-span-2">
                            <input
                              type="text"
                              value={cpt.code}
                              onChange={(e) => {
                                const updated = [...cptRates];
                                updated[index].code = e.target.value;
                                setCptRates(updated);
                              }}
                              placeholder="99213"
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono text-sm"
                            />
                          </div>
                          <div className="col-span-7">
                            <input
                              type="text"
                              value={cpt.description}
                              onChange={(e) => {
                                const updated = [...cptRates];
                                updated[index].description = e.target.value;
                                setCptRates(updated);
                              }}
                              placeholder="Office visit, established patient..."
                              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-sm"
                            />
                          </div>
                          <div className="col-span-2 relative">
                            <input
                              type="number"
                              value={cpt.rate}
                              onChange={(e) => {
                                const updated = [...cptRates];
                                updated[index].rate = e.target.value;
                                setCptRates(updated);
                              }}
                              placeholder="135"
                              className="w-full px-3 py-2 pr-8 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium text-sm"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">%</span>
                          </div>
                          <div className="col-span-1 flex justify-center">
                            <button
                              onClick={() => setCptRates(cptRates.filter((_, i) => i !== index))}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Remove"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {cptRates.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                          No CPT codes added yet. Click "Add CPT Code" to get started.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-center">
                <p className="text-amber-300">
                  This provider uses practice-level rates. Enable custom rates above to set provider-specific rates.
                </p>
                <Link
                  href={`/admin/providers/${practiceId}`}
                  className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300"
                >
                  <Building2 className="w-4 h-4" />
                  View Practice Rates
                </Link>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Rates
              </button>
            </div>
          </div>
        )}

        {/* Networks Section */}
        {activeSection === "networks" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Network Memberships ({provider.networks?.length || 0})
              </h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors">
                <Globe className="w-4 h-4" />
                Add to Network
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {provider.networks?.map((networkId: string) => (
                <div key={networkId} className="bg-white border border-slate-200 rounded-xl p-4 border border-slate-600/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 font-medium">{networkNames[networkId] || networkId}</p>
                      <p className="text-slate-400 text-sm">Active member</p>
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
