import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const payload = verifyAuth(req);
    if (payload.role !== 'member') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    const where: any = { memberId: payload.id };
    if (type) where.type = type;

    const documents = await prisma.document.findMany({
      where,
      orderBy: { generatedAt: 'desc' },
    });

    // Group by type
    const grouped = {
      eob: documents.filter(d => d.type === 'eob'),
      id_card: documents.filter(d => d.type === 'id_card'),
      welcome_letter: documents.filter(d => d.type === 'welcome_letter'),
      notice: documents.filter(d => d.type === 'notice'),
    };

    return NextResponse.json({
      documents: documents.map(d => ({
        id: d.id,
        type: d.type,
        title: d.title,
        fileName: d.fileName,
        fileUrl: d.fileUrl,
        generatedAt: d.generatedAt,
        viewedAt: d.viewedAt,
      })),
      grouped,
      total: documents.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
