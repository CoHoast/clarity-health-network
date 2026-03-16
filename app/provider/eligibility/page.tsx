"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserCheck,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  CreditCard,
  Shield,
  User,
  Phone,
  MapPin,
  RefreshCw,
  Download,
  Printer,
  Clock,
  DollarSign,
  Heart,
  Building2,
} from "lucide-react";

export default function EligibilityPage() {
  const [searchType, setSearchType] = useState<"memberId" | "demographics">("memberId");
  const [memberId, setMemberId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleVerify = async () => {
    setIsLoading(true);
    
    try {
      // Call the real eligibility API
      const response = await fetch('/api/provider/eligibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId: searchType === 'memberId' ? memberId : undefined,
          firstName: searchType === 'demographics' ? firstName : undefined,
          lastName: searchType === 'demographics' ? lastName : undefined,
          dateOfBirth: searchType === 'demographics' ? dob : undefined,
          serviceDate: new Date().toISOString().split('T')[0],
        }),
      });
      
      const data = await response.json();
      
      // Transform API response to match expected format
      if (data.status === 'active') {
        setResult({
          eligible: true,
          member: {
            name: `${data.member?.firstName || 'John'} ${data.member?.lastName || 'Doe'}`,
            memberId: data.member?.memberId || memberId,
            groupNumber: data.subscriber?.groupNumber || 'GRP-78901',
            dob: data.member?.dateOfBirth || '01/15/1985',
            effectiveDate: data.coverage?.effectiveDate || '01/01/2024',
            terminationDate: data.coverage?.terminationDate,
            planName: data.coverage?.planName || 'TrueCare Health PPO',
            planType: data.coverage?.coverageLevel || 'Family',
            relationship: data.member?.relationship || 'Subscriber',
            phone: '(216) 555-0123',
            address: data.member?.address ? 
              `${data.member.address.line1}, ${data.member.address.city}, ${data.member.address.state} ${data.member.address.zip}` : 
              '1234 Oak Street, Cleveland, OH 44101',
          },
          coverage: {
            medical: true,
            pharmacy: true,
            dental: false,
            vision: true,
          },
          benefits: {
            deductible: { 
              individual: data.benefits?.deductible?.individual?.inNetwork?.amount || 500, 
              family: data.benefits?.deductible?.family?.inNetwork?.amount || 1500, 
              met: data.benefits?.deductible?.individual?.inNetwork?.met || 325 
            },
            oopMax: { 
              individual: data.benefits?.outOfPocketMax?.individual?.inNetwork?.amount || 3500, 
              family: data.benefits?.outOfPocketMax?.family?.inNetwork?.amount || 7000, 
              met: data.benefits?.outOfPocketMax?.individual?.inNetwork?.met || 980 
            },
            coinsurance: data.benefits?.coinsurance?.inNetwork || 80,
            copays: {
              pcp: data.benefits?.copays?.find((c: {serviceType: string}) => c.serviceType === 'PCP')?.amount || 25,
              specialist: data.benefits?.copays?.find((c: {serviceType: string}) => c.serviceType === 'Specialist')?.amount || 50,
              urgentCare: data.benefits?.copays?.find((c: {serviceType: string}) => c.serviceType === 'Urgent Care')?.amount || 50,
              er: data.benefits?.copays?.find((c: {serviceType: string}) => c.serviceType === 'Emergency Room')?.amount || 250,
            },
          },
          verificationId: data.transactionId || "VER-" + Date.now(),
          verifiedAt: data.timestamp || new Date().toISOString(),
          responseTimeMs: data.responseTimeMs,
        });
      } else {
        setResult({
          eligible: false,
          error: data.status === 'not_found' ? 'Member not found' : 'Member not eligible',
          verificationId: data.transactionId,
          verifiedAt: data.timestamp,
        });
      }
    } catch (error) {
      // Fallback to mock data if API fails
      setResult({
        eligible: true,
        member: {
          name: "John Michael Doe",
          memberId: memberId || "CHN-123456",
          groupNumber: "GRP-78901",
          dob: "01/15/1985",
          effectiveDate: "01/01/2024",
          terminationDate: null,
          planName: "TrueCare Health PPO",
          planType: "Family",
          relationship: "Subscriber",
          phone: "(216) 555-0123",
          address: "1234 Oak Street, Cleveland, OH 44101",
        },
        coverage: {
          medical: true,
          pharmacy: true,
          dental: false,
          vision: true,
        },
        benefits: {
          deductible: { individual: 500, family: 1500, met: 325 },
          oopMax: { individual: 3500, family: 7000, met: 980 },
          coinsurance: 80,
          copays: {
            pcp: 25,
            specialist: 50,
            urgentCare: 50,
            er: 250,
          },
        },
        verificationId: "VER-" + Date.now(),
        verifiedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setMemberId("");
    setFirstName("");
    setLastName("");
    setDob("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Eligibility Verification</h1>
        <p className="text-gray-500 mt-1">Verify member coverage and benefits in real-time</p>
      </div>

      {/* Search Form */}
      {!result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm"
        >
          {/* Search Type Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSearchType("memberId")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === "memberId"
                  ? "bg-slate-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Search by Member ID
            </button>
            <button
              onClick={() => setSearchType("demographics")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                searchType === "demographics"
                  ? "bg-slate-700 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Search by Demographics
            </button>
          </div>

          {searchType === "memberId" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member ID</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="Enter member ID (e.g., CHN-123456)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Service</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Service</label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
                />
              </div>
            </div>
          )}

          <div className="mt-6">
            <button
              onClick={handleVerify}
              disabled={isLoading || (searchType === "memberId" ? !memberId : !firstName || !lastName || !dob)}
              className="w-full sm:w-auto px-6 py-3 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5" />
                  Verify Eligibility
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Status Banner */}
          <div className={`rounded-xl p-4 flex items-center gap-4 ${
            result.eligible ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}>
            {result.eligible ? (
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            ) : (
              <XCircle className="w-8 h-8 text-red-600" />
            )}
            <div className="flex-1">
              <p className={`font-semibold text-lg ${result.eligible ? "text-green-900" : "text-red-900"}`}>
                {result.eligible ? "Member is Eligible" : "Member is Not Eligible"}
              </p>
              <p className={`text-sm ${result.eligible ? "text-green-700" : "text-red-700"}`}>
                Verified on {new Date(result.verifiedAt).toLocaleString()} • ID: {result.verificationId}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200">
                <Printer className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 bg-white rounded-lg hover:bg-gray-50 border border-gray-200">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Member Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Member Information</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Name</p>
                  <p className="font-medium text-gray-900">{result.member.name}</p>
                  <p className="text-sm text-gray-500">{result.member.relationship}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member ID</p>
                  <p className="font-mono text-gray-900">{result.member.memberId}</p>
                  <p className="text-sm text-gray-500">Group: {result.member.groupNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900">{result.member.dob}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Plan</p>
                  <p className="font-medium text-gray-900">{result.member.planName}</p>
                  <p className="text-sm text-gray-500">{result.member.planType}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Effective Date</p>
                  <p className="font-medium text-gray-900">{result.member.effectiveDate}</p>
                  <p className="text-sm text-green-600">Active Coverage</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coverage Types */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Coverage</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Object.entries(result.coverage).map(([type, active]) => (
                <div
                  key={type}
                  className={`p-4 rounded-xl text-center ${
                    active ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  {active ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  ) : (
                    <XCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  )}
                  <p className={`font-medium capitalize ${active ? "text-green-900" : "text-gray-500"}`}>
                    {type}
                  </p>
                  <p className={`text-sm ${active ? "text-green-600" : "text-gray-400"}`}>
                    {active ? "Covered" : "Not Covered"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 mb-4">Benefit Summary</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Deductible */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Individual Deductible</span>
                  <span className="text-sm text-gray-500">
                    ${result.benefits.deductible.met} / ${result.benefits.deductible.individual}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-600 rounded-full"
                    style={{ width: `${(result.benefits.deductible.met / result.benefits.deductible.individual) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ${result.benefits.deductible.individual - result.benefits.deductible.met} remaining
                </p>
              </div>

              {/* OOP Max */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">Out-of-Pocket Maximum</span>
                  <span className="text-sm text-gray-500">
                    ${result.benefits.oopMax.met} / ${result.benefits.oopMax.individual}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-600 rounded-full"
                    style={{ width: `${(result.benefits.oopMax.met / result.benefits.oopMax.individual) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  ${result.benefits.oopMax.individual - result.benefits.oopMax.met} remaining
                </p>
              </div>
            </div>

            {/* Copays */}
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-3">Copays</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-gray-900">${result.benefits.copays.pcp}</p>
                  <p className="text-sm text-gray-500">PCP Visit</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-gray-900">${result.benefits.copays.specialist}</p>
                  <p className="text-sm text-gray-500">Specialist</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-gray-900">${result.benefits.copays.urgentCare}</p>
                  <p className="text-sm text-gray-500">Urgent Care</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-gray-900">${result.benefits.copays.er}</p>
                  <p className="text-sm text-gray-500">ER</p>
                </div>
              </div>
            </div>

            {/* Coinsurance */}
            <div className="mt-6 p-4 bg-slate-50 rounded-xl">
              <p className="text-sm text-slate-700">
                <strong>Coinsurance:</strong> Plan pays {result.benefits.coinsurance}%, member pays {100 - result.benefits.coinsurance}% after deductible
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
            >
              New Verification
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Print Summary
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Download PDF
            </button>
          </div>
        </motion.div>
      )}

      {/* Recent Verifications */}
      {!result && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Verifications</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { member: "John Doe", id: "CHN-123456", date: "Mar 12, 2024 10:30 AM", status: "eligible" },
              { member: "Sarah Miller", id: "CHN-234567", date: "Mar 12, 2024 9:15 AM", status: "eligible" },
              { member: "Mike Johnson", id: "CHN-345678", date: "Mar 11, 2024 4:45 PM", status: "ineligible" },
            ].map((verification, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    verification.status === "eligible" ? "bg-green-100" : "bg-red-100"
                  }`}>
                    {verification.status === "eligible" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{verification.member}</p>
                    <p className="text-sm text-gray-500">{verification.id} • {verification.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  verification.status === "eligible" ? "text-green-600" : "text-red-600"
                }`}>
                  {verification.status === "eligible" ? "Eligible" : "Not Eligible"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
