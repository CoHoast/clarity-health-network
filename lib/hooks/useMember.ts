'use client';

import { useApi, api } from './useApi';

interface MemberDashboard {
  member: {
    id: string;
    memberNumber: string;
    firstName: string;
    lastName: string;
    planType: string;
    status: string;
  };
  benefits: {
    deductible: number;
    deductibleMet: number;
    outOfPocketMax: number;
    outOfPocketMet: number;
  };
  recentClaims: Array<{
    id: string;
    claimNumber: string;
    serviceDate: string;
    provider: string;
    amount: number;
    status: string;
  }>;
  upcomingAppointments: Array<{
    id: string;
    provider: string;
    date: string;
    type: string;
  }>;
}

interface MemberClaims {
  claims: Array<{
    id: string;
    claimNumber: string;
    serviceDate: string;
    provider: string;
    billedAmount: number;
    paidAmount: number | null;
    status: string;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface MemberBenefits {
  planName: string;
  planType: string;
  deductible: { individual: number; used: number; remaining: number };
  outOfPocketMax: { individual: number; used: number; remaining: number };
  copays: { primaryCare: number; specialist: number; urgentCare: number; emergency: number };
  coverage: Record<string, { covered: boolean; copay?: number; coinsurance?: number; notes?: string }>;
}

interface IDCard {
  member: { memberNumber: string; firstName: string; lastName: string };
  plan: { name: string; groupNumber: string; groupName: string };
  copays: { primaryCare: number; specialist: number };
  rxBin: string;
  rxPcn: string;
  rxGroup: string;
}

export function useMemberDashboard() {
  return useApi<MemberDashboard>('/member/dashboard');
}

export function useMemberClaims(page = 1, status?: string) {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set('status', status);
  return useApi<MemberClaims>(`/member/claims?${params}`);
}

export function useMemberBenefits() {
  return useApi<MemberBenefits>('/member/benefits');
}

export function useMemberIDCard() {
  return useApi<IDCard>('/member/id-card');
}

export function useMemberDocuments() {
  return useApi<{ documents: any[]; grouped: Record<string, any[]> }>('/member/documents');
}

export function useMemberMessages() {
  return useApi<{ messages: any[]; unreadCount: number }>('/member/messages');
}

export function useMemberProviders(query?: string, specialty?: string) {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (specialty) params.set('specialty', specialty);
  return useApi<{ providers: any[]; specialties: string[] }>(`/member/providers?${params}`);
}

export function useMemberAppointments() {
  return useApi<{ upcoming: any[]; past: any[]; reminders: any[] }>('/member/appointments');
}

export function useMemberPrescriptions() {
  return useApi<{ prescriptions: any[]; pharmacies: any[]; summary: any }>('/member/prescriptions');
}

// Mutations
export async function submitCostEstimate(procedureCode: string, providerId?: string, quantity = 1) {
  return api.post('/member/cost-estimate', { procedureCode, providerId, quantity });
}

export async function sendMessage(subject: string, body: string) {
  return api.post('/member/messages', { subject, body });
}
