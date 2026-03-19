"use client";

import Link from "next/link";
import {
  Building2,
  FileSignature,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  BarChart3,
  Users,
  Calendar,
  Plus,
  Globe,
  TrendingUp,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { StatCard, StatCardCompact } from "@/components/admin/ui/StatCard";
import { Badge, StatusBadge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total Providers", value: "0", change: "Import pending", trend: "up" as const, icon: <Building2 className="w-5 h-5" /> },
  { label: "Active Contracts", value: "0", change: "—", trend: "up" as const, icon: <FileSignature className="w-5 h-5" /> },
  { label: "Expiring Soon", value: "0", change: "—", trend: "up" as const, icon: <AlertTriangle className="w-5 h-5" /> },
  { label: "Avg. Discount", value: "—", change: "TBD", trend: "up" as const, icon: <DollarSign className="w-5 h-5" /> },
];

const expiringContracts: { provider: string; npi: string; expires: string; discount: string; status: string }[] = [
  // Empty - awaiting Arizona provider import
];

const recentActivity = [
  { type: "network", title: "Network Created", message: "Arizona Antidote - PPO Network", time: "Just now" },
  { type: "system", title: "Data Cleared", message: "Ready for Arizona provider import", time: "Just now" },
  { type: "discount", title: "Rate Updated", message: "Regional Hospital - 38% → 42%", time: "2h ago" },
  { type: "credentialing", title: "Credentialing Complete", message: "5 providers verified", time: "3h ago" },
  { type: "provider", title: "Provider Updated", message: "NPI 9876543210 - address change", time: "4h ago" },
];

const providersBySpecialty = [
  { specialty: "Primary Care", count: 892, percentage: 31 },
  { specialty: "Specialists", count: 756, percentage: 27 },
  { specialty: "Hospitals", count: 234, percentage: 8 },
  { specialty: "Urgent Care", count: 189, percentage: 7 },
  { specialty: "Imaging", count: 312, percentage: 11 },
  { specialty: "Labs", count: 464, percentage: 16 },
];

const quickActions = [
  { label: "Add Provider", href: "/admin/providers/new", icon: Plus, description: "Add new provider" },
  { label: "Expiring", href: "/admin/contracts/expiring", icon: AlertTriangle, count: 47, description: "Contracts expiring" },
  { label: "Credentialing", href: "/admin/credentialing", icon: Clock, count: 12, description: "Pending review" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, description: "Network reports" },
];

export default function AdminDashboard() {
  const { isDark } = useTheme();
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="PPO Network Dashboard"
        subtitle="Manage your provider network, contracts, and rates"
        actions={
          <>
            <Button variant="outline" href="/admin/reports" icon={<BarChart3 className="w-4 h-4" />}>
              Reports
            </Button>
            <Button variant="primary" href="/admin/providers/new" icon={<Plus className="w-4 h-4" />}>
              Add Provider
            </Button>
          </>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            delay={i}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} href={action.href}>
              <Card hover className="h-full">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    isDark 
                      ? "bg-blue-500/20 border border-blue-500/30"
                      : "bg-blue-50 border border-blue-200"
                  )}>
                    <Icon className={cn("w-5 h-5", isDark ? "text-blue-400" : "text-blue-600")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-semibold",
                      isDark ? "text-white" : "text-slate-900"
                    )}>
                      {action.label}
                    </p>
                    <p className={cn(
                      "text-sm",
                      isDark ? "text-slate-400" : "text-slate-500"
                    )}>
                      {action.count ? `${action.count} pending` : action.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Expiring Contracts - 2 columns */}
        <Card className="lg:col-span-2" padding="none">
          <div className="p-6 pb-0">
            <CardHeader
              title="Contracts Expiring Soon"
              icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
              action={
                <Link href="/admin/contracts/expiring" className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </Link>
              }
              className="mb-0"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn(
                  "text-left text-xs font-medium uppercase tracking-wider border-b",
                  isDark ? "text-slate-400 border-slate-700" : "text-slate-500 border-slate-200"
                )}>
                  <th className="px-6 py-4">Provider</th>
                  <th className="px-6 py-4">NPI</th>
                  <th className="px-6 py-4">Expires</th>
                  <th className="px-6 py-4">Discount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className={cn("divide-y", isDark ? "divide-slate-700/50" : "divide-slate-100")}>
                {expiringContracts.map((contract, i) => (
                  <tr key={i} className={cn(
                    "transition-colors",
                    isDark ? "hover:bg-slate-700/30" : "hover:bg-slate-50"
                  )}>
                    <td className={cn("px-6 py-4 font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {contract.provider}
                    </td>
                    <td className={cn("px-6 py-4 font-mono text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                      {contract.npi}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-500 font-medium">{contract.expires}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="success">{contract.discount}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={contract.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Activity - 1 column */}
        <Card>
          <CardHeader title="Recent Activity" className="mb-4" />
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  activity.type === "provider" && "bg-blue-500/15",
                  activity.type === "contract" && "bg-emerald-500/15",
                  activity.type === "discount" && "bg-amber-500/15",
                  activity.type === "credentialing" && "bg-teal-500/15"
                )}>
                  {activity.type === "provider" && <Building2 className="w-4 h-4 text-blue-500" />}
                  {activity.type === "contract" && <FileSignature className="w-4 h-4 text-emerald-500" />}
                  {activity.type === "discount" && <DollarSign className="w-4 h-4 text-amber-500" />}
                  {activity.type === "credentialing" && <CheckCircle className="w-4 h-4 text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                    {activity.title}
                  </p>
                  <p className={cn("text-xs truncate", isDark ? "text-slate-400" : "text-slate-500")}>
                    {activity.message}
                  </p>
                </div>
                <span className={cn("text-xs whitespace-nowrap", isDark ? "text-slate-500" : "text-slate-400")}>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Network by Specialty */}
      <Card>
        <CardHeader
          title="Network by Specialty"
          icon={<Globe className="w-5 h-5 text-blue-500" />}
          action={
            <Link href="/admin/analytics" className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1">
              Full Analytics <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {providersBySpecialty.map((item) => (
            <div key={item.specialty} className={cn(
              "rounded-xl p-4 text-center",
              isDark ? "bg-slate-700/40 border border-slate-600/50" : "bg-slate-50 border border-slate-100"
            )}>
              <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                {item.count}
              </p>
              <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                {item.specialty}
              </p>
              <div className={cn(
                "mt-3 h-1.5 rounded-full overflow-hidden",
                isDark ? "bg-slate-600" : "bg-slate-200"
              )}>
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <p className={cn("text-xs mt-1.5 font-medium", isDark ? "text-blue-400" : "text-blue-600")}>
                {item.percentage}%
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Credentialing Queue */}
        <Card>
          <CardHeader
            title="Credentialing Queue"
            icon={<Users className="w-5 h-5 text-blue-500" />}
            action={
              <Link href="/admin/credentialing" className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
          
          {/* Queue Stats */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            <StatCardCompact label="New Apps" value="12" />
            <StatCardCompact label="In Review" value="8" />
            <StatCardCompact label="Pending Docs" value="5" />
            <StatCardCompact label="This Week" value="23" highlight />
          </div>
          
          {/* Recent Applications */}
          <div className="space-y-3">
            {[
              { name: "Dr. Michael Torres", specialty: "Cardiology", submitted: "2 hours ago", status: "new" },
              { name: "Eastside Family Practice", specialty: "Primary Care", submitted: "5 hours ago", status: "review" },
              { name: "Dr. Jennifer Walsh", specialty: "Orthopedics", submitted: "1 day ago", status: "docs" },
            ].map((app, i) => (
              <div key={i} className={cn(
                "flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer",
                isDark 
                  ? "bg-slate-700/30 hover:bg-slate-700/50 border border-slate-700/50"
                  : "bg-slate-50 hover:bg-slate-100 border border-slate-100"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    isDark 
                      ? "bg-slate-600/50 border border-slate-500/50"
                      : "bg-white border border-slate-200"
                  )}>
                    <Building2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                      {app.name}
                    </p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                      {app.specialty}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={app.status === "new" ? "New" : app.status === "review" ? "In Review" : "Pending Docs"} size="sm" />
                  <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-slate-400")}>
                    {app.submitted}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader
            title="Upcoming Tasks"
            icon={<Calendar className="w-5 h-5 text-blue-500" />}
          />
          <div className="space-y-3">
            {[
              { task: "Review 12 credentialing applications", due: "Today", priority: "high" },
              { task: "Send renewal notices (47 contracts)", due: "This week", priority: "high" },
              { task: "Update fee schedules for Q2", due: "Mar 31", priority: "medium" },
              { task: "Quarterly network report", due: "Apr 1", priority: "medium" },
              { task: "Provider satisfaction survey", due: "Apr 15", priority: "low" },
            ].map((item, i) => (
              <div key={i} className={cn(
                "flex items-center justify-between p-3 rounded-xl",
                isDark ? "bg-slate-700/30 border border-slate-700/50" : "bg-slate-50 border border-slate-100"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full flex-shrink-0",
                    item.priority === "high" && "bg-red-500",
                    item.priority === "medium" && "bg-amber-500",
                    item.priority === "low" && "bg-slate-400"
                  )} />
                  <span className={cn("text-sm", isDark ? "text-slate-300" : "text-slate-700")}>
                    {item.task}
                  </span>
                </div>
                <span className={cn(
                  "text-xs font-medium whitespace-nowrap ml-4",
                  item.due === "Today" ? "text-red-500" : (isDark ? "text-slate-500" : "text-slate-400")
                )}>
                  {item.due}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
