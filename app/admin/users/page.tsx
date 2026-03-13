"use client";

import { useState } from "react";
import { Search, UserPlus, Eye, MoreVertical, Shield, Mail, Calendar, Edit, Trash2, X, CheckCircle, Clock, XCircle, Key, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const users = [
  { id: "USR-001", name: "Sarah Mitchell", email: "sarah.m@clarity.health", role: "Super Admin", department: "Administration", status: "active", lastLogin: "2024-03-12 09:15 AM", mfa: true },
  { id: "USR-002", name: "James Wilson", email: "james.w@clarity.health", role: "Claims Manager", department: "Claims", status: "active", lastLogin: "2024-03-12 08:30 AM", mfa: true },
  { id: "USR-003", name: "Emily Chen", email: "emily.c@clarity.health", role: "Provider Relations", department: "Network", status: "active", lastLogin: "2024-03-11 04:45 PM", mfa: true },
  { id: "USR-004", name: "Michael Brown", email: "michael.b@clarity.health", role: "Analyst", department: "Analytics", status: "active", lastLogin: "2024-03-12 10:00 AM", mfa: false },
  { id: "USR-005", name: "Lisa Rodriguez", email: "lisa.r@clarity.health", role: "Claims Processor", department: "Claims", status: "active", lastLogin: "2024-03-11 05:30 PM", mfa: true },
  { id: "USR-006", name: "David Kim", email: "david.k@clarity.health", role: "Compliance Officer", department: "Compliance", status: "active", lastLogin: "2024-03-12 07:45 AM", mfa: true },
  { id: "USR-007", name: "Jennifer Lee", email: "jennifer.l@clarity.health", role: "Member Services", department: "Member Services", status: "inactive", lastLogin: "2024-02-28 03:00 PM", mfa: false },
  { id: "USR-008", name: "Robert Taylor", email: "robert.t@clarity.health", role: "Analyst", department: "Analytics", status: "pending", lastLogin: "Never", mfa: false },
];

const roles = [
  { name: "Super Admin", permissions: "Full system access", users: 2 },
  { name: "Claims Manager", permissions: "Claims, Payments, Reports", users: 3 },
  { name: "Claims Processor", permissions: "Claims processing only", users: 8 },
  { name: "Provider Relations", permissions: "Provider, Credentialing, Contracts", users: 4 },
  { name: "Analyst", permissions: "Reports, Analytics (read-only)", users: 5 },
  { name: "Member Services", permissions: "Members, Eligibility", users: 6 },
  { name: "Compliance Officer", permissions: "Compliance, Fraud, Audit logs", users: 2 },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "roles">("users");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Active</span>;
      case "inactive": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full"><XCircle className="w-3 h-3" />Inactive</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400">Manage users, roles, and permissions</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-white">22</p>
          <p className="text-sm text-slate-400">Total Users</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-green-400">18</p>
          <p className="text-sm text-slate-400">Active</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-purple-400">7</p>
          <p className="text-sm text-slate-400">Roles</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-amber-400">85%</p>
          <p className="text-sm text-slate-400">MFA Enabled</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        <button onClick={() => setActiveTab("users")} className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === "users" ? "bg-slate-800 text-purple-400 border-b-2 border-purple-400" : "text-slate-400 hover:text-white"}`}>Users</button>
        <button onClick={() => setActiveTab("roles")} className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === "roles" ? "bg-slate-800 text-purple-400 border-b-2 border-purple-400" : "text-slate-400 hover:text-white"}`}>Roles</button>
      </div>

      {activeTab === "users" ? (
        <>
          {/* Search */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Department</th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase">MFA</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Last Login</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <span className="text-purple-400 font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-xs text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{user.role}</td>
                      <td className="px-4 py-3 text-slate-400">{user.department}</td>
                      <td className="px-4 py-3 text-center">
                        {user.mfa ? <Shield className="w-4 h-4 text-green-400 mx-auto" /> : <span className="text-slate-500">—</span>}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{user.lastLogin}</td>
                      <td className="px-4 py-3">{getStatusBadge(user.status)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => { setSelectedUser(user); setShowEditModal(true); }} className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/20 rounded"><Edit className="w-4 h-4" /></button>
                          <button className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Roles Tab */
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div key={role.name} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-purple-400" />
                </div>
                <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded"><Edit className="w-4 h-4" /></button>
              </div>
              <h3 className="font-semibold text-white mb-1">{role.name}</h3>
              <p className="text-sm text-slate-400 mb-3">{role.permissions}</p>
              <p className="text-xs text-slate-500">{role.users} users</p>
            </div>
          ))}
        </div>
      )}

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Add New User</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="john.d@clarity.health" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    {roles.map(r => <option key={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Department</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option>Administration</option>
                    <option>Claims</option>
                    <option>Network</option>
                    <option>Analytics</option>
                    <option>Member Services</option>
                    <option>Compliance</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="sendInvite" defaultChecked className="rounded border-slate-500 bg-slate-600 text-purple-500" />
                  <label htmlFor="sendInvite" className="text-sm text-slate-300">Send invitation email</label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Add User</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showEditModal && selectedUser && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Edit User</h2>
                <button onClick={() => setShowEditModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
                  <input type="text" defaultValue={selectedUser.name} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input type="email" defaultValue={selectedUser.email} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                  <select defaultValue={selectedUser.role} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    {roles.map(r => <option key={r.name}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select defaultValue={selectedUser.status} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="pt-2 border-t border-slate-700">
                  <button className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm"><Key className="w-4 h-4" />Reset Password</button>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Changes</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
