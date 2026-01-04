import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Tag, Space, Divider } from 'antd';
import { ClockCircleOutlined, CalendarOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography';
import Paragraph from 'antd/es/typography';
import Text from 'antd/es/typography';

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
        <header style={{ marginBottom: 64 }}>
          {tags && tags.length > 0 && (
            <Space size={[0, 8]} wrap style={{ marginBottom: 24 }}>
              {tags.map((tag) => (
                <Tag key={tag} color="blue">{tag}</Tag>
              ))}
            </Space>
          )}
          <Title style={{
            fontFamily: 'Merriweather, Georgia, serif',
            fontSize: '3.5rem',
            marginBottom: 32,
            lineHeight: 1.2
          }}>
            {post.title}
          </Title>
          <Space size="large">
            {post.publishedAt && (
              <Text>
                <CalendarOutlined /> {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            )}
            {readingTime && (
              <Text>
                <ClockCircleOutlined /> {readingTime} min read
              </Text>
            )}
          </Space>
        </header>

        <Divider />

        <div className="article-content" style={{ marginTop: 48 }}>
          <div style={{ whiteSpace: 'pre-wrap' }}>{post.content}</div>
        </div>
      </article>
    </div>
  );
}
