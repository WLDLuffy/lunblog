'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';

export default function NewResumeItemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    description: '',
    startDate: '',
    endDate: '',
    displayOrder: 0,
    isCurrentPosition: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        company: formData.company,
        position: formData.position,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.isCurrentPosition ? null : formData.endDate || null,
        displayOrder: formData.displayOrder,
      };

      const response = await fetch('/api/admin/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to create item');
        setLoading(false);
        return;
      }

      router.push('/admin/resume');
    } catch (err) {
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Add Resume Item</h1>
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Work Experience Details</h2>
        </CardHeader>
        {/* <CardBody> */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                {error}
              </div>
            )}
            <Input
              label="Company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              required
            />
            <Input
              label="Position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              required
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800"
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
              required
            />
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isCurrentPosition}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isCurrentPosition: e.target.checked,
                    })
                  }
                />
                <span className="text-sm font-medium">Current Position</span>
              </label>
            </div>
            {!formData.isCurrentPosition && (
              <Input
                label="End Date"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            )}
            <Input
              label="Display Order (higher = shows first)"
              type="number"
              value={formData.displayOrder}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  displayOrder: parseInt(e.target.value) || 0,
                })
              }
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Item'}
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
