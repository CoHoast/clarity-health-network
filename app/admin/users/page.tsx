"use client";

import React, { useState } from "react";
import { Search, UserPlus, Eye, Shield, Mail, Edit, Trash2, X, CheckCircle, Clock, XCircle, Key, Lock, Check, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  users: number;
  isSystem: boolean;
}

const users = [
  { id: "USR-001", name: "Sarah Mitchell", email: "sarah.m@truecare.health", role: "Super Admin", department: "Administration", status: "active", lastLogin: "2024-03-12 09:15 AM", mfa: true },
  { id: "USR-002", name: "James Wilson", email: "james.w@truecare.health", role: "Claims Manager", department: "Claims", status: "active", lastLogin: "2024-03-12 08:30 AM", mfa: true },
  { id: "USR-003", name: "Emily Chen", email: "emily.c@truecare.health", role: "Provider Relations", department: "Network", status: "active", lastLogin: "2024-03-11 04:45 PM", mfa: true },
  { id: "USR-004", name: "Michael Brown", email: "michael.b@truecare.health", role: "Analyst", department: "Analytics", status: "active", lastLogin: "2024-03-12 10:00 AM", mfa: false },
  { id: "USR-005", name: "Lisa Rodriguez", email: "lisa.r@truecare.health", role: "Claims Processor", department: "Claims", status: "active", lastLogin: "2024-03-11 05:30 PM", mfa: true },
  { id: "USR-006", name: "David Kim", email: "david.k@truecare.health", role: "Compliance Officer", department: "Compliance", status: "active", lastLogin: "2024-03-12 07:45 AM", mfa: true },
  { id: "USR-007", name: "Jennifer Lee", email: "jennifer.l@truecare.health", role: "Member Services", department: "Member Services", status: "inactive", lastLogin: "2024-02-28 03:00 PM", mfa: false },
  { id: "USR-008", name: "Robert Taylor", email: "robert.t@truecare.health", role: "Analyst", department: "Analytics", status: "pending", lastLogin: "Never", mfa: false },
];

const modules = ["Dashboard", "Claims", "Members", "Providers", "Payments", "Reports", "Analytics", "Compliance", "Audit Logs", "Users", "Settings", "Workflows"];

const initialRoles: Role[] = [
  { 
    id: "ROLE-001",
    name: "Super Admin", 
    description: "Full system access with all permissions",
    permissions: modules.map(m => ({ module: m, view: true, create: true, edit: true, delete: true, export: true })),
    users: 2,
    isSystem: true
  },
  { 
    id: "ROLE-002",
    name: "Claims Manager", 
    description: "Manage claims, payments, and generate reports",
    permissions: modules.map(m => ({ 
      module: m, 
      view: ["Dashboard", "Claims", "Members", "Providers", "Payments", "Reports"].includes(m),
      create: ["Claims"].includes(m),
      edit: ["Claims", "Payments"].includes(m),
      delete: false,
      export: ["Claims", "Payments", "Reports"].includes(m)
    })),
    users: 3,
    isSystem: false
  },
  { 
    id: "ROLE-003",
    name: "Claims Processor", 
    description: "Process and adjudicate claims",
    permissions: modules.map(m => ({ 
      module: m, 
      view: ["Dashboard", "Claims", "Members", "Providers"].includes(m),
      create: false,
      edit: ["Claims"].includes(m),
      delete: false,
      export: false
    })),
    users: 8,
    isSystem: false
  },
  { 
    id: "ROLE-004",
    name: "Provider Relations", 
    description: "Manage provider network, credentialing, and contracts",
    permissions: modules.map(m => ({ 
      module: m, 
      view: ["Dashboard", "Providers", "Reports"].includes(m),
      create: ["Providers"].includes(m),
      edit: ["Providers"].includes(m),
      delete: false,
      export: ["Providers", "Reports"].includes(m)
    })),
    users: 4,
    isSystem: false
  },
  { 
    id: "ROLE-005",
    name: "Analyst", 
    description: "Read-only access to reports and analytics",
    permissions: modules.map(m => ({ 
      module: m, 
      view: ["Dashboard", "Reports", "Analytics"].includes(m),
      create: false,
      edit: false,
      delete: false,
      export: ["Reports", "Analytics"].includes(m)
    })),
    users: 5,
    isSystem: false
  },
  { 
    id: "ROLE-006",
    name: "Member Services", 
    description: "Manage member inquiries and eligibility",
    permissions: modules.map(m => ({ 
      module: m, 
      view: ["Dashboard", "Members", "Claims"].includes(m),
      create: false,
      edit: ["Members"].includes(m),
      delete: false,
      export: false
    })),
    users: 6,
    isSystem: false
  },
  { 
    id: "ROLE-007",
    name: "Compliance Officer", 
    description: "Compliance monitoring, fraud detection, and audit logs",
    permissions: modules.map(m => ({ 
      module: m, 
      view: ["Dashboard", "Compliance", "Audit Logs", "Reports"].includes(m),
      create: false,
      edit: ["Compliance"].includes(m),
      delete: false,
      export: ["Compliance", "Audit Logs", "Reports"].includes(m)
    })),
    users: 2,
    isSystem: false
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"users" | "roles" | "permissions">("users");
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [showAddRoleModal, setShowAddRoleModal] = useState(false);

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

  const togglePermission = (roleId: string, moduleIndex: number, permType: keyof Omit<Permission, 'module'>) => {
    setRoles(roles.map(role => {
      if (role.id === roleId && !role.isSystem) {
        const newPermissions = [...role.permissions];
        newPermissions[moduleIndex] = {
          ...newPermissions[moduleIndex],
          [permType]: !newPermissions[moduleIndex][permType]
        };
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  };

  const PermissionCell = ({ checked, onClick, disabled }: { checked: boolean; onClick: () => void; disabled?: boolean }) => (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
        disabled ? "cursor-not-allowed opacity-50" :
        checked ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-slate-700 text-slate-500 hover:bg-slate-600"
      }`}
    >
      {checked ? <Check className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400">Manage users, roles, and permissions</p>
        </div>
        <div className="flex gap-2">
          {activeTab === "roles" && (
            <button onClick={() => setShowAddRoleModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
              <Shield className="w-4 h-4" />
              Add Role
            </button>
          )}
          <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>
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
          <p className="text-2xl font-bold text-cyan-500">{roles.length}</p>
          <p className="text-sm text-slate-400">Roles</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
          <p className="text-2xl font-bold text-amber-400">85%</p>
          <p className="text-sm text-slate-400">MFA Enabled</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700 pb-2">
        <button onClick={() => setActiveTab("users")} className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === "users" ? "bg-slate-800 text-cyan-500 border-b-2 border-cyan-500" : "text-slate-400 hover:text-white"}`}>Users</button>
        <button onClick={() => setActiveTab("roles")} className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === "roles" ? "bg-slate-800 text-cyan-500 border-b-2 border-cyan-500" : "text-slate-400 hover:text-white"}`}>Roles</button>
        <button onClick={() => setActiveTab("permissions")} className={`px-4 py-2 rounded-t-lg font-medium ${activeTab === "permissions" ? "bg-slate-800 text-cyan-500 border-b-2 border-cyan-500" : "text-slate-400 hover:text-white"}`}>Permission Matrix</button>
      </div>

      {activeTab === "users" && (
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-600"
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
                          <div className="w-10 h-10 bg-cyan-600/20 rounded-full flex items-center justify-center">
                            <span className="text-cyan-500 font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span>
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
                          <button onClick={() => { setSelectedUser(user); setShowEditModal(true); }} className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-600/20 rounded"><Edit className="w-4 h-4" /></button>
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
      )}

      {activeTab === "roles" && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <div key={role.id} className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-cyan-500" />
                </div>
                <div className="flex gap-1">
                  {role.isSystem && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">System</span>
                  )}
                  <button 
                    onClick={() => { setSelectedRole(role); setShowEditRoleModal(true); }}
                    className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-600/20 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-white mb-1">{role.name}</h3>
              <p className="text-sm text-slate-400 mb-3">{role.description}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">{role.users} users</p>
                <button 
                  onClick={() => { setSelectedRole(role); setActiveTab("permissions"); }}
                  className="text-xs text-cyan-500 hover:text-cyan-400"
                >
                  View Permissions →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "permissions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Permission Matrix</h2>
              <p className="text-sm text-slate-400">Configure what each role can access</p>
            </div>
            <select 
              value={selectedRole?.id || ""}
              onChange={(e) => setSelectedRole(roles.find(r => r.id === e.target.value) || null)}
              className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
            >
              <option value="">All Roles</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase sticky left-0 bg-slate-800">Module</th>
                  {(selectedRole ? [selectedRole] : roles).map(role => (
                    <th key={role.id} colSpan={5} className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase border-l border-slate-700">
                      {role.name}
                      {role.isSystem && <span className="ml-1 text-blue-400">(System)</span>}
                    </th>
                  ))}
                </tr>
                <tr className="bg-slate-800/50">
                  <th className="px-4 py-2 text-left text-xs text-slate-500 sticky left-0 bg-slate-800/50"></th>
                  {(selectedRole ? [selectedRole] : roles).map(role => (
                    <React.Fragment key={role.id}>
                      <th className="px-2 py-2 text-center text-xs text-slate-500 border-l border-slate-700">View</th>
                      <th className="px-2 py-2 text-center text-xs text-slate-500">Create</th>
                      <th className="px-2 py-2 text-center text-xs text-slate-500">Edit</th>
                      <th className="px-2 py-2 text-center text-xs text-slate-500">Delete</th>
                      <th className="px-2 py-2 text-center text-xs text-slate-500">Export</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {modules.map((module, moduleIndex) => (
                  <tr key={module} className="hover:bg-slate-700/30">
                    <td className="px-4 py-3 text-white font-medium sticky left-0 bg-slate-800/90">{module}</td>
                    {(selectedRole ? [selectedRole] : roles).map(role => {
                      const perm = role.permissions[moduleIndex];
                      return (
                        <React.Fragment key={role.id}>
                          <td className="px-2 py-3 text-center border-l border-slate-700">
                            <PermissionCell checked={perm.view} onClick={() => togglePermission(role.id, moduleIndex, 'view')} disabled={role.isSystem} />
                          </td>
                          <td className="px-2 py-3 text-center">
                            <PermissionCell checked={perm.create} onClick={() => togglePermission(role.id, moduleIndex, 'create')} disabled={role.isSystem} />
                          </td>
                          <td className="px-2 py-3 text-center">
                            <PermissionCell checked={perm.edit} onClick={() => togglePermission(role.id, moduleIndex, 'edit')} disabled={role.isSystem} />
                          </td>
                          <td className="px-2 py-3 text-center">
                            <PermissionCell checked={perm.delete} onClick={() => togglePermission(role.id, moduleIndex, 'delete')} disabled={role.isSystem} />
                          </td>
                          <td className="px-2 py-3 text-center">
                            <PermissionCell checked={perm.export} onClick={() => togglePermission(role.id, moduleIndex, 'export')} disabled={role.isSystem} />
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-500/20 rounded flex items-center justify-center"><Check className="w-4 h-4 text-green-400" /></div>
              <span>Allowed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-700 rounded flex items-center justify-center"><Minus className="w-4 h-4 text-slate-500" /></div>
              <span>Denied</span>
            </div>
            <span className="text-slate-500">• Click to toggle (System roles are read-only)</span>
          </div>
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
                  <input type="email" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="john.d@truecare.health" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    {roles.map(r => <option key={r.id}>{r.name}</option>)}
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
                  <input type="checkbox" id="sendInvite" defaultChecked className="rounded border-slate-500 bg-slate-600 text-cyan-600" />
                  <label htmlFor="sendInvite" className="text-sm text-slate-300">Send invitation email</label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="requireMFA" className="rounded border-slate-500 bg-slate-600 text-cyan-600" />
                  <label htmlFor="requireMFA" className="text-sm text-slate-300">Require MFA setup</label>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Add User</button>
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
                    {roles.map(r => <option key={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                  <select defaultValue={selectedUser.status} className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="pt-2 border-t border-slate-700 space-y-2">
                  <button className="flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm"><Key className="w-4 h-4" />Reset Password</button>
                  <button className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 text-sm"><Shield className="w-4 h-4" />Reset MFA</button>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Save Changes</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit Role Modal */}
      <AnimatePresence>
        {showEditRoleModal && selectedRole && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditRoleModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Edit Role</h2>
                <button onClick={() => setShowEditRoleModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                {selectedRole.isSystem && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-400">
                    This is a system role. Name and description can be edited, but permissions are locked.
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Role Name</label>
                  <input 
                    type="text" 
                    value={selectedRole.name}
                    onChange={(e) => setSelectedRole({...selectedRole, name: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea 
                    value={selectedRole.description}
                    onChange={(e) => setSelectedRole({...selectedRole, description: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20 resize-none" 
                  />
                </div>
                <div className="pt-2 border-t border-slate-700">
                  <button 
                    onClick={() => { setShowEditRoleModal(false); setActiveTab("permissions"); }}
                    className="flex items-center gap-2 text-cyan-500 hover:text-cyan-400 text-sm"
                  >
                    <Shield className="w-4 h-4" />Edit Permissions in Matrix →
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border-t border-slate-700">
                {!selectedRole.isSystem && (
                  <button className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 flex items-center gap-1">
                    <Trash2 className="w-4 h-4" />Delete
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button onClick={() => setShowEditRoleModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                  <button 
                    onClick={() => {
                      setRoles(roles.map(r => r.id === selectedRole.id ? selectedRole : r));
                      setShowEditRoleModal(false);
                    }} 
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Role Modal */}
      <AnimatePresence>
        {showAddRoleModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddRoleModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Add New Role</h2>
                <button onClick={() => setShowAddRoleModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Role Name</label>
                  <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="e.g., Billing Specialist" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                  <textarea className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white h-20 resize-none" placeholder="What can this role do?" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Copy Permissions From</label>
                  <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                    <option value="">Start with no permissions</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700">
                <button onClick={() => setShowAddRoleModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                <button onClick={() => setShowAddRoleModal(false)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Create Role</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
