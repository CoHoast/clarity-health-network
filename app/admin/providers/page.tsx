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

// Network Organizations
const networks: Network[] = [
  { id: "NET-001", name: "Ohio PPO Network", description: "Primary PPO network covering all of Ohio", state: "OH", providerCount: 1847, status: "active", createdDate: "2020-01-01" },
  { id: "NET-002", name: "Cleveland Metro Network", description: "Greater Cleveland metropolitan area providers", state: "OH", providerCount: 892, status: "active", createdDate: "2021-03-15" },
  { id: "NET-003", name: "Northeast Ohio Specialists", description: "Specialty care providers in NE Ohio", state: "OH", providerCount: 456, status: "active", createdDate: "2022-06-01" },
  { id: "NET-004", name: "Ohio Hospital Alliance", description: "Hospital and facility network", state: "OH", providerCount: 89, status: "active", createdDate: "2019-08-20" },
  { id: "NET-005", name: "Midwest Regional Network", description: "Multi-state network covering OH, PA, MI, IN", providerCount: 3421, status: "active", createdDate: "2018-01-01" },
  { id: "NET-006", name: "TrueCare Value Network", description: "Cost-effective care network", providerCount: 1256, status: "active", createdDate: "2023-01-15" },
  { id: "NET-007", name: "Pennsylvania PPO", description: "Pennsylvania state network", state: "PA", providerCount: 2134, status: "active", createdDate: "2020-04-01" },
  { id: "NET-008", name: "Urgent Care Express", description: "Urgent care and walk-in clinics", providerCount: 234, status: "active", createdDate: "2022-09-01" },
];

// Mock Data
const practices: Practice[] = [
  {
    id: "PRC-001",
    name: "Cleveland Family Medicine",
    type: "Group Practice",
    specialty: "Family Medicine",
    address: "123 Medical Center Dr",
    address2: "Suite 200",
    city: "Cleveland",
    county: "Cuyahoga",
    state: "OH",
    zip: "44101",
    country: "USA",
    phone: "(555) 123-4567",
    fax: "(555) 123-4568",
    billingPhone: "(555) 123-4569",
    billingFax: "(555) 123-4570",
    email: "info@clevelandfm.com",
    contactName: "Mary Johnson",
    correspondenceAddress: "P.O. Box 4567",
    correspondenceCity: "Cleveland",
    correspondenceState: "OH",
    correspondenceZip: "44101",
    correspondenceCountry: "USA",
    correspondenceFax: "(555) 123-4571",
    payToNpi: "1234567890",
    payToName: "Cleveland Family Medicine LLC",
    payToTaxId: "34-1234567",
    payToAddress: "P.O. Box 1234",
    payToCity: "Cleveland",
    payToState: "OH",
    payToZip: "44101",
    payToCountry: "USA",
    status: "active",
    contractStart: "2024-01-15",
    contractEnd: "2027-01-14",
    discountType: "% Off Billed",
    discountRate: "35%",
  },
  {
    id: "PRC-002",
    name: "Cleveland Orthopedic Associates",
    type: "Group Practice",
    specialty: "Orthopedics",
    address: "321 Bone & Joint Dr",
    address2: "Building B, Suite 150",
    city: "Beachwood",
    county: "Cuyahoga",
    state: "OH",
    zip: "44122",
    country: "USA",
    phone: "(555) 456-7890",
    fax: "(555) 456-7891",
    billingPhone: "(555) 456-7892",
    billingFax: "(555) 456-7893",
    email: "contact@clevortho.com",
    contactName: "James Miller",
    correspondenceAddress: "321 Bone & Joint Dr, Suite 100",
    correspondenceCity: "Beachwood",
    correspondenceState: "OH",
    correspondenceZip: "44122",
    correspondenceCountry: "USA",
    correspondenceFax: "(555) 456-7894",
    payToNpi: "9999999991",
    payToName: "COA Billing Services LLC",
    payToTaxId: "34-9999991",
    payToAddress: "P.O. Box 5678",
    payToCity: "Beachwood",
    payToState: "OH",
    payToZip: "44122",
    payToCountry: "USA",
    status: "active",
    contractStart: "2024-09-01",
    contractEnd: "2027-08-31",
    discountType: "% Off Billed",
    discountRate: "40%",
  },
  {
    id: "PRC-003",
    name: "Metro Imaging Center",
    type: "Facility",
    specialty: "Diagnostic Imaging",
    address: "789 Imaging Way",
    city: "Cleveland",
    county: "Cuyahoga",
    state: "OH",
    zip: "44102",
    country: "USA",
    phone: "(555) 345-6789",
    fax: "(555) 345-6780",
    billingPhone: "(555) 345-6781",
    billingFax: "(555) 345-6782",
    email: "scheduling@metroimaging.com",
    contactName: "Tom Richards",
    correspondenceAddress: "789 Imaging Way",
    correspondenceCity: "Cleveland",
    correspondenceState: "OH",
    correspondenceZip: "44102",
    correspondenceCountry: "USA",
    correspondenceFax: "(555) 345-6783",
    payToNpi: "3456789012",
    payToName: "Metro Imaging Center Inc",
    payToTaxId: "34-3456789",
    payToAddress: "789 Imaging Way, Suite 100",
    payToCity: "Cleveland",
    payToState: "OH",
    payToZip: "44102",
    payToCountry: "USA",
    status: "active",
    contractStart: "2023-06-15",
    contractEnd: "2026-06-14",
    discountType: "Case Rate",
    discountRate: "See Schedule",
  },
  {
    id: "PRC-004",
    name: "Cleveland Cardiology Associates",
    type: "Group Practice",
    specialty: "Cardiology",
    address: "369 Heart Center Dr",
    city: "Cleveland",
    county: "Cuyahoga",
    state: "OH",
    zip: "44104",
    country: "USA",
    phone: "(555) 901-2345",
    fax: "(555) 901-2346",
    billingPhone: "(555) 901-2347",
    billingFax: "(555) 901-2348",
    email: "info@clevcardio.com",
    contactName: "Robert Thompson",
    correspondenceAddress: "P.O. Box 9012",
    correspondenceCity: "Cleveland",
    correspondenceState: "OH",
    correspondenceZip: "44104",
    correspondenceCountry: "USA",
    correspondenceFax: "(555) 901-2349",
    payToNpi: "9012345678",
    payToName: "CCA Management Group",
    payToTaxId: "34-9012000",
    payToAddress: "P.O. Box 9012",
    payToCity: "Cleveland",
    payToState: "OH",
    payToZip: "44104",
    payToCountry: "USA",
    status: "active",
    contractStart: "2024-03-15",
    contractEnd: "2027-03-14",
    discountType: "% of Medicare",
    discountRate: "130%",
  },
  {
    id: "PRC-005",
    name: "Westlake Urgent Care",
    type: "Facility",
    specialty: "Urgent Care",
    address: "987 Quick Care Blvd",
    city: "Westlake",
    county: "Cuyahoga",
    state: "OH",
    zip: "44145",
    country: "USA",
    phone: "(555) 678-9012",
    fax: "(555) 678-9013",
    billingPhone: "(555) 678-9014",
    billingFax: "(555) 678-9015",
    email: "info@westlakeuc.com",
    contactName: "Patricia Lee",
    correspondenceAddress: "987 Quick Care Blvd",
    correspondenceCity: "Westlake",
    correspondenceState: "OH",
    correspondenceZip: "44145",
    correspondenceCountry: "USA",
    correspondenceFax: "(555) 678-9016",
    payToNpi: "6789012345",
    payToName: "Westlake Urgent Care LLC",
    payToTaxId: "34-6789012",
    payToAddress: "987 Quick Care Blvd",
    payToCity: "Westlake",
    payToState: "OH",
    payToZip: "44145",
    payToCountry: "USA",
    status: "active",
    contractStart: "2025-01-01",
    contractEnd: "2028-12-31",
    discountType: "% Off Billed",
    discountRate: "30%",
  },
  {
    id: "PRC-006",
    name: "University Hospitals Cleveland Medical Center",
    type: "Facility",
    specialty: "Multi-Specialty Hospital",
    address: "11100 Euclid Avenue",
    city: "Cleveland",
    county: "Cuyahoga",
    state: "OH",
    zip: "44106",
    country: "USA",
    phone: "(216) 844-1000",
    fax: "(216) 844-1001",
    billingPhone: "(216) 844-2000",
    billingFax: "(216) 844-2001",
    email: "providerrelations@uhhospitals.org",
    contactName: "Angela Martinez",
    correspondenceAddress: "11100 Euclid Avenue, Admin Building",
    correspondenceCity: "Cleveland",
    correspondenceState: "OH",
    correspondenceZip: "44106",
    correspondenceCountry: "USA",
    correspondenceFax: "(216) 844-2002",
    payToNpi: "1234509876",
    payToName: "University Hospitals Health System Inc",
    payToTaxId: "34-0714586",
    payToAddress: "P.O. Box 94516",
    payToCity: "Cleveland",
    payToState: "OH",
    payToZip: "44101",
    payToCountry: "USA",
    status: "active",
    contractStart: "2024-01-01",
    contractEnd: "2029-12-31",
    discountType: "% of Medicare",
    discountRate: "145%",
  },
  {
    id: "PRC-IND",
    name: "Independent Providers",
    type: "Group Practice",
    specialty: "Various",
    address: "N/A",
    city: "Cleveland",
    county: "Cuyahoga",
    state: "OH",
    zip: "44101",
    country: "USA",
    phone: "N/A",
    fax: "N/A",
    billingPhone: "N/A",
    billingFax: "N/A",
    email: "N/A",
    contactName: "N/A",
    correspondenceAddress: "N/A",
    correspondenceCity: "Cleveland",
    correspondenceState: "OH",
    correspondenceZip: "44101",
    correspondenceCountry: "USA",
    correspondenceFax: "N/A",
    payToNpi: "N/A",
    payToName: "Individual - See Provider",
    payToTaxId: "N/A",
    payToAddress: "N/A",
    payToCity: "N/A",
    payToState: "N/A",
    payToZip: "N/A",
    payToCountry: "USA",
    status: "active",
    contractStart: "2024-01-01",
    contractEnd: "2027-12-31",
    discountType: "Individual Contracts",
    discountRate: "Varies",
  },
];

const providers: Provider[] = [
  // Cleveland Family Medicine providers
  { id: "PRV-001", practiceId: "PRC-001", name: "Robert Smith", credential: "MD", npi: "1111111111", gender: "Male", specialty: "Family Medicine", primaryTaxonomy: "207Q00000X", primaryTaxonomyDesc: "Family Medicine", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-123456", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "8:00 AM - 5:00 PM", wednesday: "8:00 AM - 5:00 PM", thursday: "8:00 AM - 5:00 PM", friday: "8:00 AM - 3:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-002", practiceId: "PRC-001", name: "Jennifer Adams", credential: "MD", npi: "1111111112", gender: "Female", specialty: "Family Medicine", primaryTaxonomy: "207Q00000X", primaryTaxonomyDesc: "Family Medicine", secondaryTaxonomy: "207QA0505X", secondaryTaxonomyDesc: "Adult Medicine", licenseState: "OH", licenseNumber: "MD-35-123457", acceptingNewPatients: true, languages: ["eng", "spa"], clinicHours: { monday: "9:00 AM - 6:00 PM", tuesday: "9:00 AM - 6:00 PM", wednesday: "Closed", thursday: "9:00 AM - 6:00 PM", friday: "9:00 AM - 6:00 PM", saturday: "9:00 AM - 12:00 PM", sunday: "Closed" } },
  { id: "PRV-003", practiceId: "PRC-001", name: "Michael Chen", credential: "DO", npi: "1111111113", gender: "Male", specialty: "Family Medicine", primaryTaxonomy: "207Q00000X", primaryTaxonomyDesc: "Family Medicine", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "DO-35-123458", acceptingNewPatients: false, languages: ["eng", "cmn", "yue"], clinicHours: { monday: "7:00 AM - 4:00 PM", tuesday: "7:00 AM - 4:00 PM", wednesday: "7:00 AM - 4:00 PM", thursday: "7:00 AM - 4:00 PM", friday: "7:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-004", practiceId: "PRC-001", name: "Sarah Williams", credential: "NP", npi: "1111111114", gender: "Female", specialty: "Family Medicine", primaryTaxonomy: "363L00000X", primaryTaxonomyDesc: "Nurse Practitioner", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "NP-35-123459", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "8:00 AM - 5:00 PM", wednesday: "8:00 AM - 5:00 PM", thursday: "8:00 AM - 5:00 PM", friday: "8:00 AM - 5:00 PM", saturday: "Closed", sunday: "Closed" } },

  // Cleveland Orthopedic Associates providers
  { id: "PRV-005", practiceId: "PRC-002", name: "James Miller", credential: "MD", npi: "4444444441", gender: "Male", specialty: "Orthopedic Surgery", primaryTaxonomy: "207X00000X", primaryTaxonomyDesc: "Orthopedic Surgery", secondaryTaxonomy: "207XS0114X", secondaryTaxonomyDesc: "Sports Medicine", licenseState: "OH", licenseNumber: "MD-35-456789", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "8:00 AM - 4:00 PM", tuesday: "Surgery Day", wednesday: "8:00 AM - 4:00 PM", thursday: "Surgery Day", friday: "8:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-006", practiceId: "PRC-002", name: "Lisa Thompson", credential: "MD", npi: "4444444442", gender: "Female", specialty: "Orthopedic Surgery", primaryTaxonomy: "207X00000X", primaryTaxonomyDesc: "Orthopedic Surgery", secondaryTaxonomy: "207XP3100X", secondaryTaxonomyDesc: "Pediatric Orthopedics", licenseState: "OH", licenseNumber: "MD-35-456790", acceptingNewPatients: true, languages: ["eng", "fra"], clinicHours: { monday: "9:00 AM - 5:00 PM", tuesday: "9:00 AM - 5:00 PM", wednesday: "Surgery Day", thursday: "9:00 AM - 5:00 PM", friday: "9:00 AM - 3:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-007", practiceId: "PRC-002", name: "David Park", credential: "MD", npi: "4444444443", gender: "Male", specialty: "Orthopedic Surgery", primaryTaxonomy: "207X00000X", primaryTaxonomyDesc: "Orthopedic Surgery", secondaryTaxonomy: "207XX0004X", secondaryTaxonomyDesc: "Spine Surgery", licenseState: "OH", licenseNumber: "MD-35-456791", acceptingNewPatients: false, languages: ["eng", "kor"], clinicHours: { monday: "Surgery Day", tuesday: "8:00 AM - 4:00 PM", wednesday: "Surgery Day", thursday: "8:00 AM - 4:00 PM", friday: "8:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-008", practiceId: "PRC-002", name: "Amy Rodriguez", credential: "PA", npi: "4444444444", gender: "Female", specialty: "Orthopedics", primaryTaxonomy: "363A00000X", primaryTaxonomyDesc: "Physician Assistant", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "PA-35-456792", acceptingNewPatients: true, languages: ["eng", "spa"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "8:00 AM - 5:00 PM", wednesday: "8:00 AM - 5:00 PM", thursday: "8:00 AM - 5:00 PM", friday: "8:00 AM - 5:00 PM", saturday: "Closed", sunday: "Closed" } },

  // Metro Imaging Center providers
  { id: "PRV-009", practiceId: "PRC-003", name: "Thomas Richards", credential: "MD", npi: "3333333331", gender: "Male", specialty: "Radiology", primaryTaxonomy: "2085R0202X", primaryTaxonomyDesc: "Diagnostic Radiology", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-345678", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "7:00 AM - 3:00 PM", tuesday: "7:00 AM - 3:00 PM", wednesday: "7:00 AM - 3:00 PM", thursday: "7:00 AM - 3:00 PM", friday: "7:00 AM - 3:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-010", practiceId: "PRC-003", name: "Karen Lee", credential: "MD", npi: "3333333332", gender: "Female", specialty: "Radiology", primaryTaxonomy: "2085R0202X", primaryTaxonomyDesc: "Diagnostic Radiology", secondaryTaxonomy: "2085N0700X", secondaryTaxonomyDesc: "Neuroradiology", licenseState: "OH", licenseNumber: "MD-35-345679", acceptingNewPatients: true, languages: ["eng", "kor", "jpn"], clinicHours: { monday: "10:00 AM - 6:00 PM", tuesday: "10:00 AM - 6:00 PM", wednesday: "10:00 AM - 6:00 PM", thursday: "10:00 AM - 6:00 PM", friday: "10:00 AM - 6:00 PM", saturday: "8:00 AM - 12:00 PM", sunday: "Closed" } },

  // Cleveland Cardiology Associates providers
  { id: "PRV-011", practiceId: "PRC-004", name: "Robert Thompson", credential: "MD", npi: "9999999991", gender: "Male", specialty: "Cardiology", primaryTaxonomy: "207RC0000X", primaryTaxonomyDesc: "Cardiovascular Disease", secondaryTaxonomy: "207RI0011X", secondaryTaxonomyDesc: "Interventional Cardiology", licenseState: "OH", licenseNumber: "MD-35-901234", acceptingNewPatients: false, languages: ["eng"], clinicHours: { monday: "8:00 AM - 4:00 PM", tuesday: "Cath Lab", wednesday: "8:00 AM - 4:00 PM", thursday: "Cath Lab", friday: "8:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-012", practiceId: "PRC-004", name: "Michelle Wang", credential: "MD", npi: "9999999992", gender: "Female", specialty: "Cardiology", primaryTaxonomy: "207RC0000X", primaryTaxonomyDesc: "Cardiovascular Disease", secondaryTaxonomy: "207RE0101X", secondaryTaxonomyDesc: "Electrophysiology", licenseState: "OH", licenseNumber: "MD-35-901235", acceptingNewPatients: true, languages: ["eng", "cmn"], clinicHours: { monday: "9:00 AM - 5:00 PM", tuesday: "9:00 AM - 5:00 PM", wednesday: "EP Lab", thursday: "9:00 AM - 5:00 PM", friday: "9:00 AM - 3:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-013", practiceId: "PRC-004", name: "Daniel Kim", credential: "MD", npi: "9999999993", gender: "Male", specialty: "Cardiology", primaryTaxonomy: "207RC0000X", primaryTaxonomyDesc: "Cardiovascular Disease", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-901236", acceptingNewPatients: true, languages: ["eng", "kor"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "8:00 AM - 5:00 PM", wednesday: "8:00 AM - 5:00 PM", thursday: "8:00 AM - 5:00 PM", friday: "8:00 AM - 5:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-014", practiceId: "PRC-004", name: "Emily Foster", credential: "NP", npi: "9999999994", gender: "Female", specialty: "Cardiology", primaryTaxonomy: "363L00000X", primaryTaxonomyDesc: "Nurse Practitioner", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "NP-35-901237", acceptingNewPatients: true, languages: ["eng", "spa"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "8:00 AM - 5:00 PM", wednesday: "8:00 AM - 5:00 PM", thursday: "8:00 AM - 5:00 PM", friday: "8:00 AM - 3:00 PM", saturday: "Closed", sunday: "Closed" } },

  // Westlake Urgent Care providers
  { id: "PRV-015", practiceId: "PRC-005", name: "Patricia Lee", credential: "MD", npi: "6666666661", gender: "Female", specialty: "Emergency Medicine", primaryTaxonomy: "207P00000X", primaryTaxonomyDesc: "Emergency Medicine", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-678901", acceptingNewPatients: true, languages: ["eng", "vie"], clinicHours: { monday: "8:00 AM - 8:00 PM", tuesday: "8:00 AM - 8:00 PM", wednesday: "Closed", thursday: "8:00 AM - 8:00 PM", friday: "8:00 AM - 8:00 PM", saturday: "9:00 AM - 5:00 PM", sunday: "9:00 AM - 5:00 PM" } },
  { id: "PRV-016", practiceId: "PRC-005", name: "Mark Johnson", credential: "DO", npi: "6666666662", gender: "Male", specialty: "Emergency Medicine", primaryTaxonomy: "207P00000X", primaryTaxonomyDesc: "Emergency Medicine", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "DO-35-678902", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "Closed", tuesday: "8:00 AM - 8:00 PM", wednesday: "8:00 AM - 8:00 PM", thursday: "8:00 AM - 8:00 PM", friday: "8:00 AM - 8:00 PM", saturday: "9:00 AM - 5:00 PM", sunday: "Closed" } },
  { id: "PRV-017", practiceId: "PRC-005", name: "Jessica Brown", credential: "PA", npi: "6666666663", gender: "Female", specialty: "Emergency Medicine", primaryTaxonomy: "363A00000X", primaryTaxonomyDesc: "Physician Assistant", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "PA-35-678903", acceptingNewPatients: true, languages: ["eng", "spa", "por"], clinicHours: { monday: "10:00 AM - 8:00 PM", tuesday: "10:00 AM - 8:00 PM", wednesday: "10:00 AM - 8:00 PM", thursday: "Closed", friday: "10:00 AM - 8:00 PM", saturday: "10:00 AM - 6:00 PM", sunday: "10:00 AM - 6:00 PM" } },

  // University Hospitals Cleveland Medical Center - 20 providers
  { id: "PRV-018", practiceId: "PRC-006", name: "William Anderson", credential: "MD", npi: "8888888801", gender: "Male", specialty: "Internal Medicine", primaryTaxonomy: "207R00000X", primaryTaxonomyDesc: "Internal Medicine", secondaryTaxonomy: "207RH0000X", secondaryTaxonomyDesc: "Hematology", licenseState: "OH", licenseNumber: "MD-35-800001", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "8:00 AM - 4:00 PM", tuesday: "8:00 AM - 4:00 PM", wednesday: "8:00 AM - 4:00 PM", thursday: "8:00 AM - 4:00 PM", friday: "8:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-019", practiceId: "PRC-006", name: "Maria Garcia", credential: "MD", npi: "8888888802", gender: "Female", specialty: "Oncology", primaryTaxonomy: "207RX0202X", primaryTaxonomyDesc: "Medical Oncology", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-800002", acceptingNewPatients: true, languages: ["eng", "spa"], clinicHours: { monday: "9:00 AM - 5:00 PM", tuesday: "9:00 AM - 5:00 PM", wednesday: "9:00 AM - 5:00 PM", thursday: "9:00 AM - 5:00 PM", friday: "9:00 AM - 3:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-020", practiceId: "PRC-006", name: "James Wilson", credential: "MD", npi: "8888888803", gender: "Male", specialty: "General Surgery", primaryTaxonomy: "208600000X", primaryTaxonomyDesc: "Surgery", secondaryTaxonomy: "2086S0102X", secondaryTaxonomyDesc: "Surgical Critical Care", licenseState: "OH", licenseNumber: "MD-35-800003", acceptingNewPatients: false, languages: ["eng"], clinicHours: { monday: "Surgery", tuesday: "7:00 AM - 3:00 PM", wednesday: "Surgery", thursday: "7:00 AM - 3:00 PM", friday: "Surgery", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-021", practiceId: "PRC-006", name: "Linda Martinez", credential: "MD", npi: "8888888804", gender: "Female", specialty: "Pediatrics", primaryTaxonomy: "208000000X", primaryTaxonomyDesc: "Pediatrics", secondaryTaxonomy: "2080P0006X", secondaryTaxonomyDesc: "Developmental Pediatrics", licenseState: "OH", licenseNumber: "MD-35-800004", acceptingNewPatients: true, languages: ["eng", "spa"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "8:00 AM - 5:00 PM", wednesday: "8:00 AM - 5:00 PM", thursday: "8:00 AM - 5:00 PM", friday: "8:00 AM - 5:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-022", practiceId: "PRC-006", name: "Richard Taylor", credential: "MD", npi: "8888888805", gender: "Male", specialty: "Neurology", primaryTaxonomy: "2084N0400X", primaryTaxonomyDesc: "Neurology", secondaryTaxonomy: "2084N0402X", secondaryTaxonomyDesc: "Neuromuscular Medicine", licenseState: "OH", licenseNumber: "MD-35-800005", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "9:00 AM - 4:00 PM", tuesday: "9:00 AM - 4:00 PM", wednesday: "9:00 AM - 4:00 PM", thursday: "9:00 AM - 4:00 PM", friday: "Closed", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-023", practiceId: "PRC-006", name: "Susan Brown", credential: "MD", npi: "8888888806", gender: "Female", specialty: "OB/GYN", primaryTaxonomy: "207V00000X", primaryTaxonomyDesc: "Obstetrics & Gynecology", secondaryTaxonomy: "207VG0400X", secondaryTaxonomyDesc: "Gynecology", licenseState: "OH", licenseNumber: "MD-35-800006", acceptingNewPatients: true, languages: ["eng", "fra"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "8:00 AM - 5:00 PM", wednesday: "8:00 AM - 5:00 PM", thursday: "8:00 AM - 5:00 PM", friday: "8:00 AM - 2:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-024", practiceId: "PRC-006", name: "Christopher Lee", credential: "MD", npi: "8888888807", gender: "Male", specialty: "Pulmonology", primaryTaxonomy: "207RP1001X", primaryTaxonomyDesc: "Pulmonary Disease", secondaryTaxonomy: "207RC0001X", secondaryTaxonomyDesc: "Critical Care Medicine", licenseState: "OH", licenseNumber: "MD-35-800007", acceptingNewPatients: true, languages: ["eng", "kor"], clinicHours: { monday: "8:00 AM - 4:00 PM", tuesday: "ICU Rounds", wednesday: "8:00 AM - 4:00 PM", thursday: "ICU Rounds", friday: "8:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-025", practiceId: "PRC-006", name: "Nancy White", credential: "MD", npi: "8888888808", gender: "Female", specialty: "Nephrology", primaryTaxonomy: "207RN0300X", primaryTaxonomyDesc: "Nephrology", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-800008", acceptingNewPatients: false, languages: ["eng"], clinicHours: { monday: "Dialysis Unit", tuesday: "8:00 AM - 4:00 PM", wednesday: "Dialysis Unit", thursday: "8:00 AM - 4:00 PM", friday: "8:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-026", practiceId: "PRC-006", name: "David Harris", credential: "MD", npi: "8888888809", gender: "Male", specialty: "Gastroenterology", primaryTaxonomy: "207RG0100X", primaryTaxonomyDesc: "Gastroenterology", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-800009", acceptingNewPatients: true, languages: ["eng", "ara"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "Procedures", wednesday: "8:00 AM - 5:00 PM", thursday: "Procedures", friday: "8:00 AM - 3:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-027", practiceId: "PRC-006", name: "Jennifer Clark", credential: "MD", npi: "8888888810", gender: "Female", specialty: "Endocrinology", primaryTaxonomy: "207RE0101X", primaryTaxonomyDesc: "Endocrinology, Diabetes & Metabolism", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-800010", acceptingNewPatients: true, languages: ["eng", "cmn"], clinicHours: { monday: "9:00 AM - 5:00 PM", tuesday: "9:00 AM - 5:00 PM", wednesday: "9:00 AM - 5:00 PM", thursday: "9:00 AM - 5:00 PM", friday: "9:00 AM - 1:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-028", practiceId: "PRC-006", name: "Michael Robinson", credential: "MD", npi: "8888888811", gender: "Male", specialty: "Rheumatology", primaryTaxonomy: "207RR0500X", primaryTaxonomyDesc: "Rheumatology", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-800011", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "8:00 AM - 4:00 PM", tuesday: "8:00 AM - 4:00 PM", wednesday: "8:00 AM - 4:00 PM", thursday: "8:00 AM - 4:00 PM", friday: "Closed", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-029", practiceId: "PRC-006", name: "Elizabeth Lewis", credential: "MD", npi: "8888888812", gender: "Female", specialty: "Dermatology", primaryTaxonomy: "207N00000X", primaryTaxonomyDesc: "Dermatology", secondaryTaxonomy: "207ND0101X", secondaryTaxonomyDesc: "Dermatopathology", licenseState: "OH", licenseNumber: "MD-35-800012", acceptingNewPatients: true, languages: ["eng", "rus"], clinicHours: { monday: "9:00 AM - 5:00 PM", tuesday: "9:00 AM - 5:00 PM", wednesday: "9:00 AM - 5:00 PM", thursday: "9:00 AM - 5:00 PM", friday: "9:00 AM - 3:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-030", practiceId: "PRC-006", name: "Robert Walker", credential: "MD", npi: "8888888813", gender: "Male", specialty: "Urology", primaryTaxonomy: "208800000X", primaryTaxonomyDesc: "Urology", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-800013", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "8:00 AM - 4:00 PM", tuesday: "Surgery", wednesday: "8:00 AM - 4:00 PM", thursday: "Surgery", friday: "8:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-031", practiceId: "PRC-006", name: "Patricia Hall", credential: "NP", npi: "8888888814", gender: "Female", specialty: "Primary Care", primaryTaxonomy: "363L00000X", primaryTaxonomyDesc: "Nurse Practitioner", secondaryTaxonomy: "363LA2200X", secondaryTaxonomyDesc: "Adult Health", licenseState: "OH", licenseNumber: "NP-35-800014", acceptingNewPatients: true, languages: ["eng", "spa"], clinicHours: { monday: "8:00 AM - 6:00 PM", tuesday: "8:00 AM - 6:00 PM", wednesday: "8:00 AM - 6:00 PM", thursday: "8:00 AM - 6:00 PM", friday: "8:00 AM - 4:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-032", practiceId: "PRC-006", name: "Steven Young", credential: "MD", npi: "8888888815", gender: "Male", specialty: "Infectious Disease", primaryTaxonomy: "207RI0200X", primaryTaxonomyDesc: "Infectious Disease", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-800015", acceptingNewPatients: true, languages: ["eng", "hin"], clinicHours: { monday: "9:00 AM - 4:00 PM", tuesday: "9:00 AM - 4:00 PM", wednesday: "9:00 AM - 4:00 PM", thursday: "9:00 AM - 4:00 PM", friday: "9:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-033", practiceId: "PRC-006", name: "Amanda King", credential: "MD", npi: "8888888816", gender: "Female", specialty: "Psychiatry", primaryTaxonomy: "2084P0800X", primaryTaxonomyDesc: "Psychiatry", secondaryTaxonomy: "2084P0802X", secondaryTaxonomyDesc: "Addiction Psychiatry", licenseState: "OH", licenseNumber: "MD-35-800016", acceptingNewPatients: false, languages: ["eng"], clinicHours: { monday: "10:00 AM - 6:00 PM", tuesday: "10:00 AM - 6:00 PM", wednesday: "10:00 AM - 6:00 PM", thursday: "10:00 AM - 6:00 PM", friday: "10:00 AM - 2:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-034", practiceId: "PRC-006", name: "Kevin Wright", credential: "PA", npi: "8888888817", gender: "Male", specialty: "Orthopedic Surgery", primaryTaxonomy: "363A00000X", primaryTaxonomyDesc: "Physician Assistant", secondaryTaxonomy: "363AM0700X", secondaryTaxonomyDesc: "Medical", licenseState: "OH", licenseNumber: "PA-35-800017", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "7:00 AM - 4:00 PM", tuesday: "7:00 AM - 4:00 PM", wednesday: "7:00 AM - 4:00 PM", thursday: "7:00 AM - 4:00 PM", friday: "7:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-035", practiceId: "PRC-006", name: "Melissa Scott", credential: "MD", npi: "8888888818", gender: "Female", specialty: "Emergency Medicine", primaryTaxonomy: "207P00000X", primaryTaxonomyDesc: "Emergency Medicine", secondaryTaxonomy: "207PT0002X", secondaryTaxonomyDesc: "Medical Toxicology", licenseState: "OH", licenseNumber: "MD-35-800018", acceptingNewPatients: true, languages: ["eng", "tgl"], clinicHours: { monday: "ER Shifts", tuesday: "ER Shifts", wednesday: "Closed", thursday: "ER Shifts", friday: "ER Shifts", saturday: "ER Shifts", sunday: "Closed" } },
  { id: "PRV-036", practiceId: "PRC-006", name: "Brian Green", credential: "MD", npi: "8888888819", gender: "Male", specialty: "Anesthesiology", primaryTaxonomy: "207L00000X", primaryTaxonomyDesc: "Anesthesiology", secondaryTaxonomy: "207LP2900X", secondaryTaxonomyDesc: "Pain Medicine", licenseState: "OH", licenseNumber: "MD-35-800019", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "OR Schedule", tuesday: "OR Schedule", wednesday: "Pain Clinic", thursday: "OR Schedule", friday: "OR Schedule", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-037", practiceId: "PRC-006", name: "Stephanie Adams", credential: "MD", npi: "8888888820", gender: "Female", specialty: "Physical Medicine", primaryTaxonomy: "208100000X", primaryTaxonomyDesc: "Physical Medicine & Rehabilitation", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-800020", acceptingNewPatients: true, languages: ["eng", "jpn"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "8:00 AM - 5:00 PM", wednesday: "8:00 AM - 5:00 PM", thursday: "8:00 AM - 5:00 PM", friday: "8:00 AM - 3:00 PM", saturday: "Closed", sunday: "Closed" } },

  // Independent Providers (not affiliated with a group practice)
  { id: "PRV-IND-001", practiceId: "PRC-IND", name: "Dr. Anthony Russo", credential: "MD", npi: "7777777701", gender: "Male", specialty: "Pain Management", primaryTaxonomy: "208VP0014X", primaryTaxonomyDesc: "Interventional Pain Medicine", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-700001", acceptingNewPatients: true, languages: ["eng", "ita"], clinicHours: { monday: "9:00 AM - 5:00 PM", tuesday: "9:00 AM - 5:00 PM", wednesday: "9:00 AM - 5:00 PM", thursday: "9:00 AM - 5:00 PM", friday: "9:00 AM - 1:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-IND-002", practiceId: "PRC-IND", name: "Dr. Helen Patel", credential: "MD", npi: "7777777702", gender: "Female", specialty: "Allergy & Immunology", primaryTaxonomy: "207K00000X", primaryTaxonomyDesc: "Allergy & Immunology", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-700002", acceptingNewPatients: true, languages: ["eng", "hin", "urd"], clinicHours: { monday: "8:00 AM - 4:00 PM", tuesday: "8:00 AM - 4:00 PM", wednesday: "Closed", thursday: "8:00 AM - 4:00 PM", friday: "8:00 AM - 4:00 PM", saturday: "9:00 AM - 12:00 PM", sunday: "Closed" } },
  { id: "PRV-IND-003", practiceId: "PRC-IND", name: "Dr. Samuel Okonkwo", credential: "MD", npi: "7777777703", gender: "Male", specialty: "Sleep Medicine", primaryTaxonomy: "207QS1201X", primaryTaxonomyDesc: "Sleep Medicine", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-700003", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "10:00 AM - 6:00 PM", tuesday: "10:00 AM - 6:00 PM", wednesday: "10:00 AM - 6:00 PM", thursday: "10:00 AM - 6:00 PM", friday: "Closed", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-IND-004", practiceId: "PRC-IND", name: "Dr. Rachel Steinberg", credential: "DO", npi: "7777777704", gender: "Female", specialty: "Osteopathic Medicine", primaryTaxonomy: "204E00000X", primaryTaxonomyDesc: "Oral & Maxillofacial Surgery", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "DO-35-700004", acceptingNewPatients: true, languages: ["eng", "heb"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "Surgery", wednesday: "8:00 AM - 5:00 PM", thursday: "Surgery", friday: "8:00 AM - 2:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-IND-005", practiceId: "PRC-IND", name: "Dr. Carlos Mendez", credential: "MD", npi: "7777777705", gender: "Male", specialty: "Sports Medicine", primaryTaxonomy: "207XX0005X", primaryTaxonomyDesc: "Sports Medicine", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-700005", acceptingNewPatients: true, languages: ["eng", "spa", "por"], clinicHours: { monday: "7:00 AM - 3:00 PM", tuesday: "7:00 AM - 3:00 PM", wednesday: "7:00 AM - 3:00 PM", thursday: "7:00 AM - 3:00 PM", friday: "7:00 AM - 12:00 PM", saturday: "Event Coverage", sunday: "Closed" } },
  { id: "PRV-IND-006", practiceId: "PRC-IND", name: "Dr. Yuki Tanaka", credential: "MD", npi: "7777777706", gender: "Female", specialty: "Geriatric Medicine", primaryTaxonomy: "207QG0300X", primaryTaxonomyDesc: "Geriatric Medicine", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-700006", acceptingNewPatients: true, languages: ["eng", "jpn"], clinicHours: { monday: "9:00 AM - 4:00 PM", tuesday: "9:00 AM - 4:00 PM", wednesday: "9:00 AM - 4:00 PM", thursday: "9:00 AM - 4:00 PM", friday: "9:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-IND-007", practiceId: "PRC-IND", name: "Dr. Ahmed Hassan", credential: "MD", npi: "7777777707", gender: "Male", specialty: "Vascular Surgery", primaryTaxonomy: "208G00000X", primaryTaxonomyDesc: "Thoracic Surgery (Cardiothoracic Vascular)", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-700007", acceptingNewPatients: false, languages: ["eng", "ara", "fas"], clinicHours: { monday: "Surgery", tuesday: "8:00 AM - 4:00 PM", wednesday: "Surgery", thursday: "8:00 AM - 4:00 PM", friday: "8:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-IND-008", practiceId: "PRC-IND", name: "Dr. Natasha Volkov", credential: "MD", npi: "7777777708", gender: "Female", specialty: "Plastic Surgery", primaryTaxonomy: "208200000X", primaryTaxonomyDesc: "Plastic Surgery", secondaryTaxonomy: "2082S0099X", secondaryTaxonomyDesc: "Plastic Surgery Within the Head & Neck", licenseState: "OH", licenseNumber: "MD-35-700008", acceptingNewPatients: true, languages: ["eng", "rus", "pol"], clinicHours: { monday: "9:00 AM - 5:00 PM", tuesday: "Surgery", wednesday: "9:00 AM - 5:00 PM", thursday: "Surgery", friday: "9:00 AM - 3:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-IND-009", practiceId: "PRC-IND", name: "Dr. Kwame Asante", credential: "MD", npi: "7777777709", gender: "Male", specialty: "Ophthalmology", primaryTaxonomy: "207W00000X", primaryTaxonomyDesc: "Ophthalmology", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-700009", acceptingNewPatients: true, languages: ["eng"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "8:00 AM - 5:00 PM", wednesday: "Surgery", thursday: "8:00 AM - 5:00 PM", friday: "8:00 AM - 3:00 PM", saturday: "Closed", sunday: "Closed" } },
  { id: "PRV-IND-010", practiceId: "PRC-IND", name: "Dr. Priya Sharma", credential: "MD", npi: "7777777710", gender: "Female", specialty: "Reproductive Endocrinology", primaryTaxonomy: "207VE0102X", primaryTaxonomyDesc: "Reproductive Endocrinology", secondaryTaxonomy: "", secondaryTaxonomyDesc: "", licenseState: "OH", licenseNumber: "MD-35-700010", acceptingNewPatients: true, languages: ["eng", "hin", "ben"], clinicHours: { monday: "8:00 AM - 5:00 PM", tuesday: "8:00 AM - 5:00 PM", wednesday: "8:00 AM - 5:00 PM", thursday: "8:00 AM - 5:00 PM", friday: "8:00 AM - 12:00 PM", saturday: "Closed", sunday: "Closed" } },
];

const statusOptions = ["All", "Active", "Pending", "Inactive"];
const typeOptions = ["All Types", "Group Practice", "Facility"];

export default function ProvidersPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "providers" | "billing" | "payto" | "contract">("info");
  const [showAddPractice, setShowAddPractice] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [showCsvUpload, setShowCsvUpload] = useState(false);
  const [csvData, setCsvData] = useState<Partial<Provider>[]>([]);
  const [csvErrors, setCsvErrors] = useState<string[]>([]);
  const [isEditingPractice, setIsEditingPractice] = useState(false);
  const [isEditingProvider, setIsEditingProvider] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showNetworkAssign, setShowNetworkAssign] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
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
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'));

      const errors: string[] = [];
      const parsed: Partial<Provider>[] = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
        const row: any = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        // Map CSV columns to Provider fields
        const provider: Partial<Provider> = {
          name: row.name || row.provider_name || row.full_name || '',
          credential: row.credential || row.credentials || 'MD',
          npi: row.npi || row.provider_npi || '',
          gender: row.gender || '',
          specialty: row.specialty || row.speciality || '',
          primaryTaxonomy: row.primary_taxonomy || row.taxonomy_code || '',
          primaryTaxonomyDesc: row.primary_taxonomy_desc || row.taxonomy_description || '',
          secondaryTaxonomy: row.secondary_taxonomy || '',
          secondaryTaxonomyDesc: row.secondary_taxonomy_desc || '',
          licenseState: row.license_state || row.state_license || '',
          licenseNumber: row.license_number || row.license_no || '',
          acceptingNewPatients: row.accepting_new_patients?.toLowerCase() === 'yes' || row.accepting_new_patients?.toLowerCase() === 'true',
          languages: row.languages ? row.languages.split(';').map((l: string) => l.trim()) : ['eng'],
          clinicHours: {
            monday: row.monday || row.mon || '8:00 AM - 5:00 PM',
            tuesday: row.tuesday || row.tue || '8:00 AM - 5:00 PM',
            wednesday: row.wednesday || row.wed || '8:00 AM - 5:00 PM',
            thursday: row.thursday || row.thu || '8:00 AM - 5:00 PM',
            friday: row.friday || row.fri || '8:00 AM - 5:00 PM',
            saturday: row.saturday || row.sat || 'Closed',
            sunday: row.sunday || row.sun || 'Closed',
          },
        };

        // Validate required fields
        if (!provider.name) errors.push(`Row ${i}: Missing provider name`);
        if (!provider.npi) errors.push(`Row ${i}: Missing NPI`);

        if (provider.name && provider.npi) {
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
              value={providers.length}
              icon={<Users className="w-5 h-5" />}
              delay={1}
            />
            <StatCard
              label="Active Practices"
              value={practices.filter(p => p.status === "active").length}
              change={`${Math.round((practices.filter(p => p.status === "active").length / practices.length) * 100)}%`}
              trend="up"
              icon={<CheckCircle className="w-5 h-5" />}
              delay={2}
            />
            <StatCard
              label="Accepting Patients"
              value={providers.filter(p => p.acceptingNewPatients).length}
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
                      <Users className={cn("w-4 h-4", isDark ? "text-teal-400" : "text-teal-600")} />
                      <span className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{practiceProviders.length}</span>
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
                        <MapPin className="w-4 h-4 text-teal-400" />
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
                        <Phone className="w-4 h-4 text-teal-400" />
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
                        className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors text-sm font-medium"
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
                                    <span className="text-xs text-teal-400">— {provider.primaryTaxonomyDesc}</span>
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
                                      <span key={lang} className="px-2 py-0.5 bg-teal-600 text-xs rounded-full" style={{ color: 'white' }}>
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
                            ? "bg-teal-600 text-white"
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
                    <h3 className="text-sm font-semibold text-white mb-3">Expected CSV Columns</h3>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-blue-400">name *</div>
                      <div className="text-blue-400">npi *</div>
                      <div className="text-slate-400">credential</div>
                      <div className="text-slate-400">gender</div>
                      <div className="text-slate-400">specialty</div>
                      <div className="text-slate-400">primary_taxonomy</div>
                      <div className="text-slate-400">primary_taxonomy_desc</div>
                      <div className="text-slate-400">license_state</div>
                      <div className="text-slate-400">license_number</div>
                      <div className="text-slate-400">accepting_new_patients</div>
                      <div className="text-slate-400">languages (semicolon sep)</div>
                      <div className="text-slate-400">monday, tuesday, etc.</div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">* Required fields. Column names are case-insensitive.</p>
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
                  <span key={lang} className="px-3 py-1.5 bg-teal-600 rounded-full text-sm font-medium" style={{ color: 'white' }}>
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
                <FileText className="w-5 h-5 text-teal-400" />
                Primary Taxonomy
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Taxonomy Code</p>
                  <p className="text-xl text-white font-mono">{provider.primaryTaxonomy || "Not Set"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Description</p>
                  <p className="text-lg text-teal-400">{provider.primaryTaxonomyDesc || "No description"}</p>
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
