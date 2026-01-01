import Link from 'next/link';
import { Card, CardHeader} from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/posts">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <h2 className="text-xl font-semibold">Manage Blog Posts</h2>
            </CardHeader>
            {/* <CardBody> */}
              <p className="text-gray-600 dark:text-gray-400">
                Create, edit, and publish blog posts
              </p>
            {/* </CardBody> */}
          </Card>
        </Link>
        <Link href="/admin/resume">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <h2 className="text-xl font-semibold">Manage Resume</h2>
            </CardHeader>
            {/* <CardBody> */}
              <p className="text-gray-600 dark:text-gray-400">
                Update your work experience and achievements
              </p>
            {/* </CardBody> */}
          </Card>
        </Link>
      </div>
    </div>
  );
}
