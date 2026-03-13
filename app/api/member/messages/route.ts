import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const messages = await prisma.message.findMany({
      where: { memberId: payload.id },
      orderBy: { sentAt: 'desc' },
      take: 50,
    });

    return NextResponse.json({
      messages: messages.map(m => ({
        id: m.id,
        subject: m.subject,
        body: m.body,
        direction: m.direction,
        channel: m.channel,
        status: m.status,
        sentAt: m.sentAt,
        readAt: m.readAt,
      })),
      unreadCount: messages.filter(m => m.status === 'unread' && m.direction === 'outbound').length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { subject, body } = await req.json();

    const message = await prisma.message.create({
      data: {
        memberId: payload.id,
        subject,
        body,
        direction: 'inbound',
        channel: 'portal',
        status: 'unread',
      },
    });

    return NextResponse.json({ message, success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
