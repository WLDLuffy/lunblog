# Quickstart Guide
## Personal Tech Blog Platform

**Last Updated**: 2026-01-01
**For**: Developers implementing the feature

---

## Overview

This guide will help you set up and start developing the Personal Tech Blog Platform. The stack uses Next.js 15 (App Router), TypeScript, Prisma, PostgreSQL, and Tailwind CSS.

**Estimated setup time**: 30-45 minutes

---

## Prerequisites

Before starting, ensure you have:

- **Node.js**: Version 20+ (LTS)
- **pnpm**: Version 9+ (install via `npm install -g pnpm`)
- **PostgreSQL**: Local instance or cloud database (Railway, Vercel Postgres, Supabase)
- **Git**: For version control
- **Code Editor**: VS Code recommended with extensions:
  - ESLint
  - Prettier
  - Prisma
  - Tailwind CSS IntelliSense

**Check versions**:
```bash
node --version  # Should be v20.x.x or higher
pnpm --version  # Should be 9.x.x or higher
psql --version  # Should be 16.x or higher (optional if using cloud DB)
```

---

## Quick Setup (5 minutes)

### 1. Initialize Next.js Project

```bash
# Create new Next.js project with TypeScript and App Router
pnpm create next-app@latest lunblog --typescript --tailwind --app --src-dir --import-alias "@/*"

# Navigate to project directory
cd lunblog
```

**Project configuration** (when prompted):
- ✅ TypeScript: Yes
- ✅ ESLint: Yes
- ✅ Tailwind CSS: Yes
- ✅ `src/` directory: Yes
- ✅ App Router: Yes
- ✅ Import alias: `@/*`

### 2. Install Dependencies

```bash
# Install core dependencies
pnpm add @prisma/client next-auth bcrypt zod

# Install dev dependencies
pnpm add -D prisma @types/bcrypt @types/node tsx

# Install testing dependencies
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @playwright/test
```

### 3. Setup Database

**Option A: Local PostgreSQL**
```bash
# Create database
createdb lunblog_dev

# Or via psql
psql -U postgres
CREATE DATABASE lunblog_dev;
\q
```

**Option B: Cloud Database (Recommended)**

**Vercel Postgres (easiest)**:
1. Go to [vercel.com/storage](https://vercel.com/storage)
2. Create new Postgres database
3. Copy connection string

**Railway**:
1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy connection string

**Supabase**:
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection string

### 4. Setup Environment Variables

Create `.env` file in project root:

```bash
# .env (DO NOT COMMIT - add to .gitignore)

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lunblog_dev"

# For Prisma migrations (same as DATABASE_URL for local dev)
DIRECT_URL="postgresql://user:password@localhost:5432/lunblog_dev"

# NextAuth.js (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

**Generate secure secret**:
```bash
openssl rand -base64 32
```

### 5. Initialize Prisma

```bash
# Initialize Prisma
pnpm prisma init

# This creates:
# - prisma/schema.prisma
# - .env (if not exists)
```

Replace `prisma/schema.prisma` with the schema from `data-model.md`:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum PostStatus {
  draft
  published
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  passwordHash String
  name         String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  sessions     Session[]

  @@map("User")
}

model Session {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expiresAt DateTime
  createdAt DateTime @default(now())
  data      Json?

  @@index([userId])
  @@index([expiresAt])
  @@map("Session")
}

model BlogPost {
  id          String     @id @default(uuid())
  title       String
  slug        String     @unique
  content     String     @db.Text
  excerpt     String?
  status      PostStatus @default(draft)
  publishedAt DateTime?
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  metadata    Json?

  @@index([slug])
  @@index([status])
  @@index([publishedAt(sort: Desc)])
  @@index([createdAt(sort: Desc)])
  @@map("BlogPost")
}

model ResumeItem {
  id           String   @id @default(uuid())
  company      String
  position     String
  description  String   @db.Text
  startDate    DateTime @db.Date
  endDate      DateTime? @db.Date
  displayOrder Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@index([displayOrder(sort: Desc)])
  @@index([startDate(sort: Desc)])
  @@map("ResumeItem")
}
```

### 6. Run Database Migrations

```bash
# Create initial migration
pnpm prisma migrate dev --name init

# Generate Prisma Client
pnpm prisma generate
```

### 7. Seed Database (Optional)

Create `prisma/seed.ts`:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const passwordHash = await bcrypt.hash('Admin123!@#', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      name: 'Blog Admin'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Create sample blog posts
  const post1 = await prisma.blogPost.upsert({
    where: { slug: 'getting-started-nextjs' },
    update: {},
    create: {
      title: 'Getting Started with Next.js',
      slug: 'getting-started-nextjs',
      content: '# Getting Started\n\nNext.js is a powerful React framework...',
      excerpt: 'Learn the basics of Next.js and build your first app',
      status: 'published',
      publishedAt: new Date('2025-12-15'),
      metadata: { tags: ['Next.js', 'React'], category: 'Tutorial', readingTime: 8 }
    }
  });
  console.log('✅ Blog post created:', post1.title);

  // Create sample resume items
  const resume1 = await prisma.resumeItem.upsert({
    where: { id: 'sample-resume-1' },
    update: {},
    create: {
      id: 'sample-resume-1',
      company: 'Tech Startup Inc.',
      position: 'Senior Software Engineer',
      description: 'Led development of microservices architecture using Next.js, Node.js, and PostgreSQL.',
      startDate: new Date('2023-01-01'),
      endDate: null,
      displayOrder: 100
    }
  });
  console.log('✅ Resume item created:', resume1.company);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to `package.json`:
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Run seed:
```bash
pnpm prisma db seed
```

**Default admin credentials** (change immediately):
- Email: `admin@example.com`
- Password: `Admin123!@#`

### 8. Start Development Server

```bash
# Start Next.js dev server
pnpm dev

# Server runs at http://localhost:3000
```

**Test the setup**:
1. Visit `http://localhost:3000` - should see Next.js welcome page
2. Database connection should work (no errors in console)

---

## Project Structure

After setup, your project should look like:

```
lunblog/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── blog/               # Blog pages
│   │   ├── about/              # About page
│   │   ├── resume/             # Resume page
│   │   ├── admin/              # Admin pages
│   │   └── api/                # API routes
│   │       ├── posts/
│   │       ├── resume/
│   │       ├── auth/
│   │       └── admin/
│   ├── components/             # React components
│   │   ├── ui/                 # UI components (buttons, inputs, etc.)
│   │   ├── layout/             # Layout components (header, footer, nav)
│   │   └── blog/               # Blog-specific components
│   ├── lib/                    # Utility functions
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── auth.ts             # Authentication utilities
│   │   └── validation.ts       # Zod schemas
│   └── types/                  # TypeScript type definitions
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Database seeding script
│   └── migrations/             # Migration history
├── public/                     # Static files
├── tests/
│   ├── unit/                   # Unit tests (Vitest)
│   ├── integration/            # Integration tests (Vitest)
│   └── e2e/                    # E2E tests (Playwright)
├── .env                        # Environment variables (DO NOT COMMIT)
├── .env.example                # Example env file
├── .gitignore
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Vitest configuration
├── playwright.config.ts        # Playwright configuration
└── package.json
```

---

## Development Workflow

### Daily Development

```bash
# Start dev server
pnpm dev

# Open Prisma Studio (database GUI)
pnpm prisma studio

# Run type checking
pnpm tsc --noEmit

# Run linting
pnpm lint

# Format code
pnpm format
```

### Database Workflow

```bash
# Create new migration after schema changes
pnpm prisma migrate dev --name your-migration-name

# Reset database (WARNING: deletes all data)
pnpm prisma migrate reset

# Open Prisma Studio to view/edit data
pnpm prisma studio

# Generate Prisma Client (after schema changes)
pnpm prisma generate
```

### Testing Workflow

```bash
# Run unit tests
pnpm test

# Run unit tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Run E2E tests in UI mode
pnpm test:e2e:ui

# Generate test coverage report
pnpm test:coverage
```

---

## Configuration Files

### Create Vitest Config

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Create Playwright Config

```bash
# Initialize Playwright
pnpm create playwright
```

Or create `playwright.config.ts` manually:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Update package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "prisma:studio": "prisma studio",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "prisma:seed": "prisma db seed"
  }
}
```

---

## Essential Code Snippets

### 1. Prisma Client Singleton

Create `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

### 2. Example API Route (Get Posts)

Create `src/app/api/posts/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: { status: 'published' },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        skip: offset,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          publishedAt: true,
          metadata: true,
        },
      }),
      prisma.blogPost.count({ where: { status: 'published' } }),
    ]);

    return NextResponse.json({
      posts,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
```

### 3. Example Page Component (Blog List)

Create `src/app/blog/page.tsx`:

```typescript
import { prisma } from '@/lib/prisma';

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: 'published' },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
    },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id} className="border-b pb-6">
            <h2 className="text-2xl font-semibold mb-2">
              <a href={`/blog/${post.slug}`} className="hover:text-blue-600">
                {post.title}
              </a>
            </h2>
            <p className="text-gray-600 mb-2">{post.excerpt}</p>
            <time className="text-sm text-gray-500">
              {post.publishedAt?.toLocaleDateString()}
            </time>
          </article>
        ))}
      </div>
    </main>
  );
}
```

---

## Common Issues & Solutions

### Issue 1: Prisma Client Not Generated

**Error**: `Cannot find module '@prisma/client'`

**Solution**:
```bash
pnpm prisma generate
```

### Issue 2: Database Connection Failed

**Error**: `Can't reach database server`

**Solution**:
- Check `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running: `pg_isready`
- Test connection: `psql $DATABASE_URL`

### Issue 3: Port 3000 Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
pnpm dev -p 3001
```

### Issue 4: TypeScript Errors After Schema Changes

**Error**: Type errors after updating Prisma schema

**Solution**:
```bash
pnpm prisma generate
# Restart TypeScript server in VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## Next Steps

1. **Review Documentation**:
   - Read `spec.md` for feature requirements
   - Review `data-model.md` for database schema details
   - Check `contracts/openapi.yaml` for API specifications

2. **Start Building**:
   - Begin with public pages (Blog, About, Resume)
   - Implement API routes following contracts
   - Add admin authentication
   - Build admin dashboard

3. **Follow Best Practices**:
   - Write tests as you go (TDD approach)
   - Use Zod for input validation
   - Keep components small and focused
   - Follow Next.js App Router patterns

4. **Helpful Resources**:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Prisma Docs](https://www.prisma.io/docs)
   - [Tailwind CSS Docs](https://tailwindcss.com/docs)
   - [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

---

## Getting Help

- **Spec Questions**: Refer to `spec.md` for requirements clarification
- **Architecture Questions**: See `plan.md` for technical decisions
- **API Questions**: Check `contracts/README.md` and `openapi.yaml`
- **Database Questions**: Review `data-model.md`

Happy coding! 🚀
