"use client";

import { useState } from "react";
import { Settings, Building2, Bell, Shield, Globe, Save, Check, Key, Clock, Users, AlertTriangle, Mail, Plus, Edit, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("organization");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "organization", label: "Organization", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-slate-400">Configure system preferences and options</p>
        </div>
        <button onClick={handleSave} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "bg-teal-600/20 text-cyan-500" : "text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "organization" && (
            <>
              {/* Organization Details */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-400" />
                  Organization Details
                </h2>
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Organization Name</label>
                      <input type="text" defaultValue="TrueCare Health Network" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Legal Entity Name</label>
                      <input type="text" defaultValue="TrueCare Health Network, LLC" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Tax ID (EIN)</label>
                      <input type="text" defaultValue="XX-XXXXXXX" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Organization NPI</label>
                      <input type="text" defaultValue="1234567890" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white font-mono" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                    <input type="text" defaultValue="123 Healthcare Drive, Suite 500" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white mb-2" />
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" defaultValue="Cleveland" placeholder="City" className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                      <input type="text" defaultValue="OH" placeholder="State" className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                      <input type="text" defaultValue="44101" placeholder="ZIP" className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                      <input type="tel" defaultValue="1-800-555-0199" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                      <input type="email" defaultValue="admin@truecarehealth.com" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Website</label>
                    <input type="url" defaultValue="https://truecarehealth.com" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                  </div>
                </div>
              </div>

              {/* Localization */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Regional Settings
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Timezone</label>
                    <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option>Eastern Time (ET)</option>
                      <option>Central Time (CT)</option>
                      <option>Mountain Time (MT)</option>
                      <option>Pacific Time (PT)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Date Format</label>
                    <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              {/* Email Recipients Section */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    Notification Recipients
                  </h2>
                  <button className="flex items-center gap-2 px-3 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-500 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Recipient
                  </button>
                </div>
                <p className="text-slate-400 text-sm mb-4">Configure which email addresses receive different types of notifications.</p>
                
                <div className="space-y-3">
                  {[
                    { email: "admin@truecare.health", name: "Admin Team", types: ["All Notifications"] },
                    { email: "contracts@truecare.health", name: "Contracts Team", types: ["Contract Alerts", "Renewals"] },
                    { email: "credentialing@truecare.health", name: "Credentialing Dept", types: ["Credential Expiration", "Applications", "Status Changes"] },
                    { email: "network@truecare.health", name: "Network Operations", types: ["Weekly Summary", "Provider Updates"] },
                  ].map((recipient, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <Mail className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{recipient.name}</p>
                          <p className="text-sm text-slate-400">{recipient.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {recipient.types.map((type, j) => (
                            <span key={j} className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded-full">
                              {type}
                            </span>
                          ))}
                        </div>
                        <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notification Types */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-amber-400" />
                  Notification Types
                </h2>
                <p className="text-slate-400 text-sm mb-4">Enable or disable specific notification categories.</p>
                <div className="space-y-4">
                  {[
                    { label: "Contract expiration alerts", description: "30, 60, and 90 days before expiration", default: true },
                    { label: "Provider credential expiration", description: "When credentials are expiring soon", default: true },
                    { label: "New provider applications", description: "When providers apply to join the network", default: true },
                    { label: "Contract renewal confirmations", description: "When providers sign renewals", default: true },
                    { label: "Credentialing status changes", description: "Verification updates and completions", default: true },
                    { label: "Weekly network summary", description: "Overview of network activity", default: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                      <div>
                        <p className="font-medium text-white">{item.label}</p>
                        <p className="text-sm text-slate-400">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:ring-4 peer-focus:ring-teal-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                      </label>
                    </div>
                ))}
              </div>
            </div>
            </>
          )}

          {activeTab === "security" && (
            <>
              {/* 2FA Status Overview */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    Two-Factor Authentication Status
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-400">6/8 users enabled</span>
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">75%</span>
                  </div>
                </div>
                
                {/* Team 2FA Status Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-700">
                        <th className="pb-3">Team Member</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">2FA Status</th>
                        <th className="pb-3">Last Login</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {[
                        { name: "Sarah Mitchell", email: "sarah.m@truecare.health", role: "Super Admin", mfa: true, lastLogin: "Today, 9:15 AM" },
                        { name: "James Wilson", email: "james.w@truecare.health", role: "Network Director", mfa: true, lastLogin: "Today, 8:30 AM" },
                        { name: "Emily Chen", email: "emily.c@truecare.health", role: "Provider Relations", mfa: true, lastLogin: "Yesterday, 4:45 PM" },
                        { name: "Michael Brown", email: "michael.b@truecare.health", role: "Network Analyst", mfa: false, lastLogin: "Today, 10:00 AM" },
                        { name: "Lisa Rodriguez", email: "lisa.r@truecare.health", role: "Credentialing", mfa: true, lastLogin: "Yesterday, 5:30 PM" },
                        { name: "David Kim", email: "david.k@truecare.health", role: "Contract Manager", mfa: true, lastLogin: "Today, 7:45 AM" },
                        { name: "Jennifer Lee", email: "jennifer.l@truecare.health", role: "Credentialing", mfa: false, lastLogin: "Feb 28, 3:00 PM" },
                        { name: "Robert Taylor", email: "robert.t@truecare.health", role: "Network Analyst", mfa: true, lastLogin: "Never" },
                      ].map((user, i) => (
                        <tr key={i} className="hover:bg-slate-700/30">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm font-medium">
                                {user.name.split(" ").map(n => n[0]).join("")}
                              </div>
                              <div>
                                <p className="font-medium text-white">{user.name}</p>
                                <p className="text-xs text-slate-400">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-slate-300">{user.role}</td>
                          <td className="py-3">
                            {user.mfa ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                                <Check className="w-3 h-3" />
                                Enabled
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">
                                <Shield className="w-3 h-3" />
                                Not Enabled
                              </span>
                            )}
                          </td>
                          <td className="py-3 text-sm text-slate-400">{user.lastLogin}</td>
                          <td className="py-3 text-right">
                            {!user.mfa && (
                              <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
                                Send Reminder
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Security Policies */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-teal-400" />
                  Security Policies
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div>
                      <p className="font-medium text-white">Require 2FA for all users</p>
                      <p className="text-sm text-slate-400">Users without 2FA will be prompted to enable it on next login</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div>
                      <p className="font-medium text-white">Lockout after failed attempts</p>
                      <p className="text-sm text-slate-400">Lock account after 5 failed login attempts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Session Timeout</label>
                    <select className="w-full sm:w-64 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option>15 minutes</option>
                      <option>30 minutes</option>
                      <option>1 hour</option>
                      <option>4 hours</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Password Policy</label>
                    <select className="w-full sm:w-64 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option>Strong (12+ chars, mixed case, numbers, symbols)</option>
                      <option>Medium (8+ chars, mixed case, numbers)</option>
                      <option>Basic (8+ characters)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Recent Login Activity */}
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Recent Login Activity
                </h2>
                <div className="space-y-3">
                  {[
                    { user: "Sarah Mitchell", action: "Login successful", time: "Today, 9:15 AM", ip: "192.168.1.45", device: "Chrome / Windows", status: "success" },
                    { user: "James Wilson", action: "Login successful", time: "Today, 8:30 AM", ip: "192.168.1.102", device: "Safari / macOS", status: "success" },
                    { user: "Unknown", action: "Failed login attempt", time: "Today, 7:45 AM", ip: "45.33.32.156", device: "Firefox / Linux", status: "failed" },
                    { user: "Emily Chen", action: "Password reset", time: "Yesterday, 4:45 PM", ip: "192.168.1.78", device: "Chrome / macOS", status: "warning" },
                    { user: "Michael Brown", action: "Login successful", time: "Yesterday, 10:00 AM", ip: "192.168.1.33", device: "Edge / Windows", status: "success" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          log.status === "success" ? "bg-green-500" :
                          log.status === "failed" ? "bg-red-500" : "bg-amber-500"
                        }`} />
                        <div>
                          <p className="text-white text-sm">
                            <span className="font-medium">{log.user}</span>
                            <span className="text-slate-400"> — {log.action}</span>
                          </p>
                          <p className="text-xs text-slate-500">{log.device} • {log.ip}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{log.time}</span>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                  View Full Audit Log →
                </button>
              </div>

              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-400" />
                  API Access
                </h2>
                <p className="text-slate-400 text-sm mb-4">Manage API keys for external systems</p>
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Production API Key</p>
                      <p className="text-sm text-slate-400 font-mono">tc_live_****************************4f2a</p>
                    </div>
                    <button className="px-3 py-1.5 bg-slate-600 text-white rounded hover:bg-slate-500 text-sm">Regenerate</button>
                  </div>
                </div>
                <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">+ Create new API key</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
