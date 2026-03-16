"use client";

import { HeadphonesIcon, MessageSquare, Phone, Mail, Clock, Plus, CheckCircle, AlertCircle, HelpCircle, FileText, ExternalLink } from "lucide-react";

const tickets = [
  { id: "TKT-4521", subject: "Question about invoice breakdown", status: "open", created: "Mar 12, 2026", lastUpdate: "2 hours ago" },
  { id: "TKT-4520", subject: "Need help with enrollment form", status: "resolved", created: "Mar 8, 2026", lastUpdate: "Mar 10, 2026" },
  { id: "TKT-4519", subject: "Employee termination process", status: "resolved", created: "Mar 1, 2026", lastUpdate: "Mar 3, 2026" },
];

const faqItems = [
  { question: "How do I add a new employee?", answer: "Go to Employee Roster > Add Employee and complete the enrollment wizard." },
  { question: "When are invoices due?", answer: "Invoices are due on the 15th of each month. You can set up auto-pay in Billing settings." },
  { question: "How do I change an employee's plan?", answer: "Plan changes can only be made during Open Enrollment or with a Qualifying Life Event." },
  { question: "What is stop-loss insurance?", answer: "Stop-loss protects against catastrophic claims by reimbursing amounts over the attachment point." },
];

export default function SupportPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-500">Get help, submit tickets, and find answers</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 font-medium">
          <Plus className="w-4 h-4" />
          New Support Ticket
        </button>
      </div>

      {/* Contact Options */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-teal-300 transition-colors">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Call Us</h3>
          <p className="text-teal-600 font-medium mt-1">1-800-555-0123</p>
          <p className="text-sm text-gray-500 mt-2">Mon-Fri, 8am-6pm EST</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-teal-300 transition-colors">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Email Support</h3>
          <p className="text-blue-600 font-medium mt-1">employers@truecare.health</p>
          <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-teal-300 transition-colors">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900">Live Chat</h3>
          <p className="text-green-600 font-medium mt-1">Start Chat</p>
          <p className="text-sm text-gray-500 mt-2">Available now</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Support Tickets */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Your Tickets</h2>
            <button className="text-teal-600 hover:text-teal-700 text-sm font-medium">View All</button>
          </div>
          <div className="divide-y divide-gray-100">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {ticket.status === "open" ? (
                      <AlertCircle className="w-5 h-5 text-teal-500 mt-0.5" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{ticket.subject}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{ticket.id} • Created {ticket.created}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    ticket.status === "open" ? "bg-teal-100 text-teal-700" : "bg-green-100 text-green-700"
                  }`}>
                    {ticket.status === "open" ? "Open" : "Resolved"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {faqItems.map((item, i) => (
              <details key={i} className="group">
                <summary className="p-4 cursor-pointer hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">{item.question}</span>
                  </div>
                </summary>
                <div className="px-4 pb-4 pl-12">
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Resources</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Employer Guide", description: "Complete HR admin guide", icon: FileText },
            { title: "Video Tutorials", description: "Step-by-step walkthroughs", icon: ExternalLink },
            { title: "API Documentation", description: "Integration guides", icon: FileText },
            { title: "Compliance Calendar", description: "Important dates", icon: Clock },
          ].map((resource) => (
            <button key={resource.title} className="flex items-start gap-3 p-4 bg-gray-50 hover:bg-teal-50 rounded-lg text-left transition-colors">
              <resource.icon className="w-5 h-5 text-teal-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{resource.title}</p>
                <p className="text-sm text-gray-500">{resource.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Dedicated Account Manager */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center text-2xl font-bold">
            MJ
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Your Account Manager</h3>
            <p className="text-gray-300">Michael Johnson • Senior Account Executive</p>
            <p className="text-gray-400 text-sm mt-1">Available Mon-Fri 8am-6pm EST</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium">
              Schedule Call
            </button>
            <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-sm font-medium">
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
