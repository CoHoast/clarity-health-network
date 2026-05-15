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
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="PPO Network Overview & Analytics"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            delay={index}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader title="Quick Actions" />
          <div className="p-6 pt-0 space-y-3">
            {quickActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-colors group",
                    isDark ? "hover:bg-slate-700" : "hover:bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    isDark ? "bg-blue-500/10" : "bg-blue-50"
                  )}>
                    <IconComponent className={cn("w-4 h-4", isDark ? "text-blue-400" : "text-blue-600")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>{action.label}</h4>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-500")}>{action.description}</p>
                  </div>
                  <ArrowRight className={cn("w-4 h-4", isDark ? "text-slate-400 group-hover:text-white" : "text-gray-400 group-hover:text-gray-600")} />
                </Link>
              );
            })}
          </div>
        </Card>

        {/* Network Distribution */}
        <Card>
          <CardHeader title="Top Specialties" />
          <div className="p-6 pt-0 space-y-3">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={cn("h-4 rounded animate-pulse", isDark ? "bg-slate-700" : "bg-gray-200")} />
                ))}
              </div>
            ) : (
              dashboardData.topSpecialties.map((item) => (
                <div key={item.specialty} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium truncate", isDark ? "text-white" : "text-gray-900")}>{item.specialty}</p>
                    <p className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-500")}>{item.count.toLocaleString()} providers</p>
                  </div>
                  <Badge variant="secondary">{item.percentage}%</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader title="Recent Activity" />
          <div className="p-6 pt-0 space-y-3">
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-2",
                  isDark ? "bg-blue-400" : "bg-blue-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>{item.title}</p>
                  <p className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-500")}>{item.message}</p>
                  <p className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-gray-400")}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Actions Required Section */}
      <ActionRequiredWidget items={createDemoActionItems()} />

      {/* Network Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader title="Geographic Distribution" />
          <div className="p-6 pt-0 space-y-3">
            {isLoading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={cn("h-4 rounded animate-pulse", isDark ? "bg-slate-700" : "bg-gray-200")} />
                ))}
              </div>
            ) : (
              dashboardData.topCities.map((city) => (
                <div key={city.city} className="flex items-center justify-between">
                  <p className={cn("text-sm", isDark ? "text-slate-300" : "text-gray-600")}>{city.city}</p>
                  <p className={cn("text-sm font-medium", isDark ? "text-white" : "text-gray-900")}>{city.count.toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Network Status" />
          <div className="p-6 pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <span className={cn("text-sm", isDark ? "text-slate-300" : "text-gray-600")}>Active Network</span>
              <Badge variant="success">Arizona Antidote</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className={cn("text-sm", isDark ? "text-slate-300" : "text-gray-600")}>Coverage</span>
              <Badge variant="success">Statewide</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className={cn("text-sm", isDark ? "text-slate-300" : "text-gray-600")}>Data Source</span>
              <Badge variant="warning">Import Complete</Badge>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader title="Quick Stats" />
          <div className="p-6 pt-0 space-y-4">
            <StatCardCompact
              label="Behavioral Health"
              value={dashboardData.behavioralHealth.toLocaleString()}
              icon={<Brain className="w-4 h-4" />}
            />
            <StatCardCompact
              label="Board Certified"
              value="85%"
              icon={<CheckCircle className="w-4 h-4" />}
            />
            <StatCardCompact
              label="Avg Response Time"
              value="< 24h"
              icon={<Clock className="w-4 h-4" />}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
