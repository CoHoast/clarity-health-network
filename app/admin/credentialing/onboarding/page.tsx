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
  Eye,
  Edit,
  FileText,
  ChevronDown,
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

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  category: string;
  body: string;
}

// Email templates for provider invitations
const emailTemplates: EmailTemplate[] = [
  {
    id: "TPL-INV-001",
    name: "Standard Network Invitation",
    subject: "Join Our Provider Network - Invitation to Partner",
    description: "Professional invitation to join the provider network",
    category: "Invitation",
    body: `Dear [PROVIDER_NAME],

I hope this message finds you well. I'm reaching out on behalf of our PPO Network to invite you to join our growing network of healthcare providers.

We are expanding our provider network in your area, and based on your excellent reputation, we believe you would be a valuable addition.

**Benefits of joining our network:**
• Access to thousands of covered lives in your area
• Competitive reimbursement rates
• Streamlined credentialing process (typically 7-14 days)
• Dedicated provider support team
• No participation fees

**Next Steps:**
Click the link below to start your application. If you have your NPI ready, we can pre-fill much of your information automatically.

[APPLICATION_LINK]

We would love the opportunity to discuss how a partnership could benefit your practice. Please feel free to reach out if you have any questions.

Best regards,
Provider Relations Team`
  },
  {
    id: "TPL-INV-002",
    name: "Fast-Track Invitation",
    subject: "Priority Invitation - Join Our Network",
    description: "Expedited invitation with fast-track credentialing offer",
    category: "Priority",
    body: `Dear [PROVIDER_NAME],

We're excited to extend a **priority invitation** to join our provider network!

Based on the high demand for [SPECIALTY] providers in your area, we're offering **fast-track credentialing** - complete your application today and be credentialed within 5-7 business days.

**Why join now?**
• Fast-track credentialing (5-7 days vs. standard 14 days)
• Immediate access to our member base upon approval
• Competitive [SPECIALTY] reimbursement rates
• Dedicated onboarding specialist assigned to your account

**Get Started:**
[APPLICATION_LINK]

This fast-track offer is available for a limited time. Reply to this email or call us directly with any questions.

Looking forward to welcoming you to our network!

Best regards,
Provider Relations Team`
  },
  {
    id: "TPL-INV-003",
    name: "Re-Engagement Invitation",
    subject: "We'd Love to Have You Join Our Network",
    description: "Follow-up for providers who showed previous interest",
    category: "Follow-Up",
    body: `Dear [PROVIDER_NAME],

I wanted to follow up on our previous outreach regarding the opportunity to join our provider network.

We understand you have a busy practice, but we truly believe a partnership would be mutually beneficial. Our members are actively seeking quality [SPECIALTY] providers in your area.

**What's new since we last reached out:**
• Enhanced reimbursement rates for your specialty
• Even faster credentialing turnaround
• New provider portal with real-time eligibility verification

**Ready to get started?**
[APPLICATION_LINK]

If you have any questions or concerns that prevented you from joining previously, I'd be happy to address them personally. Just reply to this email.

Best regards,
Provider Relations Team`
  },
  {
    id: "TPL-INV-004",
    name: "Specialty-Specific Invitation",
    subject: "Seeking [SPECIALTY] Providers - Network Opportunity",
    description: "Targeted invitation for specific specialty needs",
    category: "Specialty",
    body: `Dear [PROVIDER_NAME],

Our network is actively seeking [SPECIALTY] providers to meet the growing demand from our members.

We've identified your practice as a top-rated [SPECIALTY] provider, and we'd like to invite you to join our network.

**What we offer [SPECIALTY] providers:**
• Competitive specialty-specific fee schedules
• Growing patient referral volume
• Simple online credentialing
• Dedicated specialty liaison
• No network participation fees

**Our members need you:**
We currently have [XX] members in your area searching for [SPECIALTY] providers. Your expertise would help us better serve their healthcare needs.

**Start your application:**
[APPLICATION_LINK]

Let me know if you'd like to schedule a call to discuss the details.

Best regards,
Provider Relations Team`
  },
  {
    id: "TPL-INV-005",
    name: "Warm Introduction",
    subject: "Personal Invitation to Join Our Network",
    description: "Personalized invitation from network leadership",
    category: "Executive",
    body: `Dear [PROVIDER_NAME],

My name is [SENDER_NAME], and I'm personally reaching out to invite you to join our provider network.

Your reputation for excellent patient care has not gone unnoticed. We carefully select our network providers, and we believe your practice exemplifies the quality standards our members deserve.

**Why we're reaching out to you specifically:**
• Excellent patient satisfaction ratings
• Strong clinical outcomes in your specialty
• Positive reputation in the healthcare community

**What membership offers:**
• Partnership with a network that values quality over quantity
• Fair and transparent reimbursement
• Minimal administrative burden
• Access to our growing member base

I'd be honored to have you join our network. Please click below to begin your application, or reply to this email to schedule a personal call.

[APPLICATION_LINK]

Warm regards,
[SENDER_NAME]
Network Relations Director`
  },
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
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ npi: "", name: "", email: "" });
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  
  // Template selection state
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(emailTemplates[0]);
  const [editedSubject, setEditedSubject] = useState(emailTemplates[0].subject);
  const [editedBody, setEditedBody] = useState(emailTemplates[0].body);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
      
      {/* Send Invitation Modal - Enhanced with Template Selection */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setShowInviteModal(false); setShowPreview(false); setIsEditing(false); }}>
          <div
            className={cn(
              "w-full rounded-xl overflow-hidden flex flex-col",
              showPreview || isEditing ? "max-w-4xl max-h-[90vh]" : "max-w-lg",
              isDark ? "bg-slate-800" : "bg-white"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={cn("px-6 py-4 border-b flex items-center justify-between", isDark ? "border-slate-700" : "border-slate-200")}>
              <div>
                <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                  Send Provider Invitation
                </h2>
                <p className={cn("text-sm mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>
                  Choose a template and customize your message
                </p>
              </div>
              <button 
                onClick={() => { setShowInviteModal(false); setShowPreview(false); setIsEditing(false); }}
                className={cn("p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700")}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {sendSuccess ? (
              <div className="p-8 text-center">
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
              <div className={cn("flex-1 overflow-auto", showPreview || isEditing ? "flex" : "")}>
                {/* Left Panel - Form */}
                <div className={cn("p-6 space-y-4", showPreview || isEditing ? "w-1/2 border-r" : "", isDark ? "border-slate-700" : "border-slate-200")}>
                  {/* Provider Info Section */}
                  <div className={cn("p-4 rounded-lg", isDark ? "bg-slate-900/50" : "bg-slate-50")}>
                    <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                      <Mail className="w-4 h-4" /> Provider Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <label className={cn("block text-xs font-medium mb-1", isDark ? "text-slate-400" : "text-slate-600")}>
                          Provider NPI (optional)
                        </label>
                        <input
                          type="text"
                          placeholder="1234567890"
                          value={inviteForm.npi}
                          onChange={(e) => setInviteForm({ ...inviteForm, npi: e.target.value })}
                          className={cn(
                            "w-full px-3 py-2 rounded-lg border text-sm",
                            isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"
                          )}
                        />
                      </div>
                      <div>
                        <label className={cn("block text-xs font-medium mb-1", isDark ? "text-slate-400" : "text-slate-600")}>
                          Provider Name
                        </label>
                        <input
                          type="text"
                          placeholder="Dr. John Smith"
                          value={inviteForm.name}
                          onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                          className={cn(
                            "w-full px-3 py-2 rounded-lg border text-sm",
                            isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"
                          )}
                        />
                      </div>
                      <div>
                        <label className={cn("block text-xs font-medium mb-1", isDark ? "text-slate-400" : "text-slate-600")}>
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="provider@example.com"
                          value={inviteForm.email}
                          onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                          className={cn(
                            "w-full px-3 py-2 rounded-lg border text-sm",
                            isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Template Selection */}
                  <div>
                    <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>
                      Email Template
                    </label>
                    <div className="relative">
                      <select
                        value={selectedTemplate?.id || ""}
                        onChange={(e) => {
                          const template = emailTemplates.find(t => t.id === e.target.value);
                          if (template) {
                            setSelectedTemplate(template);
                            setEditedSubject(template.subject);
                            setEditedBody(template.body);
                          }
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg border text-sm appearance-none pr-10",
                          isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                        )}
                      >
                        {emailTemplates.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                      <ChevronDown className={cn("absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none", isDark ? "text-slate-400" : "text-slate-500")} />
                    </div>
                    {selectedTemplate && (
                      <p className={cn("text-xs mt-1.5", isDark ? "text-slate-500" : "text-slate-400")}>
                        {selectedTemplate.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Template Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      icon={<Eye className="w-4 h-4" />}
                      onClick={() => { setShowPreview(true); setIsEditing(false); }}
                      className="flex-1"
                    >
                      Preview
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      icon={<Edit className="w-4 h-4" />}
                      onClick={() => { setIsEditing(true); setShowPreview(false); }}
                      className="flex-1"
                    >
                      Edit Before Sending
                    </Button>
                  </div>
                </div>
                
                {/* Right Panel - Preview or Edit */}
                {(showPreview || isEditing) && (
                  <div className={cn("w-1/2 p-6 overflow-auto", isDark ? "bg-slate-900/30" : "bg-slate-50")}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={cn("text-sm font-semibold flex items-center gap-2", isDark ? "text-white" : "text-slate-900")}>
                        <FileText className="w-4 h-4" />
                        {isEditing ? "Edit Email" : "Email Preview"}
                      </h3>
                      <button 
                        onClick={() => { setShowPreview(false); setIsEditing(false); }}
                        className={cn("text-xs px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700", isDark ? "text-slate-400" : "text-slate-500")}
                      >
                        Close
                      </button>
                    </div>
                    
                    {/* Subject Line */}
                    <div className="mb-4">
                      <label className={cn("block text-xs font-medium mb-1", isDark ? "text-slate-400" : "text-slate-600")}>
                        Subject
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedSubject}
                          onChange={(e) => setEditedSubject(e.target.value)}
                          className={cn(
                            "w-full px-3 py-2 rounded-lg border text-sm",
                            isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"
                          )}
                        />
                      ) : (
                        <p className={cn("px-3 py-2 rounded-lg text-sm", isDark ? "bg-slate-800 text-white" : "bg-white text-slate-900")}>
                          {editedSubject.replace("[PROVIDER_NAME]", inviteForm.name || "[Provider Name]").replace("[SPECIALTY]", "your specialty")}
                        </p>
                      )}
                    </div>
                    
                    {/* Email Body */}
                    <div>
                      <label className={cn("block text-xs font-medium mb-1", isDark ? "text-slate-400" : "text-slate-600")}>
                        Message Body
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editedBody}
                          onChange={(e) => setEditedBody(e.target.value)}
                          rows={16}
                          className={cn(
                            "w-full px-3 py-2 rounded-lg border text-sm font-mono resize-none",
                            isDark ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"
                          )}
                        />
                      ) : (
                        <div className={cn("px-4 py-3 rounded-lg text-sm whitespace-pre-wrap max-h-[400px] overflow-auto", isDark ? "bg-slate-800 text-slate-300" : "bg-white text-slate-700")}>
                          {editedBody
                            .replace(/\[PROVIDER_NAME\]/g, inviteForm.name || "[Provider Name]")
                            .replace(/\[PRACTICE_NAME\]/g, inviteForm.name || "[Practice Name]")
                            .replace(/\[SPECIALTY\]/g, "your specialty")
                            .replace(/\[LOCATION\]/g, "your area")
                            .replace(/\[APPLICATION_LINK\]/g, "https://network.example.com/apply/abc123")
                            .replace(/\[SENDER_NAME\]/g, "Provider Relations Team")
                            .replace(/\[SENDER_TITLE\]/g, "Network Relations")
                            .replace(/\*\*(.*?)\*\*/g, "$1") // Strip markdown bold for preview
                          }
                        </div>
                      )}
                    </div>
                    
                    {isEditing && (
                      <p className={cn("text-xs mt-2", isDark ? "text-slate-500" : "text-slate-400")}>
                        Use placeholders: [PROVIDER_NAME], [PRACTICE_NAME], [SPECIALTY], [LOCATION], [APPLICATION_LINK]
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Footer */}
            {!sendSuccess && (
              <div className={cn("px-6 py-4 border-t flex justify-end gap-3", isDark ? "border-slate-700 bg-slate-800" : "border-slate-200 bg-slate-50")}>
                <Button variant="secondary" onClick={() => { setShowInviteModal(false); setShowPreview(false); setIsEditing(false); }}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  icon={sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  onClick={handleSendInvite}
                  disabled={!inviteForm.email || sending}
                >
                  {sending ? "Sending..." : "Send Invitation"}
                </Button>
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
