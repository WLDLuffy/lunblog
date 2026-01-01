import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage(props: BlogPostPageProps) {
  const params = await props.params;
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug, status: 'published' },
  });

  if (!post) {
    notFound();
  }

  const tags = post.metadata ? (post.metadata as any).tags as string[] | undefined : undefined;
  const readingTime = post.metadata ? (post.metadata as any).readingTime as number | undefined : undefined;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <article>
        <header className="mb-16">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold mb-8 leading-tight" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
            {post.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            )}
            {readingTime && (
              <>
                <span>·</span>
                <span>{readingTime} min read</span>
              </>
            )}
          </div>
        </header>

        <Separator className="mb-12" />

        <div className="article-content">
          <div className="whitespace-pre-wrap">{post.content}</div>
        </div>
      </article>
    </div>
  );
}
