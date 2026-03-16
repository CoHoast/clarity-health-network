"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Zap, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "Show providers with expiring contracts",
  "Find cardiologists in Cleveland",
  "What's the average network discount?",
  "List pending credentialing applications",
];

const mockResponses: Record<string, string> = {
  "expiring contracts": "**47 contracts** expiring in the next 90 days:\n\n⚠️ **Critical (next 14 days):**\n• Midwest Regional Medical - expires Mar 28\n• Summit Health Specialists - expires Apr 2\n\n📋 **Next 30 Days (12):**\n• 5 Group Practices\n• 4 Individual Providers\n• 3 Facilities\n\nWould you like me to send bulk renewal notices?",
  "cardiologist": "Found **8 cardiologists** in the Cleveland area:\n\n✅ **Active Contracts:**\n• Cleveland Cardiology Associates (NPI: 9012345678) - 32% discount\n• Dr. Michael Heart, MD (NPI: 1122334455) - 30% discount\n• Lakeside Cardiology (NPI: 6789012345) - 35% discount\n\n📍 **Locations:** Downtown, Beachwood, Westlake, Lakewood\n\nWant me to show contract details or add a new cardiologist?",
  "average discount": "**Network Discount Analysis:**\n\n📊 **Average Discount:** 34% off billed charges\n\n**By Provider Type:**\n• Hospitals: 28% (% of Medicare: 140%)\n• Group Practices: 35%\n• Individual Providers: 32%\n• Labs & Imaging: 45%\n\n**Top Performers:**\n• Quest Diagnostics: 48%\n• Metro Imaging: 45%\n• Cleveland Orthopedic: 40%\n\nOur rates are 12% better than regional average!",
  "credentialing": "**12 pending credentialing applications:**\n\n🔄 **In Progress (5):**\n• Dr. James Wilson, DO - License verification\n• Premier PT Group - Insurance pending\n• Valley Care Imaging - Facility license review\n\n📋 **New Applications (7):**\n• 4 Individual Providers\n• 2 Group Practices\n• 1 Urgent Care Facility\n\nWould you like to review the credentialing queue?",
  "provider": "I found several providers matching your query. Could you be more specific?\n\n• Search by **specialty**: \"Find orthopedists in Beachwood\"\n• Search by **NPI**: \"Lookup NPI 1234567890\"\n• Search by **contract status**: \"Show providers with expiring contracts\"\n• Search by **discount rate**: \"Providers with 40%+ discount\"",
  "npi": "To look up an NPI, please provide the 10-digit number.\n\nI can show you:\n• Provider details & contact info\n• Contract status & expiration\n• Discount terms & service rates\n• Credentialing verification status",
  "default": "I can help you with:\n\n• **Providers** - Search, lookup, add new\n• **Contracts** - Expiring, renewals, templates\n• **Discounts** - Rate analysis, schedules\n• **Credentialing** - Applications, verifications\n• **Network** - Coverage, analytics, reports\n\nWhat would you like to explore?",
};

export default function AdminPulseChat({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm Pulse, your PPO Network assistant. I can help you find providers, check contract status, analyze discount rates, and manage credentialing. What would you like to explore?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const lowerText = messageText.toLowerCase();
      let response = mockResponses.default;
      
      for (const [key, value] of Object.entries(mockResponses)) {
        if (key !== "default" && lowerText.includes(key)) {
          response = value;
          break;
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Chat panel */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-cyan-500 to-teal-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Pulse AI</h3>
                  <p className="text-xs text-cyan-200">Admin Assistant</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "user"
                        ? "bg-gray-200"
                        : "bg-gradient-to-br from-cyan-500 to-teal-600"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 text-gray-600" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested questions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Suggested queries:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="px-3 py-1.5 bg-teal-50 text-teal-700 text-xs rounded-full hover:bg-teal-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Query data, run reports, analyze..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-2 bg-gradient-to-r from-cyan-500 to-teal-600 text-white rounded-full hover:from-teal-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
