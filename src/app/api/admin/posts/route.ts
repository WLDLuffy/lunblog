import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { BlogPostCreateSchema } from '@/lib/validation/blog';
import { Prisma } from '@prisma/client';

export async function GET() {
  try {
    await requireAuth();

    const posts = await prisma.blogPost.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAuth();

    const body = await request.json();
    const validatedData = BlogPostCreateSchema.parse(body);

    const createData: any = {
      title: validatedData.title,
      slug: validatedData.slug,
      content: validatedData.content,
      excerpt: validatedData.excerpt,
      status: validatedData.status,
      publishedAt:
        validatedData.status === 'published' ? new Date() : null,
    };

    if (validatedData.metadata) {
      createData.metadata = validatedData.metadata;
    }

    const post = await prisma.blogPost.create({
      data: createData,
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}
