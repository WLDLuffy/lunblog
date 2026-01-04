import Link from 'next/link';
import { Button, Card, Tag, Typography, Space, Row, Col } from 'antd';
import { ReadOutlined, RocketOutlined, CodeOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography';
import Paragraph from 'antd/es/typography';

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="max-w-3xl mx-auto text-center mb-20">
        <Tag color="blue" style={{ marginBottom: 24, fontSize: 14 }}>Welcome to LunBlog</Tag>
        <Title style={{
          fontFamily: 'Merriweather, Georgia, serif',
          fontSize: '4rem',
          marginBottom: 32,
          lineHeight: 1.2
        }}>
          Stay curious.
        </Title>
        <Paragraph style={{
          fontSize: '1.5rem',
          marginBottom: 48,
          color: 'rgba(0, 0, 0, 0.65)'
        }}>
          Discover stories, thinking, and expertise from writers on any topic.
        </Paragraph>
        <Space size="middle">
          <Link href="/blog">
            <Button type="primary" size="large" shape="round" style={{ paddingLeft: 32, paddingRight: 32 }}>
              Start reading
            </Button>
          </Link>
          <Link href="/about">
            <Button size="large" shape="round" style={{ paddingLeft: 32, paddingRight: 32 }}>
              Learn more
            </Button>
          </Link>
        </Space>
      </div>

      <div className="mt-32">
        <div className="text-center mb-12">
          <Title style={{ fontFamily: 'Merriweather, Georgia, serif', marginBottom: 16 }}>
            Featured Topics
          </Title>
          <Paragraph style={{ fontSize: 16, color: 'rgba(0, 0, 0, 0.65)' }}>
            Explore our most popular categories
          </Paragraph>
        </div>
        <Row gutter={[24, 24]}>
          {[
            { name: 'Technology', desc: 'Latest tech trends and innovations', icon: <ReadOutlined style={{ fontSize: 48 }} /> },
            { name: 'Programming', desc: 'Code tutorials and best practices', icon: <CodeOutlined style={{ fontSize: 48 }} /> },
            { name: 'Career', desc: 'Professional growth and insights', icon: <RocketOutlined style={{ fontSize: 48 }} /> }
          ].map((topic) => (
            <Col xs={24} md={8} key={topic.name}>
              <Card
                hoverable
                style={{ textAlign: 'center', height: '100%' }}
              >
                <div style={{ marginBottom: 16, color: '#1890ff' }}>
                  {topic.icon}
                </div>
                <Title >{topic.name}</Title>
                <Paragraph>{topic.desc}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
