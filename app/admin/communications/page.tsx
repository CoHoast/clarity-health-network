"use client";

import { useState } from "react";
import { Mail, Send, Users, UserPlus, Search, FileText, CheckCircle, Clock, Building2, Phone, Globe, X } from "lucide-react";
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

// Outreach templates
const outreachTemplates = [
  { 
    id: "TPL-001", 
    name: "Initial Network Invitation", 
    subject: "Join TrueCare Health Network - Invitation to Partner",
    description: "First contact email inviting providers to join the network",
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
];

// Outreach history
const outreachHistory = [
  { id: 1, practice: "Lakewood Medical Group", email: "admin@lakewoodmed.com", template: "Initial Network Invitation", date: "2026-03-14", status: "sent" },
  { id: 2, practice: "Dr. Michael Torres, MD", email: "mtorres@cleveclinic.com", template: "Specialty-Specific Outreach", date: "2026-03-12", status: "responded" },
  { id: 3, practice: "North Coast Imaging", email: "info@ncimaging.com", template: "Initial Network Invitation", date: "2026-03-10", status: "opened" },
  { id: 4, practice: "Riverside Family Practice", email: "office@riversidecare.com", template: "Follow-Up Invitation", date: "2026-03-08", status: "sent" },
];

export default function CommunicationsPage() {
  const [activeTab, setActiveTab] = useState<"messages" | "outreach">("messages");
  const [searchQuery, setSearchQuery] = useState("");
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showOutreachModal, setShowOutreachModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<typeof networkProviders[0] | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof outreachTemplates[0] | null>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);

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

  const openOutreachModal = (template: typeof outreachTemplates[0]) => {
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
      .replace(/\[EMAIL\]/g, outreachForm.senderEmail);
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

      {/* Tabs */}
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
          {/* Outreach Templates */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Outreach Templates
            </h2>
            <p className="text-slate-400 text-sm mb-4">Select a template to reach out to potential network providers</p>
            <div className="grid md:grid-cols-3 gap-4">
              {outreachTemplates.map((template) => (
                <div key={template.id} className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors">
                  <h3 className="text-white font-medium mb-2">{template.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{template.description}</p>
                  <button
                    onClick={() => openOutreachModal(template)}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Use Template
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
    </div>
  );
}
