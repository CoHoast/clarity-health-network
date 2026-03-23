"use client";

import { useState, useEffect, useRef } from "react";
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
  AlertCircle,
  FileSpreadsheet,
  X,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { cn } from "@/lib/utils";

interface Invitation {
  id: string;
  token: string;
  provider: string;
  email: string;
  npi: string;
  sentAt: string;
  expiresAt: string;
  status: 'pending' | 'opened' | 'completed' | 'expired';
  openedAt: string | null;
  completedAt: string | null;
  applicationId: string | null;
}

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
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ npi: "", name: "", email: "" });
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, opened: 0, completed: 0, expired: 0 });
  const [bulkData, setBulkData] = useState<{ name: string; email: string; npi: string }[]>([]);
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // The public application URL
  const publicUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/apply`
    : 'https://truecare-health-network-production.up.railway.app/apply';
  
  // Fetch invitations from API
  useEffect(() => {
    fetchInvitations();
  }, []);
  
  const fetchInvitations = async () => {
    try {
      const res = await fetch('/api/invitations');
      const data = await res.json();
      if (data.success) {
        setInvitations(data.invitations || []);
        setStats(data.stats || { total: 0, pending: 0, opened: 0, completed: 0, expired: 0 });
      }
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleSendInvite = async () => {
    if (!inviteForm.email) return;
    
    setSending(true);
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteForm.email,
          name: inviteForm.name,
          npi: inviteForm.npi,
        }),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSendSuccess(true);
        fetchInvitations(); // Refresh list
        
        setTimeout(() => {
          setSendSuccess(false);
          setShowInviteModal(false);
          setInviteForm({ npi: "", name: "", email: "" });
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
    } finally {
      setSending(false);
    }
  };
  
  const handleResend = async (id: string) => {
    try {
      await fetch(`/api/invitations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend' }),
      });
      fetchInvitations();
    } catch (error) {
      console.error('Error resending invitation:', error);
    }
  };
  
  // CSV Import handling
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
      
      const emailIdx = headers.findIndex(h => h.includes('email'));
      const nameIdx = headers.findIndex(h => h.includes('name') || h.includes('provider'));
      const npiIdx = headers.findIndex(h => h.includes('npi'));
      
      if (emailIdx === -1) {
        setBulkErrors(['CSV must have an "email" column']);
        return;
      }
      
      const parsed: { name: string; email: string; npi: string }[] = [];
      const errors: string[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
        const email = cols[emailIdx] || '';
        const name = nameIdx >= 0 ? cols[nameIdx] || '' : '';
        const npi = npiIdx >= 0 ? cols[npiIdx] || '' : '';
        
        if (!email || !email.includes('@')) {
          errors.push(`Row ${i + 1}: Invalid email`);
          continue;
        }
        
        parsed.push({ name, email, npi });
      }
      
      setBulkData(parsed);
      setBulkErrors(errors);
      setShowBulkModal(true);
    };
    
    reader.readAsText(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  
  const handleBulkSend = async () => {
    if (bulkData.length === 0) return;
    
    setSending(true);
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bulkData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setSendSuccess(true);
        fetchInvitations();
        
        setTimeout(() => {
          setSendSuccess(false);
          setShowBulkModal(false);
          setBulkData([]);
          setBulkErrors([]);
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending bulk invitations:', error);
    } finally {
      setSending(false);
    }
  };
  
  const filteredInvitations = invitations.filter(inv =>
    inv.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.npi.includes(searchQuery)
  );
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
          <Button variant="secondary" icon={<Upload className="w-4 h-4" />} onClick={() => fileInputRef.current?.click()}>
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className={cn(
          "rounded-xl border p-4",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Total</p>
          <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{stats.total}</p>
        </div>
        <div className={cn(
          "rounded-xl border p-4",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Pending</p>
          <p className="text-2xl font-bold text-slate-500">{stats.pending}</p>
        </div>
        <div className={cn(
          "rounded-xl border p-4",
          isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
        )}>
          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Opened</p>
          <p className="text-2xl font-bold text-cyan-500">{stats.opened}</p>
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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <RefreshCw className={cn("w-6 h-6 animate-spin mx-auto mb-2", isDark ? "text-slate-400" : "text-slate-500")} />
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>Loading invitations...</p>
                  </td>
                </tr>
              ) : filteredInvitations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Mail className={cn("w-10 h-10 mx-auto mb-3", isDark ? "text-slate-600" : "text-slate-300")} />
                    <p className={cn("font-medium", isDark ? "text-slate-400" : "text-slate-500")}>No invitations yet</p>
                    <p className={cn("text-sm mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                      Send your first invitation to get started
                    </p>
                  </td>
                </tr>
              ) : filteredInvitations.map((inv) => (
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
                      {formatDate(inv.sentAt)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(inv.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {(inv.status === 'pending' || inv.status === 'expired') && (
                        <Button variant="ghost" size="sm" icon={<RefreshCw className="w-4 h-4" />} onClick={() => handleResend(inv.id)}>
                          Resend
                        </Button>
                      )}
                      {inv.status === 'completed' && inv.applicationId && (
                        <Link href={`/admin/credentialing/applications`}>
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
      
      {/* Bulk Import Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowBulkModal(false)}>
          <div
            className={cn(
              "w-full max-w-lg rounded-xl p-6",
              isDark ? "bg-slate-800" : "bg-white"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                Bulk Import Invitations
              </h2>
              <button onClick={() => setShowBulkModal(false)} className={cn("p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700")}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {sendSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                  {bulkData.length} Invitations Sent!
                </p>
              </div>
            ) : (
              <>
                {bulkErrors.length > 0 && (
                  <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-amber-800 dark:text-amber-200">Some rows had issues:</p>
                        <ul className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          {bulkErrors.slice(0, 3).map((err, i) => (
                            <li key={i}>{err}</li>
                          ))}
                          {bulkErrors.length > 3 && <li>...and {bulkErrors.length - 3} more</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className={cn(
                  "rounded-lg border p-4 mb-4",
                  isDark ? "bg-slate-900 border-slate-700" : "bg-slate-50 border-slate-200"
                )}>
                  <div className="flex items-center gap-3 mb-3">
                    <FileSpreadsheet className={cn("w-8 h-8", isDark ? "text-cyan-400" : "text-cyan-600")} />
                    <div>
                      <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                        {bulkData.length} providers ready to invite
                      </p>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        Review the list below before sending
                      </p>
                    </div>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {bulkData.slice(0, 10).map((item, i) => (
                      <div key={i} className={cn(
                        "flex items-center justify-between p-2 rounded",
                        isDark ? "bg-slate-800" : "bg-white"
                      )}>
                        <div>
                          <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                            {item.name || 'No name'}
                          </p>
                          <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                            {item.email}
                          </p>
                        </div>
                        {item.npi && (
                          <span className={cn("text-xs font-mono", isDark ? "text-slate-500" : "text-slate-400")}>
                            NPI: {item.npi}
                          </span>
                        )}
                      </div>
                    ))}
                    {bulkData.length > 10 && (
                      <p className={cn("text-sm text-center py-2", isDark ? "text-slate-400" : "text-slate-500")}>
                        ...and {bulkData.length - 10} more
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="secondary" className="flex-1" onClick={() => { setShowBulkModal(false); setBulkData([]); setBulkErrors([]); }}>
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1" 
                    icon={sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    onClick={handleBulkSend}
                    disabled={bulkData.length === 0 || sending}
                  >
                    {sending ? "Sending..." : `Send ${bulkData.length} Invitations`}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
