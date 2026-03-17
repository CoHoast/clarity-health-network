"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, User, MapPin, Phone, Mail, FileText, DollarSign, Edit, Save, X,
  CheckCircle, Clock, Briefcase, GraduationCap, Globe, Calendar, Stethoscope,
  CreditCard, Building2, Languages, Shield, Plus, Trash2
} from "lucide-react";

// Provider data (in real app, this would come from API)
const providersData: Record<string, any> = {
  "PRV-001": {
    id: "PRV-001",
    practiceId: "PRC-001",
    practiceName: "Cleveland Family Medicine",
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
    networks: ["NET-001", "NET-002"],
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
    networks: ["NET-001", "NET-002", "NET-005"],
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
  "NET-001": "Ohio PPO Network",
  "NET-002": "Cleveland Metro Network",
  "NET-003": "Northeast Ohio Specialists",
  "NET-004": "Ohio Hospital Alliance",
  "NET-005": "Midwest Regional Network",
  "NET-006": "TrueCare Value Network",
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
  const params = useParams();
  const practiceId = params.practiceId as string;
  const providerId = params.providerId as string;
  const provider = providersData[providerId] || providersData["PRV-001"];

  const [activeSection, setActiveSection] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(provider);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Rates
  const [useCustomRates, setUseCustomRates] = useState(provider.useCustomRates);
  const [rateType, setRateType] = useState<"flat" | "custom" | "cpt">(provider.rateType);
  const [flatRate, setFlatRate] = useState(provider.flatRate);
  const [serviceRates, setServiceRates] = useState(provider.serviceRates);
  const [cptRates, setCptRates] = useState<{ code: string; description: string; rate: string }[]>([
    { code: "99213", description: "Office visit, established patient, low complexity", rate: "145" },
    { code: "99214", description: "Office visit, established patient, moderate complexity", rate: "150" },
  ]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const sections = [
    { id: "overview", label: "Overview", icon: User },
    { id: "credentials", label: "Credentials & Licenses", icon: GraduationCap },
    { id: "malpractice", label: "Malpractice", icon: Shield },
    { id: "hospitals", label: "Hospital Affiliations", icon: Building2 },
    { id: "location", label: "Office Location", icon: MapPin },
    { id: "education", label: "Education", icon: Briefcase },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "rates", label: "Rates & Discounts", icon: DollarSign },
    { id: "networks", label: "Networks", icon: Globe },
  ];

  const statusColors = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    inactive: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  };

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
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
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
              <Link href={`/admin/providers/${practiceId}`} className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
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
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-500 transition-colors disabled:opacity-50"
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
                ? "bg-teal-600 text-white"
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
              <User className="w-5 h-5 text-teal-400" />
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
            </div>

            {/* Taxonomy & Languages */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-teal-400" />
                  Taxonomy Codes
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-slate-500">Primary</p>
                    <p className="text-slate-900">{provider.primaryTaxonomyDesc}</p>
                    <p className="text-slate-400 text-sm font-mono">{provider.primaryTaxonomy}</p>
                  </div>
                  {provider.secondaryTaxonomy && (
                    <div>
                      <p className="text-xs text-slate-500">Secondary</p>
                      <p className="text-slate-900">{provider.secondaryTaxonomyDesc}</p>
                      <p className="text-slate-400 text-sm font-mono">{provider.secondaryTaxonomy}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-teal-400" />
                  Languages Spoken
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.languages.map((lang: string) => (
                    <span key={lang} className="px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-full">
                      {languageNames[lang] || lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Credentials Section */}
        {activeSection === "credentials" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-teal-400" />
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

        {/* Malpractice Section */}
        {activeSection === "malpractice" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-400" />
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
                <Building2 className="w-5 h-5 text-teal-400" />
                Hospital Affiliations
              </h2>
              {isEditing && (
                <button className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-500 transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Affiliation
                </button>
              )}
            </div>

            <div className="space-y-4">
              {(provider.hospitalAffiliations || []).map((hospital: any, index: number) => (
                <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-cyan-400" />
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
              <MapPin className="w-5 h-5 text-teal-400" />
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
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.officePhone || ""}
                        onChange={(e) => setEditData({ ...editData, officePhone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.officePhone || "—"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Fax</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.officeFax || ""}
                        onChange={(e) => setEditData({ ...editData, officeFax: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900"
                      />
                    ) : (
                      <p className="text-slate-900">{provider.officeFax || "—"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Education Section */}
        {activeSection === "education" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-teal-400" />
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
              <Calendar className="w-5 h-5 text-teal-400" />
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
                      <span className={`${hours === "Closed" ? "text-slate-500" : "text-cyan-400"}`}>
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
                <DollarSign className="w-5 h-5 text-teal-400" />
                Provider Discount Rates
              </h2>
            </div>

            {/* Custom Rates Toggle */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-slate-900 font-medium">Use Custom Rates for This Provider</p>
                <p className="text-slate-400 text-sm">Override practice-level rates with provider-specific rates</p>
              </div>
              <button
                onClick={() => setUseCustomRates(!useCustomRates)}
                className={`w-14 h-8 rounded-full transition-colors relative ${
                  useCustomRates ? "bg-teal-600" : "bg-slate-600"
                }`}
              >
                <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${
                  useCustomRates ? "translate-x-7" : "translate-x-1"
                }`} />
              </button>
            </div>

            {useCustomRates ? (
              <>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRateType("flat")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      rateType === "flat" ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    Flat Rate
                  </button>
                  <button
                    onClick={() => setRateType("custom")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      rateType === "custom" ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    Custom by Category
                  </button>
                  <button
                    onClick={() => setRateType("cpt")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      rateType === "cpt" ? "bg-teal-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    Custom by CPT Code
                  </button>
                </div>

                {rateType === "flat" ? (
                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="text-sm font-semibold text-slate-900 mb-4">Flat % of Medicare</h3>
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
                      <button
                        onClick={() => setCptRates([...cptRates, { code: "", description: "", rate: "" }])}
                        className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-500 transition-colors"
                      >
                        <span className="text-lg leading-none">+</span>
                        Add CPT Code
                      </button>
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
                  className="inline-flex items-center gap-2 mt-4 text-cyan-400 hover:text-cyan-300"
                >
                  <Building2 className="w-4 h-4" />
                  View Practice Rates
                </Link>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-500 transition-colors"
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
                <Globe className="w-5 h-5 text-teal-400" />
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
