'use client';

import { useApi, api } from './useApi';

interface ProviderDashboard {
  provider: {
    id: string;
    npi: string;
    name: string;
    specialty: string;
    status: string;
  };
  claimsSnapshot: {
    pending: number;
    paid: number;
    denied: number;
    ytdPaid: number;
  };
  recentClaims: Array<{
    id: string;
    claimNumber: string;
    patient: string;
    serviceDate: string;
    amount: number;
    status: string;
  }>;
  alerts: Array<{
    type: string;
    message: string;
    severity: string;
  }>;
}

interface ProviderClaims {
  claims: Array<{
    id: string;
    claimNumber: string;
    member: string;
    memberNumber: string;
    serviceDate: string;
    billedAmount: number;
    allowedAmount: number | null;
    paidAmount: number | null;
    status: string;
  }>;
  stats: Record<string, { count: number; amount: number }>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface ProviderPayments {
  payments: Array<{
    id: string;
    batchNumber: string;
    amount: number;
    claimCount: number;
    paymentDate: string;
    paymentMethod: string;
    status: string;
  }>;
  summary: { ytdTotal: number; ytdPayments: number };
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface EligibilityResult {
  eligible: boolean;
  status: string;
  member?: {
    memberNumber: string;
    firstName: string;
    lastName: string;
  };
  coverage?: {
    planType: string;
    planName: string;
    effectiveDate: string;
  };
  benefits?: {
    deductible: number;
    deductibleMet: number;
    coinsurance: number;
  };
  copays?: {
    primaryCare: number;
    specialist: number;
  };
  message?: string;
}

export function useProviderDashboard() {
  return useApi<ProviderDashboard>('/provider/dashboard');
}

export function useProviderProfile() {
  return useApi<{ provider: any }>('/provider/profile');
}

export function useProviderClaims(page = 1, status?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  return useApi<ProviderClaims>(`/provider/claims?${params}`);
}

export function useProviderPayments(page = 1) {
  return useApi<ProviderPayments>(`/provider/payments?page=${page}`);
}

export function useProviderContracts() {
  return useApi<{ contracts: any[]; activeContract: any }>('/provider/contracts');
}

export function useProviderCredentialing() {
  return useApi<{ status: string; application: any; alerts: any }>('/provider/credentialing');
}

export function useProviderLocations() {
  return useApi<{ locations: any[] }>('/provider/locations');
}

export function useProviderFeeSchedule(search?: string) {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  return useApi<{ fees: any[]; scheduleName: string }>(`/provider/fee-schedule${params}`);
}

export function useProviderPatients(search?: string, page = 1) {
  const params = new URLSearchParams({ page: String(page) });
  if (search) params.set('search', search);
  return useApi<{ patients: any[]; pagination: any }>(`/provider/patients?${params}`);
}

export function useProviderMessages() {
  return useApi<{ messages: any[]; unreadCount: number }>('/provider/messages');
}

// Mutations
export async function checkEligibility(
  memberNumber: string,
  dateOfBirth: string,
  serviceDate?: string
): Promise<EligibilityResult> {
  return api.post('/provider/eligibility', { memberNumber, dateOfBirth, serviceDate });
}

export async function updateProfile(data: Partial<any>) {
  return api.put('/provider/profile', data);
}

export async function addLocation(data: any) {
  return api.post('/provider/locations', data);
}

export async function sendMessage(subject: string, body: string) {
  return api.post('/provider/messages', { subject, body });
}
