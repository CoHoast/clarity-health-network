"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, User, MapPin, FileText, DollarSign, CheckCircle, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const specialties = [
  "Family Medicine", "Internal Medicine", "Pediatrics", "Cardiology", "Orthopedics",
  "Dermatology", "Neurology", "Gastroenterology", "Pulmonology", "Psychiatry",
  "OB/GYN", "Urgent Care", "Emergency Medicine", "Diagnostic Imaging", "Laboratory",
  "Physical Therapy", "Pharmacy", "General Surgery", "Other"
];

const discountTypes = [
  "% Off Billed",
  "% of Medicare",
  "Flat Rate",
  "Case Rate",
  "Per Diem",
  "Custom Schedule"
];

const networkOptions = [
  { id: "NET-001", name: "Ohio PPO Network" },
  { id: "NET-002", name: "Cleveland Metro Network" },
  { id: "NET-003", name: "Northeast Ohio Specialists" },
  { id: "NET-004", name: "Ohio Hospital Alliance" },
  { id: "NET-005", name: "Midwest Regional Network" },
  { id: "NET-006", name: "TrueCare Value Network" },
  { id: "NET-007", name: "Pennsylvania PPO" },
  { id: "NET-008", name: "Urgent Care Express" },
];

const titleOptions = ["MD", "DO", "PhD", "NP", "PA", "DPM", "DC", "PT", "OT", "DDS", "DMD", "PharmD", "PsyD"];

export default function AddProviderPage() {
  const { isDark } = useTheme();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addMode, setAddMode] = useState<"new" | "existing">("new");
  const [formData, setFormData] = useState({
    // Practice Info
    practiceName: "",
    existingPracticeId: "",
    type: "Group Practice",
    specialty: "",
    // Individual Provider Info
    providerFirstName: "",
    providerLastName: "",
    providerTitle: "MD",
    providerNpi: "",
    providerGender: "",
    // NPIs
    orgNpi: "",
    servicingNpi: "",
    payToNpi: "",
    taxId: "",
    // Contact
    contactName: "",
    contactTitle: "",
    phone: "",
    email: "",
    // Location
    address: "",
    suite: "",
    city: "",
    state: "",
    zip: "",
    // Contract
    contractStart: "",
    contractEnd: "",
    autoRenew: false,
    // Discount
    discountType: "% Off Billed",
    discountRate: "",
    // Service Overrides
    serviceOverrides: [] as { service: string; rate: string }[],
    // Networks
    networks: [] as string[],
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleNetwork = (networkId: string) => {
    setFormData(prev => ({
      ...prev,
      networks: prev.networks.includes(networkId)
        ? prev.networks.filter(id => id !== networkId)
        : [...prev.networks, networkId]
    }));
  };

  const addServiceOverride = () => {
    setFormData(prev => ({
      ...prev,
      serviceOverrides: [...prev.serviceOverrides, { service: "", rate: "" }]
    }));
  };

  const updateServiceOverride = (index: number, field: "service" | "rate", value: string) => {
    setFormData(prev => ({
      ...prev,
      serviceOverrides: prev.serviceOverrides.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeServiceOverride = (index: number) => {
    setFormData(prev => ({
      ...prev,
      serviceOverrides: prev.serviceOverrides.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // First, create or get the practice
      let practiceId = formData.existingPracticeId;
      
      if (addMode === "new" && formData.practiceName) {
        // Create new practice
        const practiceRes = await fetch('/api/practices', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.practiceName,
            taxId: formData.taxId,
            npi: formData.orgNpi,
            address1: formData.address,
            address2: formData.suite,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            phone: formData.phone,
          }),
        });
        
        if (practiceRes.ok) {
          const practiceData = await practiceRes.json();
          practiceId = practiceData.practice.id;
        }
      }
      
      // Create the provider
      const providerData = {
        firstName: formData.providerFirstName,
        lastName: formData.providerLastName,
        credentials: formData.providerTitle,
        npi: formData.providerNpi || formData.servicingNpi,
        gender: formData.providerGender === 'Male' ? 'M' : formData.providerGender === 'Female' ? 'F' : '',
        specialty: formData.specialty,
        acceptingNewPatients: true,
        directoryDisplay: true,
        practiceId: practiceId,
        billing: {
          npi: formData.orgNpi,
          taxId: formData.taxId,
          name: formData.practiceName,
          address1: formData.address,
          address2: formData.suite,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          phone: formData.phone,
        },
        locations: [{
          address1: formData.address,
          address2: formData.suite,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          phone: formData.phone,
        }],
        contractStartDate: formData.contractStart,
        contractEndDate: formData.contractEnd,
        networks: formData.networks,
      };
      
      const providerRes = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(providerData),
      });
      
      if (!providerRes.ok) {
        throw new Error('Failed to create provider');
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/admin/providers');
      }, 2000);
    } catch (error) {
      console.error('Failed to add provider:', error);
      alert('Failed to add provider. Please try again.');
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: "Practice Info", icon: Building2 },
    { num: 2, label: "NPI & Tax ID", icon: User },
    { num: 3, label: "Contact & Location", icon: MapPin },
    { num: 4, label: "Contract", icon: FileText },
    { num: 5, label: "Discount Terms", icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/providers" className="p-2 bg-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New Provider</h1>
          <p className="text-slate-400 mt-1">Add a provider to your PPO network</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex justify-between">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isComplete = step > s.num;
            return (
              <div key={s.num} className="flex items-center">
                <div 
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                    isActive ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" :
                    isComplete ? "bg-gradient-to-r from-blue-500 to-indigo-500/20 text-blue-400" :
                    "bg-slate-700 text-slate-400"
                  }`}
                  onClick={() => setStep(s.num)}
                >
                  {isComplete ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  <span className="hidden sm:inline font-medium">{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 lg:w-16 h-0.5 mx-2 ${isComplete ? "bg-teal-500" : "bg-slate-700"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        {/* Step 1: Practice Info */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {/* Mode Toggle */}
            <div className="flex gap-2 p-1 bg-slate-700/50 rounded-lg w-fit">
              <button
                onClick={() => setAddMode("new")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  addMode === "new" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                New Practice
              </button>
              <button
                onClick={() => setAddMode("existing")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  addMode === "existing" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Add to Existing Practice
              </button>
            </div>

            {/* Individual Provider Info (always shown) */}
            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">Individual Provider Information</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">First Name *</label>
                  <input
                    type="text"
                    value={formData.providerFirstName}
                    onChange={(e) => updateField("providerFirstName", e.target.value)}
                    placeholder="Robert"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Last Name *</label>
                  <input
                    type="text"
                    value={formData.providerLastName}
                    onChange={(e) => updateField("providerLastName", e.target.value)}
                    placeholder="Smith"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Title *</label>
                  <select
                    value={formData.providerTitle}
                    onChange={(e) => updateField("providerTitle", e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-teal-500"
                  >
                    {titleOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Provider NPI *</label>
                  <input
                    type="text"
                    value={formData.providerNpi}
                    onChange={(e) => updateField("providerNpi", e.target.value)}
                    placeholder="10-digit NPI"
                    maxLength={10}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono placeholder:text-slate-400 focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            </div>

            <h2 className="text-lg font-semibold text-white">
              {addMode === "new" ? "New Practice Information" : "Select Existing Practice"}
            </h2>
            
            {addMode === "existing" ? (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Select Practice *</label>
                <select
                  value={formData.existingPracticeId}
                  onChange={(e) => updateField("existingPracticeId", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a practice...</option>
                  <option value="PRC-001">Cleveland Family Medicine</option>
                  <option value="PRC-002">Cleveland Orthopedic Associates</option>
                  <option value="PRC-003">Metro Imaging Center</option>
                  <option value="PRC-004">Cleveland Cardiology Associates</option>
                  <option value="PRC-005">Westlake Urgent Care</option>
                </select>
              </div>
            ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Practice Name *</label>
                <input
                  type="text"
                  value={formData.practiceName}
                  onChange={(e) => updateField("practiceName", e.target.value)}
                  placeholder="e.g., Cleveland Family Medicine"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Provider Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => updateField("type", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Individual">Individual Provider</option>
                  <option value="Group Practice">Group Practice</option>
                  <option value="Facility">Facility</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Primary Specialty *</label>
                <select
                  value={formData.specialty}
                  onChange={(e) => updateField("specialty", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select a specialty...</option>
                  {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Network Assignment */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Network Assignment</label>
                <p className="text-xs text-slate-500 mb-3">Select one or more networks to add this provider to.</p>
                <div className="flex flex-wrap gap-2">
                  {networkOptions.map(network => (
                    <button
                      key={network.id}
                      type="button"
                      onClick={() => toggleNetwork(network.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        formData.networks.includes(network.id)
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                      }`}
                    >
                      {formData.networks.includes(network.id) && (
                        <CheckCircle className="w-4 h-4 inline mr-1.5" />
                      )}
                      {network.name}
                    </button>
                  ))}
                </div>
                {formData.networks.length > 0 && (
                  <p className="text-xs text-blue-400 mt-2">
                    {formData.networks.length} network{formData.networks.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>
            )}
          </motion.div>
        )}

        {/* Step 2: NPI & Tax ID */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-lg font-semibold text-white">NPI Numbers & Tax ID</h2>
            <p className="text-slate-400 text-sm">Enter all applicable NPI numbers for billing and payment routing.</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Organization NPI (Type 2) *</label>
                <input
                  type="text"
                  value={formData.orgNpi}
                  onChange={(e) => updateField("orgNpi", e.target.value)}
                  placeholder="10-digit NPI"
                  maxLength={10}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-slate-500 mt-1">The organization or practice NPI</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Servicing Provider NPI (Type 1)</label>
                <input
                  type="text"
                  value={formData.servicingNpi}
                  onChange={(e) => updateField("servicingNpi", e.target.value)}
                  placeholder="10-digit NPI"
                  maxLength={10}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-slate-500 mt-1">Individual provider rendering services</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Pay-To NPI *</label>
                <input
                  type="text"
                  value={formData.payToNpi}
                  onChange={(e) => updateField("payToNpi", e.target.value)}
                  placeholder="10-digit NPI"
                  maxLength={10}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-xs text-slate-500 mt-1">NPI for payment routing</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Tax ID / EIN *</label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => updateField("taxId", e.target.value)}
                  placeholder="XX-XXXXXXX"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Contact & Location */}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Contact & Location</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Contact Name *</label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  placeholder="Primary contact person"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.contactTitle}
                  onChange={(e) => updateField("contactTitle", e.target.value)}
                  placeholder="e.g., Office Manager"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="contact@provider.com"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <hr className="border-slate-700" />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-400 mb-2">Street Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  placeholder="123 Medical Center Dr"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Suite/Unit</label>
                <input
                  type="text"
                  value={formData.suite}
                  onChange={(e) => updateField("suite", e.target.value)}
                  placeholder="Suite 100"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Cleveland"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  placeholder="OH"
                  maxLength={2}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">ZIP Code *</label>
                <input
                  type="text"
                  value={formData.zip}
                  onChange={(e) => updateField("zip", e.target.value)}
                  placeholder="44101"
                  maxLength={10}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Contract */}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Contract Details</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Contract Start Date *</label>
                <input
                  type="date"
                  value={formData.contractStart}
                  onChange={(e) => updateField("contractStart", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Contract End Date *</label>
                <input
                  type="date"
                  value={formData.contractEnd}
                  onChange={(e) => updateField("contractEnd", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoRenew}
                    onChange={(e) => updateField("autoRenew", e.target.checked)}
                    className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-blue-500 focus:ring-teal-500"
                  />
                  <span className="text-slate-300">Auto-renew contract at end of term</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 5: Discount Terms */}
        {step === 5 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <h2 className="text-lg font-semibold text-white">Discount Terms</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Discount Type *</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => updateField("discountType", e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {discountTypes.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Default Rate *</label>
                <input
                  type="text"
                  value={formData.discountRate}
                  onChange={(e) => updateField("discountRate", e.target.value)}
                  placeholder="e.g., 35% or $150"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Service-Specific Overrides */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">Service-Specific Overrides (Optional)</h3>
                <button
                  onClick={addServiceOverride}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Override
                </button>
              </div>
              
              {formData.serviceOverrides.length === 0 ? (
                <p className="text-slate-500 text-sm">No service-specific overrides. The default rate will apply to all services.</p>
              ) : (
                <div className="space-y-3">
                  {formData.serviceOverrides.map((override, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <input
                        type="text"
                        value={override.service}
                        onChange={(e) => updateServiceOverride(index, "service", e.target.value)}
                        placeholder="Service name (e.g., Office Visit)"
                        className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <input
                        type="text"
                        value={override.rate}
                        onChange={(e) => updateServiceOverride(index, "rate", e.target.value)}
                        placeholder="Rate"
                        className="w-32 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        onClick={() => removeServiceOverride(index)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
          <button
            onClick={() => setStep(s => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-6 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {step < 5 ? (
            <button
              onClick={() => setStep(s => Math.min(5, s + 1))}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Add Provider
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-8 max-w-md w-full text-center border border-slate-700"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Provider Added!</h2>
            <p className="text-slate-400 mb-6">The provider has been successfully added to your network.</p>
            <Link
              href="/admin/providers"
              className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
            >
              View All Providers
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}
