import { prisma } from '@/lib/prisma';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { Separator } from '@/components/ui/separator';

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      metadata: true,
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>Stories</h1>
        <p className="text-lg text-muted-foreground">Thoughts, ideas, and stories</p>
      </div>

      <Separator className="mb-12" />

      {posts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-xl text-muted-foreground">
            No stories published yet. Check back soon!
          </p>
        </div>
      ) : (
        <div>
          {posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
