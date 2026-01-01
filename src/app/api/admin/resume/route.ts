import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { ResumeItemCreateSchema } from '@/lib/validation/resume';

export async function GET() {
  try {
    await requireAuth();

    const items = await prisma.resumeItem.findMany({
      orderBy: [{ displayOrder: 'desc' }, { startDate: 'desc' }],
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching resume items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = ResumeItemCreateSchema.parse(body);

    const item = await prisma.resumeItem.create({
      data: validatedData,
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating resume item:', error);
    return NextResponse.json(
      { error: 'Failed to create resume item' },
      { status: 500 }
    );
  }
}
