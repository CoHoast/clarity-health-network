"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  FileText,
  Shield,
  Bell,
  RefreshCw,
  ChevronRight,
  Filter,
} from "lucide-react";
import { useTheme } from "@/components/admin/ThemeContext";
import { Breadcrumb } from "@/components/admin/ui/Breadcrumb";
import { Card, CardHeader } from "@/components/admin/ui/Card";
import { StatCard } from "@/components/admin/ui/StatCard";
import { Button } from "@/components/admin/ui/Button";
import { Badge } from "@/components/admin/ui/Badge";
import { useToast } from "@/components/admin/ui/Toast";
import { cn } from "@/lib/utils";

interface ExpiringCredential {
  id: string;
  providerId: string;
  providerName: string;
  npi: string;
  credentialType: string;
  credentialName: string;
  expirationDate: string;
  daysUntilExpiry: number;
  status: 'expired' | 'critical' | 'warning' | 'upcoming';
}

// Demo data - in production, this would come from the API
const demoCredentials: ExpiringCredential[] = [
  { id: '1', providerId: 'prov-1', providerName: 'Dr. Sarah Chen', npi: '1234567890', credentialType: 'license', credentialName: 'Medical License', expirationDate: '2026-03-28', daysUntilExpiry: 4, status: 'critical' },
  { id: '2', providerId: 'prov-2', providerName: 'Dr. Michael Torres', npi: '2345678901', credentialType: 'dea', credentialName: 'DEA Certificate', expirationDate: '2026-03-20', daysUntilExpiry: -4, status: 'expired' },
  { id: '3', providerId: 'prov-3', providerName: 'Dr. Emily Johnson', npi: '3456789012', credentialType: 'malpractice', credentialName: 'Malpractice Insurance', expirationDate: '2026-04-15', daysUntilExpiry: 22, status: 'warning' },
  { id: '4', providerId: 'prov-4', providerName: 'Dr. James Wilson', npi: '4567890123', credentialType: 'board_certification', credentialName: 'Board Certification', expirationDate: '2026-04-20', daysUntilExpiry: 27, status: 'warning' },
  { id: '5', providerId: 'prov-5', providerName: 'Valley Health Clinic', npi: '5678901234', credentialType: 'license', credentialName: 'Facility License', expirationDate: '2026-05-15', daysUntilExpiry: 52, status: 'upcoming' },
  { id: '6', providerId: 'prov-6', providerName: 'Dr. Lisa Park', npi: '6789012345', credentialType: 'cpr', credentialName: 'BLS Certification', expirationDate: '2026-06-01', daysUntilExpiry: 69, status: 'upcoming' },
  { id: '7', providerId: 'prov-7', providerName: 'Metro Imaging Center', npi: '7890123456', credentialType: 'license', credentialName: 'Radiology License', expirationDate: '2026-04-01', daysUntilExpiry: 8, status: 'critical' },
  { id: '8', providerId: 'prov-8', providerName: 'Dr. Robert Kim', npi: '8901234567', credentialType: 'dea', credentialName: 'DEA Certificate', expirationDate: '2026-03-15', daysUntilExpiry: -9, status: 'expired' },
];

export default function ExpiringCredentialsPage() {
  const { isDark } = useTheme();
  const toast = useToast();
  const [credentials, setCredentials] = useState<ExpiringCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'expired' | 'critical' | 'warning' | 'upcoming'>('all');

  // Fetch real expiring credentials from API
  const fetchCredentials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/monitoring?type=expiring');
      if (res.ok) {
        const data = await res.json();
        // Map API response to our interface
        const mapped = (data.expiring || []).map((c: any, i: number) => ({
          id: String(i + 1),
          providerId: c.providerId,
          providerName: c.providerName,
          npi: c.npi,
          credentialType: c.credentialType,
          credentialName: c.credentialName,
          expirationDate: c.expirationDate,
          daysUntilExpiry: c.daysUntilExpiry,
          status: c.status as 'expired' | 'critical' | 'warning' | 'upcoming',
        }));
        setCredentials(mapped);
      }
    } catch (error) {
      console.error('Failed to fetch credentials:', error);
      toast.error("Error", "Failed to load credential data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredentials();
  }, []);

  const stats = {
    expired: credentials.filter(c => c.status === 'expired').length,
    critical: credentials.filter(c => c.status === 'critical').length,
    warning: credentials.filter(c => c.status === 'warning').length,
    upcoming: credentials.filter(c => c.status === 'upcoming').length,
  };

  const filteredCredentials = filter === 'all' 
    ? credentials 
    : credentials.filter(c => c.status === filter);

  const handleRefresh = async () => {
    await fetchCredentials();
    toast.success("Refreshed", "Credential data updated");
  };

  const handleSendReminder = (credential: ExpiringCredential) => {
    toast.info("Reminder Sent", `Renewal reminder sent to ${credential.providerName}`);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'expired':
        return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-500', icon: XCircle, label: 'Expired' };
      case 'critical':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-500', icon: AlertTriangle, label: 'Critical' };
      case 'warning':
        return { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-500', icon: Clock, label: 'Warning' };
      case 'upcoming':
        return { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-500', icon: Calendar, label: 'Upcoming' };
      default:
        return { bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-500', icon: FileText, label: status };
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={[
        { label: "Credentialing", href: "/admin/credentialing" },
        { label: "Expiring Credentials" }
      ]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            Expiring Credentials
          </h1>
          <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
            Monitor and manage credential expirations across all providers
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          loading={isLoading}
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Expired"
          value={stats.expired.toString()}
          icon={<XCircle className="w-5 h-5" />}
          trend="warning"
          change="Immediate action"
        />
        <StatCard
          label="Critical (7 days)"
          value={stats.critical.toString()}
          icon={<AlertTriangle className="w-5 h-5" />}
          trend="warning"
          change="Urgent"
        />
        <StatCard
          label="Warning (30 days)"
          value={stats.warning.toString()}
          icon={<Clock className="w-5 h-5" />}
          trend="neutral"
          change="Plan renewal"
        />
        <StatCard
          label="Upcoming (90 days)"
          value={stats.upcoming.toString()}
          icon={<Calendar className="w-5 h-5" />}
          trend="up"
          change="Monitor"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'expired', 'critical', 'warning', 'upcoming'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              filter === f
                ? "bg-blue-500 text-white"
                : isDark
                  ? "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== 'all' && (
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded bg-white/20">
                {stats[f as keyof typeof stats]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Credentials List */}
      <Card>
        <CardHeader
          title="Credential Expirations"
          icon={<Shield className="w-5 h-5 text-blue-500" />}
        />
        <div className="divide-y divide-slate-700/50">
          {filteredCredentials.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle className={cn("w-12 h-12 mx-auto mb-3", isDark ? "text-emerald-500" : "text-emerald-600")} />
              <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                No expiring credentials
              </p>
              <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
                All credentials in this category are up to date
              </p>
            </div>
          ) : (
            filteredCredentials.map((credential) => {
              const config = getStatusConfig(credential.status);
              const StatusIcon = config.icon;
              
              return (
                <div
                  key={credential.id}
                  className={cn(
                    "p-4 flex items-center justify-between",
                    isDark ? "hover:bg-slate-800/50" : "hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      config.bg, "border", config.border
                    )}>
                      <StatusIcon className={cn("w-5 h-5", config.text)} />
                    </div>

                    {/* Provider Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={cn("font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {credential.providerName}
                        </p>
                        <span className={cn(
                          "px-2 py-0.5 text-xs font-medium rounded-lg border",
                          config.bg, config.border, config.text
                        )}>
                          {config.label}
                        </span>
                      </div>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-slate-500")}>
                        {credential.credentialName} • NPI: {credential.npi}
                      </p>
                    </div>
                  </div>

                  {/* Expiration Info */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={cn(
                        "font-medium",
                        credential.daysUntilExpiry <= 0 ? "text-red-500" :
                        credential.daysUntilExpiry <= 7 ? "text-amber-500" :
                        isDark ? "text-white" : "text-slate-900"
                      )}>
                        {credential.daysUntilExpiry <= 0 
                          ? `${Math.abs(credential.daysUntilExpiry)} days overdue`
                          : `${credential.daysUntilExpiry} days left`
                        }
                      </p>
                      <p className={cn("text-sm", isDark ? "text-slate-500" : "text-slate-400")}>
                        Expires: {formatDate(credential.expirationDate)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendReminder(credential)}
                        icon={<Bell className="w-4 h-4" />}
                      >
                        Remind
                      </Button>
                      <Link href={`/admin/providers/${credential.providerId}`}>
                        <Button variant="ghost" size="sm" icon={<ChevronRight className="w-4 h-4" />}>
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Info Card */}
      <Card>
        <div className={cn("p-4 flex items-start gap-3", isDark ? "bg-blue-500/5" : "bg-blue-50")}>
          <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className={cn("font-medium", isDark ? "text-blue-400" : "text-blue-700")}>
              Automatic Monitoring
            </p>
            <p className={cn("text-sm mt-1", isDark ? "text-blue-300/80" : "text-blue-600")}>
              Credentials are checked daily. Providers and administrators are automatically 
              notified at 90, 60, 30, and 7 days before expiration.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
