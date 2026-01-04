'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  slug: string;
  status: 'draft' | 'published';
  createdAt: Date;
  publishedAt: Date | null;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/admin/posts');
      const data = await response.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' });
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blog Posts</h1>
        <Link href="/admin/posts/new">
          {/* <Button>Create New Post</Button> */}
        </Link>
      </div>

      {/* {posts.length === 0 ? (
        <Card>
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              No blog posts yet. Create your first post!
            </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {post.slug}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          post.status === 'published'
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Button size="sm" variant="secondary">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
            </Card>
          ))}
        </div>
      )} */}
    </div>
  );
}
