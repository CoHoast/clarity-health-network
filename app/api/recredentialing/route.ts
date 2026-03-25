/**
 * Re-credentialing API
 * GET /api/recredentialing - Get re-credentialing records from real providers
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface RecredentialingRecord {
  id: number;
  provider: string;
  practice: string;
  npi: string;
  specialty: string;
  providerType: string;
  currentExpires: string;
  daysUntil: number;
  status: "due_soon" | "upcoming" | "in_progress" | "overdue" | "completed";
  remindersSent: number;
  lastReminder: string | null;
  applicationStarted: boolean;
  workflowStage: string;
  cleanHistory: boolean;
  eligibleForAbbreviated: boolean;
  city?: string;
  state?: string;
}

// Generate re-credentialing records from real provider data
function generateRecredentialingRecords(providers: any[], practices: any[]): RecredentialingRecord[] {
  const records: RecredentialingRecord[] = [];
  const today = new Date();
  
  // Get unique providers by NPI - take first 50 for re-credentialing demo
  const uniqueProviders = new Map<string, any>();
  providers.forEach(p => {
    if (p.npi && !uniqueProviders.has(p.npi)) {
      uniqueProviders.set(p.npi, p);
    }
  });
  
  const sampleProviders = Array.from(uniqueProviders.values()).slice(0, 50);
  
  sampleProviders.forEach((provider, index) => {
    const providerName = `${provider.firstName || ''} ${provider.lastName || ''}`.trim();
    const credential = provider.credentials || provider.credential || '';
    const displayName = credential ? `${providerName}, ${credential}` : providerName;
    
    // Find the practice
    const practice = practices.find(p => p.taxId === provider.billing?.taxId);
    const practiceName = practice?.name || provider.billing?.name || 'Unknown Practice';
    
    // Determine provider type based on credentials
    let providerType = "Physician";
    const credLower = credential.toLowerCase();
    if (credLower.includes('np') || credLower.includes('pa')) {
      providerType = "Mid-Level";
    } else if (credLower.includes('lcsw') || credLower.includes('lpc') || credLower.includes('psych')) {
      providerType = "Behavioral Health";
    } else if (credLower.includes('pt') || credLower.includes('ot')) {
      providerType = "Allied Health";
    }
    
    // Generate expiration date (spread across next 6 months)
    const expiresDate = new Date(today);
    expiresDate.setDate(expiresDate.getDate() + Math.floor(Math.random() * 180) - 30); // -30 to +150 days
    
    const daysUntil = Math.floor((expiresDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // Determine status based on days until expiration
    let status: RecredentialingRecord["status"];
    let workflowStage: string;
    let remindersSent = 0;
    let applicationStarted = false;
    
    if (daysUntil < -7) {
      status = "overdue";
      workflowStage = "overdue";
      remindersSent = 3;
    } else if (daysUntil < 0) {
      status = "in_progress";
      workflowStage = "final_review";
      remindersSent = 2;
      applicationStarted = true;
    } else if (daysUntil < 30) {
      status = "due_soon";
      workflowStage = "reminder_30";
      remindersSent = 2;
      applicationStarted = Math.random() > 0.5;
    } else if (daysUntil < 60) {
      status = "due_soon";
      workflowStage = "reminder_60";
      remindersSent = 1;
    } else if (daysUntil < 90) {
      status = "upcoming";
      workflowStage = "reminder_90";
      remindersSent = 1;
    } else {
      status = "upcoming";
      workflowStage = "scheduled";
      remindersSent = 0;
    }
    
    // Some already completed
    if (Math.random() < 0.15) {
      status = "completed";
      workflowStage = "approved";
      applicationStarted = true;
      expiresDate.setFullYear(expiresDate.getFullYear() + 3);
    }
    
    const lastReminderDate = remindersSent > 0 ? new Date(today) : null;
    if (lastReminderDate) {
      lastReminderDate.setDate(lastReminderDate.getDate() - Math.floor(Math.random() * 14));
    }
    
    records.push({
      id: index + 1,
      provider: displayName,
      practice: practiceName,
      npi: provider.npi,
      specialty: provider.specialty || 'General Practice',
      providerType,
      currentExpires: expiresDate.toISOString().split('T')[0],
      daysUntil,
      status,
      remindersSent,
      lastReminder: lastReminderDate ? lastReminderDate.toISOString().split('T')[0] : null,
      applicationStarted,
      workflowStage,
      cleanHistory: Math.random() > 0.1, // 90% have clean history
      eligibleForAbbreviated: Math.random() > 0.3, // 70% eligible
      city: provider.locations?.[0]?.city || practice?.city,
      state: provider.locations?.[0]?.state || practice?.state || 'AZ',
    });
  });
  
  // Sort by days until expiration
  records.sort((a, b) => a.daysUntil - b.daysUntil);
  
  return records;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    // Load real data
    const providersFile = path.join(process.cwd(), 'data', 'arizona-providers.json');
    const practicesFile = path.join(process.cwd(), 'data', 'arizona-practices.json');
    
    let providers: any[] = [];
    let practices: any[] = [];
    
    if (fs.existsSync(providersFile)) {
      providers = JSON.parse(fs.readFileSync(providersFile, 'utf-8'));
    }
    if (fs.existsSync(practicesFile)) {
      practices = JSON.parse(fs.readFileSync(practicesFile, 'utf-8'));
    }
    
    // Generate records
    let records = generateRecredentialingRecords(providers, practices);
    
    // Apply filters
    if (status && status !== 'all') {
      records = records.filter(r => r.status === status);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      records = records.filter(r => 
        r.provider.toLowerCase().includes(searchLower) ||
        r.practice.toLowerCase().includes(searchLower) ||
        r.npi.includes(search) ||
        r.specialty.toLowerCase().includes(searchLower)
      );
    }
    
    // Calculate stats
    const allRecords = generateRecredentialingRecords(providers, practices);
    const stats = {
      total: allRecords.length,
      dueSoon: allRecords.filter(r => r.status === 'due_soon').length,
      upcoming: allRecords.filter(r => r.status === 'upcoming').length,
      inProgress: allRecords.filter(r => r.status === 'in_progress').length,
      overdue: allRecords.filter(r => r.status === 'overdue').length,
      completed: allRecords.filter(r => r.status === 'completed').length,
    };
    
    return NextResponse.json({
      records,
      stats,
      totalProviders: providers.length,
    });
    
  } catch (error) {
    console.error('Re-credentialing error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch re-credentialing data' },
      { status: 500 }
    );
  }
}
