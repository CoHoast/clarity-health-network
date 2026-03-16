"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Plus, Download, MoreVertical, UserCheck, UserX, Clock, 
  Eye, X, Mail, Phone, Building2, Calendar, Shield, Check, Edit,
  User, Users, FileText, Trash2, Send
} from "lucide-react";
import Link from "next/link";

const employees = [
  { id: "E001", name: "John Smith", email: "john.smith@acme.com", phone: "(555) 123-4567", department: "Engineering", plan: "Gold PPO", status: "active", enrolled: "2024-01-15", dependents: 2, dob: "1985-06-15", ssn: "***-**-4521", address: "123 Main St, San Francisco, CA 94102" },
  { id: "E002", name: "Sarah Johnson", email: "sarah.j@acme.com", phone: "(555) 234-5678", department: "Marketing", plan: "Silver PPO", status: "active", enrolled: "2024-02-01", dependents: 1, dob: "1990-03-22", ssn: "***-**-8742", address: "456 Oak Ave, San Francisco, CA 94103" },
  { id: "E003", name: "Michael Chen", email: "m.chen@acme.com", phone: "(555) 345-6789", department: "Sales", plan: "Gold PPO", status: "active", enrolled: "2023-06-10", dependents: 3, dob: "1982-11-08", ssn: "***-**-3156", address: "789 Pine Rd, Oakland, CA 94601" },
  { id: "E004", name: "Emily Rodriguez", email: "e.rodriguez@acme.com", phone: "(555) 456-7890", department: "HR", plan: "Platinum PPO", status: "active", enrolled: "2022-03-20", dependents: 0, dob: "1988-07-30", ssn: "***-**-9234", address: "321 Elm St, Berkeley, CA 94702" },
  { id: "E005", name: "David Kim", email: "d.kim@acme.com", phone: "(555) 567-8901", department: "Engineering", plan: "Gold PPO", status: "pending", enrolled: "2024-03-10", dependents: 2, dob: "1992-01-14", ssn: "***-**-5678", address: "654 Maple Dr, San Jose, CA 95101" },
  { id: "E006", name: "Lisa Martinez", email: "l.martinez@acme.com", phone: "(555) 678-9012", department: "Finance", plan: "Silver PPO", status: "active", enrolled: "2023-09-15", dependents: 1, dob: "1986-09-05", ssn: "***-**-2345", address: "987 Cedar Ln, Palo Alto, CA 94301" },
  { id: "E007", name: "Robert Williams", email: "r.williams@acme.com", phone: "(555) 789-0123", department: "Operations", plan: "Gold PPO", status: "cobra", enrolled: "2021-05-01", dependents: 4, dob: "1979-04-18", ssn: "***-**-7890", address: "147 Birch Blvd, Mountain View, CA 94040" },
  { id: "E008", name: "Jennifer Lee", email: "j.lee@acme.com", phone: "(555) 890-1234", department: "Sales", plan: "Silver PPO", status: "termed", enrolled: "2022-08-12", dependents: 0, dob: "1994-12-25", ssn: "***-**-4567", address: "258 Walnut Way, Sunnyvale, CA 94085" },
  { id: "E009", name: "James Wilson", email: "j.wilson@acme.com", phone: "(555) 901-2345", department: "Engineering", plan: "Gold PPO", status: "active", enrolled: "2023-04-01", dependents: 2, dob: "1987-08-12", ssn: "***-**-6789", address: "369 Spruce Ave, Fremont, CA 94536" },
  { id: "E010", name: "Amanda Taylor", email: "a.taylor@acme.com", phone: "(555) 012-3456", department: "Marketing", plan: "Silver PPO", status: "active", enrolled: "2023-07-15", dependents: 0, dob: "1991-05-28", ssn: "***-**-1234", address: "741 Redwood Dr, San Mateo, CA 94401" },
  { id: "E011", name: "Christopher Brown", email: "c.brown@acme.com", phone: "(555) 111-2222", department: "Finance", plan: "Gold PPO", status: "active", enrolled: "2022-11-01", dependents: 3, dob: "1983-02-14", ssn: "***-**-5432", address: "852 Ash St, Daly City, CA 94015" },
  { id: "E012", name: "Michelle Davis", email: "m.davis@acme.com", phone: "(555) 222-3333", department: "Operations", plan: "Platinum PPO", status: "active", enrolled: "2021-08-20", dependents: 1, dob: "1989-11-03", ssn: "***-**-8765", address: "963 Willow Ln, Hayward, CA 94541" },
  { id: "E013", name: "Daniel Garcia", email: "d.garcia@acme.com", phone: "(555) 333-4444", department: "Sales", plan: "Gold PPO", status: "active", enrolled: "2024-01-02", dependents: 2, dob: "1986-07-19", ssn: "***-**-2109", address: "159 Oak Park Rd, Cupertino, CA 95014" },
  { id: "E014", name: "Jessica Miller", email: "j.miller@acme.com", phone: "(555) 444-5555", department: "HR", plan: "Silver PPO", status: "pending", enrolled: "2024-03-15", dependents: 0, dob: "1993-04-07", ssn: "***-**-6543", address: "267 Cherry Blvd, Santa Clara, CA 95050" },
  { id: "E015", name: "Andrew Thompson", email: "a.thompson@acme.com", phone: "(555) 555-6666", department: "Engineering", plan: "Gold PPO", status: "active", enrolled: "2022-06-10", dependents: 4, dob: "1981-09-22", ssn: "***-**-9876", address: "378 Sequoia Way, Menlo Park, CA 94025" },
  { id: "E016", name: "Stephanie Moore", email: "s.moore@acme.com", phone: "(555) 666-7777", department: "Marketing", plan: "Platinum PPO", status: "active", enrolled: "2023-02-28", dependents: 1, dob: "1988-12-30", ssn: "***-**-3210", address: "489 Cypress Ct, Redwood City, CA 94061" },
  { id: "E017", name: "Kevin Anderson", email: "k.anderson@acme.com", phone: "(555) 777-8888", department: "Finance", plan: "Gold PPO", status: "cobra", enrolled: "2020-09-15", dependents: 2, dob: "1980-06-11", ssn: "***-**-7654", address: "591 Magnolia Dr, Foster City, CA 94404" },
  { id: "E018", name: "Rachel White", email: "r.white@acme.com", phone: "(555) 888-9999", department: "Operations", plan: "Silver PPO", status: "active", enrolled: "2023-10-01", dependents: 0, dob: "1995-01-25", ssn: "***-**-0987", address: "602 Laurel Ave, Burlingame, CA 94010" },
  { id: "E019", name: "Brandon Harris", email: "b.harris@acme.com", phone: "(555) 999-0000", department: "Sales", plan: "Gold PPO", status: "active", enrolled: "2022-04-18", dependents: 3, dob: "1984-10-08", ssn: "***-**-4321", address: "713 Sycamore Rd, San Bruno, CA 94066" },
  { id: "E020", name: "Nicole Clark", email: "n.clark@acme.com", phone: "(555) 000-1111", department: "Engineering", plan: "Platinum PPO", status: "active", enrolled: "2021-12-01", dependents: 1, dob: "1990-08-17", ssn: "***-**-8901", address: "824 Poplar St, Millbrae, CA 94030" },
  { id: "E021", name: "Ryan Lewis", email: "r.lewis@acme.com", phone: "(555) 121-3434", department: "HR", plan: "Gold PPO", status: "termed", enrolled: "2021-03-15", dependents: 2, dob: "1982-03-09", ssn: "***-**-2345", address: "935 Juniper Way, Pacifica, CA 94044" },
  { id: "E022", name: "Lauren Walker", email: "l.walker@acme.com", phone: "(555) 232-4545", department: "Marketing", plan: "Silver PPO", status: "active", enrolled: "2024-02-14", dependents: 0, dob: "1996-11-21", ssn: "***-**-6789", address: "146 Fir Ct, South San Francisco, CA 94080" },
];

const statusOptions = ["All", "Active", "Pending", "COBRA", "Termed"];

export default function RosterPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employees[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDependentsModal, setShowDependentsModal] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const [editSaved, setEditSaved] = useState(false);
  const [dependentsSaved, setDependentsSaved] = useState(false);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || emp.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full"><UserCheck className="w-3 h-3" />Active</span>;
      case "termed": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full"><UserX className="w-3 h-3" />Termed</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      case "cobra": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">COBRA</span>;
      default: return null;
    }
  };

  const handleViewEmployee = (emp: typeof employees[0]) => {
    setSelectedEmployee(emp);
    setShowDetailModal(true);
  };

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => {
      setShowExportModal(false);
      setExportSuccess(false);
    }, 2000);
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => {
      setShowEmailModal(false);
      setEmailSent(false);
    }, 2000);
  };

  const handleTerminate = () => {
    setTerminated(true);
    setTimeout(() => {
      setShowTerminateModal(false);
      setTerminated(false);
      setSelectedEmployee(null);
    }, 2000);
  };

  const handleSaveEdit = () => {
    setEditSaved(true);
    setTimeout(() => {
      setShowEditModal(false);
      setEditSaved(false);
    }, 2000);
  };

  const handleSaveDependents = () => {
    setDependentsSaved(true);
    setTimeout(() => {
      setShowDependentsModal(false);
      setDependentsSaved(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Roster</h1>
          <p className="text-gray-500">Manage enrolled employees and dependents</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <Link href="/employer/roster/add" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium">
            <Plus className="w-4 h-4" />
            Add Employee
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button onClick={() => setStatusFilter("Active")} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-teal-300 transition-colors text-left">
          <p className="text-2xl font-bold text-gray-900">847</p>
          <p className="text-sm text-gray-500">Active Employees</p>
        </button>
        <button onClick={() => setStatusFilter("Pending")} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-teal-300 transition-colors text-left">
          <p className="text-2xl font-bold text-teal-600">12</p>
          <p className="text-sm text-gray-500">Pending Enrollment</p>
        </button>
        <button onClick={() => setStatusFilter("COBRA")} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:border-teal-300 transition-colors text-left">
          <p className="text-2xl font-bold text-purple-600">8</p>
          <p className="text-sm text-gray-500">COBRA</p>
        </button>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-900">1,423</p>
          <p className="text-sm text-gray-500">Total Lives</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status ? "bg-teal-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" className="rounded border-gray-300" /></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Department</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Plan</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Dependents</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Enrolled</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" className="rounded border-gray-300" /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleViewEmployee(emp)} className="text-left hover:text-cyan-600">
                      <p className="font-medium text-gray-900 hover:text-cyan-600">{emp.name}</p>
                      <p className="text-xs text-gray-500">{emp.email}</p>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{emp.department}</td>
                  <td className="px-4 py-3 text-gray-700">{emp.plan}</td>
                  <td className="px-4 py-3 text-center text-gray-700">{emp.dependents}</td>
                  <td className="px-4 py-3">{getStatusBadge(emp.status)}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{emp.enrolled}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 relative">
                      <button 
                        onClick={() => handleViewEmployee(emp)}
                        className="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-teal-50 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setShowActionMenu(showActionMenu === emp.id ? null : emp.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {/* Action dropdown */}
                      <AnimatePresence>
                        {showActionMenu === emp.id && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 w-48"
                          >
                            <button 
                              onClick={() => { handleViewEmployee(emp); setShowActionMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" /> View Details
                            </button>
                            <button 
                              onClick={() => { setSelectedEmployee(emp); setShowEmailModal(true); setShowActionMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Mail className="w-4 h-4" /> Send Email
                            </button>
                            <button 
                              onClick={() => { setSelectedEmployee(emp); setShowEditModal(true); setShowActionMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="w-4 h-4" /> Edit Employee
                            </button>
                            <button 
                              onClick={() => { setSelectedEmployee(emp); setShowDependentsModal(true); setShowActionMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Users className="w-4 h-4" /> Manage Dependents
                            </button>
                            <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                              <FileText className="w-4 h-4" /> View ID Card
                            </button>
                            <hr className="my-1 border-gray-100" />
                            {emp.status === "active" && (
                              <button 
                                onClick={() => { setSelectedEmployee(emp); setShowTerminateModal(true); setShowActionMenu(null); }}
                                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" /> Terminate
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
          <p className="text-sm text-gray-500">Showing {filteredEmployees.length} of {employees.length} employees</p>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50 text-sm">Previous</button>
            <button className="px-3 py-1.5 bg-white text-gray-700 rounded border border-gray-300 hover:bg-gray-50 text-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Employee Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{selectedEmployee.name.split(' ').map(n => n[0]).join('')}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h3>
                    <p className="text-sm text-gray-500">{selectedEmployee.id} • {selectedEmployee.department}</p>
                  </div>
                </div>
                <button onClick={() => setShowDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Status & Plan */}
                <div className="flex items-center gap-4">
                  {getStatusBadge(selectedEmployee.status)}
                  <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                    {selectedEmployee.plan}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4" /> Contact Information
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{selectedEmployee.phone}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-gray-400 mt-0.5" />
                    <span className="text-sm text-gray-700">{selectedEmployee.address}</span>
                  </div>
                </div>

                {/* Employment Details */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Coverage Details
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Enrollment Date</span>
                      <p className="text-gray-900 font-medium">{selectedEmployee.enrolled}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date of Birth</span>
                      <p className="text-gray-900 font-medium">{selectedEmployee.dob}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">SSN (Masked)</span>
                      <p className="text-gray-900 font-medium">{selectedEmployee.ssn}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Dependents</span>
                      <p className="text-gray-900 font-medium">{selectedEmployee.dependents} enrolled</p>
                    </div>
                  </div>
                </div>

                {/* Dependents Preview */}
                {selectedEmployee.dependents > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4" /> Dependents ({selectedEmployee.dependents})
                    </h4>
                    <div className="space-y-2">
                      {[...Array(selectedEmployee.dependents)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-white rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {i === 0 ? "Spouse" : `Child ${i}`}
                              </p>
                              <p className="text-xs text-gray-500">Covered under {selectedEmployee.plan}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
                <button 
                  onClick={() => { setShowEmailModal(true); setShowDetailModal(false); }}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
                <button className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button 
                  onClick={() => window.open('/docs/id-card', '_blank')}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                >
                  View ID Card
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              {exportSuccess ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Export Complete!</h3>
                  <p className="text-gray-500">Your roster has been downloaded.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Export Roster</h3>
                    <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500">
                        <option>All Employees</option>
                        <option>Active Only</option>
                        <option>Pending Only</option>
                        <option>COBRA Only</option>
                        <option>Terminated Only</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Include</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded text-cyan-600 focus:ring-cyan-500" />
                          <span className="text-sm text-gray-700">Employee Information</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="rounded text-cyan-600 focus:ring-cyan-500" />
                          <span className="text-sm text-gray-700">Dependent Information</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-cyan-600 focus:ring-cyan-500" />
                          <span className="text-sm text-gray-700">SSN (Full)</span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="format" value="excel" defaultChecked className="text-cyan-600 focus:ring-cyan-500" />
                          <span className="text-sm text-gray-700">Excel</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="format" value="csv" className="text-cyan-600 focus:ring-cyan-500" />
                          <span className="text-sm text-gray-700">CSV</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="format" value="pdf" className="text-cyan-600 focus:ring-cyan-500" />
                          <span className="text-sm text-gray-700">PDF</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowExportModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleExport}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Send Email Modal */}
      <AnimatePresence>
        {showEmailModal && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              {emailSent ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Sent!</h3>
                  <p className="text-gray-500">Message delivered to {selectedEmployee.email}</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Send Email</h3>
                    <button onClick={() => setShowEmailModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-cyan-600 font-medium">{selectedEmployee.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedEmployee.name}</p>
                        <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Template</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500">
                        <option>Custom Message</option>
                        <option>Welcome to Benefits</option>
                        <option>Enrollment Reminder</option>
                        <option>Open Enrollment Notice</option>
                        <option>ID Card Request</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <input 
                        type="text" 
                        placeholder="Enter subject..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                      <textarea 
                        rows={4}
                        placeholder="Enter your message..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowEmailModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSendEmail}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Email
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminate Modal */}
      <AnimatePresence>
        {showTerminateModal && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowTerminateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              {terminated ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Termination Processed</h3>
                  <p className="text-gray-500">COBRA notice will be sent automatically.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Terminate Employee</h3>
                    <button onClick={() => setShowTerminateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-800">
                        You are about to terminate coverage for <strong>{selectedEmployee.name}</strong> and {selectedEmployee.dependents} dependent(s).
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Termination Date</label>
                      <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500">
                        <option>Voluntary Resignation</option>
                        <option>Involuntary Termination</option>
                        <option>Retirement</option>
                        <option>Reduction in Hours</option>
                        <option>Leave of Absence</option>
                      </select>
                    </div>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-cyan-600 focus:ring-cyan-500" />
                      <span className="text-sm text-gray-700">Send COBRA notice automatically</span>
                    </label>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowTerminateModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleTerminate}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                    >
                      Confirm Termination
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Employee Modal */}
      <AnimatePresence>
        {showEditModal && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {editSaved ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Changes Saved!</h3>
                  <p className="text-gray-500">Employee information has been updated.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Edit Employee</h3>
                    <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input 
                          type="text" 
                          defaultValue={selectedEmployee.name.split(' ')[0]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input 
                          type="text" 
                          defaultValue={selectedEmployee.name.split(' ')[1]}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" 
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input 
                        type="email" 
                        defaultValue={selectedEmployee.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input 
                        type="tel" 
                        defaultValue={selectedEmployee.phone}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <select 
                        defaultValue={selectedEmployee.department}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500"
                      >
                        <option>Engineering</option>
                        <option>Marketing</option>
                        <option>Sales</option>
                        <option>HR</option>
                        <option>Finance</option>
                        <option>Operations</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                      <select 
                        defaultValue={selectedEmployee.plan}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500"
                      >
                        <option>Platinum PPO</option>
                        <option>Gold PPO</option>
                        <option>Silver PPO</option>
                        <option>Bronze PPO</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input 
                        type="text" 
                        defaultValue={selectedEmployee.address}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" 
                      />
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveEdit}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage Dependents Modal */}
      <AnimatePresence>
        {showDependentsModal && selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDependentsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {dependentsSaved ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Dependents Updated!</h3>
                  <p className="text-gray-500">Dependent information has been saved.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Manage Dependents</h3>
                      <p className="text-sm text-gray-500">{selectedEmployee.name}</p>
                    </div>
                    <button onClick={() => setShowDependentsModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    {/* Current Dependents */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Current Dependents ({selectedEmployee.dependents})</h4>
                      {selectedEmployee.dependents > 0 ? (
                        [...Array(selectedEmployee.dependents)].map((_, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-cyan-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {i === 0 ? `${selectedEmployee.name.split(' ')[1]} (Spouse)` : `Child ${i}`}
                                </p>
                                <p className="text-xs text-gray-500">{i === 0 ? 'Spouse' : 'Child'} • {selectedEmployee.plan}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 text-gray-400 hover:text-cyan-600 hover:bg-teal-50 rounded">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 italic">No dependents enrolled</p>
                      )}
                    </div>

                    {/* Add New Dependent */}
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Add New Dependent</h4>
                      <div className="space-y-3">
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input 
                              type="text" 
                              placeholder="First name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" 
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input 
                              type="text" 
                              placeholder="Last name"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" 
                            />
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500">
                              <option>Spouse</option>
                              <option>Domestic Partner</option>
                              <option>Child</option>
                              <option>Disabled Adult Child</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                            <input 
                              type="date" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">SSN</label>
                          <input 
                            type="text" 
                            placeholder="XXX-XX-XXXX"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-teal-500" 
                          />
                        </div>
                        <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-teal-500 hover:text-cyan-600 font-medium flex items-center justify-center gap-2">
                          <Plus className="w-4 h-4" />
                          Add Dependent
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowDependentsModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveDependents}
                      className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                    >
                      Save Changes
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
