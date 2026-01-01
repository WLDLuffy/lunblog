'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
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
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to access the admin dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
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
