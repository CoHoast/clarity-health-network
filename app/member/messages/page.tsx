"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

const messages = [
  {
    id: 1,
    sender: "Member Services",
    content: "Hello John! How can we help you today?",
    time: "10:30 AM",
    isMe: false,
  },
  {
    id: 2,
    sender: "You",
    content: "Hi, I have a question about my recent claim CLM-2024-002. It's been processing for a few days.",
    time: "10:32 AM",
    isMe: true,
    status: "read",
  },
  {
    id: 3,
    sender: "Member Services",
    content: "I'd be happy to help you with that! Let me look into claim CLM-2024-002 for you.",
    time: "10:33 AM",
    isMe: false,
  },
  {
    id: 4,
    sender: "Member Services",
    content: "I can see that your claim for LabCorp services on March 5th has been processed. The total billed was $245, and after applying your plan benefits, your responsibility is $49.",
    time: "10:35 AM",
    isMe: false,
  },
  {
    id: 5,
    sender: "Member Services",
    content: "Your claim CLM-2024-002 has been processed. You can view the details in your claims section.",
    time: "10:36 AM",
    isMe: false,
    attachment: {
      type: "link",
      title: "View Claim Details",
      url: "/member/claims",
    },
  },
];

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                      conversation.type === "provider" ? "bg-blue-100" : "bg-gray-100"
                    }`}>
                      {conversation.type === "support" ? (
                        <MessageSquare className={`w-5 h-5 ${
                          conversation.type === "support" ? "text-teal-600" : "text-gray-600"
                        }`} />
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
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-teal-600" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-900">{selectedConversation.name}</p>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.type === "support" ? "Support Team" : 
                     selectedConversation.type === "provider" ? "Healthcare Provider" : "Facility"}
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
              {messages.map((message) => (
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
                  className="flex-1 px-4 py-2.5 bg-gray-100 border-0 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
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
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-teal-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Ask Pulse AI</p>
            <p className="text-sm text-gray-500">Get instant answers</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Call Support</p>
            <p className="text-sm text-gray-500">1-800-555-0123</p>
          </div>
        </button>
        <button className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="font-medium text-gray-900">Submit Request</p>
            <p className="text-sm text-gray-500">Forms & appeals</p>
          </div>
        </button>
      </div>
    </div>
  );
}
