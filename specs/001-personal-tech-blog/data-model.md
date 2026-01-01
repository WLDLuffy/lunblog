# Data Model
## Personal Tech Blog Platform

**Date**: 2026-01-01
**Database**: PostgreSQL 16+
**ORM**: Prisma

---

## Overview

This document defines the data model for the personal tech blog platform. The model supports three primary entities: Blog Posts, Resume Items, and Admin User authentication.

---

## Entity Definitions

### 1. BlogPost

Represents a tech article/blog post written by the blog owner.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| title | VARCHAR(255) | NOT NULL | Blog post title |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| content | TEXT | NOT NULL | Full blog post content (Markdown or HTML) |
| excerpt | VARCHAR(500) | NULLABLE | Short preview text for blog feed |
| status | ENUM | NOT NULL, DEFAULT 'draft' | Publication status: 'draft' or 'published' |
| publishedAt | TIMESTAMP | NULLABLE | Publication date/time (NULL for drafts) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |
| metadata | JSONB | NULLABLE | Flexible field for tags, categories, SEO data |

**Validation Rules**:
- `title`: Must be 1-255 characters
- `slug`: Must be unique, lowercase, URL-safe (alphanumeric + hyphens)
- `content`: Minimum 1 character (enforce in application layer)
- `excerpt`: Maximum 500 characters
- `status`: Must be 'draft' or 'published'
- `publishedAt`: Required when status = 'published', NULL when status = 'draft'

**State Transitions**:
```
draft → published: Set publishedAt to NOW(), status = 'published'
published → draft: Set publishedAt to NULL, status = 'draft'
```

**Indexes**:
- `slug` (UNIQUE) - for fast lookups by URL
- `status` - for filtering published posts
- `publishedAt DESC` - for chronological sorting of blog feed
- `createdAt DESC` - for admin view sorting

**Example Metadata (JSONB)**:
```json
{
  "tags": ["JavaScript", "TypeScript", "Next.js"],
  "category": "Web Development",
  "seo": {
    "metaDescription": "Learn how to build...",
    "ogImage": "/images/post-1-og.jpg"
  },
  "readingTime": 8
}
```

---

### 2. ResumeItem

Represents a professional achievement or work experience entry on the Resume page.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| company | VARCHAR(255) | NOT NULL | Company/organization name |
| position | VARCHAR(255) | NOT NULL | Job title/role |
| description | TEXT | NOT NULL | Achievements, responsibilities, details |
| startDate | DATE | NOT NULL | Employment/achievement start date |
| endDate | DATE | NULLABLE | Employment/achievement end date (NULL = current/ongoing) |
| displayOrder | INTEGER | NOT NULL, DEFAULT 0 | Sort order (higher = displayed first) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules**:
- `company`: Must be 1-255 characters
- `position`: Must be 1-255 characters
- `description`: Minimum 1 character
- `startDate`: Cannot be in the future (validate in app layer)
- `endDate`: If not NULL, must be >= startDate
- `displayOrder`: Used for manual ordering (higher values first)

**Sorting**:
- Primary sort: `displayOrder DESC` (manual ordering)
- Secondary sort: `startDate DESC` (most recent first)
- Items with NULL `endDate` typically have higher `displayOrder` (current positions)

**Indexes**:
- `displayOrder DESC` - for efficient sorting
- `startDate DESC` - secondary sorting

**Display Logic**:
- If `endDate` IS NULL: Display as "Present" or "Current"
- If `endDate` IS NOT NULL: Display date range

---

### 3. User (Admin)

Represents the blog owner with authentication credentials.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Admin email address |
| passwordHash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| name | VARCHAR(255) | NULLABLE | Admin display name |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Validation Rules**:
- `email`: Must be valid email format, unique
- `passwordHash`: Bcrypt hash with salt rounds >= 10
- Password (pre-hash): Minimum 12 characters, must include uppercase, lowercase, number, special character

**Security Notes**:
- Never store plain-text passwords
- Use bcrypt with minimum 10 salt rounds (recommended: 12)
- Implement rate limiting on authentication endpoints
- Consider adding `lastLoginAt` field for audit logging

**Indexes**:
- `email` (UNIQUE) - for fast authentication lookups

---

### 4. Session

Stores server-side session data for admin authentication.

**Fields**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Session identifier (also used in cookie) |
| userId | UUID | FOREIGN KEY → User(id), NOT NULL | Reference to authenticated user |
| expiresAt | TIMESTAMP | NOT NULL | Session expiration time (30 minutes from last activity) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Session creation timestamp |
| data | JSONB | NULLABLE | Additional session data (optional) |

**Validation Rules**:
- `expiresAt`: Must be in the future (rolling 30-minute window from last activity)
- Expired sessions should be automatically cleaned up (cron job or on-access cleanup)

**Session Lifecycle**:
1. **Login**: Create new session, set `expiresAt` = NOW() + 30 minutes
2. **Activity**: Update `expiresAt` = NOW() + 30 minutes (rolling session)
3. **Logout**: Delete session record
4. **Expiration**: Automatically invalidate when NOW() > `expiresAt`

**Indexes**:
- `userId` - for user session lookups
- `expiresAt` - for efficient expired session cleanup

**Cleanup Strategy**:
```sql
-- Run periodically (e.g., every hour)
DELETE FROM "Session" WHERE "expiresAt" < NOW();
```

---

## Relationships

```
User (1) ←→ (many) Session
  - One user can have multiple sessions (different devices)
  - Cascade delete: When user deleted, delete all sessions

BlogPost (independent)
  - No foreign key relationships
  - Blog posts are created by the admin user (implicit, no FK needed for single-user blog)

ResumeItem (independent)
  - No foreign key relationships
  - Resume items belong to the blog owner (implicit, no FK needed)
```

**Rationale for No FKs to User**:
- Single-user system: All content created by the one admin user
- Simplifies data model
- If multi-user support needed in future, can add `authorId` FK to User

---

## Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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

---

## Common Queries

### BlogPost Queries

**Get all published posts (public)**:
```prisma
const posts = await prisma.blogPost.findMany({
  where: { status: 'published' },
  orderBy: { publishedAt: 'desc' },
  select: {
    id: true,
    title: true,
    slug: true,
    excerpt: true,
    publishedAt: true,
    metadata: true
  }
});
```

**Get single post by slug (public)**:
```prisma
const post = await prisma.blogPost.findUnique({
  where: { slug: 'my-blog-post' },
  select: {
    id: true,
    title: true,
    content: true,
    publishedAt: true,
    metadata: true
  }
});
```

**Get all posts including drafts (admin)**:
```prisma
const posts = await prisma.blogPost.findMany({
  orderBy: { updatedAt: 'desc' }
});
```

**Create new draft post (admin)**:
```prisma
const post = await prisma.blogPost.create({
  data: {
    title: 'New Post Title',
    slug: 'new-post-title',
    content: 'Post content...',
    excerpt: 'Short preview...',
    status: 'draft',
    metadata: {
      tags: ['JavaScript', 'Web Development'],
      category: 'Tutorial'
    }
  }
});
```

**Publish draft post (admin)**:
```prisma
const post = await prisma.blogPost.update({
  where: { id: postId },
  data: {
    status: 'published',
    publishedAt: new Date()
  }
});
```

### ResumeItem Queries

**Get all resume items (public)**:
```prisma
const items = await prisma.resumeItem.findMany({
  orderBy: [
    { displayOrder: 'desc' },
    { startDate: 'desc' }
  ]
});
```

**Create new resume item (admin)**:
```prisma
const item = await prisma.resumeItem.create({
  data: {
    company: 'Tech Company Inc.',
    position: 'Senior Software Engineer',
    description: 'Led development of...',
    startDate: new Date('2024-01-01'),
    endDate: null, // Current position
    displayOrder: 100
  }
});
```

### Session Queries

**Create new session (login)**:
```prisma
const session = await prisma.session.create({
  data: {
    userId: user.id,
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  }
});
```

**Validate and refresh session**:
```prisma
const session = await prisma.session.update({
  where: { id: sessionId },
  data: {
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // Rolling 30 minutes
  },
  include: {
    user: {
      select: { id: true, email: true, name: true }
    }
  }
});
```

**Cleanup expired sessions (background job)**:
```prisma
await prisma.session.deleteMany({
  where: {
    expiresAt: { lt: new Date() }
  }
});
```

---

## Data Seeding (Development)

**Example seed data for development/testing**:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const passwordHash = await bcrypt.hash('SecurePassword123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash,
      name: 'Blog Admin'
    }
  });

  // Create sample blog posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'Getting Started with Next.js',
        slug: 'getting-started-nextjs',
        content: 'Full content here...',
        excerpt: 'Learn the basics of Next.js...',
        status: 'published',
        publishedAt: new Date('2025-12-15'),
        metadata: { tags: ['Next.js', 'React'], category: 'Tutorial' }
      },
      {
        title: 'TypeScript Best Practices',
        slug: 'typescript-best-practices',
        content: 'Full content here...',
        excerpt: 'Improve your TypeScript code...',
        status: 'draft'
      }
    ]
  });

  // Create sample resume items
  await prisma.resumeItem.createMany({
    data: [
      {
        company: 'Tech Startup Inc.',
        position: 'Senior Software Engineer',
        description: 'Led development of microservices architecture...',
        startDate: new Date('2023-01-01'),
        endDate: null,
        displayOrder: 100
      },
      {
        company: 'Previous Company',
        position: 'Software Engineer',
        description: 'Developed RESTful APIs...',
        startDate: new Date('2020-06-01'),
        endDate: new Date('2022-12-31'),
        displayOrder: 90
      }
    ]
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

---

## Migration Strategy

1. **Initial Migration**: Create all tables with `npx prisma migrate dev --name init`
2. **Future Migrations**:
   - Modify `schema.prisma`
   - Run `npx prisma migrate dev --name descriptive-name`
   - Prisma tracks migrations in `prisma/migrations/` directory
3. **Production**: Use `npx prisma migrate deploy` (no prompts, fails on destructive changes)

**Backup Strategy**:
- Automated daily backups on hosting platform (Vercel Postgres, Railway)
- Export blog posts to JSON/Markdown files periodically for content portability

---

## Performance Considerations

1. **Indexes**: All critical query paths covered by indexes (slug, status, publishedAt, displayOrder)
2. **Connection Pooling**: Use Prisma with PgBouncer for efficient connection management
3. **Caching**:
   - Cache published blog post list (invalidate on publish/update)
   - Cache individual blog posts (invalidate on update)
   - Resume items rarely change (long cache TTL)
4. **Pagination**: Implement cursor-based pagination for blog feed if post count grows (>100 posts)

---

## Future Enhancements

**Potential schema additions** (not in initial scope):

1. **Tags/Categories**: Separate table with many-to-many relationship to BlogPost
2. **Comments**: Table for blog post comments (if public commenting added)
3. **Analytics**: Track view counts, reading time per post
4. **Media**: Separate table for uploaded images/files with references
5. **Drafts Versioning**: Store revision history for blog posts
6. **Multi-language**: Add locale field for internationalization

These enhancements would be considered if requirements expand beyond single-user personal blog.
