import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/layout/navigation';

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
        <Navigation />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-12 text-center text-sm" style={{ borderColor: 'var(--border-color)', color: 'var(--foreground)', opacity: 0.6 }}>
          <div className="max-w-6xl mx-auto px-6">
            © {new Date().getFullYear()} LunBlog. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
