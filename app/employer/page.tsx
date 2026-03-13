"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, DollarSign, FileText, TrendingUp, AlertTriangle, Calendar, 
  ArrowUpRight, ArrowDownRight, X, Check, Download, Mail, Clock,
  Building2, User, Phone, CreditCard, ExternalLink, Zap
} from "lucide-react";

const stats = [
  { label: "Enrolled Members", value: "847", change: "+12", trend: "up", icon: Users, detail: "enrolled" },
  { label: "Claims MTD", value: "234", change: "+8%", trend: "up", icon: FileText, detail: "claims" },
  { label: "MTD Spend", value: "$125,430", change: "-3%", trend: "down", icon: DollarSign, detail: "spend" },
  { label: "YTD Spend", value: "$1.24M", change: "+2%", trend: "up", icon: TrendingUp, detail: "ytd" },
];

const alerts = [
  { id: 1, type: "warning", message: "Open enrollment ends in 14 days", action: "View Details", actionType: "enrollment" },
  { id: 2, type: "warning", message: "Invoice #4521 due in 7 days ($142,850)", action: "Pay Now", actionType: "invoice" },
  { id: 3, type: "info", message: "3 new employees pending enrollment", action: "Review", actionType: "pending" },
  { id: 4, type: "info", message: "Monthly utilization report ready", action: "Download", actionType: "report" },
];

const recentActivity = [
  { id: 1, action: "John Smith enrolled", date: "Today, 2:30 PM", type: "enrollment", employeeId: "E-10842" },
  { id: 2, action: "Claim $2,340 processed", date: "Today, 11:15 AM", type: "claim", claimId: "CLM-89234" },
  { id: 3, action: "Invoice #4520 paid", date: "Yesterday", type: "payment", invoiceId: "INV-4520" },
  { id: 4, action: "Sarah Johnson - dependent added", date: "Mar 10", type: "update", employeeId: "E-10156" },
  { id: 5, action: "Claim $890 approved", date: "Mar 9", type: "claim", claimId: "CLM-89201" },
];

const upcomingEvents = [
  { id: 1, event: "Benefits Committee Meeting", date: "Mar 18, 2026", time: "2:00 PM", location: "Conference Room A", attendees: ["Sarah J.", "Mike T.", "Lisa R."] },
  { id: 2, event: "Open Enrollment Begins", date: "Nov 1, 2026", time: "12:00 AM", location: "Online Portal", attendees: [] },
  { id: 3, event: "Quarterly Review", date: "Apr 1, 2026", time: "10:00 AM", location: "Executive Boardroom", attendees: ["Leadership Team"] },
];

const pendingEmployees = [
  { id: "E-10843", name: "Michael Chen", email: "m.chen@acme.com", department: "Engineering", startDate: "Mar 20, 2026" },
  { id: "E-10844", name: "Emily Rodriguez", email: "e.rodriguez@acme.com", department: "Marketing", startDate: "Mar 22, 2026" },
  { id: "E-10845", name: "David Kim", email: "d.kim@acme.com", department: "Sales", startDate: "Mar 25, 2026" },
];

export default function EmployerDashboard() {
  const router = useRouter();
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showDownloadReport, setShowDownloadReport] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState<number | null>(null);
  const [showActivityModal, setShowActivityModal] = useState<number | null>(null);
  const [showStatModal, setShowStatModal] = useState<string | null>(null);
  const [reportDownloaded, setReportDownloaded] = useState(false);
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  const handleAlertAction = (actionType: string) => {
    switch (actionType) {
      case "enrollment":
        setShowEnrollmentModal(true);
        break;
      case "invoice":
        setShowInvoiceModal(true);
        break;
      case "pending":
        setShowPendingModal(true);
        break;
      case "report":
        setShowDownloadReport(true);
        break;
    }
  };

  const handleDownloadReport = () => {
    setReportDownloaded(true);
    setTimeout(() => {
      setShowDownloadReport(false);
      setReportDownloaded(false);
    }, 2000);
  };

  const handlePayInvoice = () => {
    setInvoicePaid(true);
    setTimeout(() => {
      setShowInvoiceModal(false);
      setInvoicePaid(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
          <p className="text-gray-500">Welcome back, Sarah. Here's your benefits overview.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowDownloadReport(true)}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300 font-medium flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
          <button 
            onClick={() => setShowAddEmployee(true)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
          >
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <button 
            key={stat.label} 
            onClick={() => setShowStatModal(stat.detail)}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm text-left hover:border-orange-300 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-orange-600" />
              </div>
              <span className={`flex items-center text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Alerts & Action Items</h2>
          </div>
          <div className="p-4 space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-center justify-between p-3 rounded-lg ${alert.type === "warning" ? "bg-amber-50" : "bg-blue-50"}`}>
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`w-5 h-5 ${alert.type === "warning" ? "text-amber-500" : "text-blue-500"}`} />
                  <span className="text-sm text-gray-700">{alert.message}</span>
                </div>
                <button 
                  onClick={() => handleAlertAction(alert.actionType)}
                  className={`text-sm font-medium ${alert.type === "warning" ? "text-amber-600 hover:text-amber-700" : "text-blue-600 hover:text-blue-700"}`}
                >
                  {alert.action}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Upcoming Events</h2>
          </div>
          <div className="p-4 space-y-4">
            {upcomingEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => setShowEventModal(event.id)}
                className="flex items-start gap-3 w-full text-left hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
              >
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{event.event}</p>
                  <p className="text-xs text-gray-500">{event.date} • {event.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Claims by Category & Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Claims by Category */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Claims by Category (MTD)</h2>
            <button 
              onClick={() => router.push('/employer/analytics')}
              className="text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="p-4 space-y-4">
            {[
              { category: "Medical", amount: "$87,450", percentage: 70, color: "from-orange-500 to-amber-500" },
              { category: "Pharmacy", amount: "$24,830", percentage: 20, color: "from-blue-500 to-cyan-500" },
              { category: "Dental", amount: "$8,150", percentage: 6, color: "from-emerald-500 to-green-500" },
              { category: "Vision", amount: "$5,000", percentage: 4, color: "from-purple-500 to-pink-500" },
            ].map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  <span className="text-sm text-gray-500">{item.amount}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((item) => (
              <button
                key={item.id}
                onClick={() => setShowActivityModal(item.id)}
                className="flex items-center justify-between p-4 w-full text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    item.type === "enrollment" ? "bg-green-500" :
                    item.type === "claim" ? "bg-blue-500" :
                    item.type === "payment" ? "bg-amber-500" : "bg-gray-400"
                  }`} />
                  <span className="text-sm text-gray-700">{item.action}</span>
                </div>
                <span className="text-xs text-gray-500">{item.date}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: "Add Employee", onClick: () => setShowAddEmployee(true) },
            { label: "View Invoices", href: "/employer/billing" },
            { label: "Run Report", onClick: () => setShowDownloadReport(true) },
            { label: "Contact Support", href: "/employer/support" },
            { label: "Ask Pulse AI", onClick: () => setShowPulse(true), pulse: true },
          ].map((action) => (
            action.href ? (
              <a
                key={action.label}
                href={action.href}
                className="px-4 py-3 bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700 rounded-lg text-sm font-medium text-center transition-colors"
              >
                {action.label}
              </a>
            ) : (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors ${
                  action.pulse 
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                    : "bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-700"
                }`}
              >
                {action.pulse && <Zap className="w-4 h-4 inline mr-1" />}
                {action.label}
              </button>
            )
          ))}
        </div>
      </div>

      {/* Add Employee Modal */}
      <AnimatePresence>
        {showAddEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddEmployee(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add New Employee</h3>
                <button onClick={() => setShowAddEmployee(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option>Engineering</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>Operations</option>
                    <option>HR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Tier</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option>Employee Only</option>
                    <option>Employee + Spouse</option>
                    <option>Employee + Children</option>
                    <option>Family</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button 
                  onClick={() => setShowAddEmployee(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => router.push('/employer/roster/add')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                >
                  Continue to Full Form
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Report Modal */}
      <AnimatePresence>
        {showDownloadReport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowDownloadReport(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              {reportDownloaded ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Report Downloaded!</h3>
                  <p className="text-gray-500">Your report has been saved to Downloads.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Download Report</h3>
                    <button onClick={() => setShowDownloadReport(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                        <option>Monthly Utilization Summary</option>
                        <option>Claims Detail Report</option>
                        <option>Employee Census</option>
                        <option>Cost Analysis</option>
                        <option>Stop-Loss Report</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input type="date" defaultValue="2026-02-01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input type="date" defaultValue="2026-02-28" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="format" value="pdf" defaultChecked className="text-orange-600 focus:ring-orange-500" />
                          <span className="text-sm text-gray-700">PDF</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="format" value="excel" className="text-orange-600 focus:ring-orange-500" />
                          <span className="text-sm text-gray-700">Excel</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="format" value="csv" className="text-orange-600 focus:ring-orange-500" />
                          <span className="text-sm text-gray-700">CSV</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowDownloadReport(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleDownloadReport}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Open Enrollment Modal */}
      <AnimatePresence>
        {showEnrollmentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEnrollmentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Open Enrollment Status</h3>
                <button onClick={() => setShowEnrollmentModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-amber-800">14 Days Remaining</span>
                  </div>
                  <p className="text-sm text-amber-700">Open enrollment closes on March 26, 2026 at 11:59 PM</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Employees</span>
                    <span className="font-semibold text-gray-900">847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Completed Enrollment</span>
                    <span className="font-semibold text-green-600">812 (95.9%)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pending</span>
                    <span className="font-semibold text-amber-600">35 (4.1%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[95.9%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button 
                  onClick={() => setShowEnrollmentModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Close
                </button>
                <button 
                  onClick={() => { setShowEnrollmentModal(false); router.push('/employer/enrollment'); }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Send Reminder
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Payment Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInvoiceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              {invoicePaid ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Submitted!</h3>
                  <p className="text-gray-500">Invoice #4521 will be processed within 24 hours.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Pay Invoice #4521</h3>
                    <button onClick={() => setShowInvoiceModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-gray-600">Invoice Amount</span>
                        <span className="text-2xl font-bold text-gray-900">$142,850.00</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Due Date</span>
                        <span className="text-amber-600 font-medium">Mar 19, 2026 (7 days)</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                          <option>ACH - ****4521 (Primary)</option>
                          <option>Wire Transfer</option>
                          <option>Check</option>
                        </select>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <CreditCard className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-blue-700">ACH payments are processed within 1-2 business days with no additional fees.</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                    <button 
                      onClick={() => setShowInvoiceModal(false)}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handlePayInvoice}
                      className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                    >
                      Pay $142,850.00
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Employees Modal */}
      <AnimatePresence>
        {showPendingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowPendingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Pending Enrollments (3)</h3>
                <button onClick={() => setShowPendingModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {pendingEmployees.map((emp) => (
                  <div key={emp.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{emp.name}</p>
                        <p className="text-sm text-gray-500">{emp.department} • Starts {emp.startDate}</p>
                      </div>
                    </div>
                    <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                      Complete
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button 
                  onClick={() => setShowPendingModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Close
                </button>
                <button 
                  onClick={() => { setShowPendingModal(false); router.push('/employer/roster'); }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                >
                  View All Roster
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowEventModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              {(() => {
                const event = upcomingEvents.find(e => e.id === showEventModal);
                if (!event) return null;
                return (
                  <>
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
                      <button onClick={() => setShowEventModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{event.event}</h4>
                          <p className="text-sm text-gray-500">{event.date} at {event.time}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{event.location}</span>
                        </div>
                        {event.attendees.length > 0 && (
                          <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{event.attendees.join(", ")}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                      <button 
                        onClick={() => setShowEventModal(null)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                      >
                        Close
                      </button>
                      <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium">
                        Add to Calendar
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Activity Detail Modal */}
      <AnimatePresence>
        {showActivityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowActivityModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              {(() => {
                const activity = recentActivity.find(a => a.id === showActivityModal);
                if (!activity) return null;
                return (
                  <>
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Activity Details</h3>
                      <button onClick={() => setShowActivityModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          activity.type === "enrollment" ? "bg-green-100" :
                          activity.type === "claim" ? "bg-blue-100" :
                          activity.type === "payment" ? "bg-amber-100" : "bg-gray-100"
                        }`}>
                          {activity.type === "enrollment" && <Users className="w-6 h-6 text-green-600" />}
                          {activity.type === "claim" && <FileText className="w-6 h-6 text-blue-600" />}
                          {activity.type === "payment" && <CreditCard className="w-6 h-6 text-amber-600" />}
                          {activity.type === "update" && <User className="w-6 h-6 text-gray-600" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{activity.action}</h4>
                          <p className="text-sm text-gray-500">{activity.date}</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-sm text-gray-500 mb-1">Reference ID</div>
                        <div className="font-mono text-gray-900">
                          {activity.employeeId || activity.claimId || activity.invoiceId}
                        </div>
                      </div>
                    </div>
                    <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                      <button 
                        onClick={() => setShowActivityModal(null)}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                      >
                        Close
                      </button>
                      <button 
                        onClick={() => {
                          setShowActivityModal(null);
                          if (activity.type === "enrollment" || activity.type === "update") {
                            router.push('/employer/roster');
                          } else if (activity.type === "claim") {
                            router.push('/employer/analytics');
                          } else if (activity.type === "payment") {
                            router.push('/employer/billing');
                          }
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium flex items-center gap-2"
                      >
                        View Details
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Detail Modal */}
      <AnimatePresence>
        {showStatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowStatModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {showStatModal === "enrolled" && "Enrolled Members"}
                  {showStatModal === "claims" && "Claims MTD"}
                  {showStatModal === "spend" && "Monthly Spend"}
                  {showStatModal === "ytd" && "Year-to-Date Spend"}
                </h3>
                <button onClick={() => setShowStatModal(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6">
                {showStatModal === "enrolled" && (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-gray-900 mb-1">847</div>
                      <div className="text-green-600 text-sm font-medium">+12 this month</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-gray-900">542</div>
                        <div className="text-xs text-gray-500">Employee Only</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <div className="text-xl font-bold text-gray-900">305</div>
                        <div className="text-xs text-gray-500">With Dependents</div>
                      </div>
                    </div>
                  </div>
                )}
                {showStatModal === "claims" && (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-gray-900 mb-1">234</div>
                      <div className="text-green-600 text-sm font-medium">+8% vs last month</div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-green-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-green-600">198</div>
                        <div className="text-xs text-gray-500">Approved</div>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-amber-600">24</div>
                        <div className="text-xs text-gray-500">Pending</div>
                      </div>
                      <div className="bg-red-50 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-red-600">12</div>
                        <div className="text-xs text-gray-500">Denied</div>
                      </div>
                    </div>
                  </div>
                )}
                {showStatModal === "spend" && (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-gray-900 mb-1">$125,430</div>
                      <div className="text-green-600 text-sm font-medium">-3% vs last month</div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Medical</span>
                        <span className="text-gray-900 font-medium">$87,450</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Pharmacy</span>
                        <span className="text-gray-900 font-medium">$24,830</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Dental</span>
                        <span className="text-gray-900 font-medium">$8,150</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Vision</span>
                        <span className="text-gray-900 font-medium">$5,000</span>
                      </div>
                    </div>
                  </div>
                )}
                {showStatModal === "ytd" && (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-4xl font-bold text-gray-900 mb-1">$1.24M</div>
                      <div className="text-amber-600 text-sm font-medium">+2% vs last year</div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Annual Budget</span>
                        <span className="text-gray-900 font-medium">$5.2M</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[24%] bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">24% of annual budget utilized</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
                <button 
                  onClick={() => setShowStatModal(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
                >
                  Close
                </button>
                <button 
                  onClick={() => { setShowStatModal(null); router.push('/employer/analytics'); }}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
                >
                  View Full Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
