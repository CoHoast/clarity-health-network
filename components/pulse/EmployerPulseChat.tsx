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
  "How many employees are enrolled?",
  "What's our YTD spend?",
  "When is open enrollment?",
  "Show me our latest invoice",
];

const mockResponses: Record<string, string> = {
  "how many employees are enrolled": "Acme Corporation currently has **847 active employees** enrolled in the health plan, with 1,423 total covered lives including dependents.\n\n**Breakdown:**\n- Active Employees: 847\n- Spouses: 412\n- Dependents: 164\n\nWould you like me to generate a detailed census report?",
  "what's our ytd spend": "Your **year-to-date healthcare spend** for Acme Corporation:\n\n📊 **Total YTD Spend:** $1,247,830\n- Medical Claims: $987,450\n- Pharmacy: $198,230\n- Dental/Vision: $62,150\n\n📈 **Trend:** 3.2% under budget\n\nYour monthly average is $124,783. Would you like to see the detailed analytics dashboard?",
  "when is open enrollment": "**Open Enrollment** for Acme Corporation is scheduled for:\n\n📅 **November 1 - November 30, 2026**\n\n**Key Dates:**\n- Employee Communications: October 15\n- Benefits Fair: October 22\n- Enrollment Opens: November 1\n- Enrollment Closes: November 30\n- Coverage Effective: January 1, 2027\n\nWould you like me to help you prepare the enrollment materials?",
  "show me our latest invoice": "Here's your **latest invoice** details:\n\n📄 **Invoice #4521**\n- Date: March 1, 2026\n- Amount: $142,850.00\n- Due Date: March 15, 2026\n- Status: **Pending**\n\n**Breakdown:**\n- Medical Premium: $128,565\n- Dental Premium: $8,475\n- Vision Premium: $4,235\n- Admin Fee: $1,575\n\nWould you like to pay this invoice now or download the PDF?",
  "default": "I can help you with:\n\n• **Employee Management** - Roster, enrollments, terminations\n• **Financial Analytics** - Claims, spending, invoices\n• **Open Enrollment** - Schedules, materials, tracking\n• **Reports** - Generate and schedule reports\n• **Stop-Loss** - Track attachment points\n\nWhat would you like to know about?",
};

export default function EmployerPulseChat({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm Pulse, your HR benefits assistant. I can help you manage employee benefits, view analytics, generate reports, and answer questions about your group health plan. How can I help you today?",
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

    // Simulate AI response
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
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Pulse AI</h3>
                  <p className="text-xs text-amber-100">HR Benefits Assistant</p>
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
                        : "bg-gradient-to-br from-amber-500 to-orange-600"
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
                        ? "bg-amber-500 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
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
                <p className="text-xs text-gray-500 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs rounded-full hover:bg-amber-100 transition-colors"
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
                  placeholder="Ask about benefits, reports, enrollment..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full hover:from-amber-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
