"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Bell, FileText, Send, Clock, CheckCircle, X, Plus, Eye, Users, Calendar, Phone, MessageSquare, ArrowRight } from "lucide-react";

const templates = [
  { id: "TPL-001", name: "EOB Statement", type: "EOB", lastUsed: "2024-03-12", sends: 1245, description: "Standard Explanation of Benefits statement sent after claim processing" },
  { id: "TPL-002", name: "Welcome Letter", type: "Letter", lastUsed: "2024-03-11", sends: 89, description: "Welcome packet for newly enrolled members" },
  { id: "TPL-003", name: "ID Card Mailed", type: "Notification", lastUsed: "2024-03-10", sends: 156, description: "Notification that member ID card has been mailed" },
  { id: "TPL-004", name: "Premium Reminder", type: "Email", lastUsed: "2024-03-09", sends: 423, description: "Monthly premium payment reminder notice" },
  { id: "TPL-005", name: "Claim Denied", type: "EOB", lastUsed: "2024-03-08", sends: 67, description: "Claim denial notification with appeal instructions" },
  { id: "TPL-006", name: "Preventive Care Reminder", type: "Email", lastUsed: "2024-03-07", sends: 892, description: "Annual wellness visit and preventive care reminder" },
];

const recentComms = [
  { id: "COM-001", member: "John Smith", memberId: "CHN-123456", type: "EOB", method: "Email", sent: "2024-03-12 14:32", status: "delivered", subject: "Your Explanation of Benefits", preview: "This is your Explanation of Benefits for the claim processed on March 10, 2024. Service provided by Cleveland Family Medicine...", fullMessage: "Dear John Smith,\n\nThis is your Explanation of Benefits for the claim processed on March 10, 2024.\n\nService provided by: Cleveland Family Medicine\nDate of Service: March 10, 2024\nClaim Number: CLM-2024-8847\n\nSummary:\n- Billed Amount: $138.00\n- Plan Paid: $100.00\n- Your Responsibility: $25.00\n\nThis is not a bill. You may receive a separate bill from your provider for any amount you owe.\n\nIf you have questions about this EOB, please contact Member Services at 1-800-555-0123.\n\nThank you for being a MedCare Health Network member.\n\nSincerely,\nMedCare Health Network" },
  { id: "COM-002", member: "Sarah Johnson", memberId: "CHN-234567", type: "Welcome", method: "Mail", sent: "2024-03-12 10:15", status: "sent", subject: "Welcome to MedCare Health Network", preview: "Welcome to MedCare Health Network! We're excited to have you as a member. Your ID card will arrive within 5-7 business days...", fullMessage: "Dear Sarah Johnson,\n\nWelcome to MedCare Health Network! We're excited to have you as a member.\n\nYour Member ID: CHN-234567\nPlan: Silver PPO\nGroup: Acme Corp\nEffective Date: March 1, 2024\n\nWhat to expect:\n• Your ID card will arrive within 5-7 business days\n• You can access our member portal at member.medcarehealthnetwork.com\n• Your Primary Care Physician is Dr. James Wilson\n\nImportant Resources:\n• Member Services: 1-800-555-0123\n• Nurse Line (24/7): 1-800-555-0199\n• Find a Doctor: medcarehealthnetwork.com/find-care\n\nWe're here to help you on your health journey!\n\nSincerely,\nMedCare Health Network Member Services" },
  { id: "COM-003", member: "Michael Chen", memberId: "CHN-345678", type: "ID Card", method: "Email", sent: "2024-03-11 16:45", status: "delivered", subject: "Your ID Card Has Been Mailed", preview: "Your new MedCare Health Network ID card has been mailed to your address on file...", fullMessage: "Dear Michael Chen,\n\nYour new MedCare Health Network ID card has been mailed to your address on file.\n\nMailing Address: 789 Elm St, Beachwood, OH 44122\n\nExpected Delivery: 5-7 business days\n\nIn the meantime, you can:\n• Print a temporary ID card from the member portal\n• Access your digital ID card on the MedCare Health mobile app\n• Provide your Member ID (CHN-345678) to healthcare providers\n\nIf you don't receive your card within 10 business days, please contact Member Services at 1-800-555-0123.\n\nThank you,\nMedCare Health Network" },
  { id: "COM-004", member: "Emily Rodriguez", memberId: "CHN-456789", type: "Premium", method: "SMS", sent: "2024-03-11 09:00", status: "delivered", subject: "Premium Payment Reminder", preview: "Reminder: Your monthly premium of $425.00 is due on March 15, 2024...", fullMessage: "MedCare Health Network Reminder\n\nYour monthly premium of $425.00 is due on March 15, 2024.\n\nPay online: member.medcarehealthnetwork.com/pay\nPay by phone: 1-800-555-0123\n\nAuto-pay is available for convenient monthly payments.\n\nThank you for being a valued member." },
  { id: "COM-005", member: "Robert Williams", memberId: "CHN-567890", type: "EOB", method: "Email", sent: "2024-03-10 11:20", status: "delivered", subject: "Your Explanation of Benefits", preview: "This is your Explanation of Benefits for services received at Quick Care Urgent on March 9, 2024...", fullMessage: "Dear Robert Williams,\n\nThis is your Explanation of Benefits for services received on March 9, 2024.\n\nService provided by: Quick Care Urgent\nDate of Service: March 9, 2024\nClaim Number: CLM-2024-8843\n\nSummary:\n- Billed Amount: $175.00\n- Plan Paid: $105.00\n- Your Responsibility: $45.00 (Copay)\n\nThis is not a bill. The provider may send you a bill for your copay amount.\n\nQuestions? Call 1-800-555-0123.\n\nThank you,\nMedCare Health Network" },
  { id: "COM-006", member: "Lisa Martinez", memberId: "CHN-678901", type: "Preventive", method: "Email", sent: "2024-03-09 08:00", status: "delivered", subject: "Time for Your Annual Wellness Visit", preview: "It's been a year since your last wellness visit. Schedule your annual checkup today to stay healthy...", fullMessage: "Dear Lisa Martinez,\n\nIt's been a year since your last wellness visit!\n\nAnnual wellness visits are covered at 100% with no copay when you see an in-network provider. These visits help you:\n• Track important health metrics\n• Update vaccinations\n• Screen for potential health concerns\n• Discuss any health questions with your doctor\n\nYour PCP: Dr. Michael Brown\nPhone: (555) 678-9012\n\nSchedule your appointment today!\n\nTo find other in-network providers, visit medcarehealthnetwork.com/find-care.\n\nYour health matters to us!\n\nMedCare Health Network" },
  { id: "COM-007", member: "David Kim", memberId: "CHN-789012", type: "Claim Denied", method: "Email", sent: "2024-03-08 14:00", status: "delivered", subject: "Important: Claim Denial Notice", preview: "We were unable to approve your claim for services received on March 6, 2024. Please review the attached EOB for details...", fullMessage: "Dear David Kim,\n\nWe were unable to approve your claim for services received on March 6, 2024.\n\nClaim Number: CLM-2024-8841\nProvider: Chiropractic Services\nDate of Service: March 6, 2024\n\nReason for Denial: Provider not in network\n\nAmount Billed: $95.00\nAmount Paid: $0.00\nYour Responsibility: $95.00\n\nYou may be responsible for the full amount billed.\n\nYour Options:\n1. Pay the provider directly\n2. Appeal this decision within 60 days\n3. Contact Member Services for assistance\n\nTo file an appeal, send a written request to:\nMedCare Health Network Appeals\nPO Box 12345\nCleveland, OH 44101\n\nQuestions? Call 1-800-555-0123.\n\nMedCare Health Network" },
  { id: "COM-008", member: "Jennifer Lee", memberId: "CHN-890123", type: "Welcome", method: "Email", sent: "2024-03-10 09:30", status: "delivered", subject: "Welcome to MedCare Health Network!", preview: "Congratulations on your new coverage! Your enrollment is being processed and you'll receive your ID card soon...", fullMessage: "Dear Jennifer Lee,\n\nCongratulations on your new coverage with MedCare Health Network!\n\nYour enrollment is currently being processed.\n\nMember ID: CHN-890123 (pending activation)\nPlan: Silver PPO\nGroup: Tech Solutions\nEffective Date: March 10, 2024\n\nNext Steps:\n• Your ID card will be mailed within 5-7 business days\n• Set up your online account at member.medcarehealthnetwork.com\n• Select a Primary Care Physician from our network\n\nNeed help? Our Member Services team is ready to assist you:\nPhone: 1-800-555-0123\nHours: Mon-Fri 8am-8pm, Sat 9am-5pm\n\nWelcome aboard!\n\nMedCare Health Network" },
];

export default function CommunicationsPage() {
  const [showNewModal, setShowNewModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);
  const [selectedComm, setSelectedComm] = useState<typeof recentComms[0] | null>(null);
  const [messageSent, setMessageSent] = useState(false);

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "Email": return <Mail className="w-4 h-4 text-blue-400" />;
      case "Mail": return <FileText className="w-4 h-4 text-amber-400" />;
      case "SMS": return <MessageSquare className="w-4 h-4 text-green-400" />;
      default: return <Mail className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EOB": return "bg-cyan-600/20 text-cyan-500";
      case "Welcome": return "bg-green-500/20 text-green-400";
      case "ID Card": return "bg-blue-500/20 text-blue-400";
      case "Premium": return "bg-amber-500/20 text-amber-400";
      case "Preventive": return "bg-cyan-500/20 text-cyan-400";
      case "Claim Denied": return "bg-red-500/20 text-red-400";
      default: return "bg-slate-500/20 text-slate-400";
    }
  };

  const handleSend = () => {
    setMessageSent(true);
    setTimeout(() => {
      setShowNewModal(false);
      setMessageSent(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Member Communications</h1>
            <p className="text-slate-400">EOB generation, notifications, and templates</p>
          </div>
        </div>
        <button onClick={() => setShowNewModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          <Send className="w-4 h-4" />Send Communication
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">2,456</p>
          <p className="text-sm text-slate-400">Sent Today</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">98.2%</p>
          <p className="text-sm text-slate-400">Delivery Rate</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-blue-400">1,245</p>
          <p className="text-sm text-slate-400">EOBs Generated</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-cyan-500">12</p>
          <p className="text-sm text-slate-400">Active Templates</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Templates */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Communication Templates</h2>
            <button className="text-cyan-500 text-sm hover:text-cyan-400">+ New Template</button>
          </div>
          <div className="divide-y divide-slate-700">
            {templates.map((template) => (
              <button key={template.id} onClick={() => setSelectedTemplate(template)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/80 text-left transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{template.name}</p>
                    <p className="text-sm text-slate-400">{template.type} • {template.sends} sends</p>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Communications */}
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Recent Communications</h2>
          </div>
          <div className="divide-y divide-slate-700 max-h-[500px] overflow-y-auto">
            {recentComms.map((comm) => (
              <button 
                key={comm.id} 
                onClick={() => setSelectedComm(comm)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/80 text-left transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-white">{comm.member}</p>
                    <span className={`px-2 py-0.5 text-xs rounded ${getTypeColor(comm.type)}`}>{comm.type}</span>
                  </div>
                  <p className="text-sm text-slate-400 truncate pr-4">{comm.subject}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    {getMethodIcon(comm.method)}
                    <span>{comm.method}</span>
                    <span>•</span>
                    <span>{comm.sent}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${comm.status === "delivered" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
                    {comm.status}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Send Communication Modal */}
      <AnimatePresence>
        {showNewModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !messageSent && setShowNewModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              {messageSent ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Communication Sent!</h3>
                  <p className="text-slate-400">Your message is being delivered.</p>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="font-semibold text-white">Send Communication</h3>
                    <button onClick={() => setShowNewModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Template</label>
                      <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        {templates.map(t => <option key={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Recipients</label>
                      <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                        <option>Select member(s)...</option>
                        <option>All Members</option>
                        <option>Members with Claims</option>
                        <option>New Members (30 days)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Delivery Method</label>
                      <div className="flex gap-2">
                        <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-700 rounded-lg cursor-pointer border-2 border-cyan-600">
                          <input type="radio" name="method" defaultChecked className="hidden" />
                          <Mail className="w-4 h-4 text-cyan-500" /><span className="text-white">Email</span>
                        </label>
                        <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-700 rounded-lg cursor-pointer border border-slate-600 hover:border-slate-500">
                          <input type="radio" name="method" className="hidden" />
                          <FileText className="w-4 h-4 text-slate-400" /><span className="text-slate-300">Mail</span>
                        </label>
                        <label className="flex-1 flex items-center justify-center gap-2 p-3 bg-slate-700 rounded-lg cursor-pointer border border-slate-600 hover:border-slate-500">
                          <input type="radio" name="method" className="hidden" />
                          <Bell className="w-4 h-4 text-slate-400" /><span className="text-slate-300">SMS</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 p-4 border-t border-slate-700">
                    <button onClick={() => setShowNewModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                    <button onClick={handleSend} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Send</button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Template Preview Modal */}
      <AnimatePresence>
        {selectedTemplate && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTemplate(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{selectedTemplate.name}</h3>
                  <p className="text-sm text-slate-400">{selectedTemplate.type} Template</p>
                </div>
                <button onClick={() => setSelectedTemplate(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4">
                <div className="bg-slate-700/50 rounded-lg p-3 mb-4 text-sm text-slate-300">
                  {selectedTemplate.description}
                </div>
                <div className="bg-white rounded-lg p-6 text-gray-900">
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold">MedCare Health Network</h4>
                    <p className="text-sm text-gray-500">{selectedTemplate.name}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
                    <p><strong>Member:</strong> {"{{member_name}}"}</p>
                    <p><strong>Member ID:</strong> {"{{member_id}}"}</p>
                    {selectedTemplate.type === "EOB" && (
                      <>
                        <p><strong>Claim #:</strong> {"{{claim_id}}"}</p>
                        <p><strong>Date of Service:</strong> {"{{dos}}"}</p>
                        <p><strong>Provider:</strong> {"{{provider_name}}"}</p>
                      </>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400 text-center">This is a preview. Actual content will be populated with member data.</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
                  <span>Last used: {selectedTemplate.lastUsed}</span>
                  <span>{selectedTemplate.sends.toLocaleString()} total sends</span>
                </div>
              </div>
              <div className="flex gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setSelectedTemplate(null)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Close</button>
                <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Edit Template</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Communication Detail Modal */}
      <AnimatePresence>
        {selectedComm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedComm(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{selectedComm.subject}</h3>
                  <p className="text-sm text-slate-400">Communication ID: {selectedComm.id}</p>
                </div>
                <button onClick={() => setSelectedComm(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-160px)]">
                {/* Meta info */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Recipient</h4>
                    <p className="text-slate-300">{selectedComm.member}</p>
                    <p className="text-sm text-slate-400">{selectedComm.memberId}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Delivery</h4>
                    <div className="flex items-center gap-2 text-slate-300">
                      {getMethodIcon(selectedComm.method)}
                      <span>{selectedComm.method}</span>
                      <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${selectedComm.status === "delivered" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>
                        {selectedComm.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">{selectedComm.sent}</p>
                  </div>
                </div>

                {/* Message Content */}
                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 text-xs rounded ${getTypeColor(selectedComm.type)}`}>{selectedComm.type}</span>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap">
                    {selectedComm.fullMessage}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-slate-700 bg-slate-800">
                <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm inline-flex items-center gap-2">
                  <Send className="w-4 h-4" />Resend
                </button>
                <button onClick={() => setSelectedComm(null)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm">Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
