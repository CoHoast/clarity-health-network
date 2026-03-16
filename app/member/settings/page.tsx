"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Smartphone,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ChevronRight,
  Check,
  Camera,
  Pencil,
  MapPin,
  Calendar,
  Heart,
  Users,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

const settingsSections = [
  { id: "profile", name: "Profile", icon: User },
  { id: "notifications", name: "Notifications", icon: Bell },
  { id: "security", name: "Security", icon: Shield },
  { id: "communication", name: "Communication", icon: Mail },
  { id: "connected", name: "Connected Apps", icon: Smartphone },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    claimUpdates: true,
    appointmentReminders: true,
    preventiveCare: true,
    marketing: false,
  });

  // Communication preferences
  const [commPrefs, setCommPrefs] = useState({
    preferredMethod: "email",
    language: "en",
    paperless: true,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and privacy settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-2">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? "bg-teal-50 text-cyan-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${
                      activeSection === section.id ? "text-cyan-600" : "text-gray-400"
                    }`} />
                    <span className="font-medium">{section.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-6">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Profile Photo */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Profile Photo</h2>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">JD</span>
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">John Doe</p>
                    <p className="text-sm text-gray-500">Member since January 2024</p>
                    <button className="mt-2 text-sm text-cyan-600 font-medium hover:text-cyan-700">
                      Upload new photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Personal Information</h2>
                  <button className="text-sm text-cyan-600 font-medium hover:text-cyan-700 flex items-center gap-1">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Full Name</label>
                    <p className="font-medium text-gray-900">John Michael Doe</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Date of Birth</label>
                    <p className="font-medium text-gray-900">January 15, 1985</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Email</label>
                    <p className="font-medium text-gray-900">john.doe@email.com</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Phone</label>
                    <p className="font-medium text-gray-900">(216) 555-0123</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-500 mb-1">Address</label>
                    <p className="font-medium text-gray-900">1234 Oak Street, Cleveland, OH 44101</p>
                  </div>
                </div>
              </div>

              {/* Plan Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Plan Information</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Member ID</label>
                    <p className="font-mono text-gray-900">CHN-123456</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Group Number</label>
                    <p className="font-mono text-gray-900">GRP-78901</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Plan Name</label>
                    <p className="font-medium text-gray-900">TrueCare Health PPO</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Coverage Type</label>
                    <p className="font-medium text-gray-900">Family</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Effective Date</label>
                    <p className="font-medium text-gray-900">January 1, 2024</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Plan Year End</label>
                    <p className="font-medium text-gray-900">December 31, 2024</p>
                  </div>
                </div>
              </div>

              {/* Dependents */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Covered Dependents</h2>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Jane Doe", relationship: "Spouse", dob: "03/22/1987" },
                    { name: "Emma Doe", relationship: "Child", dob: "06/15/2015" },
                    { name: "Liam Doe", relationship: "Child", dob: "09/30/2018" },
                  ].map((dependent, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <span className="text-cyan-600 font-semibold">{dependent.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{dependent.name}</p>
                          <p className="text-sm text-gray-500">{dependent.relationship} • DOB: {dependent.dob}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Notification Channels</h2>
                <div className="space-y-4">
                  {[
                    { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
                    { key: "sms", label: "SMS Notifications", desc: "Get text messages for important alerts" },
                    { key: "push", label: "Push Notifications", desc: "Browser and mobile app notifications" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                        className={`relative w-12 h-7 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications] ? "bg-teal-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Notification Types</h2>
                <div className="space-y-4">
                  {[
                    { key: "claimUpdates", label: "Claim Updates", desc: "When your claims are processed or updated" },
                    { key: "appointmentReminders", label: "Appointment Reminders", desc: "Reminders for upcoming appointments" },
                    { key: "preventiveCare", label: "Preventive Care Reminders", desc: "Annual checkup and screening reminders" },
                    { key: "marketing", label: "Marketing & Promotions", desc: "News, tips, and promotional content" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                        className={`relative w-12 h-7 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications] ? "bg-teal-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            notifications[item.key as keyof typeof notifications] ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value="••••••••••••"
                        readOnly
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg pr-12"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors">
                    Change Password
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Enable 2FA</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Enabled
                  </span>
                </div>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Two-factor authentication is enabled via SMS to (216) 555-0123
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Login History</h2>
                <div className="space-y-3">
                  {[
                    { device: "Chrome on Mac", location: "Cleveland, OH", time: "Now", current: true },
                    { device: "Safari on iPhone", location: "Cleveland, OH", time: "2 hours ago", current: false },
                    { device: "Chrome on Windows", location: "Cleveland, OH", time: "Yesterday", current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          session.current ? "bg-green-100" : "bg-gray-100"
                        }`}>
                          <Smartphone className={`w-5 h-5 ${session.current ? "text-green-600" : "text-gray-600"}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{session.device}</p>
                          <p className="text-sm text-gray-500">{session.location} • {session.time}</p>
                        </div>
                      </div>
                      {session.current ? (
                        <span className="text-xs text-green-600 font-medium">Current session</span>
                      ) : (
                        <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                          Sign out
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Communication Section */}
          {activeSection === "communication" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Communication Preferences</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Contact Method</label>
                    <div className="flex gap-3">
                      {["email", "phone", "mail"].map((method) => (
                        <button
                          key={method}
                          onClick={() => setCommPrefs({ ...commPrefs, preferredMethod: method })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                            commPrefs.preferredMethod === method
                              ? "bg-teal-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={commPrefs.language}
                      onChange={(e) => setCommPrefs({ ...commPrefs, language: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="zh">中文</option>
                      <option value="ko">한국어</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">Go Paperless</h2>
                    <p className="text-sm text-gray-500 mt-1">Receive all documents and statements electronically</p>
                  </div>
                  <button
                    onClick={() => setCommPrefs({ ...commPrefs, paperless: !commPrefs.paperless })}
                    className={`relative w-12 h-7 rounded-full transition-colors ${
                      commPrefs.paperless ? "bg-teal-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        commPrefs.paperless ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                {commPrefs.paperless && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                    <p className="text-sm text-green-700">
                      You're enrolled in paperless delivery. All documents will be sent to john.doe@email.com
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Connected Apps Section */}
          {activeSection === "connected" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-4">Connected Applications</h2>
                <div className="space-y-4">
                  {[
                    { name: "Apple Health", connected: true, lastSync: "Today at 2:30 PM" },
                    { name: "Google Fit", connected: false, lastSync: null },
                    { name: "Fitbit", connected: false, lastSync: null },
                    { name: "MyFitnessPal", connected: true, lastSync: "Yesterday" },
                  ].map((app, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          app.connected ? "bg-teal-100" : "bg-gray-100"
                        }`}>
                          <Smartphone className={`w-5 h-5 ${app.connected ? "text-cyan-600" : "text-gray-400"}`} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{app.name}</p>
                          {app.connected && app.lastSync && (
                            <p className="text-sm text-gray-500">Last synced: {app.lastSync}</p>
                          )}
                        </div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          app.connected
                            ? "text-red-600 hover:bg-red-50"
                            : "bg-teal-600 text-white hover:bg-teal-700"
                        }`}
                      >
                        {app.connected ? "Disconnect" : "Connect"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Data Privacy</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Connected apps can only access the data you explicitly share. You can revoke access at any time.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
