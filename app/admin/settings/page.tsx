"use client";

import { useState } from "react";
import { Settings, Building2, Bell, Shield, Database, Palette, Globe, Mail, Save, Check, Key, Webhook, Clock } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "organization", label: "Organization", icon: Building2 },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "integrations", label: "Integrations", icon: Webhook },
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
          {activeTab === "general" && (
            <>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Palette className="w-5 h-5 text-cyan-500" />Appearance</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Theme</label>
                    <select className="w-full sm:w-64 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option>Dark (Default)</option>
                      <option>Light</option>
                      <option>System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Accent Color</label>
                    <div className="flex gap-2">
                      {["purple", "blue", "teal", "green", "amber"].map((color) => (
                        <button key={color} className={`w-8 h-8 rounded-full bg-${color}-500 ${color === "purple" ? "ring-2 ring-white" : ""}`}></button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" />Localization</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Language</label>
                    <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
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
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Currency</label>
                    <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "organization" && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Building2 className="w-5 h-5 text-green-400" />Organization Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Organization Name</label>
                  <input type="text" defaultValue="MedCare Health Network" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Legal Entity Name</label>
                  <input type="text" defaultValue="MedCare Health Network, LLC" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Tax ID (EIN)</label>
                    <input type="text" defaultValue="XX-XXXXXXX" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">NPI</label>
                    <input type="text" defaultValue="1234567890" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                  <textarea defaultValue="123 Healthcare Drive, Suite 500&#10;Cleveland, OH 44101" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20 resize-none"></textarea>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                    <input type="tel" defaultValue="1-800-555-0123" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                    <input type="email" defaultValue="admin@medcarehealth.com" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-amber-400" />Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: "New claims requiring review", description: "Notify when claims need manual review", default: true },
                  { label: "High-value claims", description: "Claims exceeding $10,000", default: true },
                  { label: "Fraud alerts", description: "FraudShield AI detections", default: true },
                  { label: "Provider credential expiration", description: "30 days before expiration", default: true },
                  { label: "Payment batch completion", description: "When payment batches are processed", default: false },
                  { label: "System maintenance", description: "Scheduled downtime notices", default: true },
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
          )}

          {activeTab === "security" && (
            <>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-green-400" />Security Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-700">
                    <div>
                      <p className="font-medium text-white">Require MFA for all users</p>
                      <p className="text-sm text-slate-400">Enforce multi-factor authentication</p>
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
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Key className="w-5 h-5 text-amber-400" />API Keys</h2>
                <p className="text-slate-400 text-sm mb-4">Manage API access for integrations</p>
                <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">Production API Key</p>
                      <p className="text-sm text-slate-400 font-mono">clr_live_****************************4f2a</p>
                    </div>
                    <button className="px-3 py-1.5 bg-slate-600 text-white rounded hover:bg-slate-500 text-sm">Regenerate</button>
                  </div>
                </div>
                <button className="text-cyan-500 hover:text-cyan-400 text-sm font-medium">+ Create new API key</button>
              </div>
            </>
          )}

          {activeTab === "integrations" && (
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Webhook className="w-5 h-5 text-blue-400" />Integrations</h2>
              <div className="space-y-4">
                {[
                  { name: "Claims Clearinghouse", status: "connected", description: "Change Healthcare EDI" },
                  { name: "EHR System", status: "connected", description: "Epic MyChart Integration" },
                  { name: "Payment Gateway", status: "connected", description: "Stripe ACH Processing" },
                  { name: "Email Service", status: "connected", description: "SendGrid Transactional" },
                  { name: "Analytics", status: "disconnected", description: "Google Analytics 4" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${item.status === "connected" ? "bg-green-400" : "bg-slate-500"}`}></div>
                      <div>
                        <p className="font-medium text-white">{item.name}</p>
                        <p className="text-sm text-slate-400">{item.description}</p>
                      </div>
                    </div>
                    <button className={`px-3 py-1.5 rounded text-sm ${item.status === "connected" ? "bg-slate-600 text-white hover:bg-slate-500" : "bg-teal-600 text-white hover:bg-teal-700"}`}>
                      {item.status === "connected" ? "Configure" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
