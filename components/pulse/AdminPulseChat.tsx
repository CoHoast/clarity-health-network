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
  "Show pending claims over $10K",
  "How many providers expiring this month?",
  "What's our claim turnaround time?",
  "Run a fraud detection check",
];

const mockResponses: Record<string, string> = {
  "pending claims": "Found **23 pending claims** over $10,000:\n\n**High Priority (3):**\n• CLM-8844: $12,500 - Knee Surgery (needs pre-auth)\n• CLM-8839: $18,200 - Cardiac Procedure\n• CLM-8836: $15,750 - Spinal Fusion\n\n**Standard Review (20):**\nRanging from $10,200 to $14,800\n\nWould you like me to open the claims queue filtered to these?",
  "providers expiring": "**12 providers** have credentials expiring this month:\n\n⚠️ **Critical (expires in 7 days):**\n• Dr. James Wilson - Medical License\n• Metro Imaging - Facility License\n\n📋 **This Month:**\n• 5 DEA Registrations\n• 3 Board Certifications\n• 2 Malpractice Policies\n\nI can send automated renewal reminders to all 12 providers.",
  "turnaround": "**Claims Turnaround Metrics (Last 30 Days):**\n\n⚡ **Average Processing Time:** 2.3 days\n✅ **Auto-Adjudication Rate:** 92%\n📊 **Clean Claim Rate:** 94.5%\n\n**By Priority:**\n• Urgent (<$1K): 1.1 days\n• Standard: 2.4 days\n• Complex (>$10K): 4.2 days\n\nWe're 18% faster than industry average!",
  "fraud": "Running fraud detection analysis...\n\n🔴 **3 High-Risk Alerts:**\n• Provider #4521: Unusual billing pattern (98% modifier usage)\n• Member #7823: 47 ER visits in 90 days\n• Claim #8841: Duplicate submission detected\n\n🟡 **8 Medium-Risk Flags:**\nAwaiting review in FraudShield queue\n\nWant me to open the Fraud Detection dashboard?",
  "default": "I can help you with:\n\n• **Claims** - Query, filter, bulk actions\n• **Providers** - Credentials, contracts, performance\n• **Members** - Eligibility, communications\n• **Analytics** - Reports, metrics, trends\n• **Fraud** - Detection, investigation\n• **System** - Workflows, configurations\n\nWhat would you like to analyze?",
};

export default function AdminPulseChat({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm Pulse, your admin AI assistant. I can query data, run reports, detect anomalies, and help manage the platform. What would you like to do?",
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
