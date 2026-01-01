# API Contracts
## Personal Tech Blog Platform

**Date**: 2026-01-01
**API Version**: 1.0.0
**Specification Format**: OpenAPI 3.0.3

---

## Overview

This directory contains the API contract specifications for the Personal Tech Blog Platform. The API follows RESTful principles and provides:

- **Public endpoints**: For retrieving blog posts and resume information (no authentication)
- **Protected admin endpoints**: For content management (requires session authentication)
- **Authentication endpoints**: For admin login/logout

---

## Files

- `openapi.yaml`: Complete OpenAPI 3.0.3 specification with all endpoints, schemas, and examples

---

## API Structure

### Base URLs

- **Local Development**: `http://localhost:3000/api`
- **Production**: `https://yourblog.vercel.app/api`

### Authentication

The API uses **session-based authentication** with httpOnly cookies:

- **Cookie Name**: `sessionId`
- **Security Flags**: `HttpOnly`, `Secure` (production), `SameSite=Strict`
- **Session Duration**: 30 minutes (rolling - extends on activity)

**Admin Login Flow**:
1. POST `/api/auth/login` with email/password
2. Server sets session cookie in response
3. Client includes cookie automatically in subsequent requests
4. Session expires after 30 minutes of inactivity
5. POST `/api/auth/logout` to destroy session

---

## Endpoint Summary

### Public Endpoints (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all published blog posts (paginated) |
| GET | `/api/posts/{slug}` | Get single blog post by slug |
| GET | `/api/resume` | Get all resume items |

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login (creates session) |
| POST | `/api/auth/logout` | Admin logout (destroys session) |
| GET | `/api/auth/session` | Check current session status |

### Admin Endpoints (Authentication Required)

**Blog Posts**:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/posts` | Get all blog posts (including drafts) |
| POST | `/api/admin/posts` | Create new blog post |
| GET | `/api/admin/posts/{id}` | Get blog post by ID |
| PUT | `/api/admin/posts/{id}` | Update blog post |
| DELETE | `/api/admin/posts/{id}` | Delete blog post |

**Resume Items**:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/resume` | Get all resume items |
| POST | `/api/admin/resume` | Create new resume item |
| GET | `/api/admin/resume/{id}` | Get resume item by ID |
| PUT | `/api/admin/resume/{id}` | Update resume item |
| DELETE | `/api/admin/resume/{id}` | Delete resume item |

---

## Data Models

### BlogPost

**Summary Model** (used in list endpoints):
```typescript
{
  id: string (UUID)
  title: string
  slug: string
  excerpt?: string
  publishedAt: string (ISO 8601)
  metadata?: {
    tags?: string[]
    category?: string
    readingTime?: number
  }
}
```

**Full Model** (used in detail/admin endpoints):
```typescript
{
  // All fields from Summary, plus:
  content: string
  status: 'draft' | 'published'
  createdAt: string (ISO 8601)
  updatedAt: string (ISO 8601)
}
```

### ResumeItem

```typescript
{
  id: string (UUID)
  company: string
  position: string
  description: string
  startDate: string (YYYY-MM-DD)
  endDate?: string (YYYY-MM-DD) // null = current position
  displayOrder: number
  createdAt: string (ISO 8601)
  updatedAt: string (ISO 8601)
}
```

---

## Request/Response Examples

### Example 1: Get Published Posts (Public)

**Request**:
```http
GET /api/posts?limit=10&offset=0 HTTP/1.1
Host: yourblog.vercel.app
```

**Response** (200 OK):
```json
{
  "posts": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Getting Started with Next.js",
      "slug": "getting-started-nextjs",
      "excerpt": "Learn the basics of Next.js...",
      "publishedAt": "2025-12-15T10:30:00Z",
      "metadata": {
        "tags": ["Next.js", "React"],
        "category": "Tutorial",
        "readingTime": 8
      }
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### Example 2: Get Single Post (Public)

**Request**:
```http
GET /api/posts/getting-started-nextjs HTTP/1.1
Host: yourblog.vercel.app
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Getting Started with Next.js",
  "slug": "getting-started-nextjs",
  "content": "# Getting Started\n\nNext.js is...",
  "excerpt": "Learn the basics of Next.js...",
  "status": "published",
  "publishedAt": "2025-12-15T10:30:00Z",
  "createdAt": "2025-12-10T08:00:00Z",
  "updatedAt": "2025-12-15T10:30:00Z",
  "metadata": {
    "tags": ["Next.js", "React"],
    "category": "Tutorial"
  }
}
```

### Example 3: Admin Login

**Request**:
```http
POST /api/auth/login HTTP/1.1
Host: yourblog.vercel.app
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```http
HTTP/1.1 200 OK
Set-Cookie: sessionId=abc123xyz; HttpOnly; Secure; SameSite=Strict; Max-Age=1800
Content-Type: application/json

{
  "success": true,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "admin@example.com",
    "name": "Blog Admin"
  }
}
```

### Example 4: Create Blog Post (Admin)

**Request**:
```http
POST /api/admin/posts HTTP/1.1
Host: yourblog.vercel.app
Cookie: sessionId=abc123xyz
Content-Type: application/json

{
  "title": "TypeScript Best Practices",
  "slug": "typescript-best-practices",
  "content": "# TypeScript Best Practices\n\nHere are...",
  "excerpt": "Improve your TypeScript code...",
  "status": "published",
  "metadata": {
    "tags": ["TypeScript", "Best Practices"],
    "category": "Tutorial"
  }
}
```

**Response** (201 Created):
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "title": "TypeScript Best Practices",
  "slug": "typescript-best-practices",
  "content": "# TypeScript Best Practices\n\nHere are...",
  "excerpt": "Improve your TypeScript code...",
  "status": "published",
  "publishedAt": "2026-01-01T12:00:00Z",
  "createdAt": "2026-01-01T12:00:00Z",
  "updatedAt": "2026-01-01T12:00:00Z",
  "metadata": {
    "tags": ["TypeScript", "Best Practices"],
    "category": "Tutorial"
  }
}
```

### Example 5: Get Resume Items (Public)

**Request**:
```http
GET /api/resume HTTP/1.1
Host: yourblog.vercel.app
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "company": "Tech Startup Inc.",
      "position": "Senior Software Engineer",
      "description": "Led development of microservices architecture...",
      "startDate": "2023-01-01",
      "endDate": null,
      "displayOrder": 100,
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    },
    {
      "id": "880e8400-e29b-41d4-a716-446655440003",
      "company": "Previous Company",
      "position": "Software Engineer",
      "description": "Developed RESTful APIs...",
      "startDate": "2020-06-01",
      "endDate": "2022-12-31",
      "displayOrder": 90,
      "createdAt": "2020-06-01T00:00:00Z",
      "updatedAt": "2022-12-31T00:00:00Z"
    }
  ]
}
```

---

## Error Responses

All error responses follow a consistent format:

```json
{
  "error": "Human-readable error message"
}
```

### Common Error Status Codes

| Status | Description | Example |
|--------|-------------|---------|
| 400 | Bad Request | Invalid input data, validation failures |
| 401 | Unauthorized | Missing/invalid authentication, session expired |
| 404 | Not Found | Requested resource doesn't exist |
| 409 | Conflict | Duplicate slug, resource already exists |
| 429 | Too Many Requests | Rate limit exceeded (login attempts) |
| 500 | Internal Server Error | Unexpected server error |

**Example Error Response** (400 Bad Request):
```json
{
  "error": "Validation failed. Title is required."
}
```

**Example Error Response** (401 Unauthorized):
```json
{
  "error": "Authentication required. Please log in."
}
```

---

## Validation Rules

### BlogPost

- **title**: 1-255 characters, required
- **slug**: 1-255 characters, lowercase, alphanumeric + hyphens only, unique, required
- **content**: Minimum 1 character, required
- **excerpt**: Maximum 500 characters, optional
- **status**: Must be 'draft' or 'published', defaults to 'draft'
- **publishedAt**: Automatically set when status changes to 'published'

### ResumeItem

- **company**: 1-255 characters, required
- **position**: 1-255 characters, required
- **description**: Minimum 1 character, required
- **startDate**: Valid date, cannot be in future, required
- **endDate**: Valid date, must be >= startDate if provided, optional (null = current)
- **displayOrder**: Integer, defaults to 0

### Authentication

- **email**: Valid email format, required
- **password**: Minimum 12 characters, must include uppercase, lowercase, number, special character

---

## Security Considerations

### Authentication Security

1. **Session Cookies**:
   - `HttpOnly` flag prevents JavaScript access (XSS protection)
   - `Secure` flag ensures HTTPS-only transmission
   - `SameSite=Strict` prevents CSRF attacks

2. **Rate Limiting**:
   - Login endpoint: Maximum 5 attempts per 15 minutes per IP
   - Prevents brute-force attacks

3. **Session Management**:
   - 30-minute rolling expiration
   - Automatic cleanup of expired sessions
   - Server-side session validation on every protected request

### Input Validation

- All inputs validated server-side
- SQL injection prevented by Prisma ORM (parameterized queries)
- XSS prevented by React auto-escaping (client-side)
- Input sanitization for HTML content (if rich text editor used)

### HTTPS Enforcement

- Production deployment enforces HTTPS (Vercel default)
- Secure cookies only transmitted over encrypted connections

---

## Testing the API

### Tools

- **API Client**: Postman, Insomnia, or curl
- **OpenAPI Viewer**: Swagger UI, Redoc
- **Contract Testing**: Dredd, Prism

### Example curl Commands

**Get published posts**:
```bash
curl https://yourblog.vercel.app/api/posts
```

**Admin login**:
```bash
curl -X POST https://yourblog.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"SecurePassword123!"}' \
  -c cookies.txt
```

**Create blog post (with session)**:
```bash
curl -X POST https://yourblog.vercel.app/api/admin/posts \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title":"New Post",
    "slug":"new-post",
    "content":"Post content",
    "status":"published"
  }'
```

---

## API Versioning

**Current Version**: 1.0.0

**Versioning Strategy**: URL-based versioning (when needed)
- Current: `/api/*`
- Future: `/api/v2/*` (if breaking changes required)

**Backward Compatibility**: All changes in v1 will be backward compatible. Major version bump only for breaking changes.

---

## Implementation Notes

### Next.js Route Handlers

API routes will be implemented using Next.js 15 Route Handlers (App Router):

```
app/
├── api/
│   ├── posts/
│   │   ├── route.ts              # GET /api/posts
│   │   └── [slug]/
│   │       └── route.ts          # GET /api/posts/{slug}
│   ├── resume/
│   │   └── route.ts              # GET /api/resume
│   ├── auth/
│   │   ├── login/
│   │   │   └── route.ts          # POST /api/auth/login
│   │   ├── logout/
│   │   │   └── route.ts          # POST /api/auth/logout
│   │   └── session/
│   │       └── route.ts          # GET /api/auth/session
│   └── admin/
│       ├── posts/
│       │   ├── route.ts          # GET/POST /api/admin/posts
│       │   └── [id]/
│       │       └── route.ts      # GET/PUT/DELETE /api/admin/posts/{id}
│       └── resume/
│           ├── route.ts          # GET/POST /api/admin/resume
│           └── [id]/
│               └── route.ts      # GET/PUT/DELETE /api/admin/resume/{id}
```

### Authentication Middleware

Protected routes will use Next.js middleware to verify sessions before processing requests.

---

## Future Enhancements

Potential API additions (not in current scope):

1. **Search**: `GET /api/posts/search?q={query}` - Full-text search
2. **Tags/Categories**: `GET /api/tags`, `GET /api/posts?tag={tag}`
3. **Analytics**: `POST /api/posts/{slug}/view` - Track view counts
4. **Media Upload**: `POST /api/admin/media` - Image/file uploads
5. **Comments**: `GET/POST /api/posts/{slug}/comments` - Blog comments
6. **RSS Feed**: `GET /api/feed.xml` - RSS feed generation

---

## Contact

For questions about the API contract, refer to the feature specification at `../spec.md` or the implementation plan at `../plan.md`.
