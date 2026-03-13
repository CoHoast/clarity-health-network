'use client';

import { useApi, api } from './useApi';

interface EmployerDashboard {
  employer: {
    id: string;
    name: string;
    groupNumber: string;
    planType: string;
    status: string;
  };
  user: {
    name: string;
    role: string;
  };
  kpis: {
    totalMembers: number;
    activeMembers: number;
    ytdClaims: number;
    ytdSpend: number;
  };
  recentClaims: Array<{
    id: string;
    claimNumber: string;
    employee: string;
    provider: string;
    serviceDate: string;
    amount: number;
    status: string;
  }>;
  billing: {
    pendingInvoices: number;
    totalDue: number;
    nextDueDate: string | null;
  };
}

interface EmployerRoster {
  employees: Array<{
    id: string;
    memberNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    planType: string;
    relationship: string;
    status: string;
    effectiveDate: string;
  }>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface EmployerBilling {
  invoices: Array<{
    id: string;
    invoiceNumber: string;
    periodStart: string;
    periodEnd: string;
    totalAmount: number;
    dueDate: string;
    status: string;
  }>;
  summary: {
    pending: number;
    totalDue: number;
    ytdPaid: number;
    overdue: number;
  };
}

interface EmployerAnalytics {
  monthlyTrend: Array<{
    month: string;
    claims: number;
    billed: number;
    paid: number;
  }>;
  claimsByStatus: Record<string, number>;
  topProviders: Array<{
    name: string;
    specialty: string;
    claimCount: number;
    totalPaid: number;
  }>;
  summary: {
    totalClaims: number;
    totalBilled: number;
    totalPaid: number;
    avgClaimAmount: number;
  };
}

export function useEmployerDashboard() {
  return useApi<EmployerDashboard>('/employer/dashboard');
}

export function useEmployerRoster(page = 1, status?: string, search?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  return useApi<EmployerRoster>(`/employer/roster?${params}`);
}

export function useEmployerEmployee(id: string) {
  return useApi<{ employee: any; dependents: any[]; claims: any[]; ytdStats: any }>(
    `/employer/roster/${id}`,
    { immediate: !!id }
  );
}

export function useEmployerBilling() {
  return useApi<EmployerBilling>('/employer/billing');
}

export function useEmployerAnalytics() {
  return useApi<EmployerAnalytics>('/employer/analytics');
}

export function useEmployerDocuments() {
  return useApi<{ documents: any[]; grouped: Record<string, any[]> }>('/employer/documents');
}

export function useEmployerEnrollment() {
  return useApi<{ summary: any; recentEnrollments: any[]; openEnrollment: any }>(
    '/employer/enrollment'
  );
}

// Mutations
export async function addEmployee(data: {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  effectiveDate?: string;
  relationship?: string;
}) {
  return api.post('/employer/roster', data);
}

export async function updateEmployee(id: string, data: Partial<any>) {
  return api.put(`/employer/roster/${id}`, data);
}

export async function terminateEmployee(id: string, terminationDate: string) {
  return api.put(`/employer/roster/${id}`, { status: 'terminated', terminationDate });
}
