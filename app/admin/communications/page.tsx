"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Mail, Send, Users, UserPlus, Search, FileText, CheckCircle, Building2, X, Plus, Edit, Trash2, Copy, Check, Eye, Settings, MessageCircle, Reply, Clock, Inbox } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Existing network providers
const networkProviders = [
  { id: "PRV-001", name: "Cleveland Family Medicine", email: "info@clevelandfm.com", specialty: "Family Medicine", contact: "Mary Johnson", lastContact: "2026-03-10" },
  { id: "PRV-002", name: "Dr. Sarah Chen, MD", email: "dr.chen@medical.com", specialty: "Internal Medicine", contact: "Dr. Sarah Chen", lastContact: "2026-03-05" },
  { id: "PRV-003", name: "Metro Imaging Center", email: "scheduling@metroimaging.com", specialty: "Diagnostic Imaging", contact: "Tom Richards", lastContact: "2026-02-28" },
  { id: "PRV-004", name: "Cleveland Orthopedic Associates", email: "contact@clevortho.com", specialty: "Orthopedics", contact: "James Miller", lastContact: "2026-03-12" },
  { id: "PRV-006", name: "Westlake Urgent Care", email: "info@westlakeuc.com", specialty: "Urgent Care", contact: "Patricia Lee", lastContact: "2026-03-01" },
  { id: "PRV-007", name: "Cleveland Cardiology Associates", email: "info@clevcardio.com", specialty: "Cardiology", contact: "Robert Thompson", lastContact: "2026-02-20" },
  { id: "PRV-008", name: "Quest Diagnostics Cleveland", email: "clevelandlab@quest.com", specialty: "Laboratory", contact: "Lab Admin", lastContact: "2026-03-08" },
];

// Message history
const messageHistory = [
  { id: 1, provider: "Cleveland Family Medicine", subject: "Contract Renewal Reminder", date: "2026-03-10", status: "delivered" },
  { id: 2, provider: "Metro Imaging Center", subject: "Updated Fee Schedule", date: "2026-02-28", status: "opened" },
  { id: 3, provider: "Cleveland Cardiology Associates", subject: "Credentialing Documentation Request", date: "2026-02-20", status: "replied" },
  { id: 4, provider: "Westlake Urgent Care", subject: "Network Policy Update", date: "2026-03-01", status: "delivered" },
  { id: 5, provider: "Dr. Sarah Chen, MD", subject: "Welcome to TrueCare Network", date: "2026-03-05", status: "opened" },
];

interface OutreachTemplate {
  id: string;
  name: string;
  subject: string;
  description: string;
  category: string;
  body: string;
  lastModified: string;
  timesUsed: number;
}

// Outreach templates
const initialTemplates: OutreachTemplate[] = [
  { 
    id: "TPL-001", 
    name: "Initial Network Invitation", 
    subject: "Join TrueCare Health Network - Invitation to Partner",
    description: "First contact email inviting providers to join the network",
    category: "Initial Outreach",
    lastModified: "2026-02-15",
    timesUsed: 145,
    body: `Dear [PROVIDER_NAME],

I hope this message finds you well. My name is [SENDER_NAME] from TrueCare Health Network, and I'm reaching out to invite [PRACTICE_NAME] to join our growing PPO network.

TrueCare Health Network is expanding our provider network in the [LOCATION] area, and based on your excellent reputation in [SPECIALTY], we believe you would be a valuable addition to our network.

Benefits of joining TrueCare Health Network:
• Access to thousands of covered lives in your area
• Competitive reimbursement rates
• Streamlined credentialing process
• Dedicated provider support team
• No participation fees

We would love the opportunity to discuss how a partnership could benefit your practice. Would you be available for a brief call this week to learn more?

Please feel free to reach out to me directly at [PHONE] or reply to this email.

Best regards,
[SENDER_NAME]
[SENDER_TITLE]
TrueCare Health Network
[PHONE]
[EMAIL]`
  },
  { 
    id: "TPL-002", 
    name: "Follow-Up Invitation", 
    subject: "Following Up - TrueCare Health Network Partnership",
    description: "Second contact for providers who haven't responded",
    category: "Follow-Up",
    lastModified: "2026-02-10",
    timesUsed: 89,
    body: `Dear [PROVIDER_NAME],

I wanted to follow up on my previous email regarding the opportunity to join TrueCare Health Network.

We're actively building our [SPECIALTY] provider network in [LOCATION], and [PRACTICE_NAME] would be an excellent fit for our members seeking quality care.

If you have any questions about network participation, credentialing requirements, or reimbursement rates, I'd be happy to schedule a call at your convenience.

You can also visit our provider information page at truecarehealth.com/providers to learn more.

Looking forward to hearing from you.

Best regards,
[SENDER_NAME]
[SENDER_TITLE]
TrueCare Health Network`
  },
  { 
    id: "TPL-003", 
    name: "Specialty-Specific Outreach", 
    subject: "TrueCare Seeking [SPECIALTY] Providers in [LOCATION]",
    description: "Targeted outreach for specific specialty needs",
    category: "Specialty",
    lastModified: "2026-02-20",
    timesUsed: 67,
    body: `Dear [PROVIDER_NAME],

TrueCare Health Network is actively seeking [SPECIALTY] providers to meet the growing demand from our members in the [LOCATION] area.

We've identified [PRACTICE_NAME] as a top-rated practice in your specialty, and we'd like to discuss a potential partnership.

What we offer:
• Competitive [SPECIALTY]-specific fee schedules
• Growing patient referral volume
• Simple online credentialing
• Dedicated specialty liaison

Our members are actively searching for [SPECIALTY] providers, and we'd love to include your practice in our network.

Can we schedule a 15-minute call this week to discuss the details?

Best regards,
[SENDER_NAME]
[SENDER_TITLE]
TrueCare Health Network`
  },
  { 
    id: "TPL-004", 
    name: "Contract Renewal Outreach", 
    subject: "Your TrueCare Network Contract Renewal",
    description: "Reminder for expiring contracts and renewal invitation",
    category: "Renewal",
    lastModified: "2026-03-01",
    timesUsed: 34,
    body: `Dear [PROVIDER_NAME],

I hope this email finds you well. I'm reaching out regarding your upcoming contract renewal with TrueCare Health Network.

Your current agreement with [PRACTICE_NAME] is set to expire on [EXPIRATION_DATE], and we'd love to continue our partnership.

During your time in our network, you've been an invaluable resource for our members. We've seen [STATS] visits to your practice from TrueCare members.

To ensure uninterrupted participation in our network, please review the attached renewal documents and return them by [DEADLINE].

If you have any questions about the renewal terms or would like to discuss any changes, please don't hesitate to reach out.

Thank you for your continued partnership.

Best regards,
[SENDER_NAME]
[SENDER_TITLE]
TrueCare Health Network
[PHONE]`
  },
  { 
    id: "TPL-005", 
    name: "Final Follow-Up", 
    subject: "Final Notice - TrueCare Network Invitation",
    description: "Last attempt to reach non-responsive providers",
    category: "Follow-Up",
    lastModified: "2026-01-25",
    timesUsed: 23,
    body: `Dear [PROVIDER_NAME],

I've reached out a couple of times regarding the opportunity for [PRACTICE_NAME] to join TrueCare Health Network, and I wanted to make one final attempt to connect.

We understand you're busy, and if now isn't the right time, we completely understand. However, if you're interested in learning more about:

• Our competitive reimbursement rates for [SPECIALTY]
• Access to our growing member base in [LOCATION]
• Our streamlined credentialing process

Please reply to this email or call me directly at [PHONE].

If we don't hear back, we'll assume the timing isn't right and won't reach out again. However, our door is always open should you wish to explore this opportunity in the future.

Wishing you continued success.

Best regards,
[SENDER_NAME]
[SENDER_TITLE]
TrueCare Health Network`
  },
];

// Outreach history
const outreachHistory = [
  { id: 1, practice: "Lakewood Medical Group", email: "admin@lakewoodmed.com", template: "Initial Network Invitation", date: "2026-03-14", status: "sent" },
  { id: 2, practice: "Dr. Michael Torres, MD", email: "mtorres@cleveclinic.com", template: "Specialty-Specific Outreach", date: "2026-03-12", status: "responded" },
  { id: 3, practice: "North Coast Imaging", email: "info@ncimaging.com", template: "Initial Network Invitation", date: "2026-03-10", status: "opened" },
  { id: 4, practice: "Riverside Family Practice", email: "office@riversidecare.com", template: "Follow-Up Invitation", date: "2026-03-08", status: "sent" },
];

interface OutreachResponse {
  id: number;
  practice: string;
  contact: string;
  email: string;
  specialty: string;
  originalOutreach: string;
  responseDate: string;
  receivedDate: string;
  subject: string;
  body: string;
  status: "new" | "read" | "replied" | "archived";
  interested: boolean;
}

// Provider responses to outreach
const initialResponses: OutreachResponse[] = [
  {
    id: 1,
    practice: "Dr. Michael Torres, MD",
    contact: "Dr. Michael Torres",
    email: "mtorres@cleveclinic.com",
    specialty: "Cardiology",
    originalOutreach: "Specialty-Specific Outreach",
    responseDate: "2026-03-13",
    receivedDate: "2026-03-13 2:45 PM",
    subject: "Re: TrueCare Seeking Cardiology Providers in Cleveland",
    body: `Hello,

Thank you for reaching out about joining TrueCare Health Network. I've been looking for opportunities to expand my practice's reach, and your network sounds like a good fit.

I'm particularly interested in learning more about:
- Your reimbursement rates for cardiology services
- The credentialing timeline
- Current patient volume from TrueCare members in the Cleveland area

I'm available for a call this Thursday or Friday afternoon if that works for your team.

Best regards,
Dr. Michael Torres
Cleveland Cardiology Specialists
(216) 555-0147`,
    status: "new",
    interested: true,
  },
  {
    id: 2,
    practice: "Lakeside Pediatrics",
    contact: "Dr. Amanda Chen",
    email: "achen@lakesidepeds.com",
    specialty: "Pediatrics",
    originalOutreach: "Initial Network Invitation",
    responseDate: "2026-03-11",
    receivedDate: "2026-03-11 10:22 AM",
    subject: "Re: Join TrueCare Health Network - Invitation to Partner",
    body: `Hi there,

We received your invitation to join TrueCare Health Network. Our practice has been considering expanding our insurance network participation.

Could you send over more details about:
1. The fee schedule for pediatric services
2. Any participation requirements
3. How claims are processed

We're definitely interested in learning more.

Thanks,
Dr. Amanda Chen
Lakeside Pediatrics`,
    status: "read",
    interested: true,
  },
  {
    id: 3,
    practice: "Summit Orthopedic Group",
    contact: "Office Manager - Janet Miller",
    email: "jmiller@summitortho.com",
    specialty: "Orthopedics",
    originalOutreach: "Follow-Up Invitation",
    responseDate: "2026-03-09",
    receivedDate: "2026-03-09 4:15 PM",
    subject: "Re: Following Up - TrueCare Health Network Partnership",
    body: `Thank you for following up.

After discussing with our physicians, we've decided that we're not looking to add new network partnerships at this time. We're at capacity with our current patient load.

However, please keep us in mind for the future. Our situation may change in 6-12 months.

Best,
Janet Miller
Office Manager
Summit Orthopedic Group`,
    status: "replied",
    interested: false,
  },
  {
    id: 4,
    practice: "Cleveland Women's Health",
    contact: "Dr. Rebecca Thompson",
    email: "rthompson@clevewomens.com",
    specialty: "OB/GYN",
    originalOutreach: "Specialty-Specific Outreach",
    responseDate: "2026-03-08",
    receivedDate: "2026-03-08 11:30 AM",
    subject: "Re: TrueCare Seeking OB/GYN Providers in Cleveland",
    body: `Hello,

Yes, we would be very interested in joining TrueCare Health Network! We've heard good things about your organization from colleagues.

Can we schedule a call for early next week? I'd like to discuss the onboarding process and get started as soon as possible.

My direct line is (216) 555-0234.

Looking forward to partnering with you,
Dr. Rebecca Thompson
Cleveland Women's Health Associates`,
    status: "read",
    interested: true,
  },
];

function CommunicationsContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"messages" | "outreach">("messages");
  const [outreachSubTab, setOutreachSubTab] = useState<"send" | "templates" | "responses">("send");
  const [searchQuery, setSearchQuery] = useState("");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [showNewTemplateModal, setShowNewTemplateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<typeof networkProviders[0] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<OutreachTemplate | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<OutreachResponse | null>(null);
  const [responses, setResponses] = useState<OutreachResponse[]>(initialResponses);
  const [templates, setTemplates] = useState<OutreachTemplate[]>(initialTemplates);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Edit template form state
  const [editForm, setEditForm] = useState({
    name: "",
    subject: "",
    description: "",
    category: "",
    body: "",
  });

  // New template form state
  const [newTemplateForm, setNewTemplateForm] = useState({
    name: "",
    subject: "",
    description: "",
    category: "Initial Outreach",
    body: "",
  });

  // Outreach form state
  const [outreachForm, setOutreachForm] = useState({
    practiceName: "",
    providerName: "",
    email: "",
    specialty: "",
    location: "",
    senderName: "Network Relations Team",
    senderTitle: "Provider Relations",
    phone: "1-800-555-0199",
    senderEmail: "providers@truecarehealth.com",
  });

  // Set tab from URL param on mount
  useEffect(() => {
    if (tabParam === "outreach") {
      setActiveTab("outreach");
    } else {
      setActiveTab("messages");
    }
  }, [tabParam]);

  const filteredProviders = networkProviders.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openComposeModal = (provider: typeof networkProviders[0]) => {
    setSelectedProvider(provider);
    setMessageSubject("");
    setMessageBody("");
    setSendSuccess(false);
    setShowComposeModal(true);
  };

  const openOutreachModal = (template: OutreachTemplate) => {
    setSelectedTemplate(template);
    setOutreachForm({
      ...outreachForm,
      practiceName: "",
      providerName: "",
      email: "",
      specialty: "",
      location: "Cleveland, OH",
    });
    setSendSuccess(false);
    setShowOutreachModal(true);
  };

  const openEditTemplateModal = (template: OutreachTemplate) => {
    setSelectedTemplate(template);
    setEditForm({
      name: template.name,
      subject: template.subject,
      description: template.description,
      category: template.category,
      body: template.body,
    });
    setShowEditTemplateModal(true);
  };

  const openPreviewModal = (template: OutreachTemplate) => {
    setSelectedTemplate(template);
    setShowPreviewModal(true);
  };

  const handleSendMessage = () => {
    setSendSuccess(true);
    setTimeout(() => {
      setShowComposeModal(false);
      setSendSuccess(false);
    }, 1500);
  };

  const handleSendOutreach = () => {
    setSendSuccess(true);
    setTimeout(() => {
      setShowOutreachModal(false);
      setSendSuccess(false);
    }, 1500);
  };

  const handleSaveTemplate = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      // Update template in list
      if (selectedTemplate) {
        setTemplates(templates.map(t => 
          t.id === selectedTemplate.id 
            ? { ...t, ...editForm, lastModified: new Date().toISOString().split('T')[0] }
            : t
        ));
      }
      setTimeout(() => {
        setSaved(false);
        setShowEditTemplateModal(false);
      }, 1500);
    }, 1000);
  };

  const handleCreateTemplate = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      // Add new template
      const newTemplate: OutreachTemplate = {
        id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
        ...newTemplateForm,
        lastModified: new Date().toISOString().split('T')[0],
        timesUsed: 0,
      };
      setTemplates([...templates, newTemplate]);
      setTimeout(() => {
        setSaved(false);
        setShowNewTemplateModal(false);
        setNewTemplateForm({
          name: "",
          subject: "",
          description: "",
          category: "Initial Outreach",
          body: "",
        });
      }, 1500);
    }, 1000);
  };

  const handleDuplicateTemplate = (template: OutreachTemplate) => {
    const newTemplate: OutreachTemplate = {
      ...template,
      id: `TPL-${String(templates.length + 1).padStart(3, '0')}`,
      name: `${template.name} (Copy)`,
      lastModified: new Date().toISOString().split('T')[0],
      timesUsed: 0,
    };
    setTemplates([...templates, newTemplate]);
  };

  const openResponseModal = (response: OutreachResponse) => {
    setSelectedResponse(response);
    // Mark as read
    if (response.status === "new") {
      setResponses(responses.map(r => 
        r.id === response.id ? { ...r, status: "read" as const } : r
      ));
    }
    setShowResponseModal(true);
  };

  const openReplyModal = (response: OutreachResponse) => {
    setSelectedResponse(response);
    setReplyBody("");
    setSendSuccess(false);
    setShowReplyModal(true);
  };

  const handleSendReply = () => {
    setSendSuccess(true);
    setTimeout(() => {
      // Mark as replied
      if (selectedResponse) {
        setResponses(responses.map(r => 
          r.id === selectedResponse.id ? { ...r, status: "replied" as const } : r
        ));
      }
      setShowReplyModal(false);
      setShowResponseModal(false);
      setSendSuccess(false);
    }, 1500);
  };

  const newResponsesCount = responses.filter(r => r.status === "new").length;

  const getResponseStatusBadge = (status: string) => {
    switch (status) {
      case "new": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded-full"><Mail className="w-3 h-3" />New</span>;
      case "read": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-500/20 text-slate-400 text-xs font-medium rounded-full"><Eye className="w-3 h-3" />Read</span>;
      case "replied": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><Reply className="w-3 h-3" />Replied</span>;
      case "archived": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-600/20 text-slate-500 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Archived</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-500/20 text-slate-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Delivered</span>;
      case "opened": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded-full"><Mail className="w-3 h-3" />Opened</span>;
      case "replied": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Replied</span>;
      case "sent": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Send className="w-3 h-3" />Sent</span>;
      case "responded": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Responded</span>;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Initial Outreach": return "bg-cyan-500/20 text-cyan-400";
      case "Follow-Up": return "bg-amber-500/20 text-amber-400";
      case "Specialty": return "bg-purple-500/20 text-purple-400";
      case "Renewal": return "bg-green-500/20 text-green-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  // Generate preview of outreach email with filled placeholders
  const getOutreachPreview = () => {
    if (!selectedTemplate) return "";
    return selectedTemplate.body
      .replace(/\[PROVIDER_NAME\]/g, outreachForm.providerName || "[Provider Name]")
      .replace(/\[PRACTICE_NAME\]/g, outreachForm.practiceName || "[Practice Name]")
      .replace(/\[SPECIALTY\]/g, outreachForm.specialty || "[Specialty]")
      .replace(/\[LOCATION\]/g, outreachForm.location || "[Location]")
      .replace(/\[SENDER_NAME\]/g, outreachForm.senderName)
      .replace(/\[SENDER_TITLE\]/g, outreachForm.senderTitle)
      .replace(/\[PHONE\]/g, outreachForm.phone)
      .replace(/\[EMAIL\]/g, outreachForm.senderEmail)
      .replace(/\[EXPIRATION_DATE\]/g, "[Expiration Date]")
      .replace(/\[DEADLINE\]/g, "[Deadline]")
      .replace(/\[STATS\]/g, "[Statistics]");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Mail className="w-7 h-7 text-teal-500" />
            Communications
          </h1>
          <p className="text-slate-400 mt-1">Message providers and recruit new network partners</p>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "messages" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <Users className="w-4 h-4" />
          Network Providers
        </button>
        <button
          onClick={() => setActiveTab("outreach")}
          className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "outreach" ? "bg-teal-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <UserPlus className="w-4 h-4" />
          Provider Outreach
        </button>
      </div>

      {activeTab === "messages" ? (
        <>
          {/* Provider Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search providers by name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Provider List */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Network Providers</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredProviders.map((provider) => (
                  <div key={provider.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{provider.name}</p>
                        <p className="text-slate-400 text-sm">{provider.specialty}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => openComposeModal(provider)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Messages</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messageHistory.map((msg) => (
                  <div key={msg.id} className="p-3 bg-slate-700/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white font-medium text-sm">{msg.provider}</p>
                      {getStatusBadge(msg.status)}
                    </div>
                    <p className="text-slate-300 text-sm">{msg.subject}</p>
                    <p className="text-slate-500 text-xs mt-1">{msg.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Outreach Sub-Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setOutreachSubTab("send")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                outreachSubTab === "send" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Send className="w-4 h-4 inline mr-2" />
              Send Outreach
            </button>
            <button
              onClick={() => setOutreachSubTab("responses")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                outreachSubTab === "responses" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Inbox className="w-4 h-4 inline mr-2" />
              Responses
              {newResponsesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {newResponsesCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setOutreachSubTab("templates")}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                outreachSubTab === "templates" ? "bg-slate-700 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Manage Templates
            </button>
          </div>

          {outreachSubTab === "send" ? (
            <>
              {/* Quick Send Section */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5 text-cyan-400" />
                  Send Outreach Email
                </h2>
                <p className="text-slate-400 text-sm mb-4">Select a template to send to a potential network provider</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-medium">{template.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                          {template.category}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">{template.description}</p>
                      <button
                        onClick={() => openOutreachModal(template)}
                        className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                        Use This Template
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Outreach History */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Outreach History</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Practice</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Template</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {outreachHistory.map((outreach) => (
                        <tr key={outreach.id} className="hover:bg-slate-700/30">
                          <td className="px-4 py-3 text-white">{outreach.practice}</td>
                          <td className="px-4 py-3 text-slate-400 text-sm">{outreach.email}</td>
                          <td className="px-4 py-3 text-slate-300 text-sm">{outreach.template}</td>
                          <td className="px-4 py-3 text-slate-400 text-sm">{outreach.date}</td>
                          <td className="px-4 py-3">{getStatusBadge(outreach.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : outreachSubTab === "responses" ? (
            <>
              {/* Responses Section */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Inbox className="w-5 h-5 text-cyan-400" />
                      Provider Responses
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      {newResponsesCount > 0 ? `${newResponsesCount} new response${newResponsesCount > 1 ? 's' : ''} • ` : ''}
                      {responses.length} total responses
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {responses.map((response) => (
                    <div 
                      key={response.id} 
                      className={`rounded-lg p-4 transition-colors cursor-pointer ${
                        response.status === "new" 
                          ? "bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20" 
                          : "bg-slate-700/30 hover:bg-slate-700/50"
                      }`}
                      onClick={() => openResponseModal(response)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            response.interested ? "bg-green-500/20" : "bg-slate-600/50"
                          }`}>
                            <Building2 className={`w-6 h-6 ${response.interested ? "text-green-400" : "text-slate-400"}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-white font-semibold">{response.practice}</h3>
                              {getResponseStatusBadge(response.status)}
                              {response.interested && (
                                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                                  Interested
                                </span>
                              )}
                            </div>
                            <p className="text-slate-300 text-sm mb-1">{response.subject}</p>
                            <p className="text-slate-400 text-sm line-clamp-2">{response.body.split('\n')[0]}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {response.receivedDate}
                              </span>
                              <span>•</span>
                              <span>{response.contact}</span>
                              <span>•</span>
                              <span>{response.specialty}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            onClick={(e) => { e.stopPropagation(); openReplyModal(response); }}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                          >
                            <Reply className="w-4 h-4" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {responses.length === 0 && (
                    <div className="text-center py-12">
                      <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-400">No responses yet</p>
                      <p className="text-slate-500 text-sm mt-1">Responses to your outreach emails will appear here</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Template Management */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      Email Templates
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Create and customize outreach email templates</p>
                  </div>
                  <button
                    onClick={() => setShowNewTemplateModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Template
                  </button>
                </div>

                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold">{template.name}</h3>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                              {template.category}
                            </span>
                          </div>
                          <p className="text-slate-400 text-sm mb-2">{template.description}</p>
                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>Subject: {template.subject}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                            <span>Last modified: {template.lastModified}</span>
                            <span>•</span>
                            <span>Used {template.timesUsed} times</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openPreviewModal(template)}
                            className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditTemplateModal(template)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateTemplate(template)}
                            className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Available Placeholders */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h3 className="text-white font-semibold mb-4">Available Placeholders</h3>
                <p className="text-slate-400 text-sm mb-4">Use these placeholders in your templates. They will be replaced with actual values when sending.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { tag: "[PROVIDER_NAME]", desc: "Contact person's name" },
                    { tag: "[PRACTICE_NAME]", desc: "Practice/organization name" },
                    { tag: "[SPECIALTY]", desc: "Medical specialty" },
                    { tag: "[LOCATION]", desc: "City/region" },
                    { tag: "[SENDER_NAME]", desc: "Your name" },
                    { tag: "[SENDER_TITLE]", desc: "Your job title" },
                    { tag: "[PHONE]", desc: "Contact phone" },
                    { tag: "[EMAIL]", desc: "Contact email" },
                  ].map((placeholder) => (
                    <div key={placeholder.tag} className="bg-slate-700/50 rounded-lg p-3">
                      <code className="text-cyan-400 text-sm">{placeholder.tag}</code>
                      <p className="text-slate-400 text-xs mt-1">{placeholder.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Compose Message Modal */}
      <AnimatePresence>
        {showComposeModal && selectedProvider && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowComposeModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">New Message</h2>
                  <p className="text-slate-400">To: {selectedProvider.name}</p>
                </div>
                <button onClick={() => setShowComposeModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Recipient</label>
                  <div className="flex items-center gap-3 p-3 bg-slate-700/50 rounded-lg">
                    <Building2 className="w-5 h-5 text-teal-400" />
                    <div>
                      <p className="text-white">{selectedProvider.contact}</p>
                      <p className="text-slate-400 text-sm">{selectedProvider.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
                  <input
                    type="text"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder="Enter subject..."
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                  <textarea
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder="Type your message..."
                    rows={6}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowComposeModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageSubject || !messageBody}
                  className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendSuccess ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  {sendSuccess ? "Sent!" : "Send Message"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Outreach Modal */}
      <AnimatePresence>
        {showOutreachModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowOutreachModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedTemplate.name}</h2>
                  <p className="text-slate-400">Fill in the details to personalize your outreach</p>
                </div>
                <button onClick={() => setShowOutreachModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 grid lg:grid-cols-2 gap-6">
                {/* Form */}
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">Provider Information</h3>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Practice Name *</label>
                    <input
                      type="text"
                      value={outreachForm.practiceName}
                      onChange={(e) => setOutreachForm({ ...outreachForm, practiceName: e.target.value })}
                      placeholder="e.g., Lakewood Medical Group"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Contact Name *</label>
                    <input
                      type="text"
                      value={outreachForm.providerName}
                      onChange={(e) => setOutreachForm({ ...outreachForm, providerName: e.target.value })}
                      placeholder="e.g., Dr. John Smith"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={outreachForm.email}
                      onChange={(e) => setOutreachForm({ ...outreachForm, email: e.target.value })}
                      placeholder="e.g., contact@practice.com"
                      className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Specialty</label>
                      <input
                        type="text"
                        value={outreachForm.specialty}
                        onChange={(e) => setOutreachForm({ ...outreachForm, specialty: e.target.value })}
                        placeholder="e.g., Cardiology"
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={outreachForm.location}
                        onChange={(e) => setOutreachForm({ ...outreachForm, location: e.target.value })}
                        placeholder="e.g., Cleveland, OH"
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <h3 className="text-white font-semibold pt-4">Sender Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Your Name</label>
                      <input
                        type="text"
                        value={outreachForm.senderName}
                        onChange={(e) => setOutreachForm({ ...outreachForm, senderName: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Your Title</label>
                      <input
                        type="text"
                        value={outreachForm.senderTitle}
                        onChange={(e) => setOutreachForm({ ...outreachForm, senderTitle: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <h3 className="text-white font-semibold mb-3">Email Preview</h3>
                  <div className="bg-white rounded-lg p-4 text-slate-800 text-sm max-h-96 overflow-y-auto">
                    <div className="border-b border-slate-200 pb-3 mb-3">
                      <p><strong>To:</strong> {outreachForm.email || "[email]"}</p>
                      <p><strong>Subject:</strong> {selectedTemplate.subject.replace(/\[SPECIALTY\]/g, outreachForm.specialty || "[Specialty]").replace(/\[LOCATION\]/g, outreachForm.location || "[Location]")}</p>
                    </div>
                    <div className="whitespace-pre-line">
                      {getOutreachPreview()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowOutreachModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendOutreach}
                  disabled={!outreachForm.practiceName || !outreachForm.providerName || !outreachForm.email}
                  className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendSuccess ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  {sendSuccess ? "Sent!" : "Send Outreach Email"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Template Modal */}
      <AnimatePresence>
        {showEditTemplateModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !saving && setShowEditTemplateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {!saving && !saved ? (
                <>
                  <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Edit Template</h2>
                      <p className="text-slate-400 text-sm">Customize your outreach email template</p>
                    </div>
                    <button onClick={() => setShowEditTemplateModal(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 overflow-auto max-h-[60vh] space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Template Name *</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                        >
                          <option>Initial Outreach</option>
                          <option>Follow-Up</option>
                          <option>Specialty</option>
                          <option>Renewal</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                        placeholder="Brief description of when to use this template"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Subject *</label>
                      <input
                        type="text"
                        value={editForm.subject}
                        onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Body *</label>
                      <textarea
                        value={editForm.body}
                        onChange={(e) => setEditForm({ ...editForm, body: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 h-64 resize-none font-mono text-sm"
                      />
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">
                        <strong>Tip:</strong> Use placeholders like [PROVIDER_NAME], [PRACTICE_NAME], [SPECIALTY], [LOCATION] to personalize emails.
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                    <button
                      onClick={() => setShowEditTemplateModal(false)}
                      className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTemplate}
                      className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </>
              ) : saving ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Saving template...</p>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <p className="text-white font-medium">Template Saved!</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Template Modal */}
      <AnimatePresence>
        {showNewTemplateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !saving && setShowNewTemplateModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              {!saving && !saved ? (
                <>
                  <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-white">Create New Template</h2>
                      <p className="text-slate-400 text-sm">Build a custom outreach email template</p>
                    </div>
                    <button onClick={() => setShowNewTemplateModal(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6 overflow-auto max-h-[60vh] space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Template Name *</label>
                        <input
                          type="text"
                          value={newTemplateForm.name}
                          onChange={(e) => setNewTemplateForm({ ...newTemplateForm, name: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                          placeholder="e.g., Welcome Email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Category *</label>
                        <select
                          value={newTemplateForm.category}
                          onChange={(e) => setNewTemplateForm({ ...newTemplateForm, category: e.target.value })}
                          className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                        >
                          <option>Initial Outreach</option>
                          <option>Follow-Up</option>
                          <option>Specialty</option>
                          <option>Renewal</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <input
                        type="text"
                        value={newTemplateForm.description}
                        onChange={(e) => setNewTemplateForm({ ...newTemplateForm, description: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                        placeholder="Brief description of when to use this template"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Subject *</label>
                      <input
                        type="text"
                        value={newTemplateForm.subject}
                        onChange={(e) => setNewTemplateForm({ ...newTemplateForm, subject: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                        placeholder="e.g., Join TrueCare Health Network"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Email Body *</label>
                      <textarea
                        value={newTemplateForm.body}
                        onChange={(e) => setNewTemplateForm({ ...newTemplateForm, body: e.target.value })}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500 h-64 resize-none font-mono text-sm"
                        placeholder="Dear [PROVIDER_NAME],&#10;&#10;Write your email content here...&#10;&#10;Best regards,&#10;[SENDER_NAME]"
                      />
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">
                        <strong>Available placeholders:</strong> [PROVIDER_NAME], [PRACTICE_NAME], [SPECIALTY], [LOCATION], [SENDER_NAME], [SENDER_TITLE], [PHONE], [EMAIL]
                      </p>
                    </div>
                  </div>
                  <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                    <button
                      onClick={() => setShowNewTemplateModal(false)}
                      className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateTemplate}
                      disabled={!newTemplateForm.name || !newTemplateForm.subject || !newTemplateForm.body}
                      className="px-6 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      Create Template
                    </button>
                  </div>
                </>
              ) : saving ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white font-medium">Creating template...</p>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-8 h-8 text-green-400" />
                  </motion.div>
                  <p className="text-white font-medium">Template Created!</p>
                  <p className="text-slate-400 text-sm mt-1">You can now use this template for outreach</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Preview Template Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPreviewModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(selectedTemplate.category)}`}>
                    {selectedTemplate.category}
                  </span>
                </div>
                <button onClick={() => setShowPreviewModal(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-auto max-h-[60vh] bg-white">
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <p className="text-gray-600 text-sm"><strong>Subject:</strong> {selectedTemplate.subject}</p>
                </div>
                <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">
                  {selectedTemplate.body}
                </div>
              </div>
              <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    openEditTemplateModal(selectedTemplate);
                  }}
                  className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Template
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Response Modal */}
      <AnimatePresence>
        {showResponseModal && selectedResponse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowResponseModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-gray-900">{selectedResponse.practice}</h2>
                    {selectedResponse.interested && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Interested
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{selectedResponse.contact} • {selectedResponse.specialty}</p>
                </div>
                <button onClick={() => setShowResponseModal(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-200 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-auto max-h-[60vh] bg-white">
                {/* Email Header */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">From:</p>
                      <p className="text-gray-900 font-medium">{selectedResponse.contact}</p>
                      <p className="text-gray-600">{selectedResponse.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Received:</p>
                      <p className="text-gray-900">{selectedResponse.receivedDate}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-gray-500 text-sm">In response to:</p>
                    <p className="text-gray-700 text-sm">{selectedResponse.originalOutreach}</p>
                  </div>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <p className="text-gray-500 text-sm mb-1">Subject:</p>
                  <p className="text-gray-900 font-semibold">{selectedResponse.subject}</p>
                </div>

                {/* Email Body */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="whitespace-pre-line text-gray-700 text-sm leading-relaxed">
                    {selectedResponse.body}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 flex justify-between bg-gray-50">
                <div className="flex gap-2">
                  <button
                    className="px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Archive
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setShowResponseModal(false);
                      openReplyModal(selectedResponse);
                    }}
                    className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
                  >
                    <Reply className="w-4 h-4" />
                    Reply
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && selectedResponse && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => !sendSuccess && setShowReplyModal(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Reply to {selectedResponse.contact}</h2>
                  <p className="text-slate-400 text-sm">{selectedResponse.email}</p>
                </div>
                <button onClick={() => setShowReplyModal(false)} className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-lg">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-auto">
                {/* Original Message Reference */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-400 text-xs uppercase font-semibold mb-2">Replying to:</p>
                  <p className="text-slate-300 text-sm font-medium">{selectedResponse.subject}</p>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-3">{selectedResponse.body.split('\n').slice(0, 3).join('\n')}...</p>
                </div>

                {/* Reply Subject */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                  <input
                    type="text"
                    defaultValue={`Re: ${selectedResponse.subject}`}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:border-teal-500"
                  />
                </div>

                {/* Reply Body */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Your Reply</label>
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder={`Hi ${selectedResponse.contact.split(' ')[0]},\n\nThank you for your response...\n\nBest regards,\nNetwork Relations Team\nTrueCare Health Network`}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:border-teal-500 h-48 resize-none"
                  />
                </div>

                {/* Quick Response Buttons */}
                <div>
                  <p className="text-slate-400 text-xs uppercase font-semibold mb-2">Quick Responses:</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setReplyBody(`Hi ${selectedResponse.contact.split(' ')[0]},\n\nThank you for your interest in joining TrueCare Health Network! I'd be happy to schedule a call to discuss the details.\n\nWould any of the following times work for you?\n- [Option 1]\n- [Option 2]\n- [Option 3]\n\nAlternatively, feel free to suggest a time that works best for your schedule.\n\nBest regards,\nNetwork Relations Team\nTrueCare Health Network\n1-800-555-0199`)}
                      className="px-3 py-1.5 bg-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Schedule Call
                    </button>
                    <button
                      onClick={() => setReplyBody(`Hi ${selectedResponse.contact.split(' ')[0]},\n\nThank you for your response. I've attached the following information you requested:\n\n• Fee schedule for ${selectedResponse.specialty} services\n• Credentialing requirements\n• Network participation agreement\n\nPlease review these documents and let me know if you have any questions. I'm happy to schedule a call to walk through anything in detail.\n\nBest regards,\nNetwork Relations Team\nTrueCare Health Network\n1-800-555-0199`)}
                      className="px-3 py-1.5 bg-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Send Info
                    </button>
                    <button
                      onClick={() => setReplyBody(`Hi ${selectedResponse.contact.split(' ')[0]},\n\nThank you for letting us know. We completely understand and appreciate you taking the time to respond.\n\nWe'll keep your information on file, and please don't hesitate to reach out if your situation changes in the future. Our door is always open.\n\nWishing you continued success!\n\nBest regards,\nNetwork Relations Team\nTrueCare Health Network`)}
                      className="px-3 py-1.5 bg-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Not Interested (Polite)
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyBody}
                  className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendSuccess ? <CheckCircle className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  {sendSuccess ? "Sent!" : "Send Reply"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CommunicationsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div></div>}>
      <CommunicationsContent />
    </Suspense>
  );
}
