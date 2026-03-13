'use client';

import { useApi, api } from './useApi';

interface AdminDashboard {
  overview: {
    totalMembers: number;
    activeMembers: number;
    totalProviders: number;
    contractedProviders: number;
    pendingClaims: number;
    ytdPaidClaims: number;
    ytdPayments: number;
    fraudAlerts: number;
  };
  claimsQueue: Array<{
    id: string;
    claimNumber: string;
    member: string;
    provider: string;
    amount: number;
    status: string;
    receivedDate: string;
  }>;
  recentActivity: Array<{
    type: string;
    message: string;
    timestamp: string;
  }>;
}

interface AdminClaims {
  claims: Array<{
    id: string;
    claimNumber: string;
    member: { name: string; memberNumber: string };
    provider: { name: string; npi: string };
    serviceDate: string;
    billedAmount: number;
    status: string;
    fraudScore: number | null;
  }>;
  statusCounts: Record<string, number>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface AdminProviders {
  providers: Array<{
    id: string;
    npi: string;
    name: string;
    specialty: string;
    status: string;
    contractStatus: string;
    credentialStatus: string;
    claimCount: number;
  }>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface AdminMembers {
  members: Array<{
    id: string;
    memberNumber: string;
    firstName: string;
    lastName: string;
    planType: string;
    status: string;
    employer: string | null;
    claimCount: number;
  }>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface FraudAlerts {
  alerts: Array<{
    id: string;
    entityType: string;
    alertType: string;
    severity: string;
    score: number;
    status: string;
    createdAt: string;
  }>;
  summary: {
    open: number;
    investigating: number;
    critical: number;
    high: number;
  };
}

export function useAdminDashboard() {
  return useApi<AdminDashboard>('/admin/dashboard');
}

export function useAdminClaims(page = 1, status?: string, search?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  return useApi<AdminClaims>(`/admin/claims?${params}`);
}

export function useAdminClaim(id: string) {
  return useApi<{ claim: any }>(`/admin/claims/${id}`, { immediate: !!id });
}

export function useAdminProviders(page = 1, status?: string, search?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  return useApi<AdminProviders>(`/admin/providers?${params}`);
}

export function useAdminMembers(page = 1, status?: string, search?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  return useApi<AdminMembers>(`/admin/members?${params}`);
}

export function useAdminFraudAlerts(status?: string) {
  const params = status ? `?status=${status}` : '';
  return useApi<FraudAlerts>(`/admin/fraud${params}`);
}

export function useAdminPayments(page = 1) {
  return useApi<{ batches: any[]; summary: any; pagination: any }>(`/admin/payments?page=${page}`);
}

export function useAdminAuditLogs(page = 1, action?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (action) params.set('action', action);
  return useApi<{ logs: any[]; pagination: any }>(`/admin/audit?${params}`);
}

export function useAdminCredentialing(status?: string) {
  const params = status ? `?status=${status}` : '';
  return useApi<{ applications: any[]; summary: any }>(`/admin/credentialing${params}`);
}

export function useAdminContracts(status?: string) {
  const params = status ? `?status=${status}` : '';
  return useApi<{ contracts: any[]; summary: any }>(`/admin/contracts${params}`);
}

export function useAdminReports() {
  return useApi<{ membership: any; network: any; claims: any; kpis: any }>('/admin/reports');
}

export function useAdminNetwork() {
  return useApi<{
    providersByState: any[];
    providersBySpecialty: any[];
    membersByState: any[];
    metrics: any;
  }>('/admin/network');
}

export function useAdminUsers() {
  return useApi<{ admins: any[]; employerUsers: any[] }>('/admin/users');
}

export function useAdminEmployers() {
  return useApi<{ employers: any[] }>('/admin/employers');
}

export function useAdminFeeSchedules(scheduleId?: string, search?: string) {
  const params = new URLSearchParams();
  if (scheduleId) params.set('scheduleId', scheduleId);
  if (search) params.set('search', search);
  return useApi<{ schedules: any[]; rates?: any[] }>(`/admin/fee-schedules?${params}`);
}

// Mutations
export async function adjudicateClaim(claimId: string, action: 'approve' | 'deny' | 'pend', denialReason?: string) {
  return api.post(`/admin/claims/${claimId}/adjudicate`, { action, denialReason });
}

export async function updateFraudAlert(alertId: string, status: string, resolution?: string) {
  return api.patch('/admin/fraud', { alertId, status, resolution });
}

export async function createPaymentBatch(providerId: string, claimIds: string[], paymentMethod?: string) {
  return api.post('/admin/payments', { providerId, claimIds, paymentMethod });
}
