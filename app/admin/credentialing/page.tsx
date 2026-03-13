"use client";

import { useState } from "react";
import { Search, Filter, Download, Eye, CheckCircle, Clock, AlertTriangle, XCircle, MoreVertical, BadgeCheck, FileText, Calendar } from "lucide-react";

const applications = [
  { id: "CRED-2024-1247", provider: "Dr. Sarah Mitchell", npi: "1234567890", specialty: "Cardiology", status: "pending", submitted: "2024-03-10", stage: "PSV In Progress" },
  { id: "CRED-2024-1246", provider: "Dr. James Wilson", npi: "2345678901", specialty: "Orthopedics", status: "committee", submitted: "2024-03-08", stage: "Committee Review" },
  { id: "CRED-2024-1245", provider: "Metro Imaging Center", npi: "3456789012", specialty: "Radiology", status: "approved", submitted: "2024-03-05", stage: "Complete" },
  { id: "CRED-2024-1244", provider: "Dr. Emily Chen", npi: "4567890123", specialty: "Pediatrics", status: "pending", submitted: "2024-03-03", stage: "Document Review" },
  { id: "CRED-2024-1243", provider: "Cleveland Physical Therapy", npi: "5678901234", specialty: "Physical Therapy", status: "approved", submitted: "2024-02-28", stage: "Complete" },
  { id: "CRED-2024-1242", provider: "Dr. Robert Kim", npi: "6789012345", specialty: "Dermatology", status: "denied", submitted: "2024-02-25", stage: "Failed PSV" },
];

const expiringCredentials = [
  { provider: "Dr. James Wilson", credential: "Medical License (OH)", expires: "Apr 15, 2026", daysLeft: 34 },
  { provider: "Metro Imaging", credential: "Facility License", expires: "Apr 20, 2026", daysLeft: 39 },
  { provider: "Dr. Amy Foster", credential: "DEA Registration", expires: "Apr 30, 2026", daysLeft: 49 },
  { provider: "Dr. Michael Brown", credential: "Board Certification", expires: "May 15, 2026", daysLeft: 64 },
];

const statusOptions = ["All", "Pending", "Committee", "Approved", "Denied"];

export default function CredentialingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.npi.includes(searchQuery) ||
      app.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Approved</span>;
      case "denied": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full"><XCircle className="w-3 h-3" />Denied</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      case "committee": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full"><BadgeCheck className="w-3 h-3" />Committee</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Provider Credentialing</h1>
          <p className="text-slate-400">Manage provider applications and credentials</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <FileText className="w-4 h-4" />
          New Application
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">47</p>
          <p className="text-sm text-slate-400">Pending Applications</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-purple-400">12</p>
          <p className="text-sm text-slate-400">Committee Review</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-amber-400">18</p>
          <p className="text-sm text-slate-400">Expiring (30 days)</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">94%</p>
          <p className="text-sm text-slate-400">Approval Rate</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications Table */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search providers, NPI..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      statusFilter === status ? "bg-purple-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Provider</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Specialty</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Stage</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{app.provider}</p>
                        <p className="text-xs text-slate-500">NPI: {app.npi}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{app.specialty}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{app.stage}</td>
                    <td className="px-4 py-3">{getStatusBadge(app.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 rounded"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-300 hover:bg-slate-600 rounded"><MoreVertical className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expiring Credentials */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="font-semibold text-white">Expiring Credentials</h2>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="divide-y divide-slate-700">
            {expiringCredentials.map((cred, i) => (
              <div key={i} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-white text-sm">{cred.provider}</p>
                    <p className="text-xs text-slate-400">{cred.credential}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    cred.daysLeft <= 30 ? "bg-red-500/20 text-red-400" : 
                    cred.daysLeft <= 60 ? "bg-amber-500/20 text-amber-400" : "bg-slate-700 text-slate-400"
                  }`}>
                    {cred.daysLeft} days
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  Expires: {cred.expires}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-slate-700">
            <button className="w-full text-center text-purple-400 hover:text-purple-300 text-sm font-medium">
              Send Renewal Reminders
            </button>
          </div>
        </div>
      </div>

      {/* Workflow Stats */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
        <h2 className="font-semibold text-white mb-4">Credentialing Workflow</h2>
        <div className="grid grid-cols-5 gap-4">
          {[
            { stage: "Application", count: 12, color: "bg-blue-500" },
            { stage: "Document Review", count: 18, color: "bg-cyan-500" },
            { stage: "PSV", count: 15, color: "bg-amber-500" },
            { stage: "Committee", count: 8, color: "bg-purple-500" },
            { stage: "Complete", count: 142, color: "bg-green-500" },
          ].map((stage, i) => (
            <div key={stage.stage} className="text-center">
              <div className={`w-12 h-12 ${stage.color} rounded-full mx-auto flex items-center justify-center text-white font-bold mb-2`}>
                {stage.count}
              </div>
              <p className="text-xs text-slate-400">{stage.stage}</p>
              {i < 4 && <div className="hidden sm:block absolute top-6 -right-2 w-4 h-0.5 bg-slate-600" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
