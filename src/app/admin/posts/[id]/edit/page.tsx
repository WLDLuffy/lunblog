'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPostPage(props: EditPostPageProps) {
  const router = useRouter();
  const [id, setId] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'draft' as 'draft' | 'published',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    props.params.then((params) => {
      setId(params.id);
      fetchPost(params.id);
    });
  }, [props.params]);

  const fetchPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`);
      const data = await response.json();
      setFormData({
        title: data.post.title,
        slug: data.post.slug,
        content: data.post.content,
        excerpt: data.post.excerpt || '',
        status: data.post.status,
      });
    } catch (err) {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const response = await fetch(`/api/admin/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update post');
        setSaving(false);
        return;
      }

      router.push('/admin/posts');
    } catch (err) {
      setError('An unexpected error occurred');
      setSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Post Details</h2>
        </CardHeader>
        {/* <CardBody> */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
            <Input
              label="Slug (URL)"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800"
                rows={3}
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800"
                rows={15}
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'draft' | 'published',
                  })
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        {/* </CardBody> */}
      </Card>
    </div>
  );
}
