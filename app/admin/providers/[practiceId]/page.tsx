"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Building2, MapPin, Phone, Mail, FileText, DollarSign, Users, Edit, Save, X,
  CheckCircle, Clock, AlertTriangle, Globe, CreditCard, Calendar, Percent, FileSignature, Upload, Plus
} from "lucide-react";

// Practice data (in real app, this would come from API)
const practicesData: Record<string, any> = {
  "PRC-001": {
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
    contactTitle: "Office Manager",
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
    w9Collected: true,
    contractStart: "2024-01-15",
    contractEnd: "2027-01-14",
    discountType: "% Off Billed",
    discountRate: "35%",
    networks: ["NET-001", "NET-002"],
    providers: [
      { id: "PRV-001", name: "Robert Smith", title: "MD", specialty: "Family Medicine", npi: "1111111111", status: "active", useCustomRates: false },
      { id: "PRV-002", name: "Jennifer Adams", title: "MD", specialty: "Family Medicine", npi: "1111111112", status: "active", useCustomRates: true },
      { id: "PRV-003", name: "Michael Chen", title: "DO", specialty: "Family Medicine", npi: "1111111113", status: "active", useCustomRates: false },
      { id: "PRV-004", name: "Sarah Williams", title: "NP", specialty: "Family Medicine", npi: "1111111114", status: "active", useCustomRates: true },
    ],
  },
  "PRC-002": {
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
    contactTitle: "Practice Administrator",
    correspondenceAddress: "321 Bone & Joint Dr",
    correspondenceAddress2: "Suite 100",
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
    w9Collected: false,
    contractStart: "2024-09-01",
    contractEnd: "2027-08-31",
    discountType: "% Off Billed",
    discountRate: "40%",
    networks: ["NET-001", "NET-003"],
    providers: [
      { id: "PRV-005", name: "James Miller", title: "MD", specialty: "Orthopedic Surgery", npi: "4444444441", status: "active", useCustomRates: true },
      { id: "PRV-006", name: "Lisa Thompson", title: "MD", specialty: "Orthopedic Surgery", npi: "4444444442", status: "active", useCustomRates: false },
      { id: "PRV-007", name: "David Park", title: "MD", specialty: "Orthopedic Surgery", npi: "4444444443", status: "active", useCustomRates: false },
      { id: "PRV-008", name: "Amy Rodriguez", title: "PA", specialty: "Orthopedics", npi: "4444444444", status: "active", useCustomRates: true },
    ],
  },
};

const networkNames: Record<string, string> = {
  "NET-001": "Ohio PPO Network",
  "NET-002": "Cleveland Metro Network",
  "NET-003": "Northeast Ohio Specialists",
  "NET-004": "Ohio Hospital Alliance",
  "NET-005": "Midwest Regional Network",
  "NET-006": "TrueCare Value Network",
};

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

export default function PracticeDetailPage() {
  const { isDark } = useTheme();
  const params = useParams();
  const searchParams = useSearchParams();
  const practiceId = params.practiceId as string;
  
  // Practice data state - load from API
  const [practice, setPractice] = useState<any>(null);
  const [practiceProviders, setPracticeProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeSection, setActiveSection] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // Modal states
  const [showAddNetwork, setShowAddNetwork] = useState(false);
  const [showAddProvider, setShowAddProvider] = useState(false);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [newProvider, setNewProvider] = useState({
    firstName: "",
    lastName: "",
    title: "MD",
    npi: "",
    specialty: "",
    email: "",
    phone: "",
    licenseState: "AZ",
    licenseNumber: "",
  });

  // Load practice data from API
  useEffect(() => {
    async function loadPractice() {
      try {
        // Fetch practice details
        const res = await fetch(`/api/practices?id=${practiceId}`);
        const data = await res.json();
        
        if (data.practice) {
          const p = data.practice;
          // Convert API data to page format
          const practiceData = {
            id: p.id,
            name: p.name || 'Unknown Practice',
            type: 'Group Practice',
            specialty: 'Multi-Specialty',
            npi: p.npi || '',
            taxId: p.taxId || '',
            address: p.address1 || '',
            address2: p.address2 || '',
            city: p.city || '',
            state: p.state || 'AZ',
            zip: p.zip || '',
            country: 'USA',
            phone: p.phone || '',
            fax: p.fax || '',
            email: '',
            contactName: '',
            contactTitle: '',
            status: 'active',
            w9Collected: false,
            providerCount: p.providerCount || 0,
            providerIds: p.providerIds || [],
            networks: ['arizona-antidote'],
            // Pay-to info
            payToNpi: p.npi || '',
            payToName: p.name || '',
            payToTaxId: p.taxId || '',
            payToAddress: p.address1 || '',
            payToCity: p.city || '',
            payToState: p.state || 'AZ',
            payToZip: p.zip || '',
            payToCountry: 'USA',
            // Contract info (defaults)
            contractStart: '2026-01-01',
            contractEnd: '2029-12-31',
            discountType: '% Off Billed',
            discountRate: '25%',
            providers: [], // Will be loaded separately
          };
          setPractice(practiceData);
          setEditData(practiceData);
          setNewProvider(prev => ({ ...prev, specialty: practiceData.specialty }));
          
          // Load providers for this practice using the providerIds
          if (p.providerIds && p.providerIds.length > 0) {
            // Fetch providers with NPI filter (first 50)
            const providerPromises = p.providerIds.slice(0, 50).map(async (pid: string) => {
              const npi = pid.replace('prov-', '');
              const provRes = await fetch(`/api/providers?search=${npi}&limit=1`);
              const provData = await provRes.json();
              return provData.providers?.[0];
            });
            
            const providers = await Promise.all(providerPromises);
            const validProviders = providers.filter(Boolean).map((prov: any) => ({
              id: `PRV-${prov.npi}`,
              name: `${prov.firstName || ''} ${prov.lastName || ''}`.trim() || 'Unknown',
              firstName: prov.firstName,
              lastName: prov.lastName,
              title: prov.credential || 'MD',
              specialty: prov.specialty || 'General Practice',
              npi: prov.npi,
              status: 'active',
              useCustomRates: false,
              isPrimaryCare: prov.isPrimaryCare,
              isBehavioralHealth: prov.isBehavioralHealth,
            }));
            
            setPracticeProviders(validProviders);
            setPractice((prev: any) => prev ? { ...prev, providers: validProviders } : null);
          }
        } else {
          // Fallback to mock data if practice not found
          setPractice(practicesData["PRC-001"]);
          setEditData(practicesData["PRC-001"]);
        }
      } catch (error) {
        console.error('Failed to load practice:', error);
        // Fallback to mock data on error
        setPractice(practicesData["PRC-001"]);
        setEditData(practicesData["PRC-001"]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPractice();
  }, [practiceId]);

  // Available networks (not already assigned to this practice)
  const availableNetworks = Object.entries(networkNames).filter(
    ([id]) => !practice?.networks?.includes(id)
  );

  // Provider CSV upload
  const providerFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedProviders, setUploadedProviders] = useState<any[]>([]);
  
  // CSV headers for provider import - official Solidarity format
  const providerCsvHeaders = [
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

  const downloadProviderTemplate = () => {
    const csv = providerCsvHeaders.join(',') + '\n';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'provider-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Parse CSV line handling quoted values
  const parseCsvLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  };

  const handleProviderCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter(line => line.trim());
      
      if (lines.length === 0) return;
      
      // Parse headers to create column mapping
      const headers = parseCsvLine(lines[0]).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
      
      // Create header index map - matches official Solidarity template
      const headerMap: Record<string, number> = {};
      headers.forEach((h, i) => {
        // Map header names to standard fields
        if (h === 'entity' || h.includes('entity')) headerMap['referenceNumber'] = i;
        else if (h === 'contract' || h.includes('contract')) headerMap['contractNumber'] = i;
        else if (h === 'npi' && !h.includes('billing')) headerMap['npi'] = i;
        else if (h.includes('firstname') || h === 'first') headerMap['firstName'] = i;
        else if (h.includes('lastname') || h === 'last') headerMap['lastName'] = i;
        else if (h.includes('midinit') || h.includes('middle')) headerMap['middleInitial'] = i;
        else if (h.includes('suffix')) headerMap['suffix'] = i;
        else if (h === 'address1' && !h.includes('billing') && !h.includes('corresponding')) headerMap['address1'] = i;
        else if (h === 'address2' && !h.includes('billing') && !h.includes('corresponding')) headerMap['address2'] = i;
        else if (h === 'city' && !h.includes('billing') && !h.includes('corresponding')) headerMap['city'] = i;
        else if (h === 'state' && !h.includes('billing') && !h.includes('corresponding')) headerMap['state'] = i;
        else if ((h === 'zipcode' || h === 'zip') && !h.includes('billing') && !h.includes('corresponding')) headerMap['zip'] = i;
        else if (h === 'county') headerMap['county'] = i;
        else if (h === 'gender' || h === 'sex') headerMap['gender'] = i;
        else if (h.includes('primaryspc') || h === 'primaryspccode') headerMap['specialtyCode'] = i;
        else if (h.includes('primarytaxonomy')) headerMap['taxonomyCode'] = i;
        else if (h.includes('secondaryspc')) headerMap['secondarySpecialtyCode'] = i;
        else if (h.includes('secondarytaxonomy')) headerMap['secondaryTaxonomyCode'] = i;
        else if (h.includes('facilitytype')) headerMap['facilityType'] = i;
        else if (h === 'phone' || h.includes('phone') && !h.includes('billing')) headerMap['phone'] = i;
        else if (h === 'fax' && !h.includes('billing') && !h.includes('corresponding')) headerMap['fax'] = i;
        else if (h === 'email') headerMap['email'] = i;
        else if (h === 'language' || h.includes('language')) headerMap['languages'] = i;
        else if (h.includes('acceptsnew') || h.includes('acceptnew')) headerMap['acceptingNewPatients'] = i;
        else if (h.includes('primarycare')) headerMap['isPrimaryCare'] = i;
        else if (h.includes('behavioral')) headerMap['isBehavioralHealth'] = i;
        else if (h.includes('directory') || h.includes('display')) headerMap['directoryDisplay'] = i;
        else if (h.includes('mondayhours') || h === 'monday') headerMap['mondayHours'] = i;
        else if (h.includes('tuesdayhours') || h === 'tuesday') headerMap['tuesdayHours'] = i;
        else if (h.includes('wednesdayhours') || h === 'wednesday') headerMap['wednesdayHours'] = i;
        else if (h.includes('thursdayhours') || h === 'thursday') headerMap['thursdayHours'] = i;
        else if (h.includes('fridayhours') || h === 'friday') headerMap['fridayHours'] = i;
        else if (h.includes('saturdayhours') || h === 'saturday') headerMap['saturdayHours'] = i;
        else if (h.includes('sundayhours') || h === 'sunday') headerMap['sundayHours'] = i;
        else if (h.includes('pricingtier')) headerMap['pricingTier'] = i;
        else if (h.includes('networkorg')) headerMap['networkOrg'] = i;
        else if (h.includes('startdate')) headerMap['contractStartDate'] = i;
        else if (h.includes('enddate')) headerMap['contractEndDate'] = i;
        // Corresponding address
        else if (h.includes('correspondingaddr1')) headerMap['correspondingAddress1'] = i;
        else if (h.includes('correspondingaddr2')) headerMap['correspondingAddress2'] = i;
        else if (h.includes('correspondingcity')) headerMap['correspondingCity'] = i;
        else if (h.includes('correspondingstate')) headerMap['correspondingState'] = i;
        else if (h.includes('correspondingzip')) headerMap['correspondingZip'] = i;
        else if (h.includes('contactname')) headerMap['contactName'] = i;
        else if (h.includes('correspondingfax')) headerMap['correspondingFax'] = i;
        // Billing info
        else if (h.includes('billingnpi')) headerMap['billingNpi'] = i;
        else if (h.includes('billingtax')) headerMap['billingTaxId'] = i;
        else if (h.includes('billingname')) headerMap['billingName'] = i;
        else if (h.includes('billingaddr1')) headerMap['billingAddress1'] = i;
        else if (h.includes('billingaddr2')) headerMap['billingAddress2'] = i;
        else if (h.includes('billingcity')) headerMap['billingCity'] = i;
        else if (h.includes('billingstate')) headerMap['billingState'] = i;
        else if (h.includes('billingzip')) headerMap['billingZip'] = i;
        else if (h.includes('billingphone')) headerMap['billingPhone'] = i;
        else if (h.includes('billingfax')) headerMap['billingFax'] = i;
      });
      
      const newProviders: any[] = [];
      
      // Parse data rows (skip header)
      for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        if (values.length < 3) continue; // Skip empty/invalid rows
        
        const npi = headerMap['npi'] !== undefined ? values[headerMap['npi']] : '';
        const lastName = headerMap['lastName'] !== undefined ? values[headerMap['lastName']] : '';
        const firstName = headerMap['firstName'] !== undefined ? values[headerMap['firstName']] : '';
        
        // Require NPI and Name
        if (!npi || (!lastName && !firstName)) continue;
        
        const getVal = (key: string) => headerMap[key] !== undefined ? values[headerMap[key]] || '' : '';
        const getBool = (key: string, defaultVal = false) => {
          const val = getVal(key)?.toLowerCase();
          return val === 'y' || val === 'yes' || val === 'true' || val === '1' || (defaultVal && !val);
        };
        
        newProviders.push({
          id: `PRV-UPLOAD-${Date.now()}-${i}`,
          npi,
          firstName,
          lastName,
          middleInitial: getVal('middleInitial'),
          suffix: getVal('suffix'),
          name: `${firstName} ${lastName}`.trim(),
          title: getVal('suffix') || 'MD',
          specialty: practice?.specialty || 'General Practice',
          specialtyCode: getVal('specialtyCode'),
          taxonomyCode: getVal('taxonomyCode'),
          secondarySpecialtyCode: getVal('secondarySpecialtyCode'),
          secondaryTaxonomyCode: getVal('secondaryTaxonomyCode'),
          facilityType: getVal('facilityType'),
          gender: getVal('gender'),
          referenceNumber: getVal('referenceNumber'),
          contractNumber: getVal('contractNumber'),
          isPrimaryCare: getBool('isPrimaryCare'),
          isBehavioralHealth: getBool('isBehavioralHealth'),
          phone: getVal('phone'),
          fax: getVal('fax'),
          email: getVal('email'),
          address1: getVal('address1'),
          address2: getVal('address2'),
          city: getVal('city'),
          state: getVal('state') || 'AZ',
          zip: getVal('zip'),
          county: getVal('county'),
          acceptingNewPatients: getBool('acceptingNewPatients', true),
          directoryDisplay: getBool('directoryDisplay', true),
          languages: getVal('languages') || 'English',
          // Hours
          hours: {
            monday: getVal('mondayHours'),
            tuesday: getVal('tuesdayHours'),
            wednesday: getVal('wednesdayHours'),
            thursday: getVal('thursdayHours'),
            friday: getVal('fridayHours'),
            saturday: getVal('saturdayHours'),
            sunday: getVal('sundayHours'),
          },
          // Contract info
          pricingTier: getVal('pricingTier'),
          networkOrg: getVal('networkOrg'),
          contractStartDate: getVal('contractStartDate'),
          contractEndDate: getVal('contractEndDate'),
          // Corresponding address
          correspondingAddress: {
            address1: getVal('correspondingAddress1'),
            address2: getVal('correspondingAddress2'),
            city: getVal('correspondingCity'),
            state: getVal('correspondingState'),
            zip: getVal('correspondingZip'),
            contactName: getVal('contactName'),
            fax: getVal('correspondingFax'),
          },
          // Billing info
          billing: {
            npi: getVal('billingNpi'),
            taxId: getVal('billingTaxId'),
            name: getVal('billingName'),
            address1: getVal('billingAddress1'),
            address2: getVal('billingAddress2'),
            city: getVal('billingCity'),
            state: getVal('billingState'),
            zip: getVal('billingZip'),
            phone: getVal('billingPhone'),
            fax: getVal('billingFax'),
          },
          status: "active",
          useCustomRates: false,
        });
      }
      
      if (newProviders.length > 0) {
        setUploadedProviders(newProviders);
        // Show success message
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        console.log(`Uploaded ${newProviders.length} providers`);
      }
    };
    reader.readAsText(file);
    
    // Reset input
    if (providerFileInputRef.current) {
      providerFileInputRef.current.value = "";
    }
  };

  // Auto-enable edit mode if ?edit=true
  useEffect(() => {
    if (searchParams.get("edit") === "true") {
      setIsEditing(true);
    }
  }, [searchParams]);

  // Discount rates state
  const [discountBasis, setDiscountBasis] = useState<"medicare" | "billed">("medicare");
  const [rateType, setRateType] = useState<"flat" | "custom">("flat");
  const [flatRate, setFlatRate] = useState("135");
  const [serviceRates, setServiceRates] = useState<Record<string, string>>({
    professional: "140",
    inpatient: "125",
    outpatient: "130",
    urgentCare: "145",
    labServices: "110",
    imaging: "120",
    mentalHealth: "135",
    physicalTherapy: "130",
    dme: "100",
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      // Prepare update payload
      const updateData = {
        name: editData.name,
        npi: editData.npi,
        taxId: editData.taxId,
        address1: editData.address1,
        address2: editData.address2,
        city: editData.city,
        state: editData.state,
        zip: editData.zip,
        phone: editData.phone,
        fax: editData.fax,
      };

      // Call API to update practice
      const res = await fetch(`/api/practices/${practice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        throw new Error('Failed to update practice');
      }

      // Update local state with saved data
      setPractice({ ...practice, ...editData });
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Failed to save practice:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: "overview", label: "Overview", icon: Building2 },
    { id: "contact", label: "Contact & Location", icon: MapPin },
    { id: "billing", label: "Billing Info", icon: CreditCard },
    { id: "contract", label: "Contract", icon: FileSignature },
    { id: "rates", label: "Rates & Discounts", icon: DollarSign },
    { id: "providers", label: "Providers", icon: Users },
    { id: "networks", label: "Networks", icon: Globe },
  ];

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
  if (!practice) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Building2 className="w-16 h-16 text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-white mb-2">Practice Not Found</h2>
        <p className="text-slate-400 mb-4">The practice with ID "{practiceId}" could not be found.</p>
        <Link href="/admin/providers" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">
          Back to Providers
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
            href="/admin/providers"
            className="mt-1 p-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">{practice.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusColors[practice.status as keyof typeof statusColors]}`}>
                {practice.status.charAt(0).toUpperCase() + practice.status.slice(1)}
              </span>
            </div>
            <p className="text-slate-400 mt-1">{practice.type} • {practice.specialty}</p>
            <p className="text-slate-500 text-sm mt-1">ID: {practice.id}</p>
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
              Edit Practice
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-1 bg-slate-800/50 p-1 rounded-xl overflow-x-auto">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
              activeSection === section.id
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                : "text-slate-400 hover:text-white hover:bg-slate-700"
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Practice Overview
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Practice Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                ) : (
                  <p className="text-white font-medium">{practice.name}</p>
                )}
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Practice Type</p>
                {isEditing ? (
                  <select
                    value={editData.type}
                    onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="Group Practice">Group Practice</option>
                    <option value="Facility">Facility</option>
                    <option value="Individual">Individual</option>
                  </select>
                ) : (
                  <p className="text-white">{practice.type}</p>
                )}
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Primary Specialty</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.specialty}
                    onChange={(e) => setEditData({ ...editData, specialty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                ) : (
                  <p className="text-white">{practice.specialty}</p>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{practice.providers?.length || 0}</p>
                <p className="text-sm text-slate-400">Providers</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">{practice.networks?.length || 0}</p>
                <p className="text-sm text-slate-400">Networks</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-purple-400">{practice.discountRate}</p>
                <p className="text-sm text-slate-400">Discount Rate</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className={`text-lg font-bold ${practice.status === "active" ? "text-green-400" : "text-amber-400"}`}>
                  {practice.status === "active" ? "Active" : "Pending"}
                </p>
                <p className="text-sm text-slate-400">Status</p>
              </div>
            </div>
          </div>
        )}

        {/* Contact & Location Section */}
        {activeSection === "contact" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Contact & Location
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Physical Address */}
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Physical Address</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Address Line 1</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.address}
                        onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{practice.address}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Address Line 2 (Suite/Office)</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.address2 || ""}
                        onChange={(e) => setEditData({ ...editData, address2: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        placeholder="Suite, Office, Building number"
                      />
                    ) : (
                      <p className="text-white">{practice.address2 || "—"}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">City</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.city}
                          onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.city}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">State</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.state}
                          onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.state}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">ZIP Code</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.zip}
                          onChange={(e) => setEditData({ ...editData, zip: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.zip}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">County</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.county}
                        onChange={(e) => setEditData({ ...editData, county: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{practice.county}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Primary Contact</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.contactName}
                        onChange={(e) => setEditData({ ...editData, contactName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{practice.contactName}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Title</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.contactTitle || ""}
                        onChange={(e) => setEditData({ ...editData, contactTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{practice.contactTitle || "—"}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Phone</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.phone}
                          onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.phone}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Fax</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.fax}
                          onChange={(e) => setEditData({ ...editData, fax: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.fax}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-blue-400">{practice.email}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Billing Section */}
        {activeSection === "billing" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-400" />
              Billing Information
            </h2>

            {/* W9 Status */}
            <div className={`rounded-xl p-4 flex items-center justify-between ${
              practice.w9Collected 
                ? "bg-green-500/20 border border-green-500/30" 
                : "bg-red-500/20 border border-red-500/30"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  practice.w9Collected ? "bg-green-500" : "bg-red-500"
                }`}>
                  {practice.w9Collected ? (
                    <CheckCircle className="w-6 h-6 text-white" />
                  ) : (
                    <X className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${practice.w9Collected ? "text-green-400" : "text-red-400"}`}>
                    W-9 {practice.w9Collected ? "Collected" : "Not Collected"}
                  </p>
                  <p className="text-slate-400 text-sm">
                    {practice.w9Collected 
                      ? "Tax documentation on file" 
                      : "Required for payment processing"}
                  </p>
                </div>
              </div>
              {isEditing && (
                <button
                  onClick={() => setEditData({ ...editData, w9Collected: !editData.w9Collected })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    editData.w9Collected 
                      ? "bg-red-600 hover:bg-red-700 text-white" 
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {editData.w9Collected ? "Mark as Not Collected" : "Mark as Collected"}
                </button>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Billing Contact */}
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Billing Department</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Billing Phone</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.billingPhone}
                          onChange={(e) => setEditData({ ...editData, billingPhone: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.billingPhone}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Billing Fax</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.billingFax}
                          onChange={(e) => setEditData({ ...editData, billingFax: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.billingFax}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Correspondence Address */}
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Correspondence Address</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Address Line 1</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.correspondenceAddress}
                        onChange={(e) => setEditData({ ...editData, correspondenceAddress: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{practice.correspondenceAddress}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Address Line 2</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.correspondenceAddress2 || ""}
                        onChange={(e) => setEditData({ ...editData, correspondenceAddress2: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{practice.correspondenceAddress2 || "—"}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">City</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.correspondenceCity || ""}
                          onChange={(e) => setEditData({ ...editData, correspondenceCity: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.correspondenceCity}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">State</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.correspondenceState || ""}
                          onChange={(e) => setEditData({ ...editData, correspondenceState: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.correspondenceState}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">ZIP</p>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editData.correspondenceZip || ""}
                          onChange={(e) => setEditData({ ...editData, correspondenceZip: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.correspondenceZip}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pay-To Information */}
              <div className="bg-slate-700/30 rounded-lg p-6 md:col-span-2">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Pay-To Information (Remittance)
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Pay-To Name</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.payToName}
                        onChange={(e) => setEditData({ ...editData, payToName: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white font-medium">{practice.payToName}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Pay-To NPI</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.payToNpi}
                        onChange={(e) => setEditData({ ...editData, payToNpi: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono"
                      />
                    ) : (
                      <p className="text-white font-mono">{practice.payToNpi}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Tax ID (EIN)</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.payToTaxId}
                        onChange={(e) => setEditData({ ...editData, payToTaxId: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono"
                      />
                    ) : (
                      <p className="text-white font-mono">{practice.payToTaxId}</p>
                    )}
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-xs text-slate-500 mb-1">Address Line 1</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.payToAddress}
                        onChange={(e) => setEditData({ ...editData, payToAddress: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{practice.payToAddress}</p>
                    )}
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-xs text-slate-500 mb-1">Address Line 2</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.payToAddress2 || ""}
                        onChange={(e) => setEditData({ ...editData, payToAddress2: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        placeholder="Suite, Floor, Building"
                      />
                    ) : (
                      <p className="text-white">{practice.payToAddress2 || "—"}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">City</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.payToCity}
                        onChange={(e) => setEditData({ ...editData, payToCity: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{practice.payToCity}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">State</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.payToState}
                        onChange={(e) => setEditData({ ...editData, payToState: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{practice.payToState}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">ZIP Code</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.payToZip}
                        onChange={(e) => setEditData({ ...editData, payToZip: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{practice.payToZip}</p>
                    )}
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-xs text-slate-500 mb-1">County</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.payToCounty || ""}
                        onChange={(e) => setEditData({ ...editData, payToCounty: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white">{practice.payToCounty || "—"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contract Section */}
        {activeSection === "contract" && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-blue-400" />
              Contract Details
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Contract Period</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Start Date</p>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editData.contractStart}
                          onChange={(e) => setEditData({ ...editData, contractStart: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.contractStart}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">End Date</p>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editData.contractEnd}
                          onChange={(e) => setEditData({ ...editData, contractEnd: e.target.value })}
                          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                        />
                      ) : (
                        <p className="text-white">{practice.contractEnd}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    {isEditing ? (
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    ) : (
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColors[practice.status as keyof typeof statusColors]}`}>
                        {practice.status.charAt(0).toUpperCase() + practice.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-white mb-4">Default Discount Terms</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Discount Type</p>
                    {isEditing ? (
                      <select
                        value={editData.discountType}
                        onChange={(e) => setEditData({ ...editData, discountType: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      >
                        <option value="% Off Billed">% Off Billed</option>
                        <option value="% of Medicare">% of Medicare</option>
                        <option value="Flat Rate">Flat Rate</option>
                        <option value="Case Rate">Case Rate</option>
                      </select>
                    ) : (
                      <p className="text-white">{practice.discountType}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Discount Rate</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.discountRate}
                        onChange={(e) => setEditData({ ...editData, discountRate: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-2xl font-bold text-blue-400">{practice.discountRate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rates & Discounts Section */}
        {activeSection === "rates" && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                <strong>Default Practice Rate:</strong> This rate applies to all providers in this practice unless they have custom rates set on their individual provider page.
              </p>
            </div>

            {/* Discount Basis Selection */}
            <div className="bg-slate-700/30 rounded-lg p-4">
              <p className="text-sm font-medium text-white mb-3">Discount Basis</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDiscountBasis("medicare")}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors border-2 ${
                    discountBasis === "medicare" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-teal-600 text-white" 
                      : "bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500"
                  }`}
                >
                  % of Medicare
                </button>
                <button
                  onClick={() => setDiscountBasis("billed")}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors border-2 ${
                    discountBasis === "billed" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 border-teal-600 text-white" 
                      : "bg-slate-700 border-slate-600 text-slate-400 hover:border-slate-500"
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

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-400" />
                Default Discount Rate
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setRateType("flat")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    rateType === "flat" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "bg-slate-700 text-slate-400"
                  }`}
                >
                  Flat Rate
                </button>
                <button
                  onClick={() => setRateType("custom")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    rateType === "custom" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "bg-slate-700 text-slate-400"
                  }`}
                >
                  Custom by Category
                </button>
              </div>
            </div>

            {rateType === "flat" ? (
              <div className="bg-slate-700/30 rounded-lg p-6">
                <h3 className="text-sm font-semibold text-white mb-4">
                  Flat {discountBasis === "medicare" ? "% of Medicare" : "% Off Billed Charges"}
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  Single rate applied to all services for this practice.
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 max-w-xs">
                    <div className="relative">
                      <input
                        type="number"
                        value={flatRate}
                        onChange={(e) => setFlatRate(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-slate-700 border border-slate-600 rounded-lg text-white text-2xl font-bold"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">%</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {discountBasis === "medicare" ? "of Medicare rate" : "off billed charges"}
                    </p>
                  </div>
                  <div className="bg-teal-500/20 border border-teal-500/30 rounded-lg p-4 flex-1">
                    <p className="text-sm text-blue-400">
                      {discountBasis === "medicare" 
                        ? `Example: For a $100 Medicare allowable, you pay $${parseFloat(flatRate) || 0}`
                        : `Example: For a $100 billed charge, you pay $${100 - (parseFloat(flatRate) || 0)}`
                      }
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-700/30 rounded-lg p-6">
                  <h3 className="text-sm font-semibold text-white mb-4">Rates by Service Category</h3>
                  <p className="text-slate-400 text-sm mb-6">
                    Set different discount rates for each service category.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {serviceCategories.map((cat) => (
                      <div key={cat.key} className="bg-slate-700/50 rounded-lg p-4">
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

        {/* Providers Section */}
        {activeSection === "providers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Affiliated Providers ({practice.providers?.length || 0})
              </h2>
              <div className="flex items-center gap-2">
                {/* Hidden file input for CSV upload */}
                <input
                  ref={providerFileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleProviderCsvUpload}
                  className="hidden"
                />
                <button 
                  onClick={() => providerFileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
                  title="Upload CSV with provider data"
                >
                  <Upload className="w-4 h-4" />
                  Upload CSV
                </button>
                <button 
                  onClick={() => setShowAddProvider(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Provider
                </button>
              </div>
            </div>

            {/* CSV format info with download template */}
            <div className={cn(
              "p-4 rounded-xl border",
              isDark ? "bg-slate-700/30 border-slate-600/50" : "bg-slate-50 border-slate-200"
            )}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={cn("text-sm font-semibold", isDark ? "text-white" : "text-slate-900")}>CSV Template</h3>
                <button
                  onClick={downloadProviderTemplate}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <Upload className="w-4 h-4 rotate-180" />
                  Download Template
                </button>
              </div>
              
              {/* Column sections */}
              <div className="space-y-3 text-xs">
                {/* Identity */}
                <div>
                  <p className={cn("font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>Identity</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Entity #</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Contract #</span>
                    <span className="text-blue-400 font-medium">NPI *</span>
                    <span className="text-blue-400 font-medium">First Name *</span>
                    <span className="text-blue-400 font-medium">Last Name *</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Mid Init</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Suffix</span>
                  </div>
                </div>
                
                {/* Location */}
                <div>
                  <p className={cn("font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>Location</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Address1</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Address 2</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>City</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>State</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Zip Code</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>County</span>
                  </div>
                </div>
                
                {/* Specialty */}
                <div>
                  <p className={cn("font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>Specialty & Contact</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Gender</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Primary Spc Code</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Primary Taxonomy Code</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Secondary Spc Code</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Secondary Taxonomy Code</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Facility Type</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Phone #</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Fax</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Email</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Language</span>
                  </div>
                </div>
                
                {/* Flags */}
                <div>
                  <p className={cn("font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>Flags & Hours</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Accepts New Patients</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Primary Care Flag</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Behavioral Health Flag</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Directory Display</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Monday-Sunday Hours</span>
                  </div>
                </div>
                
                {/* Contract */}
                <div>
                  <p className={cn("font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>Contract & Billing</p>
                  <div className="flex flex-wrap gap-x-3 gap-y-1">
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Pricing Tier</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Network Org</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Start/End Date</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Corresponding Address</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>Billing NPI/TaxID/Name/Address</span>
                  </div>
                </div>
              </div>
              
              <p className={cn("text-xs mt-3", isDark ? "text-slate-500" : "text-slate-400")}>
                * Required fields. Download template for full column list with 52 fields.
              </p>
            </div>

            <div className="space-y-3">
              {practice.providers?.map((provider: any) => (
                <Link
                  key={provider.id}
                  href={`/admin/providers/${practice.id}/${provider.id}`}
                  className="block bg-slate-700/30 rounded-xl p-4 hover:bg-slate-700/50 transition-colors border border-slate-600/50 hover:border-teal-500/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                        {provider.name.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-white font-medium">{provider.name}, {provider.title}</p>
                        <p className="text-slate-400 text-sm">{provider.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-slate-400 text-sm">NPI</p>
                        <p className="text-white font-mono">{provider.npi}</p>
                      </div>
                      {provider.useCustomRates ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                          Custom Rates
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-600/50 text-slate-400">
                          Inherits
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        provider.status === "active" 
                          ? "bg-green-500/20 text-green-400"
                          : "bg-slate-600 text-slate-400"
                      }`}>
                        {provider.status}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Networks Section */}
        {activeSection === "networks" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Network Memberships ({practice.networks?.length || 0})
              </h2>
              <button 
                onClick={() => setShowAddNetwork(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Add to Network
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {practice.networks?.map((networkId: string) => (
                <div key={networkId} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{networkNames[networkId] || networkId}</p>
                      <p className="text-slate-400 text-sm">Active member</p>
                    </div>
                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {(!practice.networks || practice.networks.length === 0) && (
              <div className="text-center py-12 bg-slate-700/20 rounded-xl border border-dashed border-slate-600">
                <Globe className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">Not assigned to any networks yet</p>
                <button 
                  onClick={() => setShowAddNetwork(true)}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-sm"
                >
                  Add to Network
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add to Network Modal */}
      {showAddNetwork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-lg w-full shadow-xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add to Network</h2>
              <button 
                onClick={() => {
                  setShowAddNetwork(false);
                  setSelectedNetworks([]);
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {availableNetworks.length === 0 ? (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">This practice is already in all available networks</p>
              </div>
            ) : (
              <>
                <p className="text-slate-600 mb-4">Select networks to add this practice to:</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {availableNetworks.map(([id, name]) => (
                    <label
                      key={id}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedNetworks.includes(id)
                          ? "border-purple-500 bg-purple-50"
                          : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedNetworks.includes(id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedNetworks([...selectedNetworks, id]);
                          } else {
                            setSelectedNetworks(selectedNetworks.filter(n => n !== id));
                          }
                        }}
                        className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Globe className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-slate-900 font-medium">{name}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => {
                      setShowAddNetwork(false);
                      setSelectedNetworks([]);
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // In real app, this would call an API
                      console.log("Adding to networks:", selectedNetworks);
                      setShowAddNetwork(false);
                      setSelectedNetworks([]);
                      setSaved(true);
                      setTimeout(() => setSaved(false), 2000);
                    }}
                    disabled={selectedNetworks.length === 0}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add to {selectedNetworks.length || ""} Network{selectedNetworks.length !== 1 ? "s" : ""}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Add Provider Modal */}
      {showAddProvider && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-xl my-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Add Provider to {practice.name}</h2>
              <button 
                onClick={() => setShowAddProvider(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={newProvider.firstName}
                    onChange={(e) => setNewProvider({ ...newProvider, firstName: e.target.value })}
                    placeholder="Robert"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={newProvider.lastName}
                    onChange={(e) => setNewProvider({ ...newProvider, lastName: e.target.value })}
                    placeholder="Smith"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                  <select
                    value={newProvider.title}
                    onChange={(e) => setNewProvider({ ...newProvider, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="MD">MD</option>
                    <option value="DO">DO</option>
                    <option value="NP">NP</option>
                    <option value="PA">PA</option>
                    <option value="PhD">PhD</option>
                    <option value="DPM">DPM</option>
                    <option value="DC">DC</option>
                    <option value="PT">PT</option>
                    <option value="OT">OT</option>
                    <option value="DDS">DDS</option>
                    <option value="DMD">DMD</option>
                    <option value="PharmD">PharmD</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">NPI (10 digits) *</label>
                  <input
                    type="text"
                    value={newProvider.npi}
                    onChange={(e) => setNewProvider({ ...newProvider, npi: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                    placeholder="1234567890"
                    maxLength={10}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialty *</label>
                  <select
                    value={newProvider.specialty}
                    onChange={(e) => setNewProvider({ ...newProvider, specialty: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="">Select specialty...</option>
                    <option value="Family Medicine">Family Medicine</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Pulmonology">Pulmonology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="OB/GYN">OB/GYN</option>
                    <option value="Urgent Care">Urgent Care</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="General Surgery">General Surgery</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newProvider.email}
                    onChange={(e) => setNewProvider({ ...newProvider, email: e.target.value })}
                    placeholder="provider@example.com"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newProvider.phone}
                    onChange={(e) => setNewProvider({ ...newProvider, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">License State *</label>
                  <input
                    type="text"
                    value={newProvider.licenseState}
                    onChange={(e) => setNewProvider({ ...newProvider, licenseState: e.target.value.toUpperCase().slice(0, 2) })}
                    placeholder="OH"
                    maxLength={2}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">License Number *</label>
                  <input
                    type="text"
                    value={newProvider.licenseNumber}
                    onChange={(e) => setNewProvider({ ...newProvider, licenseNumber: e.target.value })}
                    placeholder="MD-35-123456"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowAddProvider(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // In real app, this would call an API
                  console.log("Adding provider:", newProvider);
                  setShowAddProvider(false);
                  setNewProvider({
                    firstName: "",
                    lastName: "",
                    title: "MD",
                    npi: "",
                    specialty: practice.specialty || "",
                    email: "",
                    phone: "",
                    licenseState: "OH",
                    licenseNumber: "",
                  });
                  setSaved(true);
                  setTimeout(() => setSaved(false), 2000);
                }}
                disabled={!newProvider.firstName || !newProvider.lastName || !newProvider.npi || newProvider.npi.length !== 10}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Add Provider
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
