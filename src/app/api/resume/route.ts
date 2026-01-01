import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.resumeItem.findMany({
      orderBy: [{ displayOrder: 'desc' }, { startDate: 'desc' }],
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching resume items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume items' },
      { status: 500 }
    );
  }
}
