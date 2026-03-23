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
  await fs.writeFile(DATA_PATH, JSON.stringify(invitations, null, 2));
}

// GET /api/invitations/[id] - Get single invitation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invitations = await loadInvitations();
    
    // Find by ID or token
    const invitation = invitations.find(i => i.id === id || i.token === id);
    
    if (!invitation) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      invitation,
    });
  } catch (error) {
    console.error('Error fetching invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch invitation' },
      { status: 500 }
    );
  }
}

// PATCH /api/invitations/[id] - Update invitation (resend, mark opened, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;
    
    const invitations = await loadInvitations();
    const index = invitations.findIndex(i => i.id === id || i.token === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }
    
    const invitation = invitations[index];
    
    switch (action) {
      case 'resend': {
        // Generate new token and extend expiration
        const newToken = crypto.randomBytes(32).toString('hex');
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
        
        invitation.token = newToken;
        invitation.sentAt = now.toISOString();
        invitation.expiresAt = expiresAt.toISOString();
        invitation.status = 'pending';
        invitation.openedAt = null;
        
        console.log(`[Invitation] Resending to ${invitation.email} with new token`);
        break;
      }
      
      case 'mark_opened': {
        if (invitation.status === 'pending') {
          invitation.status = 'opened';
          invitation.openedAt = new Date().toISOString();
        }
        break;
      }
      
      case 'mark_completed': {
        invitation.status = 'completed';
        invitation.completedAt = new Date().toISOString();
        if (body.applicationId) {
          invitation.applicationId = body.applicationId;
        }
        break;
      }
      
      case 'cancel': {
        invitation.status = 'expired';
        break;
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    invitations[index] = invitation;
    await saveInvitations(invitations);
    
    return NextResponse.json({
      success: true,
      invitation,
    });
  } catch (error) {
    console.error('Error updating invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update invitation' },
      { status: 500 }
    );
  }
}

// DELETE /api/invitations/[id] - Delete invitation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const invitations = await loadInvitations();
    
    const index = invitations.findIndex(i => i.id === id);
    
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: 'Invitation not found' },
        { status: 404 }
      );
    }
    
    invitations.splice(index, 1);
    await saveInvitations(invitations);
    
    return NextResponse.json({
      success: true,
      message: 'Invitation deleted',
    });
  } catch (error) {
    console.error('Error deleting invitation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete invitation' },
      { status: 500 }
    );
  }
}
