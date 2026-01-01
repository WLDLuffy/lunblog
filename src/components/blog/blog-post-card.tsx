import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface BlogPostCardProps {
  post: {
    slug: string;
    title: string;
    excerpt: string | null;
    publishedAt: Date | null;
    metadata: any;
  };
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const tags = post.metadata?.tags as string[] | undefined;
  const readingTime = post.metadata?.readingTime as number | undefined;

  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="space-y-4 py-8">
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="hover:bg-secondary/80">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          <h2 className="text-3xl font-bold leading-tight group-hover:text-primary transition-colors" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-3">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
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
        </div>
      </Link>
      <Separator />
    </article>
  );
}
