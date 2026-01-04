'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Form, Input, Button, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import Title from 'antd/es/typography';
import Paragraph from 'antd/es/typography';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      const from = searchParams.get('from') || '/admin';
      router.push(from);
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <Title style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
          Welcome back
        </Title>
        <Paragraph>
          Sign in to access the admin dashboard
        </Paragraph>
      </div>

      <Form
        name="login"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        <Form.Item
          name="email"
          rules={[{ required: true, type: 'email', message: 'Please enter a valid email' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" disabled={loading} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" disabled={loading} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto px-6 py-24 text-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
