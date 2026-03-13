import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Mock messages for provider portal demo
    const messages = [
      {
        id: 'msg-1',
        subject: 'Contract Renewal Reminder',
        body: 'Your contract is up for renewal in 60 days. Please review the updated terms and contact our provider relations team if you have any questions.',
        direction: 'inbound',
        channel: 'portal',
        status: 'unread',
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        readAt: null,
      },
      {
        id: 'msg-2',
        subject: 'Credentialing Document Request',
        body: 'We need an updated copy of your DEA certificate. Please upload it to your provider portal or fax to (800) 555-0100.',
        direction: 'inbound',
        channel: 'email',
        status: 'read',
        sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        readAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-3',
        subject: 'Fee Schedule Update Notice',
        body: 'The 2026 fee schedule has been updated. New rates are effective April 1, 2026. View the updated schedule in your portal.',
        direction: 'inbound',
        channel: 'portal',
        status: 'read',
        sentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        readAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    return NextResponse.json({
      messages,
      unreadCount: messages.filter(m => m.status === 'unread').length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'provider') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { subject, body } = await req.json();

    // Mock response for demo
    const message = {
      id: `msg-${Date.now()}`,
      subject,
      body,
      direction: 'outbound',
      channel: 'portal',
      status: 'sent',
      sentAt: new Date().toISOString(),
    };

    return NextResponse.json({ message, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
