"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Copy,
  Send,
  CheckCircle,
  Clock,
  Mail,
  ExternalLink,
  ChevronLeft,
  Plus,
  Upload,
  Search,
  MoreVertical,
  RefreshCw,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { cn } from "@/lib/utils";

// Demo invitations data
const invitations = [
  { id: 1, provider: "Dr. James Wilson", email: "jwilson@ortho.com", npi: "1234567890", sent: "Mar 22, 2026", expires: "Apr 21, 2026", status: "completed", openedAt: "Mar 22", completedAt: "Mar 23" },
  { id: 2, provider: "Dr. Emily Chen", email: "echen@pediatrics.com", npi: "2345678901", sent: "Mar 20, 2026", expires: "Apr 19, 2026", status: "opened", openedAt: "Mar 21", completedAt: null },
  { id: 3, provider: "Metro Imaging Center", email: "admin@metroimaging.com", npi: "3456789012", sent: "Mar 18, 2026", expires: "Apr 17, 2026", status: "pending", openedAt: null, completedAt: null },
  { id: 4, provider: "Dr. Lisa Martinez", email: "lmartinez@neuro.com", npi: "4567890123", sent: "Mar 15, 2026", expires: "Apr 14, 2026", status: "expired", openedAt: null, completedAt: null },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge variant="success">Completed</Badge>;
    case "opened":
      return <Badge variant="info">Opened</Badge>;
    case "pending":
      return <Badge variant="warning">Pending</Badge>;
    case "expired":
      return <Badge variant="error">Expired</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

export default function OnboardingPage() {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ npi: "", name: "", email: "" });
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  
  // The public application URL
  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/apply`
    : 'https://truecare-health-network-production.up.railway.app/apply';
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSendInvite = async () => {
    if (!inviteForm.email) return;
    
    setSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSending(false);
    setSendSuccess(true);
    
    setTimeout(() => {
      setSendSuccess(false);
      setShowInviteModal(false);
      setInviteForm({ npi: "", name: "", email: "" });
    }, 2000);
  };
  
  const filteredInvitations = invitations.filter(inv =>
    inv.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.npi.includes(searchQuery)
  );
  
  const stats = {
    total: invitations.length,
    completed: invitations.filter(i => i.status === 'completed').length,
    pending: invitations.filter(i => i.status === 'pending' || i.status === 'opened').length,
    expired: invitations.filter(i => i.status === 'expired').length,
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" icon={<ChevronLeft className="w-4 h-4" />} href="/admin/credentialing">
            Back
          </Button>
          <div>
            <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
              Provider Onboarding
            </h1>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Invite providers to join the network
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" icon={<Upload className="w-4 h-4" />}>
            Bulk Import CSV
          </Button>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setShowInviteModal(true)}>
            Send Invitation
          </Button>
        </div>
      </div>
      
      {/* Public Link Card */}
      <div className={cn(
        "rounded-xl border p-6",
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <h2 className={cn("text-lg font-semibold mb-2", isDark ? "text-white" : "text-slate-900")}>
          Public Application Link
        </h2>
        <p className={cn("text-sm mb-4", isDark ? "text-slate-400" : "text-slate-500")}>
          Share this link on your website or marketing materials. Providers can apply directly without an invitation.
        </p>
        
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex-1 px-4 py-3 rounded-lg font-mono text-sm truncate",
            isDark ? "bg-slate-900 text-cyan-400 border border-slate-700" : "bg-slate-50 text-cyan-600 border border-slate-200"
          )}>
            {publicUrl}
          </div>
          <Button 
            variant={copied ? "primary" : "secondary"} 
            icon={copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            onClick={handleCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Link href="/apply" target="_blank">
            <Button variant="ghost" icon={<ExternalLink className="w-4 h-4" />}>
              Preview
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={cn(
          "rounded-xl border p-4",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Total Invitations</p>
          <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{stats.total}</p>
        </div>
        <div className={cn(
          "rounded-xl border p-4",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Completed</p>
          <p className="text-2xl font-bold text-emerald-500">{stats.completed}</p>
        </div>
        <div className={cn(
          "rounded-xl border p-4",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Pending</p>
          <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
        </div>
        <div className={cn(
          "rounded-xl border p-4",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Expired</p>
          <p className="text-2xl font-bold text-red-500">{stats.expired}</p>
        </div>
      </div>
      
      {/* Invitations Table */}
      <div className={cn(
        "rounded-xl border overflow-hidden",
        isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
      )}>
        <div className={cn(
          "flex items-center justify-between p-4 border-b",
          isDark ? "border-slate-700" : "border-slate-200"
        )}>
          <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>
            Recent Invitations
          </h3>
          <div className="w-64">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search invitations..."
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn(
                "border-b",
                isDark ? "border-slate-700 bg-slate-900/50" : "border-slate-200 bg-slate-50"
              )}>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Provider
                </th>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Email
                </th>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  NPI
                </th>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Sent
                </th>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Status
                </th>
                <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-slate-700" : "divide-slate-200")}>
              {filteredInvitations.map((inv) => (
                <tr
                  key={inv.id}
                  className={cn(
                    "transition-colors",
                    isDark ? "hover:bg-slate-700/50" : "hover:bg-slate-50"
                  )}
                >
                  <td className="px-6 py-4">
                    <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {inv.provider}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
                      {inv.email}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={cn("text-sm font-mono", isDark ? "text-slate-400" : "text-slate-500")}>
                      {inv.npi}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      {inv.sent}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(inv.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {(inv.status === 'pending' || inv.status === 'expired') && (
                        <Button variant="ghost" size="sm" icon={<RefreshCw className="w-4 h-4" />}>
                          Resend
                        </Button>
                      )}
                      {inv.status === 'completed' && (
                        <Link href="/admin/credentialing/applications">
                          <Button variant="ghost" size="sm">
                            View Application
                          </Button>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Send Invitation Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowInviteModal(false)}>
          <div
            className={cn(
              "w-full max-w-md rounded-xl p-6",
              isDark ? "bg-slate-800" : "bg-white"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={cn("text-xl font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Send Provider Invitation
            </h2>
            
            {sendSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                  Invitation Sent!
                </p>
                <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                  The provider will receive an email with instructions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Provider NPI (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    value={inviteForm.npi}
                    onChange={(e) => setInviteForm({ ...inviteForm, npi: e.target.value })}
                    className={cn(
                      "w-full px-4 py-2.5 rounded-lg border text-sm",
                      isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  />
                  <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                    If provided, we'll pre-fill their application with NPPES data
                  </p>
                </div>
                
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Provider Name
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. John Smith"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    className={cn(
                      "w-full px-4 py-2.5 rounded-lg border text-sm",
                      isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  />
                </div>
                
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="provider@example.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className={cn(
                      "w-full px-4 py-2.5 rounded-lg border text-sm",
                      isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button variant="secondary" className="flex-1" onClick={() => setShowInviteModal(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1" 
                    icon={sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    onClick={handleSendInvite}
                    disabled={!inviteForm.email || sending}
                  >
                    {sending ? "Sending..." : "Send Invitation"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
