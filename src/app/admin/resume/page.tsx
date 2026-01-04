'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ResumeItem {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
}

export default function AdminResumePage() {
  const [items, setItems] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/admin/resume');
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error('Error fetching resume items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await fetch(`/api/admin/resume/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Resume</h1>
        <Link href="/admin/resume/new">
          {/* <Button>Add New Item</Button> */}
        </Link>
      </div>

      {/* {items.length === 0 ? (
        <Card>
            <p className="text-center text-gray-600 dark:text-gray-400 py-8">
              No resume items yet. Add your first work experience!
            </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Card key={item.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{item.position}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {item.company}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(item.startDate).toLocaleDateString()} -{' '}
                      {item.endDate
                        ? new Date(item.endDate).toLocaleDateString()
                        : 'Present'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/resume/${item.id}/edit`}>
                      <Button size="sm" variant="secondary">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
            </Card>
          ))} 
        </div>
      )}*/}
    </div>
  );
}
