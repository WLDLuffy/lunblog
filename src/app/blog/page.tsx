import { prisma } from '@/lib/prisma';
import { BlogPostCard } from '@/components/blog/blog-post-card';
import { Typography, Divider, Empty } from 'antd';
import Title from 'antd/es/typography';
import Paragraph from 'antd/es/typography';

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
      <div style={{ marginBottom: 64, textAlign: 'center' }}>
        <Title style={{ fontFamily: 'Merriweather, Georgia, serif', fontSize: '3.5rem' }}>
          Stories
        </Title>
        <Paragraph style={{ fontSize: 18, color: 'rgba(0, 0, 0, 0.65)' }}>
          Thoughts, ideas, and stories
        </Paragraph>
      </div>

      <Divider />

      {posts.length === 0 ? (
        <div style={{ padding: '96px 0', textAlign: 'center' }}>
          <Empty
            description={
              <span style={{ fontSize: 20, color: 'rgba(0, 0, 0, 0.45)' }}>
                No stories published yet. Check back soon!
              </span>
            }
          />
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
