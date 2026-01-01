import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const post = await prisma.blogPost.findUnique({
      where: { slug, status: 'published' },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        publishedAt: true,
        metadata: true,
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
