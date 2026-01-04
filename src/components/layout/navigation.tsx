'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'antd';
import { ReadOutlined, UserOutlined, FileTextOutlined, HomeOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import Title from 'antd/es/typography';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const getSelectedKey = () => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/blog')) return 'blog';
    if (pathname.startsWith('/about')) return 'about';
    if (pathname.startsWith('/resume')) return 'resume';
    return 'home';
  };

  const [current, setCurrent] = useState(getSelectedKey());

  useEffect(() => {
    setCurrent(getSelectedKey());
  }, [pathname]);

  const items: MenuProps['items'] = [
    {
      label: <Link href="/">Home</Link>,
      key: 'home',
      icon: <HomeOutlined />,
    },
    {
      label: <Link href="/blog">Stories</Link>,
      key: 'blog',
      icon: <ReadOutlined />,
    },
    {
      label: <Link href="/about">About</Link>,
      key: 'about',
      icon: <UserOutlined />,
    },
    {
      label: <Link href="/resume">Resume</Link>,
      key: 'resume',
      icon: <FileTextOutlined />,
    },
  ];

  return (
    <div style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: '#fff' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 80 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Title style={{
              margin: 0,
              fontFamily: 'Merriweather, Georgia, serif',
              color: '#000'
            }}>
              LunBlog
            </Title>
          </Link>
          <Menu
            mode="horizontal"
            selectedKeys={[current]}
            items={items}
            style={{ border: 'none', flex: 1, justifyContent: 'flex-end' }}
          />
        </div>
      </div>
    </div>
  );
}

