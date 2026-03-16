"use client";

import { useState } from "react";
import { Settings, Building2, Bell, Shield, Globe, Save, Check, Key, Clock } from "lucide-react";

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
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                Notification Preferences
              </h2>
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
          )}

          {activeTab === "security" && (
            <>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  Security Settings
                </h2>
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
