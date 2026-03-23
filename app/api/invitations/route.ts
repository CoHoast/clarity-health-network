import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

interface Invitation {
  id: string;
  token: string;
  provider: string;
  email: string;
  npi: string;
  sentAt: string;
  expiresAt: string;
  status: 'pending' | 'opened' | 'completed' | 'expired';
  openedAt: string | null;
  completedAt: string | null;
  applicationId: string | null;
  sentBy: string;
}

const DATA_PATH = path.join(process.cwd(), 'data', 'invitations.json');

async function loadInvitations(): Promise<Invitation[]> {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveInvitations(invitations: Invitation[]): Promise<void> {
  const dataDir = path.dirname(DATA_PATH);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(invitations, null, 2));
}

// GET /api/invitations - List all invitations
export async function GET(request: NextRequest) {
  try {
    const invitations = await loadInvitations();
    
    // Check for expired invitations and update status
    const now = new Date();
    let updated = false;
    
    for (const inv of invitations) {
      if (inv.status === 'pending' || inv.status === 'opened') {
        if (new Date(inv.expiresAt) < now) {
          inv.status = 'expired';
          updated = true;
        }
      }
    }
    
    if (updated) {
      await saveInvitations(invitations);
    }
    
    // Sort by sentAt descending (newest first)
    invitations.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    
    return NextResponse.json({
      success: true,
      invitations,
      total: invitations.length,
      stats: {
        total: invitations.length,
        pending: invitations.filter(i => i.status === 'pending').length,
        opened: invitations.filter(i => i.status === 'opened').length,
        completed: invitations.filter(i => i.status === 'completed').length,
        expired: invitations.filter(i => i.status === 'expired').length,
      },
    });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}

// POST /api/invitations - Create new invitation(s)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const invitations = await loadInvitations();
    
    // Support single or bulk invitations
    const inviteList = Array.isArray(body) ? body : [body];
    const created: Invitation[] = [];
    const errors: { email: string; error: string }[] = [];
    
    for (const invite of inviteList) {
      const { email, name, npi, expirationDays = 30, sentBy = 'admin' } = invite;
      
      if (!email) {
        errors.push({ email: email || 'unknown', error: 'Email is required' });
        continue;
      }
      
      // Check for existing pending invitation to same email
      const existing = invitations.find(
        i => i.email.toLowerCase() === email.toLowerCase() && 
        (i.status === 'pending' || i.status === 'opened')
      );
      
      if (existing) {
        errors.push({ email, error: 'Active invitation already exists' });
        continue;
      }
      
      // Generate unique token
      const token = crypto.randomBytes(32).toString('hex');
      const now = new Date();
      const expiresAt = new Date(now.getTime() + expirationDays * 24 * 60 * 60 * 1000);
      
      const newInvitation: Invitation = {
        id: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        token,
        provider: name || '',
        email: email.toLowerCase(),
        npi: npi || '',
        sentAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: 'pending',
        openedAt: null,
        completedAt: null,
        applicationId: null,
        sentBy,
      };
      
      invitations.push(newInvitation);
      created.push(newInvitation);
      
      // In production, send email here
      console.log(`[Invitation] Would send email to ${email} with token ${token}`);
    }
    
    await saveInvitations(invitations);
    
    return NextResponse.json({
      success: true,
      created: created.length,
      errors: errors.length > 0 ? errors : undefined,
      invitations: created,
    });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}
