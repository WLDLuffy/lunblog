import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { BlogPostUpdateSchema } from '@/lib/validation/blog';
import { Prisma } from '@prisma/client';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await context.params;

    const post = await prisma.blogPost.findUnique({ where: { id } });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
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
    const validatedData = BlogPostUpdateSchema.parse(body);

    const updateData: any = {};

    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.slug !== undefined) updateData.slug = validatedData.slug;
    if (validatedData.content !== undefined) updateData.content = validatedData.content;
    if (validatedData.excerpt !== undefined) updateData.excerpt = validatedData.excerpt;
    if (validatedData.metadata !== undefined) {
      updateData.metadata = validatedData.metadata;
    }

    // Handle status and publishedAt together
    if (validatedData.status !== undefined) {
      updateData.status = validatedData.status;
      if (validatedData.status === 'published') {
        // Only set publishedAt if not already set
        const currentPost = await prisma.blogPost.findUnique({
          where: { id },
          select: { publishedAt: true }
        });
        if (!currentPost?.publishedAt) {
          updateData.publishedAt = new Date();
        }
      } else if (validatedData.status === 'draft') {
        updateData.publishedAt = null;
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ post });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
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

    await prisma.blogPost.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}
