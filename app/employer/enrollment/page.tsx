"use client";

import { Calendar, Users, Clock, CheckCircle, AlertTriangle, ArrowRight, FileText, Mail } from "lucide-react";

const enrollmentPeriod = {
  status: "upcoming",
  startDate: "November 1, 2026",
  endDate: "November 30, 2026",
  effectiveDate: "January 1, 2027",
  daysUntilStart: 234,
};

const enrollmentStats = {
  eligible: 860,
  enrolled: 0,
  pending: 0,
  waived: 0,
};

const recentEnrollments = [
  { employee: "John Smith", action: "Enrolled in Gold PPO", date: "Mar 12, 2026", status: "complete" },
  { employee: "David Kim", action: "Added dependent", date: "Mar 10, 2026", status: "pending" },
  { employee: "Lisa Martinez", action: "Changed to Silver PPO", date: "Mar 8, 2026", status: "complete" },
  { employee: "Robert Williams", action: "COBRA election", date: "Mar 5, 2026", status: "complete" },
];

const tasks = [
  { task: "Review plan offerings for 2027", dueDate: "Oct 1, 2026", status: "pending" },
  { task: "Update enrollment portal content", dueDate: "Oct 15, 2026", status: "pending" },
  { task: "Schedule benefits fair", dueDate: "Oct 20, 2026", status: "pending" },
  { task: "Send employee communications", dueDate: "Oct 25, 2026", status: "pending" },
];

export default function EnrollmentPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Open Enrollment</h1>
          <p className="text-gray-500">Manage enrollment periods and employee elections</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 font-medium">
          <Calendar className="w-4 h-4" />
          Configure Enrollment
        </button>
      </div>

      {/* Enrollment Period Status */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-white/20 rounded text-sm font-medium">Upcoming</span>
            </div>
            <h2 className="text-2xl font-bold">2027 Open Enrollment</h2>
            <p className="text-amber-100 mt-2">
              {enrollmentPeriod.startDate} — {enrollmentPeriod.endDate}
            </p>
            <p className="text-amber-100">Coverage effective: {enrollmentPeriod.effectiveDate}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-4xl font-bold">{enrollmentPeriod.daysUntilStart}</p>
            <p className="text-amber-100">days until enrollment opens</p>
          </div>
        </div>
      </div>

      {/* Current Year Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{enrollmentStats.eligible}</p>
          <p className="text-sm text-gray-500">Eligible Employees</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">847</p>
          <p className="text-sm text-gray-500">Currently Enrolled</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">12</p>
          <p className="text-sm text-gray-500">Pending Elections</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">1</p>
          <p className="text-sm text-gray-500">Waived Coverage</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Enrollment Activity */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentEnrollments.map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${item.status === "complete" ? "bg-green-500" : "bg-amber-500"}`} />
                  <div>
                    <p className="font-medium text-gray-900">{item.employee}</p>
                    <p className="text-sm text-gray-500">{item.action}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{item.date}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-100">
            <button className="text-amber-600 hover:text-amber-700 text-sm font-medium flex items-center gap-1">
              View all activity <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preparation Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Preparation Tasks</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {tasks.map((item, i) => (
              <div key={i} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4 text-amber-500 focus:ring-amber-500 rounded" />
                  <div>
                    <p className="font-medium text-gray-900">{item.task}</p>
                    <p className="text-sm text-gray-500">Due: {item.dueDate}</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">Pending</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <button className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-amber-50 rounded-lg text-left transition-colors">
            <FileText className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium text-gray-900">Download Forms</p>
              <p className="text-sm text-gray-500">Enrollment forms & waivers</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-amber-50 rounded-lg text-left transition-colors">
            <Mail className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium text-gray-900">Send Reminders</p>
              <p className="text-sm text-gray-500">Email pending employees</p>
            </div>
          </button>
          <button className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-amber-50 rounded-lg text-left transition-colors">
            <Calendar className="w-5 h-5 text-amber-600" />
            <div>
              <p className="font-medium text-gray-900">Schedule Event</p>
              <p className="text-sm text-gray-500">Benefits fair or webinar</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
