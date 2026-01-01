# LunBlog - Personal Tech Blog Platform

A modern personal blog platform built with Next.js 15, featuring admin authentication, blog post management, and resume showcase.

## Features

- 📝 **Blog Management**: Create, edit, publish, and delete blog posts with draft/published status
- 🔐 **Admin Authentication**: Secure session-based authentication with 30-minute rolling timeout
- 📄 **Resume Showcase**: Display professional work experience with customizable ordering
- 🎨 **Modern UI**: Responsive design with Tailwind CSS and dark mode support
- ⚡ **Performance**: Built on Next.js 15 with App Router for optimal performance
- 🗄️ **PostgreSQL Database**: Robust data storage with Prisma ORM

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: Custom session-based auth with bcrypt
- **Validation**: Zod schemas

## Quick Start

### Option 1: Docker (Recommended - Easiest Setup)

**Prerequisites:** Docker and Docker Compose installed

```bash
# Build and start the application with its own PostgreSQL
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

Visit [http://localhost:3000](http://localhost:3000)

**Default credentials:**
- Admin: `admin@lunblog.com` / `Admin123!@#SecurePassword`
- Database: `lunblog` / `lunblog_secure_password_2024` (on port 5433)

⚠️ **Change the admin password after first login!**

**Docker Commands:**
```bash
# View logs
docker-compose logs -f app

# Stop containers
docker-compose down

# Stop and remove volumes (deletes data)
docker-compose down -v

# Restart
docker-compose restart
```

### Option 2: Local Development (Without Docker)

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Update the `.env` file with your database credentials and generate a secret:

```bash
openssl rand -base64 32
```

Then update `.env` with your values.

### 3. Set up the database

```bash
# Run migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

Default admin credentials: `admin@lunblog.com` / `Admin123!@#SecurePassword`

⚠️ **Change the password after first login!**

### 4. Start the development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed database

## Admin Access

1. Navigate to `/login`
2. Use default credentials (change after first login!)
3. Access admin dashboard at `/admin`

**Features:**
- Manage blog posts (create, edit, publish, delete)
- Manage resume items (add, edit, delete)
- Session expires after 30 minutes of inactivity

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (public + admin)
│   ├── blog/              # Public blog pages
│   ├── about/             # About page
│   ├── resume/            # Resume page
│   ├── admin/             # Admin dashboard
│   └── login/             # Login page
├── components/            # React components
├── lib/                   # Utility functions
└── types/                 # TypeScript types
```

## License

ISC
