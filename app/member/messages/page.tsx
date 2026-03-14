"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Phone,
  User,
  Plus,
  ChevronRight,
  Clock,
  CheckCheck,
  Check,
  Star,
  Archive,
  Trash2,
  MoreHorizontal,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Zap,
  X,
  ArrowRight,
  Upload,
  Calendar,
  Shield,
  CreditCard,
  Pill,
  Building2,
  CheckCircle2,
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Member Services",
    avatar: null,
    type: "support",
    lastMessage: "Your claim CLM-2024-002 has been processed. You can view the details in your claims section.",
    time: "2h ago",
    unread: true,
    priority: "normal",
  },
  {
    id: 2,
    name: "Dr. Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=50&h=50&fit=crop",
    type: "provider",
    lastMessage: "Your lab results look great! Let's discuss at your next appointment.",
    time: "Yesterday",
    unread: false,
    priority: "normal",
  },
  {
    id: 3,
    name: "Benefits Team",
    avatar: null,
    type: "support",
    lastMessage: "Your pre-authorization request for the MRI has been approved.",
    time: "Mar 10",
    unread: false,
    priority: "high",
  },
  {
    id: 4,
    name: "Prescription Support",
    avatar: null,
    type: "support",
    lastMessage: "Your prescription is ready for pickup at CVS Pharmacy.",
    time: "Mar 8",
    unread: false,
    priority: "normal",
  },
  {
    id: 5,
    name: "Cleveland Clinic",
    avatar: null,
    type: "facility",
    lastMessage: "Reminder: Your appointment is scheduled for March 18 at 10:30 AM.",
    time: "Mar 7",
    unread: false,
    priority: "normal",
  },
];

type Message = {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
  status?: string;
  attachment?: { type: string; title: string; url: string };
};

// Different message threads for each conversation
const messageThreads: Record<number, Message[]> = {
  1: [
    { id: 1, sender: "Member Services", content: "Hello John! How can we help you today?", time: "10:30 AM", isMe: false },
    { id: 2, sender: "You", content: "Hi, I have a question about my recent claim CLM-2024-002. It's been processing for a few days.", time: "10:32 AM", isMe: true, status: "read" },
    { id: 3, sender: "Member Services", content: "I'd be happy to help you with that! Let me look into claim CLM-2024-002 for you.", time: "10:33 AM", isMe: false },
    { id: 4, sender: "Member Services", content: "I can see that your claim for LabCorp services on March 5th has been processed. The total billed was $245, and after applying your plan benefits, your responsibility is $49.", time: "10:35 AM", isMe: false },
    { id: 5, sender: "Member Services", content: "Your claim CLM-2024-002 has been processed. You can view the details in your claims section.", time: "10:36 AM", isMe: false, attachment: { type: "link", title: "View Claim Details", url: "/member/claims" } },
  ],
  2: [
    { id: 1, sender: "Dr. Sarah Chen", content: "Hi John! I wanted to follow up with you about your recent visit.", time: "Mar 11, 2:15 PM", isMe: false },
    { id: 2, sender: "You", content: "Hi Dr. Chen! Thanks for reaching out. I've been feeling much better since our last appointment.", time: "Mar 11, 3:22 PM", isMe: true, status: "read" },
    { id: 3, sender: "Dr. Sarah Chen", content: "That's wonderful to hear! I also wanted to let you know that your lab results came back.", time: "Mar 11, 3:45 PM", isMe: false },
    { id: 4, sender: "Dr. Sarah Chen", content: "Your lab results look great! Your cholesterol levels have improved significantly since your last test. Keep up the good work with the diet changes we discussed.", time: "Mar 11, 3:46 PM", isMe: false },
    { id: 5, sender: "You", content: "That's great news! I've been trying to eat healthier and exercise more.", time: "Mar 11, 4:10 PM", isMe: true, status: "read" },
    { id: 6, sender: "Dr. Sarah Chen", content: "Excellent! Let's discuss more at your next appointment. See you on March 18th!", time: "Mar 11, 4:15 PM", isMe: false },
  ],
  3: [
    { id: 1, sender: "You", content: "Hello, I need to request a pre-authorization for an MRI that my doctor ordered.", time: "Mar 8, 9:15 AM", isMe: true, status: "read" },
    { id: 2, sender: "Benefits Team", content: "Good morning! I'd be happy to help you with your pre-authorization request. Can you provide the details of the MRI and the referring physician?", time: "Mar 8, 9:30 AM", isMe: false },
    { id: 3, sender: "You", content: "It's for a lumbar spine MRI, ordered by Dr. Michael Roberts for ongoing back pain.", time: "Mar 8, 9:45 AM", isMe: true, status: "read" },
    { id: 4, sender: "Benefits Team", content: "Thank you for the information. I've submitted your pre-authorization request. These typically take 2-3 business days to process.", time: "Mar 8, 10:00 AM", isMe: false },
    { id: 5, sender: "Benefits Team", content: "Great news! Your pre-authorization request for the MRI has been approved. Your authorization number is PA-2024-78901. This authorization is valid for 60 days.", time: "Mar 10, 11:30 AM", isMe: false },
    { id: 6, sender: "You", content: "Thank you so much for the quick turnaround!", time: "Mar 10, 12:15 PM", isMe: true, status: "read" },
  ],
  4: [
    { id: 1, sender: "Prescription Support", content: "Hi John! This is a notification about your prescription.", time: "Mar 7, 2:00 PM", isMe: false },
    { id: 2, sender: "Prescription Support", content: "Your prescription for Lisinopril 10mg has been filled and is ready for pickup at CVS Pharmacy on Main Street.", time: "Mar 7, 2:01 PM", isMe: false },
    { id: 3, sender: "You", content: "Thanks! What are the pharmacy hours?", time: "Mar 7, 3:30 PM", isMe: true, status: "read" },
    { id: 4, sender: "Prescription Support", content: "CVS on Main Street is open Monday-Friday 8am-9pm, Saturday 9am-6pm, and Sunday 10am-5pm.", time: "Mar 7, 3:45 PM", isMe: false },
    { id: 5, sender: "You", content: "Perfect, I'll pick it up tomorrow morning.", time: "Mar 7, 4:00 PM", isMe: true, status: "read" },
    { id: 6, sender: "Prescription Support", content: "Sounds good! Your copay will be $10. Remember, you can also set up automatic refills through your member portal.", time: "Mar 8, 9:00 AM", isMe: false },
  ],
  5: [
    { id: 1, sender: "Cleveland Clinic", content: "Hello! This is a reminder about your upcoming appointment.", time: "Mar 7, 10:00 AM", isMe: false },
    { id: 2, sender: "Cleveland Clinic", content: "You have an appointment scheduled with Dr. Michael Roberts on March 18, 2024 at 10:30 AM at Cleveland Family Medicine.", time: "Mar 7, 10:01 AM", isMe: false },
    { id: 3, sender: "Cleveland Clinic", content: "Please arrive 15 minutes early to complete any necessary paperwork. Remember to bring your insurance card and photo ID.", time: "Mar 7, 10:02 AM", isMe: false },
    { id: 4, sender: "You", content: "Thank you for the reminder! Is there any preparation needed for this visit?", time: "Mar 7, 11:30 AM", isMe: true, status: "read" },
    { id: 5, sender: "Cleveland Clinic", content: "For your annual checkup, please fast for 8-12 hours before your appointment if you're having blood work done. Also, bring a list of any medications you're currently taking.", time: "Mar 7, 12:00 PM", isMe: false },
    { id: 6, sender: "You", content: "Got it, thank you!", time: "Mar 7, 12:15 PM", isMe: true, status: "read" },
  ],
};

const requestTypes = [
  { id: "appeal", icon: Shield, label: "Claims Appeal", description: "Appeal a denied or partially paid claim" },
  { id: "grievance", icon: AlertCircle, label: "File Grievance", description: "Report an issue with service or care" },
  { id: "auth", icon: CheckCircle2, label: "Pre-Authorization", description: "Request approval for a procedure" },
  { id: "id-card", icon: CreditCard, label: "New ID Card", description: "Request a replacement ID card" },
  { id: "rx-exception", icon: Pill, label: "Rx Exception", description: "Request coverage for a medication" },
  { id: "pcp-change", icon: User, label: "Change PCP", description: "Select a new primary care provider" },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPulseChat, setShowPulseChat] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequestType, setSelectedRequestType] = useState<string | null>(null);
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const filteredConversations = conversations.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get messages for selected conversation
  const currentMessages = messageThreads[selectedConversation.id] || [];

  const handleSubmitRequest = () => {
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setSelectedRequestType(null);
      setRequestSubmitted(false);
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="flex h-[calc(100vh-12rem)]">
          {/* Conversation List */}
          <div className="w-full sm:w-80 border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold text-gray-900">Messages</h1>
                <button className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left ${
                    selectedConversation.id === conversation.id ? "bg-teal-50" : ""
                  }`}
                >
                  {/* Avatar */}
                  {conversation.avatar ? (
                    <img
                      src={conversation.avatar}
                      alt={conversation.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      conversation.type === "support" ? "bg-teal-100" :
                      conversation.type === "provider" ? "bg-blue-100" : "bg-purple-100"
                    }`}>
                      {conversation.type === "support" ? (
                        <MessageSquare className="w-5 h-5 text-cyan-600" />
                      ) : conversation.type === "facility" ? (
                        <Building2 className="w-5 h-5 text-purple-600" />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium truncate ${
                        conversation.unread ? "text-gray-900" : "text-gray-700"
                      }`}>
                        {conversation.name}
                      </span>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">{conversation.time}</span>
                    </div>
                    <p className={`text-sm truncate ${
                      conversation.unread ? "text-gray-900 font-medium" : "text-gray-500"
                    }`}>
                      {conversation.lastMessage}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {conversation.unread && (
                    <div className="w-2 h-2 bg-teal-500 rounded-full shrink-0 mt-2" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Message Thread */}
          <div className="hidden sm:flex flex-1 flex-col">
            {/* Thread Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedConversation.avatar ? (
                  <img
                    src={selectedConversation.avatar}
                    alt={selectedConversation.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedConversation.type === "support" ? "bg-teal-100" :
                    selectedConversation.type === "facility" ? "bg-purple-100" : "bg-blue-100"
                  }`}>
                    {selectedConversation.type === "support" ? (
                      <MessageSquare className="w-5 h-5 text-cyan-600" />
                    ) : selectedConversation.type === "facility" ? (
                      <Building2 className="w-5 h-5 text-purple-600" />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{selectedConversation.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.type === "support" ? "Support Team" : 
                     selectedConversation.type === "provider" ? "Healthcare Provider" : "Healthcare Facility"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] ${message.isMe ? "order-2" : ""}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.isMe
                          ? "bg-teal-600 text-white rounded-tr-sm"
                          : "bg-white border border-gray-200 text-gray-900 rounded-tl-sm"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.attachment && (
                        <a
                          href={message.attachment.url}
                          className={`mt-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                            message.isMe
                              ? "bg-teal-700 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <FileText className="w-4 h-4" />
                          {message.attachment.title}
                        </a>
                      )}
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                      message.isMe ? "justify-end" : ""
                    }`}>
                      <span>{message.time}</span>
                      {message.isMe && message.status === "read" && (
                        <CheckCheck className="w-3 h-3 text-teal-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white">
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <button 
          onClick={() => setShowPulseChat(true)}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Ask Pulse AI</p>
            <p className="text-sm text-gray-500">Get instant answers</p>
          </div>
        </button>
        <button 
          onClick={() => window.open('tel:+18005550123', '_self')}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Call Support</p>
            <p className="text-sm text-gray-500">1-800-555-0123</p>
          </div>
        </button>
        <button 
          onClick={() => setShowRequestModal(true)}
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Submit Request</p>
            <p className="text-sm text-gray-500">Forms & appeals</p>
          </div>
        </button>
      </div>

      {/* Pulse AI Chat Panel */}
      <AnimatePresence>
        {showPulseChat && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowPulseChat(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-cyan-400 to-teal-500">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Pulse AI</h3>
                    <p className="text-xs text-teal-100">Your health assistant</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPulseChat(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm max-w-[85%]">
                  <p className="text-gray-900">Hi John! 👋 I'm Pulse, your AI health assistant. How can I help you today?</p>
                  <p className="text-xs text-gray-400 mt-2">Just now</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  {["Check my benefits", "Find a doctor", "Estimate costs", "Track a claim"].map((suggestion) => (
                    <button
                      key={suggestion}
                      className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-teal-300 hover:bg-teal-50 transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ask Pulse anything..."
                    className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Submit Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => { setShowRequestModal(false); setSelectedRequestType(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {requestSubmitted ? (
                <div className="p-8 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                  <p className="text-gray-600 mb-4">
                    Your {requestTypes.find(r => r.id === selectedRequestType)?.label.toLowerCase()} request has been received.
                  </p>
                  <p className="text-sm text-gray-500">
                    Reference #: REQ-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    You'll receive a confirmation email shortly.
                  </p>
                </div>
              ) : !selectedRequestType ? (
                <>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Submit a Request</h3>
                    <button
                      onClick={() => setShowRequestModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">Select the type of request you'd like to submit:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {requestTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedRequestType(type.id)}
                          className="p-4 bg-gray-50 rounded-xl hover:bg-teal-50 hover:border-teal-200 border-2 border-transparent transition-colors text-left"
                        >
                          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-3 shadow-sm">
                            <type.icon className="w-5 h-5 text-cyan-600" />
                          </div>
                          <p className="font-medium text-gray-900">{type.label}</p>
                          <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedRequestType(null)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-400 rotate-180" />
                      </button>
                      <h3 className="font-semibold text-gray-900">
                        {requestTypes.find(r => r.id === selectedRequestType)?.label}
                      </h3>
                    </div>
                    <button
                      onClick={() => { setShowRequestModal(false); setSelectedRequestType(null); }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {selectedRequestType === "appeal" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Claim Number</label>
                          <input type="text" placeholder="CLM-XXXX-XXX" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Appeal</label>
                          <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option>Select a reason...</option>
                            <option>Claim was incorrectly denied</option>
                            <option>Service should be covered</option>
                            <option>Incorrect amount paid</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Explanation</label>
                          <textarea rows={4} placeholder="Please explain why you believe this claim should be reconsidered..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Documents (Optional)</label>
                          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-teal-300 transition-colors cursor-pointer">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Drop files here or click to upload</p>
                            <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                          </div>
                        </div>
                      </>
                    )}
                    {selectedRequestType === "auth" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Procedure/Service</label>
                          <input type="text" placeholder="e.g., MRI, CT Scan, Surgery" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Referring Provider</label>
                          <input type="text" placeholder="Doctor's name" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Facility/Location</label>
                          <input type="text" placeholder="Where will the procedure be performed?" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Requested Date</label>
                          <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Medical Reason</label>
                          <textarea rows={3} placeholder="Brief description of why this procedure is needed..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                      </>
                    )}
                    {selectedRequestType === "id-card" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Request</label>
                          <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option>Lost card</option>
                            <option>Damaged card</option>
                            <option>Name change</option>
                            <option>Never received card</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Method</label>
                          <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-teal-50">
                              <input type="radio" name="delivery" defaultChecked className="text-cyan-600" />
                              <div>
                                <p className="font-medium text-gray-900">Mail (3-5 business days)</p>
                                <p className="text-sm text-gray-500">Free</p>
                              </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-teal-50">
                              <input type="radio" name="delivery" className="text-cyan-600" />
                              <div>
                                <p className="font-medium text-gray-900">Express (1-2 business days)</p>
                                <p className="text-sm text-gray-500">$5.00</p>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <p className="text-sm text-blue-800">
                            💡 Tip: You can also access your digital ID card instantly in the Member Portal.
                          </p>
                        </div>
                      </>
                    )}
                    {selectedRequestType === "rx-exception" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                          <input type="text" placeholder="Enter medication name" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Prescribing Doctor</label>
                          <input type="text" placeholder="Doctor's name" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Exception Type</label>
                          <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option>Non-formulary drug coverage</option>
                            <option>Prior authorization</option>
                            <option>Quantity limit exception</option>
                            <option>Step therapy exception</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Medical Justification</label>
                          <textarea rows={3} placeholder="Explain why this medication is medically necessary..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                      </>
                    )}
                    {selectedRequestType === "pcp-change" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Current PCP</label>
                          <input type="text" value="Dr. Michael Roberts" disabled className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">New PCP</label>
                          <input type="text" placeholder="Search for a provider..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                          <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Change (Optional)</label>
                          <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option>Select a reason...</option>
                            <option>Relocating</option>
                            <option>Provider availability</option>
                            <option>Prefer a different provider</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </>
                    )}
                    {selectedRequestType === "grievance" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Grievance Category</label>
                          <select className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500">
                            <option>Select a category...</option>
                            <option>Quality of care</option>
                            <option>Access to care</option>
                            <option>Customer service</option>
                            <option>Billing issue</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Incident</label>
                          <input type="date" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Provider/Facility Involved (if applicable)</label>
                          <input type="text" placeholder="Name of provider or facility" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description of Issue</label>
                          <textarea rows={4} placeholder="Please describe your concern in detail..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Desired Resolution</label>
                          <textarea rows={2} placeholder="What outcome are you hoping for?" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                    <button
                      onClick={() => setSelectedRequestType(null)}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmitRequest}
                      className="flex-1 px-4 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
                    >
                      Submit Request
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
