"use client";

import React, { useState, useEffect } from "react";
import { Search, UserPlus, Shield, Mail, Edit, Trash2, X, CheckCircle, Clock, XCircle, Key, Check, Users as UsersIcon, Eye, Loader2, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { Button, IconButton } from "@/components/admin/ui/Button";
import { PageHeader, PillTabs } from "@/components/admin/ui/PageHeader";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { Badge, StatusBadge } from "@/components/admin/ui/Badge";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  mfaEnabled: boolean;
  active: boolean;
}

const ROLES = [
  { value: 'super_admin', label: 'Super Admin', description: 'Full system access including user management' },
  { value: 'admin', label: 'Admin', description: 'Full access except user management' },
  { value: 'manager', label: 'Manager', description: 'Team-level access' },
  { value: 'staff', label: 'Staff', description: 'Standard read/write access' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access' },
];

export default function UsersPage() {
  const { isDark } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff',
  });
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Users", value: users.length, icon: <UsersIcon className="w-5 h-5" /> },
    { label: "Active", value: users.filter(u => u.active).length, icon: <CheckCircle className="w-5 h-5" /> },
    { label: "MFA Enabled", value: users.filter(u => u.mfaEnabled).length, icon: <Shield className="w-5 h-5" /> },
    { label: "Inactive", value: users.filter(u => !u.active).length, icon: <XCircle className="w-5 h-5" /> },
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'staff',
    });
    setFormErrors([]);
    setError(null);
  };

  const handleAddUser = async () => {
    setFormErrors([]);
    setError(null);
    
    // Validation
    const errors: string[] = [];
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!formData.email.includes('@')) errors.push('Invalid email format');
    if (!formData.password) errors.push('Password is required');
    if (formData.password.length < 12) errors.push('Password must be at least 12 characters');
    if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match');
    
    if (errors.length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || 'Failed to create user');
        if (data.errors) setFormErrors(data.errors);
        return;
      }
      
      // Success
      setShowAddModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      setError('Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivateUser = async (user: User) => {
    if (!confirm(`Are you sure you want to deactivate ${user.name}?`)) return;
    
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to deactivate user:', err);
    }
  };

  const handleReactivateUser = async (user: User) => {
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: true }),
      });
      
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to reactivate user:', err);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      admin: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      manager: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
      staff: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      viewer: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return colors[role] || colors.viewer;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team & Permissions"
        subtitle="Manage user access and roles"
        actions={
          <Button variant="primary" icon={<UserPlus className="w-4 h-4" />} onClick={() => setShowAddModal(true)}>
            Add User
          </Button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                isDark ? "bg-slate-700" : "bg-slate-100"
              )}>
                {stat.icon}
              </div>
              <div>
                <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                  {stat.value}
                </p>
                <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                  {stat.label}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search users by name, email, or role..."
          className="flex-1"
        />
      </div>

      {/* Users Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-500" />
            <p className={isDark ? "text-slate-400" : "text-slate-500"}>Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center">
            <UsersIcon className={cn("w-12 h-12 mx-auto mb-3", isDark ? "text-slate-600" : "text-slate-300")} />
            <p className={cn("font-medium", isDark ? "text-slate-300" : "text-slate-700")}>
              {users.length === 0 ? 'No users yet' : 'No users found'}
            </p>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-500" : "text-slate-500")}>
              {users.length === 0 ? 'Add your first team member' : 'Try adjusting your search'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={cn("border-b", isDark ? "border-slate-700" : "border-slate-200")}>
                <tr>
                  <th className={cn("text-left p-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>User</th>
                  <th className={cn("text-left p-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Role</th>
                  <th className={cn("text-left p-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Status</th>
                  <th className={cn("text-left p-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>MFA</th>
                  <th className={cn("text-left p-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Last Login</th>
                  <th className={cn("text-right p-4 font-medium", isDark ? "text-slate-400" : "text-slate-500")}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={cn("border-b", isDark ? "border-slate-700/50" : "border-slate-100")}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center font-medium",
                          isDark ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-700"
                        )}>
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                          <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>{user.name}</p>
                          <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getRoleBadge(user.role))}>
                        {ROLES.find(r => r.value === user.role)?.label || user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {user.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="error">Inactive</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      {user.mfaEnabled ? (
                        <Shield className="w-5 h-5 text-green-500" />
                      ) : (
                        <span className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-400")}>—</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.active ? (
                          <IconButton
                            icon={<Trash2 className="w-4 h-4" />}
                            onClick={() => handleDeactivateUser(user)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          />
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleReactivateUser(user)}
                          >
                            Reactivate
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => { setShowAddModal(false); resetForm(); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn("w-full max-w-md rounded-xl p-6", isDark ? "bg-slate-800" : "bg-white")}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={cn("text-xl font-semibold", isDark ? "text-white" : "text-slate-900")}>
                  Add New User
                </h2>
                <IconButton icon={<X className="w-5 h-5" />} onClick={() => { setShowAddModal(false); resetForm(); }} />
              </div>

              {(error || formErrors.length > 0) && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Error</span>
                  </div>
                  <ul className="mt-1 text-sm text-red-600 dark:text-red-400 list-disc list-inside">
                    {error && <li>{error}</li>}
                    {formErrors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Allie Smith"
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  />
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="allie@solidarity.com"
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  />
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  >
                    {ROLES.map(role => (
                      <option key={role.value} value={role.value}>{role.label}</option>
                    ))}
                  </select>
                  <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                    {ROLES.find(r => r.value === formData.role)?.description}
                  </p>
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Min 12 chars, upper/lower/number/special"
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  />
                </div>

                <div>
                  <label className={cn("block text-sm font-medium mb-1", isDark ? "text-slate-300" : "text-slate-700")}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Re-enter password"
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border text-sm",
                      isDark ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="secondary" className="flex-1" onClick={() => { setShowAddModal(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  onClick={handleAddUser}
                  disabled={saving}
                >
                  {saving ? 'Creating...' : 'Add User'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
