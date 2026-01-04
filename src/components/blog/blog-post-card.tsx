import Link from 'next/link';
import { Typography, Tag, Space, Divider } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography';
import Paragraph from 'antd/es/typography';
import Text from 'antd/es/typography';

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
    <article style={{ paddingTop: 32, paddingBottom: 32 }}>
      <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div>
          {tags && tags.length > 0 && (
            <Space size={[0, 8]} wrap style={{ marginBottom: 16 }}>
              {tags.slice(0, 3).map((tag) => (
                <Tag key={tag} color="blue">{tag}</Tag>
              ))}
            </Space>
          )}
          <Title
            style={{
              fontFamily: 'Merriweather, Georgia, serif',
              marginBottom: 16,
              cursor: 'pointer'
            }}
            className="hover:text-blue-500 transition-colors"
          >
            {post.title}
          </Title>
          {post.excerpt && (
            <Paragraph
              style={{
                fontSize: 18,
                marginBottom: 16,
                color: 'rgba(0, 0, 0, 0.65)'
              }}
            >
              {post.excerpt}
            </Paragraph>
          )}
          <Space size="middle">
            {post.publishedAt && (
              <Text>
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
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
        </div>
      </Link>
      <Divider />
    </article>
  );
}
