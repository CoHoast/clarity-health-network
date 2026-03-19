"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState } from "react";
import { Bell, Mail, MessageSquare, Settings, CheckCircle, AlertTriangle, Clock, Calendar, Building2, FileText, Trash2, Eye, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: "contract" | "credentialing" | "provider" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  actionUrl?: string;
}

const notifications: Notification[] = [
  { id: "NOT-001", type: "contract", title: "Contract Expiring in 7 Days", message: "Midwest Regional Medical contract expires on March 28, 2026. Send renewal notice.", timestamp: "2 hours ago", read: false, priority: "high", actionUrl: "/admin/contracts/expiring" },
  { id: "NOT-002", type: "credentialing", title: "Credential Verification Failed", message: "Westlake Urgent Care liability insurance verification failed. Policy may be expired.", timestamp: "4 hours ago", read: false, priority: "high", actionUrl: "/admin/credentialing/verification" },
  { id: "NOT-003", type: "provider", title: "New Provider Application", message: "Dr. James Wilson, DO has submitted a network application.", timestamp: "5 hours ago", read: false, priority: "medium", actionUrl: "/admin/credentialing" },
  { id: "NOT-004", type: "contract", title: "Contract Renewed Successfully", message: "Lakeside Medical Group has signed their 3-year renewal.", timestamp: "Yesterday", read: true, priority: "low" },
  { id: "NOT-005", type: "credentialing", title: "License Expiring Soon", message: "Dr. Sarah Chen medical license expires in 60 days.", timestamp: "Yesterday", read: true, priority: "medium" },
  { id: "NOT-006", type: "system", title: "Batch Verification Complete", message: "Monthly credential verification completed. 12 items require attention.", timestamp: "2 days ago", read: true, priority: "medium", actionUrl: "/admin/credentialing/verification" },
  { id: "NOT-007", type: "provider", title: "Provider Information Updated", message: "Cleveland Cardiology Associates updated their contact information.", timestamp: "2 days ago", read: true, priority: "low" },
  { id: "NOT-008", type: "contract", title: "47 Contracts Expiring This Quarter", message: "Q2 contract renewals summary available.", timestamp: "3 days ago", read: true, priority: "medium", actionUrl: "/admin/contracts/expiring" },
  { id: "NOT-009", type: "system", title: "Weekly Network Report Ready", message: "Your weekly network analytics report is ready to view.", timestamp: "1 week ago", read: true, priority: "low", actionUrl: "/admin/analytics" },
];

const notificationSettings = [
  { id: "NS-001", name: "Contract Expiration Alerts", description: "Notify when contracts are expiring within 30, 60, or 90 days", enabled: true, channels: ["email", "dashboard"] },
  { id: "NS-002", name: "Credential Verification Alerts", description: "Notify when credential verifications fail or expire", enabled: true, channels: ["email", "dashboard"] },
  { id: "NS-003", name: "New Provider Applications", description: "Notify when new providers apply to join the network", enabled: true, channels: ["email", "dashboard"] },
  { id: "NS-004", name: "Contract Renewal Confirmations", description: "Notify when providers sign contract renewals", enabled: true, channels: ["dashboard"] },
  { id: "NS-005", name: "Weekly Network Summary", description: "Send weekly summary of network activity and metrics", enabled: false, channels: ["email"] },
  { id: "NS-006", name: "Provider Updates", description: "Notify when providers update their information", enabled: false, channels: ["dashboard"] },
];

const filterOptions = ["All", "Unread", "Contracts", "Credentialing", "Providers", "System"];

export default function NotificationsPage() {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState("All");
  const [activeTab, setActiveTab] = useState<"notifications" | "settings">("notifications");
  const [notificationList, setNotificationList] = useState(notifications);
  const [settings, setSettings] = useState(notificationSettings);

  const filteredNotifications = notificationList.filter(n => {
    if (filter === "All") return true;
    if (filter === "Unread") return !n.read;
    if (filter === "Contracts") return n.type === "contract";
    if (filter === "Credentialing") return n.type === "credentialing";
    if (filter === "Providers") return n.type === "provider";
    if (filter === "System") return n.type === "system";
    return true;
  });

  const unreadCount = notificationList.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotificationList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
  };

  const toggleSetting = (id: string) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "contract": return <FileText className="w-5 h-5 text-blue-400" />;
      case "credentialing": return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "provider": return <Building2 className="w-5 h-5 text-blue-400" />;
      case "system": return <Settings className="w-5 h-5 text-slate-400" />;
      default: return <Bell className="w-5 h-5 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-l-red-500";
      case "medium": return "border-l-amber-500";
      case "low": return "border-l-slate-500";
      default: return "border-l-slate-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bell className="w-7 h-7 text-blue-500" />
            Notifications
          </h1>
          <p className="text-slate-400 mt-1">{unreadCount} unread notifications</p>
        </div>
        {activeTab === "notifications" && unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 font-medium rounded-lg hover:bg-slate-600 transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        <button
          onClick={() => setActiveTab("notifications")}
          className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "notifications" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <Bell className="w-4 h-4" />
          Notifications
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">{unreadCount}</span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === "settings" ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" : "text-slate-400 hover:text-white hover:bg-slate-700"
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {activeTab === "notifications" ? (
        <>
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                  filter === option 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" 
                    : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                }`}
              >
                {option}
                {option === "Unread" && unreadCount > 0 && (
                  <span className="ml-1">({unreadCount})</span>
                )}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-12 text-center">
                <Bell className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No notifications to show</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-slate-800/50 rounded-xl border border-slate-700 p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                    !notification.read ? "bg-slate-800" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className={`font-medium ${notification.read ? "text-slate-300" : "text-white"}`}>
                            {notification.title}
                          </h3>
                          <p className="text-slate-400 text-sm mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap">{notification.timestamp}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-3">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-400 hover:text-teal-300"
                          >
                            Mark as read
                          </button>
                        )}
                        {notification.actionUrl && (
                          <a
                            href={notification.actionUrl}
                            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            View Details
                          </a>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-slate-500 hover:text-red-400 flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </>
      ) : (
        /* Settings Tab */
        <div className="space-y-6">
          {/* Email Recipients Section */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-400" />
                Notification Recipients
              </h2>
              <button className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors">
                + Add Recipient
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
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{recipient.name}</p>
                      <p className="text-sm text-slate-400">{recipient.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {recipient.types.map((type, j) => (
                        <span key={j} className="px-2 py-1 bg-teal-100 text-indigo-700 text-xs font-medium rounded-full">
                          {type}
                        </span>
                      ))}
                    </div>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-600 rounded-lg transition-colors">
                      <Settings className="w-4 h-4" />
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
          <div className="bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="p-4 border-b border-slate-700">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                Notification Types
              </h2>
              <p className="text-slate-400 text-sm mt-1">Enable or disable specific notification categories.</p>
            </div>
            <div className="divide-y divide-slate-700">
              {settings.map((setting) => (
                <div key={setting.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{setting.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{setting.description}</p>
                    <div className="flex gap-2 mt-2">
                      {setting.channels.map((channel) => (
                        <span key={channel} className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded">
                          {channel === "email" ? "📧 Email" : "🖥️ Dashboard"}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting(setting.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      setting.enabled ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-slate-600"
                    }`}
                  >
                    <div
                      className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                        setting.enabled ? "translate-x-6" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
