"use client";

import { useTheme } from "@/components/admin/ThemeContext";
import { cn } from "@/lib/utils";

import { useState } from "react";
import Link from "next/link";
import { Search, Download, Eye, UserPlus, CheckCircle, Clock, XCircle, User, Mail, Phone, MapPin, Calendar, FileText, CreditCard, X, Shield, Send, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const members = [
  { id: "CHN-123456", name: "John Doe", email: "john.doe@email.com", phone: "(555) 123-4567", dob: "1985-03-15", address: "123 Main St, Cleveland, OH 44101", plan: "Gold PPO", group: "Acme Corp", status: "active", enrolled: "2024-01-15", deductible: { used: 850, max: 1500 }, oopMax: { used: 2100, max: 6000 }, pcp: "Dr. Sarah Chen", claims: 12 },
  { id: "CHN-234567", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "(555) 234-5678", dob: "1990-07-22", address: "456 Oak Ave, Lakewood, OH 44107", plan: "Silver PPO", group: "Acme Corp", status: "active", enrolled: "2024-02-01", deductible: { used: 500, max: 2500 }, oopMax: { used: 1200, max: 8000 }, pcp: "Dr. James Wilson", claims: 5 },
  { id: "CHN-345678", name: "Michael Chen", email: "m.chen@email.com", phone: "(555) 345-6789", dob: "1978-11-03", address: "789 Elm St, Beachwood, OH 44122", plan: "Gold PPO", group: "Tech Solutions", status: "active", enrolled: "2023-06-10", deductible: { used: 1500, max: 1500 }, oopMax: { used: 4500, max: 6000 }, pcp: "Dr. Amy Foster", claims: 28 },
  { id: "CHN-456789", name: "Emily Rodriguez", email: "e.rodriguez@email.com", phone: "(555) 456-7890", dob: "1995-01-28", address: "321 Pine Rd, Shaker Heights, OH 44120", plan: "Platinum PPO", group: "Healthcare Plus", status: "active", enrolled: "2022-03-20", deductible: { used: 250, max: 500 }, oopMax: { used: 800, max: 3000 }, pcp: "Dr. Robert Kim", claims: 8 },
  { id: "CHN-567890", name: "Robert Williams", email: "r.williams@email.com", phone: "(555) 567-8901", dob: "1970-09-12", address: "654 Cedar Ln, Westlake, OH 44145", plan: "Gold PPO", group: "Manufacturing Co", status: "cobra", enrolled: "2021-05-01", deductible: { used: 1200, max: 1500 }, oopMax: { used: 3800, max: 6000 }, pcp: "Dr. Lisa Martinez", claims: 45 },
  { id: "CHN-678901", name: "Lisa Martinez", email: "l.martinez@email.com", phone: "(555) 678-9012", dob: "1988-04-05", address: "987 Maple Dr, Mentor, OH 44060", plan: "Silver PPO", group: "Retail Group", status: "active", enrolled: "2023-09-15", deductible: { used: 1800, max: 2500 }, oopMax: { used: 3200, max: 8000 }, pcp: "Dr. Michael Brown", claims: 15 },
  { id: "CHN-789012", name: "David Kim", email: "d.kim@email.com", phone: "(555) 789-0123", dob: "1982-12-18", address: "147 Birch Ave, Solon, OH 44139", plan: "Gold PPO", group: "Acme Corp", status: "termed", enrolled: "2022-08-12", deductible: { used: 0, max: 1500 }, oopMax: { used: 0, max: 6000 }, pcp: "N/A", claims: 3 },
  { id: "CHN-890123", name: "Jennifer Lee", email: "j.lee@email.com", phone: "(555) 890-1234", dob: "1992-06-30", address: "258 Walnut St, Hudson, OH 44236", plan: "Silver PPO", group: "Tech Solutions", status: "pending", enrolled: "2024-03-10", deductible: { used: 0, max: 2500 }, oopMax: { used: 0, max: 8000 }, pcp: "Pending Assignment", claims: 0 },
  { id: "CHN-901234", name: "James Thompson", email: "j.thompson@email.com", phone: "(555) 901-2345", dob: "1975-05-20", address: "369 Spruce Way, Parma, OH 44129", plan: "Gold PPO", group: "City of Cleveland", status: "active", enrolled: "2020-01-01", deductible: { used: 1500, max: 1500 }, oopMax: { used: 5200, max: 6000 }, pcp: "Dr. Sarah Chen", claims: 52 },
  { id: "CHN-012345", name: "Patricia Brown", email: "p.brown@email.com", phone: "(555) 012-3456", dob: "1983-08-14", address: "741 Oak Lane, Euclid, OH 44123", plan: "Platinum PPO", group: "Healthcare Plus", status: "active", enrolled: "2023-04-01", deductible: { used: 350, max: 500 }, oopMax: { used: 950, max: 3000 }, pcp: "Dr. Amy Foster", claims: 7 },
  { id: "CHN-112233", name: "Amanda Wilson", email: "a.wilson@email.com", phone: "(555) 112-2334", dob: "1991-02-28", address: "852 Pine Street, Brooklyn, OH 44144", plan: "Silver PPO", group: "Acme Corp", status: "active", enrolled: "2023-07-15", deductible: { used: 1200, max: 2500 }, oopMax: { used: 2400, max: 8000 }, pcp: "Dr. James Wilson", claims: 9 },
  { id: "CHN-223344", name: "Christopher Davis", email: "c.davis@email.com", phone: "(555) 223-3445", dob: "1987-11-05", address: "963 Elm Court, Strongsville, OH 44136", plan: "Gold PPO", group: "Tech Solutions", status: "active", enrolled: "2022-11-01", deductible: { used: 800, max: 1500 }, oopMax: { used: 1800, max: 6000 }, pcp: "Dr. Robert Kim", claims: 14 },
  { id: "CHN-334455", name: "Nancy Garcia", email: "n.garcia@email.com", phone: "(555) 334-4556", dob: "1979-04-18", address: "147 Maple Ave, Independence, OH 44131", plan: "Gold PPO", group: "Manufacturing Co", status: "active", enrolled: "2021-09-15", deductible: { used: 1500, max: 1500 }, oopMax: { used: 4100, max: 6000 }, pcp: "Dr. Lisa Martinez", claims: 31 },
  { id: "CHN-445566", name: "Kevin Anderson", email: "k.anderson@email.com", phone: "(555) 445-5667", dob: "1994-07-22", address: "258 Cedar Blvd, Mayfield, OH 44143", plan: "Silver PPO", group: "Retail Group", status: "active", enrolled: "2024-01-01", deductible: { used: 400, max: 2500 }, oopMax: { used: 600, max: 8000 }, pcp: "Dr. Michael Brown", claims: 3 },
  { id: "CHN-556677", name: "Rachel Taylor", email: "r.taylor@email.com", phone: "(555) 556-6778", dob: "1986-09-30", address: "369 Birch Road, Twinsburg, OH 44087", plan: "Platinum PPO", group: "Healthcare Plus", status: "active", enrolled: "2022-06-01", deductible: { used: 500, max: 500 }, oopMax: { used: 1500, max: 3000 }, pcp: "Dr. Sarah Chen", claims: 12 },
  { id: "CHN-667788", name: "Thomas Moore", email: "t.moore@email.com", phone: "(555) 667-7889", dob: "1972-12-08", address: "741 Walnut Drive, Aurora, OH 44202", plan: "Gold PPO", group: "City of Cleveland", status: "cobra", enrolled: "2019-03-01", deductible: { used: 1100, max: 1500 }, oopMax: { used: 3500, max: 6000 }, pcp: "Dr. Amy Foster", claims: 38 },
  { id: "CHN-778899", name: "Sandra White", email: "s.white@email.com", phone: "(555) 778-8990", dob: "1989-01-15", address: "852 Spruce Lane, Broadview Heights, OH 44147", plan: "Silver PPO", group: "Acme Corp", status: "active", enrolled: "2023-10-01", deductible: { used: 950, max: 2500 }, oopMax: { used: 1700, max: 8000 }, pcp: "Dr. James Wilson", claims: 6 },
  { id: "CHN-889900", name: "Daniel Harris", email: "d.harris@email.com", phone: "(555) 889-9001", dob: "1981-06-25", address: "963 Oak Circle, North Royalton, OH 44133", plan: "Gold PPO", group: "Tech Solutions", status: "termed", enrolled: "2021-02-15", deductible: { used: 0, max: 1500 }, oopMax: { used: 0, max: 6000 }, pcp: "N/A", claims: 22 },
  { id: "CHN-990011", name: "Michelle Clark", email: "m.clark@email.com", phone: "(555) 990-0112", dob: "1993-10-12", address: "147 Pine Way, Brecksville, OH 44141", plan: "Platinum PPO", group: "Healthcare Plus", status: "active", enrolled: "2024-02-01", deductible: { used: 150, max: 500 }, oopMax: { used: 300, max: 3000 }, pcp: "Dr. Robert Kim", claims: 2 },
  { id: "CHN-001122", name: "Brian Lewis", email: "b.lewis@email.com", phone: "(555) 001-1223", dob: "1977-03-08", address: "258 Elm Street, Seven Hills, OH 44131", plan: "Gold PPO", group: "Manufacturing Co", status: "active", enrolled: "2020-08-01", deductible: { used: 1500, max: 1500 }, oopMax: { used: 5800, max: 6000 }, pcp: "Dr. Lisa Martinez", claims: 67 },
];

const statusOptions = ["All", "Active", "COBRA", "Termed", "Pending"];

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageMember, setMessageMember] = useState<typeof members[0] | null>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || member.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full"><CheckCircle className="w-3 h-3" />Active</span>;
      case "termed": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full"><XCircle className="w-3 h-3" />Termed</span>;
      case "pending": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full"><Clock className="w-3 h-3" />Pending</span>;
      case "cobra": return <span className="inline-flex items-center gap-1 px-2 py-1 bg-cyan-600/20 text-cyan-500 text-xs font-medium rounded-full">COBRA</span>;
      default: return null;
    }
  };

  const openMessageModal = (member: typeof members[0]) => {
    setMessageMember(member);
    setMessageSubject("");
    setMessageBody("");
    setMessageSent(false);
    setShowMessageModal(true);
  };

  const handleSendMessage = () => {
    setMessageSent(true);
    setTimeout(() => {
      setShowMessageModal(false);
      setMessageSent(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Member Management</h1>
          <p className="text-slate-400">View and manage all enrolled members</p>
        </div>
        <div className="flex gap-3">
          <a href="/docs/member-census.pdf" download className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 border border-slate-600">
            <Download className="w-4 h-4" />
            Export Census
          </a>
          <button onClick={() => setShowAddModal(true)} className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>12,847</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Members</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>12,456</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Active</p>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>234</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>COBRA</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-4 shadow-lg">
          <p className="text-2xl font-bold" style={{ color: 'white' }}>157</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>Pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-600"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status ? "bg-teal-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Member</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Plan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Group</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">PCP</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase">Claims</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-white">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{member.plan}</td>
                  <td className="px-4 py-3 text-slate-300">{member.group}</td>
                  <td className="px-4 py-3 text-slate-400 text-sm">{member.pcp}</td>
                  <td className="px-4 py-3 text-center text-slate-300">{member.claims}</td>
                  <td className="px-4 py-3">{getStatusBadge(member.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setSelectedMember(member)} className="p-1.5 text-slate-400 hover:text-cyan-500 hover:bg-cyan-600/20 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMember(null)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyan-600/20 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-cyan-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{selectedMember.name}</h2>
                    <p className="text-sm text-slate-400">{selectedMember.id} • {selectedMember.plan}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedMember(null)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><User className="w-4 h-4 text-blue-400" />Personal Info</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-300"><Mail className="w-4 h-4 text-slate-500" />{selectedMember.email}</div>
                        <div className="flex items-center gap-2 text-slate-300"><Phone className="w-4 h-4 text-slate-500" />{selectedMember.phone}</div>
                        <div className="flex items-center gap-2 text-slate-300"><Calendar className="w-4 h-4 text-slate-500" />DOB: {selectedMember.dob}</div>
                        <div className="flex items-center gap-2 text-slate-300"><MapPin className="w-4 h-4 text-slate-500" />{selectedMember.address}</div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-green-400" />Coverage</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-400">Plan</span><span className="text-white">{selectedMember.plan}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Group</span><span className="text-white">{selectedMember.group}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Enrolled</span><span className="text-white">{selectedMember.enrolled}</span></div>
                        <div className="flex justify-between"><span className="text-slate-400">Status</span>{getStatusBadge(selectedMember.status)}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3">Deductible Progress</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Used</span><span className="text-white">${selectedMember.deductible.used} / ${selectedMember.deductible.max}</span></div>
                        <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${(selectedMember.deductible.used / selectedMember.deductible.max) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3">Out-of-Pocket Max</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-400">Used</span><span className="text-white">${selectedMember.oopMax.used} / ${selectedMember.oopMax.max}</span></div>
                        <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(selectedMember.oopMax.used / selectedMember.oopMax.max) * 100}%` }} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3">Primary Care</h3>
                      <p className="text-slate-300">{selectedMember.pcp}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-amber-400" />Claims Summary</h3>
                      <div className="text-center py-4">
                        <p className="text-3xl font-bold text-white">{selectedMember.claims}</p>
                        <p className="text-sm text-slate-400">Total Claims YTD</p>
                      </div>
                      <Link 
                        href={`/admin/claims?member=${selectedMember.id}`}
                        className="w-full text-center text-cyan-500 hover:text-cyan-400 text-sm font-medium py-2 block"
                      >
                        View All Claims →
                      </Link>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <h3 className="font-medium text-white mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        <Link 
                          href="/docs/id-card" 
                          target="_blank"
                          className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white w-full"
                        >
                          <CreditCard className="w-4 h-4" />View ID Card
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </Link>
                        <Link 
                          href="/docs/eob" 
                          target="_blank"
                          className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white w-full"
                        >
                          <FileText className="w-4 h-4" />View EOB
                          <ExternalLink className="w-3 h-3 ml-auto" />
                        </Link>
                        <button 
                          onClick={() => { setSelectedMember(null); openMessageModal(selectedMember); }}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg text-sm text-white w-full"
                        >
                          <Mail className="w-4 h-4" />Send Message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700 bg-slate-800">
                <button className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Edit Member</button>
                <button onClick={() => setSelectedMember(null)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm">Close</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Send Message Modal */}
      <AnimatePresence>
        {showMessageModal && messageMember && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !messageSent && setShowMessageModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50">
              {messageSent ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-400">Your message has been sent to {messageMember.name}.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">Send Message</h3>
                        <p className="text-sm text-slate-400">to {messageMember.name}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowMessageModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">To</label>
                      <input 
                        type="text" 
                        value={messageMember.email}
                        readOnly
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                      <input 
                        type="text" 
                        value={messageSubject}
                        onChange={(e) => setMessageSubject(e.target.value)}
                        placeholder="Enter subject..."
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                      <textarea 
                        value={messageBody}
                        onChange={(e) => setMessageBody(e.target.value)}
                        placeholder="Type your message..."
                        rows={6}
                        className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 resize-none" 
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 p-4 border-t border-slate-700">
                    <button onClick={() => setShowMessageModal(false)} className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">Cancel</button>
                    <button onClick={handleSendMessage} className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 inline-flex items-center justify-center gap-2">
                      <Send className="w-4 h-4" />Send Message
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="fixed inset-0 bg-black/60 z-50" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Add New Member</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">First Name</label>
                    <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Last Name</label>
                    <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="john.doe@email.com" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Date of Birth</label>
                    <input type="date" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Phone</label>
                    <input type="tel" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="(555) 123-4567" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Address</label>
                  <input type="text" className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white" placeholder="123 Main St, Cleveland, OH 44101" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Plan</label>
                    <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option>Gold PPO</option>
                      <option>Silver PPO</option>
                      <option>Platinum PPO</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Group</label>
                    <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                      <option>Acme Corp</option>
                      <option>Tech Solutions</option>
                      <option>Healthcare Plus</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-700 bg-slate-800">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 text-sm">Cancel</button>
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm">Add Member</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
