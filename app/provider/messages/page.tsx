"use client";

import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical, CheckCheck } from "lucide-react";

const conversations = [
  { id: 1, name: "MedCare Health Support", avatar: "CH", lastMessage: "Your fee schedule has been updated for 2024.", time: "2:30 PM", unread: 2 },
  { id: 2, name: "Provider Relations", avatar: "PR", lastMessage: "Contract renewal documents are ready for review.", time: "Yesterday", unread: 0 },
  { id: 3, name: "Claims Department", avatar: "CD", lastMessage: "Claim #CLM-2024-1234 requires additional documentation.", time: "Mar 10", unread: 1 },
  { id: 4, name: "Credentialing Team", avatar: "CT", lastMessage: "Dr. Garcia's credentialing application has been approved.", time: "Mar 8", unread: 0 },
];

type Message = {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
  status?: string;
};

const messageThreads: Record<number, Message[]> = {
  1: [
    { id: 1, sender: "MedCare Health Support", content: "Hello! Your fee schedule has been updated for 2024. You can view the new rates in your Fee Schedule section.", time: "2:30 PM", isMe: false },
    { id: 2, sender: "MedCare Health Support", content: "The new rates are effective as of January 1, 2024 and reflect a 3% increase from last year.", time: "2:31 PM", isMe: false },
    { id: 3, sender: "Me", content: "Thank you for the update. Are there any changes to the E&M codes specifically?", time: "2:45 PM", isMe: true, status: "read" },
    { id: 4, sender: "MedCare Health Support", content: "Yes, E&M codes 99213-99215 have been updated to align with CMS guidelines. You'll see approximately a 2-4% increase depending on the specific code.", time: "3:00 PM", isMe: false },
  ],
  2: [
    { id: 1, sender: "Provider Relations", content: "Good morning! This is a reminder that your Primary Care Provider Agreement is coming up for renewal in December 2026.", time: "Mar 11, 9:00 AM", isMe: false },
    { id: 2, sender: "Provider Relations", content: "We've prepared the renewal documents for your review. The new agreement includes updated terms and a revised fee schedule.", time: "Mar 11, 9:01 AM", isMe: false },
    { id: 3, sender: "Me", content: "Thanks for the heads up. Can you send me a summary of the key changes?", time: "Mar 11, 10:30 AM", isMe: true, status: "read" },
    { id: 4, sender: "Provider Relations", content: "Of course! The main changes include:\n\n• 3% fee schedule increase\n• Updated telehealth billing guidelines\n• New quality incentive bonus structure\n• Extended timely filing window (90→120 days)", time: "Mar 11, 11:00 AM", isMe: false },
    { id: 5, sender: "Provider Relations", content: "Contract renewal documents are ready for review. You can access them in your Documents section.", time: "Yesterday", isMe: false },
  ],
  3: [
    { id: 1, sender: "Claims Department", content: "Hello, we're reaching out regarding claim #CLM-2024-1234 submitted on March 5, 2024.", time: "Mar 10, 2:00 PM", isMe: false },
    { id: 2, sender: "Claims Department", content: "This claim requires additional documentation before we can process it. Specifically, we need:\n\n• Operative report for procedure code 27447\n• Prior authorization number\n• Supporting medical records", time: "Mar 10, 2:01 PM", isMe: false },
    { id: 3, sender: "Me", content: "I'll gather those documents and upload them today. What's the deadline?", time: "Mar 10, 3:15 PM", isMe: true, status: "read" },
    { id: 4, sender: "Claims Department", content: "Please submit the documentation within 30 days from today's date. You can upload directly through the Provider Portal or fax to (800) 555-0199.", time: "Mar 10, 3:30 PM", isMe: false },
    { id: 5, sender: "Claims Department", content: "Claim #CLM-2024-1234 requires additional documentation. Please submit by April 10, 2024.", time: "Mar 10, 3:31 PM", isMe: false },
  ],
  4: [
    { id: 1, sender: "Credentialing Team", content: "Great news! We've completed the credentialing review for Maria Garcia, NP.", time: "Mar 8, 10:00 AM", isMe: false },
    { id: 2, sender: "Credentialing Team", content: "Dr. Garcia's credentialing application has been approved. She is now fully credentialed with MedCare Health Network and can begin seeing our members effective immediately.", time: "Mar 8, 10:01 AM", isMe: false },
    { id: 3, sender: "Me", content: "That's great news! Thank you for the quick turnaround. How long until she appears in the provider directory?", time: "Mar 8, 11:00 AM", isMe: true, status: "read" },
    { id: 4, sender: "Credentialing Team", content: "Provider directory updates occur weekly on Mondays. Maria Garcia should be visible in the directory by March 11th.", time: "Mar 8, 11:15 AM", isMe: false },
    { id: 5, sender: "Me", content: "Perfect, thank you!", time: "Mar 8, 11:20 AM", isMe: true, status: "read" },
    { id: 6, sender: "Credentialing Team", content: "You're welcome! Don't forget to submit her DEA registration renewal before June 2024. Let us know if you need any assistance.", time: "Mar 8, 11:25 AM", isMe: false },
  ],
};

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [newMessage, setNewMessage] = useState("");

  const currentMessages = messageThreads[selectedConversation.id] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Communicate with MedCare Health Network teams</p>
      </div>

      {/* Messages Container */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-3 h-[600px]">
          {/* Conversations List */}
          <div className="border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search messages..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 focus:border-slate-500" />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(600px-73px)]">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 ${selectedConversation.id === conv.id ? "bg-slate-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-slate-600 font-semibold text-sm">{conv.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-900 text-sm truncate">{conv.name}</p>
                        <span className="text-xs text-gray-500 flex-shrink-0">{conv.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="w-5 h-5 bg-slate-700 text-white rounded-full text-xs flex items-center justify-center flex-shrink-0">{conv.unread}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Thread Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-slate-600 font-semibold text-sm">{selectedConversation.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{selectedConversation.name}</p>
                  <p className="text-xs text-green-600">Online</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${msg.isMe ? "bg-slate-700 text-white rounded-br-md" : "bg-gray-100 text-gray-900 rounded-bl-md"}`}>
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.isMe ? "justify-end" : "justify-start"}`}>
                      <span className={`text-xs ${msg.isMe ? "text-slate-300" : "text-gray-500"}`}>{msg.time}</span>
                      {msg.isMe && <CheckCheck className={`w-3.5 h-3.5 ${msg.status === "read" ? "text-blue-400" : "text-slate-400"}`} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
                <button className="p-2.5 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
