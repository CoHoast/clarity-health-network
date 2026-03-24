"use client";

import React, { useState, useEffect } from "react";
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
  Heart,
  Brain,
  UserCheck,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { StatCard, StatCardCompact } from "@/components/admin/ui/StatCard";
import { Badge, StatusBadge } from "@/components/admin/ui/Badge";
import { Button } from "@/components/admin/ui/Button";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ActionRequiredWidget, createDemoActionItems } from "@/components/admin/ui/ActionRequired";
import { cn } from "@/lib/utils";
import statsData from "@/data/arizona-import-stats.json";

// Quick actions - static
const quickActions = [
  { label: "Add Provider", href: "/admin/providers/new", icon: Plus, description: "Add new provider" },
  { label: "Networks", href: "/admin/networks", icon: Globe, description: "Manage networks" },
  { label: "Credentialing", href: "/admin/credentialing", icon: Clock, description: "Review queue" },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3, description: "Network reports" },
];

export default function AdminDashboard() {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalProviders: 0,
    totalPractices: 0,
    primaryCare: 0,
    behavioralHealth: 0,
    acceptingNew: 0,
    topSpecialties: [] as { specialty: string; count: number; percentage: number }[],
    topCities: [] as { city: string; count: number }[],
  });

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Fetch provider and practice counts from API
        const [providersRes, practicesRes] = await Promise.all([
          fetch('/api/providers?limit=1'),
          fetch('/api/practices?limit=1'),
        ]);
        
        const providersData = await providersRes.json();
        const practicesData = await practicesRes.json();
        
        const totalProviders = providersData.pagination?.total || 0;
        const totalPractices = practicesData.pagination?.total || 0;
        
        // Use stats from import file
        const topSpecialties = Object.entries(statsData.bySpecialty || {})
          .slice(0, 6)
          .map(([specialty, count]) => ({
            specialty,
            count: count as number,
            percentage: Math.round(((count as number) / totalProviders) * 100),
          }));
        
        const topCities = Object.entries(statsData.byCity || {})
          .slice(0, 5)
          .map(([city, count]) => ({ city, count: count as number }));
        
        setDashboardData({
          totalProviders,
          totalPractices,
          primaryCare: statsData.primaryCare || 0,
          behavioralHealth: statsData.behavioralHealth || 0,
          acceptingNew: statsData.acceptingNew || 0,
          topSpecialties,
          topCities,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
  }, []);

  // Dynamic stats based on loaded data
  const stats = [
    { label: "Total Providers", value: dashboardData.totalProviders.toLocaleString(), change: "Arizona Antidote", trend: "up" as const, icon: <Building2 className="w-5 h-5" /> },
    { label: "Total Practices", value: dashboardData.totalPractices.toLocaleString(), change: "Billing entities", trend: "up" as const, icon: <Users className="w-5 h-5" /> },
    { label: "Primary Care", value: dashboardData.primaryCare.toLocaleString(), change: `${Math.round((dashboardData.primaryCare / dashboardData.totalProviders) * 100) || 0}% of network`, trend: "up" as const, icon: <Heart className="w-5 h-5" /> },
    { label: "Accepting Patients", value: dashboardData.acceptingNew.toLocaleString(), change: `${Math.round((dashboardData.acceptingNew / dashboardData.totalProviders) * 100) || 0}% available`, trend: "up" as const, icon: <UserCheck className="w-5 h-5" /> },
  ];

  const recentActivity = [
    { type: "import", title: "Provider Import", message: `${dashboardData.totalProviders.toLocaleString()} Arizona providers imported`, time: "Today" },
    { type: "network", title: "Network Active", message: "Arizona Antidote PPO Network", time: "Today" },
    { type: "practices", title: "Practices Loaded", message: `${dashboardData.totalPractices.toLocaleString()} billing practices configured`, time: "Today" },
    { type: "primary", title: "Primary Care", message: `${dashboardData.primaryCare.toLocaleString()} primary care providers`, time: "Today" },
    { type: "behavioral", title: "Behavioral Health", message: `${dashboardData.behavioralHealth.toLocaleString()} behavioral health providers`, time: "Today" },
  ];
  
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
                      {action.description}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Action Required Widget */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActionRequiredWidget items={createDemoActionItems()} maxItems={5} />
        </div>
        
        {/* Recent Activity - 1 column */}
        <Card>
          <CardHeader title="Recent Activity" className="mb-4" />
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                  activity.type === "import" && "bg-blue-500/15",
                  activity.type === "network" && "bg-emerald-500/15",
                  activity.type === "practices" && "bg-amber-500/15",
                  activity.type === "primary" && "bg-teal-500/15",
                  activity.type === "behavioral" && "bg-purple-500/15"
                )}>
                  {activity.type === "import" && <Building2 className="w-4 h-4 text-blue-500" />}
                  {activity.type === "network" && <Globe className="w-4 h-4 text-emerald-500" />}
                  {activity.type === "practices" && <Building2 className="w-4 h-4 text-amber-500" />}
                  {activity.type === "primary" && <Heart className="w-4 h-4 text-teal-500" />}
                  {activity.type === "behavioral" && <Brain className="w-4 h-4 text-purple-500" />}
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

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top Cities - 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Top Provider Locations"
            icon={<Globe className="w-5 h-5 text-blue-500" />}
            action={
              <Link href="/admin/providers" className="text-sm text-blue-500 hover:text-blue-400 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {dashboardData.topCities.map((item, i) => (
              <div key={item.city} className={cn(
                "rounded-xl p-4 text-center",
                isDark ? "bg-slate-700/40 border border-slate-600/50" : "bg-slate-50 border border-slate-100"
              )}>
                <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                  {item.count.toLocaleString()}
                </p>
                <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                  {item.city}
                </p>
              </div>
            ))}
          </div>
          <div className={cn(
            "mt-4 p-4 rounded-lg flex items-center gap-3",
            isDark ? "bg-amber-500/10 border border-amber-500/20" : "bg-amber-50 border border-amber-200"
          )}>
            <DollarSign className={cn("w-5 h-5", isDark ? "text-amber-400" : "text-amber-600")} />
            <p className={cn("text-sm", isDark ? "text-amber-300" : "text-amber-700")}>
              <strong>Pricing data pending</strong> — Contract rates and discount information will be available after CSV upload.
            </p>
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
          {dashboardData.topSpecialties.map((item) => (
            <div key={item.specialty} className={cn(
              "rounded-xl p-4 text-center",
              isDark ? "bg-slate-700/40 border border-slate-600/50" : "bg-slate-50 border border-slate-100"
            )}>
              <p className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
                {item.count.toLocaleString()}
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
