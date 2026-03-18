"use client";

import React, { useState } from "react";
import { Search, UserPlus, Shield, Mail, Edit, Trash2, X, CheckCircle, Clock, XCircle, Key, Check, Users as UsersIcon, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { Button, IconButton } from "@/components/admin/ui/Button";
import { PageHeader, PillTabs } from "@/components/admin/ui/PageHeader";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { Badge, StatusBadge } from "@/components/admin/ui/Badge";
import { cn } from "@/lib/utils";

const users = [
  { id: "USR-001", name: "Sarah Mitchell", email: "sarah.m@truecare.health", role: "Super Admin", department: "Administration", status: "active", lastLogin: "2024-03-12 09:15 AM", mfa: true },
  { id: "USR-002", name: "James Wilson", email: "james.w@truecare.health", role: "Network Director", department: "Network Operations", status: "active", lastLogin: "2024-03-12 08:30 AM", mfa: true },
  { id: "USR-003", name: "Emily Chen", email: "emily.c@truecare.health", role: "Provider Relations Manager", department: "Provider Relations", status: "active", lastLogin: "2024-03-11 04:45 PM", mfa: true },
  { id: "USR-004", name: "Michael Brown", email: "michael.b@truecare.health", role: "Network Analyst", department: "Analytics", status: "active", lastLogin: "2024-03-12 10:00 AM", mfa: false },
  { id: "USR-005", name: "Lisa Rodriguez", email: "lisa.r@truecare.health", role: "Credentialing Specialist", department: "Credentialing", status: "active", lastLogin: "2024-03-11 05:30 PM", mfa: true },
  { id: "USR-006", name: "David Kim", email: "david.k@truecare.health", role: "Contract Manager", department: "Contracts", status: "active", lastLogin: "2024-03-12 07:45 AM", mfa: true },
  { id: "USR-007", name: "Jennifer Lee", email: "jennifer.l@truecare.health", role: "Credentialing Specialist", department: "Credentialing", status: "inactive", lastLogin: "2024-02-28 03:00 PM", mfa: false },
  { id: "USR-008", name: "Robert Taylor", email: "robert.t@truecare.health", role: "Network Analyst", department: "Analytics", status: "pending", lastLogin: "Never", mfa: false },
];

const rolePermissions: Record<string, { section: string; view: boolean; edit: boolean; delete: boolean; export: boolean }[]> = {
  "Super Admin": [
    { section: "Dashboard", view: true, edit: true, delete: true, export: true },
    { section: "Providers", view: true, edit: true, delete: true, export: true },
    { section: "Contracts", view: true, edit: true, delete: true, export: true },
    { section: "Rates & Discounts", view: true, edit: true, delete: true, export: true },
    { section: "Credentialing", view: true, edit: true, delete: true, export: true },
    { section: "Networks", view: true, edit: true, delete: true, export: true },
    { section: "Reports", view: true, edit: true, delete: true, export: true },
    { section: "Team & Permissions", view: true, edit: true, delete: true, export: true },
    { section: "Settings", view: true, edit: true, delete: true, export: true },
  ],
  "Network Director": [
    { section: "Dashboard", view: true, edit: true, delete: false, export: true },
    { section: "Providers", view: true, edit: true, delete: false, export: true },
    { section: "Contracts", view: true, edit: true, delete: false, export: true },
    { section: "Rates & Discounts", view: true, edit: true, delete: false, export: true },
    { section: "Credentialing", view: true, edit: true, delete: false, export: true },
    { section: "Networks", view: true, edit: true, delete: true, export: true },
    { section: "Reports", view: true, edit: false, delete: false, export: true },
    { section: "Team & Permissions", view: true, edit: false, delete: false, export: false },
    { section: "Settings", view: true, edit: false, delete: false, export: false },
  ],
  "Contract Manager": [
    { section: "Dashboard", view: true, edit: false, delete: false, export: true },
    { section: "Providers", view: true, edit: false, delete: false, export: true },
    { section: "Contracts", view: true, edit: true, delete: true, export: true },
    { section: "Rates & Discounts", view: true, edit: true, delete: false, export: true },
    { section: "Credentialing", view: true, edit: false, delete: false, export: false },
    { section: "Networks", view: true, edit: false, delete: false, export: false },
    { section: "Reports", view: true, edit: false, delete: false, export: true },
    { section: "Team & Permissions", view: false, edit: false, delete: false, export: false },
    { section: "Settings", view: false, edit: false, delete: false, export: false },
  ],
  "Credentialing Specialist": [
    { section: "Dashboard", view: true, edit: false, delete: false, export: false },
    { section: "Providers", view: true, edit: true, delete: false, export: true },
    { section: "Contracts", view: true, edit: false, delete: false, export: false },
    { section: "Rates & Discounts", view: false, edit: false, delete: false, export: false },
    { section: "Credentialing", view: true, edit: true, delete: true, export: true },
    { section: "Networks", view: true, edit: false, delete: false, export: false },
    { section: "Reports", view: true, edit: false, delete: false, export: true },
    { section: "Team & Permissions", view: false, edit: false, delete: false, export: false },
    { section: "Settings", view: false, edit: false, delete: false, export: false },
  ],
  "Network Analyst": [
    { section: "Dashboard", view: true, edit: false, delete: false, export: true },
    { section: "Providers", view: true, edit: false, delete: false, export: true },
    { section: "Contracts", view: true, edit: false, delete: false, export: true },
    { section: "Rates & Discounts", view: true, edit: false, delete: false, export: true },
    { section: "Credentialing", view: true, edit: false, delete: false, export: true },
    { section: "Networks", view: true, edit: false, delete: false, export: true },
    { section: "Reports", view: true, edit: false, delete: false, export: true },
    { section: "Team & Permissions", view: false, edit: false, delete: false, export: false },
    { section: "Settings", view: false, edit: false, delete: false, export: false },
  ],
  "Provider Relations Manager": [
    { section: "Dashboard", view: true, edit: false, delete: false, export: true },
    { section: "Providers", view: true, edit: true, delete: false, export: true },
    { section: "Contracts", view: true, edit: false, delete: false, export: false },
    { section: "Rates & Discounts", view: true, edit: false, delete: false, export: false },
    { section: "Credentialing", view: true, edit: false, delete: false, export: false },
    { section: "Networks", view: true, edit: true, delete: false, export: true },
    { section: "Reports", view: true, edit: false, delete: false, export: true },
    { section: "Team & Permissions", view: false, edit: false, delete: false, export: false },
    { section: "Settings", view: false, edit: false, delete: false, export: false },
  ],
};

const roles = [
  { id: "ROLE-001", name: "Super Admin", description: "Full system access", users: 1 },
  { id: "ROLE-002", name: "Network Director", description: "Network management access", users: 1 },
  { id: "ROLE-003", name: "Contract Manager", description: "Contract management", users: 1 },
  { id: "ROLE-004", name: "Credentialing Specialist", description: "Credentialing workflow access", users: 2 },
  { id: "ROLE-005", name: "Network Analyst", description: "Read-only analytics access", users: 2 },
  { id: "ROLE-006", name: "Provider Relations Manager", description: "Provider communication", users: 1 },
];

const tabs = [
  { label: "Users", value: "users", count: users.length },
  { label: "Roles", value: "roles", count: roles.length },
];

export default function UsersPage() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Users", value: users.length, icon: <UsersIcon className="w-5 h-5" /> },
    { label: "Active", value: users.filter(u => u.status === "active").length, icon: <CheckCircle className="w-5 h-5" /> },
    { label: "MFA Enabled", value: users.filter(u => u.mfa).length, icon: <Shield className="w-5 h-5" /> },
    { label: "Pending", value: users.filter(u => u.status === "pending").length, icon: <Clock className="w-5 h-5" /> },
  ];

  const handleInvite = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setShowAddModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team & Permissions"
        subtitle="Manage user access and role-based permissions"
        actions={
          <Button variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
            Invite User
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} padding="md">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isDark ? "bg-blue-500/20 text-blue-400" : "bg-blue-50 text-blue-600"
              )}>
                {stat.icon}
              </div>
              <div>
                <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>{stat.value}</p>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <PillTabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

      {/* Users Tab */}
      {activeTab === "users" && (
        <>
          <Card padding="md">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search users by name, email, or role..."
              showShortcut
            />
          </Card>

          <Card padding="none">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={cn(
                    "text-left text-xs font-medium uppercase tracking-wider border-b",
                    isDark ? "text-slate-400 border-slate-700 bg-slate-800/50" : "text-slate-500 border-slate-200 bg-slate-50"
                  )}>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Department</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">MFA</th>
                    <th className="px-6 py-4">Last Login</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={cn("divide-y", isDark ? "divide-slate-700" : "divide-slate-100")}>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className={cn("transition-colors", isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50")}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                            isDark ? "bg-slate-700 text-white" : "bg-slate-200 text-slate-700"
                          )}>
                            {user.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{user.name}</p>
                            <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="default">{user.role}</Badge>
                      </td>
                      <td className={cn("px-6 py-4", isDark ? "text-slate-300" : "text-slate-600")}>{user.department}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={user.status} />
                      </td>
                      <td className="px-6 py-4">
                        {user.mfa ? (
                          <Badge variant="success" icon={<Shield className="w-3 h-3" />}>Enabled</Badge>
                        ) : (
                          <Badge variant="warning">Disabled</Badge>
                        )}
                      </td>
                      <td className={cn("px-6 py-4 text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{user.lastLogin}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <IconButton icon={<Edit className="w-4 h-4" />} tooltip="Edit" />
                          <IconButton icon={<Key className="w-4 h-4" />} tooltip="Reset Password" />
                          <IconButton icon={<Trash2 className="w-4 h-4" />} tooltip="Delete" variant="danger" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <Card key={role.id} hover>
              <div className="flex items-start justify-between mb-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  isDark ? "bg-teal-500/20" : "bg-teal-50"
                )}>
                  <Shield className={cn("w-5 h-5", isDark ? "text-blue-400" : "text-blue-600")} />
                </div>
                <div className="flex items-center gap-1">
                  <IconButton 
                    icon={<Eye className="w-4 h-4" />} 
                    tooltip="View Permissions" 
                    onClick={() => {
                      setSelectedRole(role.name);
                      setShowPermissionsModal(true);
                    }}
                  />
                  <IconButton icon={<Edit className="w-4 h-4" />} tooltip="Edit Role" />
                </div>
              </div>
              <h3 className={cn("font-semibold mb-1", isDark ? "text-white" : "text-slate-900")}>{role.name}</h3>
              <p className={cn("text-sm mb-3", isDark ? "text-slate-400" : "text-slate-500")}>{role.description}</p>
              <div className="flex items-center gap-2">
                <Badge variant="default">{role.users} users</Badge>
                <button 
                  onClick={() => {
                    setSelectedRole(role.name);
                    setShowPermissionsModal(true);
                  }}
                  className={cn(
                    "text-xs font-medium px-2 py-1 rounded-lg transition-colors",
                    isDark 
                      ? "text-blue-400 hover:bg-blue-500/20" 
                      : "text-blue-600 hover:bg-blue-50"
                  )}
                >
                  View Permissions →
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Invite User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-2xl shadow-2xl z-50",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              {showSuccess ? (
                <div className="p-10 text-center">
                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Check className="w-8 h-8 text-emerald-500" />
                  </div>
                  <h3 className={cn("text-xl font-bold mb-2", isDark ? "text-white" : "text-slate-900")}>Invitation Sent!</h3>
                  <p className={isDark ? "text-slate-400" : "text-slate-500"}>User will receive an email to set up their account.</p>
                </div>
              ) : (
                <>
                  <div className={cn("p-5 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                    <h3 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>Invite Team Member</h3>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>Email</label>
                      <input
                        type="email"
                        placeholder="colleague@truecare.health"
                        className={cn(
                          "w-full px-4 py-2.5 rounded-lg border",
                          isDark ? "bg-slate-700 border-slate-600 text-white placeholder-slate-500" : "bg-white border-slate-300 text-slate-900 placeholder-slate-400"
                        )}
                      />
                    </div>
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>Role</label>
                      <select className={cn(
                        "w-full px-4 py-2.5 rounded-lg border",
                        isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"
                      )}>
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={cn("block text-sm font-medium mb-2", isDark ? "text-slate-300" : "text-slate-700")}>Department</label>
                      <select className={cn(
                        "w-full px-4 py-2.5 rounded-lg border",
                        isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300 text-slate-900"
                      )}>
                        <option>Administration</option>
                        <option>Network Operations</option>
                        <option>Provider Relations</option>
                        <option>Credentialing</option>
                        <option>Contracts</option>
                        <option>Analytics</option>
                      </select>
                    </div>
                  </div>
                  <div className={cn("flex gap-3 p-5 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
                    <Button variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>Cancel</Button>
                    <Button variant="primary" className="flex-1" onClick={handleInvite} icon={<Mail className="w-4 h-4" />}>Send Invite</Button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Role Permissions Modal */}
      <AnimatePresence>
        {showPermissionsModal && selectedRole && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPermissionsModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={cn(
                "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl rounded-2xl shadow-2xl z-50 max-h-[90vh] overflow-hidden flex flex-col",
                isDark ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200"
              )}
            >
              {/* Header */}
              <div className={cn("flex items-center justify-between p-5 border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    isDark ? "bg-teal-500/20" : "bg-teal-50"
                  )}>
                    <Shield className={cn("w-5 h-5", isDark ? "text-blue-400" : "text-blue-600")} />
                  </div>
                  <div>
                    <h2 className={cn("text-lg font-semibold", isDark ? "text-white" : "text-slate-900")}>
                      {selectedRole} Permissions
                    </h2>
                    <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                      Access rights for this role
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowPermissionsModal(false)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isDark ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Permissions Table */}
              <div className="flex-1 overflow-auto p-5">
                <table className="w-full">
                  <thead>
                    <tr className={cn(
                      "text-left text-xs font-medium uppercase tracking-wider",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}>
                      <th className="pb-3">Section</th>
                      <th className="pb-3 text-center">View</th>
                      <th className="pb-3 text-center">Edit</th>
                      <th className="pb-3 text-center">Delete</th>
                      <th className="pb-3 text-center">Export</th>
                    </tr>
                  </thead>
                  <tbody className={cn("divide-y", isDark ? "divide-slate-700" : "divide-slate-100")}>
                    {rolePermissions[selectedRole]?.map((perm, idx) => (
                      <tr key={idx}>
                        <td className={cn("py-3 font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {perm.section}
                        </td>
                        <td className="py-3 text-center">
                          {perm.view ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {perm.edit ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {perm.delete ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                        <td className="py-3 text-center">
                          {perm.export ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className={cn("flex justify-end gap-3 p-5 border-t", isDark ? "border-slate-700" : "border-slate-200")}>
                <Button variant="outline" onClick={() => setShowPermissionsModal(false)}>Close</Button>
                <Button variant="primary" icon={<Edit className="w-4 h-4" />}>Edit Permissions</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
