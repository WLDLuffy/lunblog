'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/blog', label: 'Stories' },
    { href: '/about', label: 'About' },
    { href: '/resume', label: 'Resume' },
  ];

  return (
    <nav className="border-b" style={{ borderColor: 'var(--border-color)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
            LunBlog
          </Link>
          <div className="flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href
                    ? 'font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
                style={pathname === link.href ? { color: 'var(--foreground)' } : {}}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
