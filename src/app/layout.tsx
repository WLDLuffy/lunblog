import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/layout/navigation';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { Layout } from 'antd';
import Content from 'antd/es/layout';
import Footer from 'antd/es/layout';
import Text from 'antd/es/typography';

export const metadata: Metadata = {
  title: 'LunBlog - Tech Insights',
  description: 'Personal tech blog reflecting on trends and topics of interest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AntdRegistry>
          <Layout style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            <Navigation />
            <Content>
              {children}
            </Content>
            <Footer style={{ textAlign: 'center', borderTop: '1px solid #f0f0f0', backgroundColor: '#fafafa' }}>
              <Text>
                © {new Date().getFullYear()} LunBlog. All rights reserved.
              </Text>
            </Footer>
          </Layout>
        </AntdRegistry>
      </body>
    </html>
  );
}
