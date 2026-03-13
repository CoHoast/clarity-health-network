"use client";

import { Building2, Users, Bell, Shield, CreditCard, Mail, Globe, Lock, Plus, Trash2, Edit } from "lucide-react";

const teamMembers = [
  { name: "Sarah Johnson", email: "sarah.j@acme.com", role: "HR Administrator", status: "active" },
  { name: "Michael Chen", email: "m.chen@acme.com", role: "Benefits Manager", status: "active" },
  { name: "Emily Rodriguez", email: "e.rodriguez@acme.com", role: "HR Coordinator", status: "active" },
  { name: "David Kim", email: "d.kim@acme.com", role: "Read Only", status: "invited" },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your organization and account settings</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-amber-600" />
              <h2 className="font-semibold text-gray-900">Company Information</h2>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input type="text" defaultValue="Acme Corporation" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Group Number</label>
                  <input type="text" defaultValue="12345" disabled className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-500" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Contact Email</label>
                  <input type="email" defaultValue="hr@acmecorp.com" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" defaultValue="(555) 123-4567" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" defaultValue="123 Business Ave, Suite 400, Chicago, IL 60601" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500" />
              </div>
              <div className="pt-2">
                <button className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold text-gray-900">Team Members</h2>
              </div>
              <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 text-sm font-medium">
                <Plus className="w-4 h-4" />
                Invite
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {teamMembers.map((member) => (
                <div key={member.email} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-amber-600">{member.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">{member.role}</span>
                    {member.status === "invited" && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded">Pending</span>
                    )}
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <Bell className="w-5 h-5 text-amber-600" />
              <h2 className="font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="p-4 space-y-4">
              {[
                { label: "Invoice reminders", description: "Get notified before invoices are due" },
                { label: "Enrollment updates", description: "New enrollments and changes" },
                { label: "Claims alerts", description: "High-cost claims and stop-loss alerts" },
                { label: "Compliance deadlines", description: "Required notices and filings" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: "Security Settings", icon: Shield, href: "#" },
                { label: "Payment Methods", icon: CreditCard, href: "/employer/billing" },
                { label: "Email Preferences", icon: Mail, href: "#" },
                { label: "API Access", icon: Globe, href: "#" },
                { label: "Change Password", icon: Lock, href: "#" },
              ].map((link) => (
                <a key={link.label} href={link.href} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg text-gray-700 hover:text-amber-600 transition-colors">
                  <link.icon className="w-4 h-4" />
                  <span className="text-sm">{link.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Plan Info */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Your Plan</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Plan Type</span>
                <span className="font-medium text-gray-900">Gold PPO</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Enrolled</span>
                <span className="font-medium text-gray-900">847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Effective</span>
                <span className="font-medium text-gray-900">Jan 1, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Renewal</span>
                <span className="font-medium text-gray-900">Jan 1, 2027</span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl border border-red-200 p-4">
            <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-sm text-red-700 mb-3">Irreversible actions</p>
            <button className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-100 text-sm font-medium">
              Request Account Closure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
