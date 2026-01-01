import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { ResumeItemUpdateSchema } from '@/lib/validation/resume';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const item = await prisma.resumeItem.findUnique({ where: { id } });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching resume item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await context.params;
    const body = await request.json();
    const validatedData = ResumeItemUpdateSchema.parse(body);

    const item = await prisma.resumeItem.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({ item });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating resume item:', error);
    return NextResponse.json(
      { error: 'Failed to update resume item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await context.params;

    await prisma.resumeItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting resume item:', error);
    return NextResponse.json(
      { error: 'Failed to delete resume item' },
      { status: 500 }
    );
  }
}
