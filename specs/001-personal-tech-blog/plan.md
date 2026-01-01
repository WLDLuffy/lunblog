# Implementation Plan: Personal Tech Blog Platform

**Branch**: `001-personal-tech-blog` | **Date**: 2026-01-01 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-personal-tech-blog/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Personal tech blog platform enabling the owner to publish blog posts and display professional resume information. The system consists of a public-facing UI with Blog, About, and Resume pages, and a secure admin interface for content management. A monolith backend service provides public endpoints for content retrieval and protected endpoints for admin operations (CRUD on blog posts and resume items). Authentication enforces 30-minute session timeout for enhanced security.

## Technical Context

**Language/Version**: NEEDS CLARIFICATION (web application - likely JavaScript/TypeScript, Python, Ruby, Go, or similar)
**Primary Dependencies**: NEEDS CLARIFICATION (frontend framework: React/Vue/Next.js/etc.; backend framework: Express/FastAPI/Rails/Gin/etc.)
**Storage**: NEEDS CLARIFICATION (relational database for structured blog/resume data: PostgreSQL/MySQL/SQLite, or document store: MongoDB)
**Testing**: NEEDS CLARIFICATION (depends on stack choice: Jest/Vitest for frontend, pytest/RSpec/Go test for backend)
**Target Platform**: Web (browser for frontend, server/container for backend)
**Project Type**: Web application (frontend + backend monolith)
**Performance Goals**: <3 seconds page load on standard broadband (per SC-004); support moderate personal blog traffic
**Constraints**: 30-minute admin session timeout (security requirement); desktop and mobile responsive (SC-006)
**Scale/Scope**: Single-user admin, public read access; ~4 public pages (Home, Blog, About, Resume) + admin interface; moderate traffic (personal blog scale, not enterprise)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: ✅ PASS (No project-specific constitution principles defined yet)

The project constitution file (`.specify/memory/constitution.md`) contains only template placeholders. No specific architectural principles, testing requirements, or technical constraints have been ratified for this project. This feature proceeds without constitution-based gates.

**Recommendation**: Consider establishing project constitution principles for future features (e.g., testing requirements, library architecture, deployment standards).

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-tech-blog/
├── spec.md              # Feature specification
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
├── checklists/          # Quality validation checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/           # BlogPost, ResumeItem, AdminUser entities
│   ├── services/         # Business logic (auth, content management)
│   ├── api/             # REST endpoints (public + protected)
│   ├── middleware/      # Authentication, session management
│   └── config/          # Database, environment config
├── tests/
│   ├── unit/            # Model, service unit tests
│   ├── integration/     # API endpoint integration tests
│   └── fixtures/        # Test data
└── migrations/          # Database schema migrations (if using SQL)

frontend/
├── src/
│   ├── components/      # Reusable UI components (Navigation, BlogCard, etc.)
│   ├── pages/           # Page components (Home, Blog, About, Resume, Admin)
│   ├── services/        # API client, auth utilities
│   ├── hooks/           # Custom React hooks (if React) or composables
│   └── styles/          # CSS/styling
├── tests/
│   ├── unit/            # Component unit tests
│   └── e2e/             # End-to-end tests (login flow, post creation)
└── public/              # Static assets

shared/                  # Optional: shared types/contracts between frontend/backend
└── types/               # TypeScript interfaces for BlogPost, ResumeItem, etc.
```

**Structure Decision**: Web application structure (Option 2) selected based on user requirement for "UI and a monolith backend service". Frontend handles public pages and admin UI, backend provides REST API endpoints. Monolith means single deployable backend service (not microservices).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

N/A - No constitution violations (no project-specific constitution defined).

---

## Phase 0: Research (Complete)

**Status**: ✅ Complete

**Artifacts Generated**:
- `research.md` - Technology stack decisions and rationale

**Key Decisions**:
1. **Frontend**: Next.js 15+ with App Router for SEO and performance
2. **Backend**: Node.js with Next.js API Routes (monolith architecture)
3. **Database**: PostgreSQL 16+ for structured relational data
4. **Authentication**: Session-based with 30-minute timeout
5. **Testing**: Vitest for unit/integration, Playwright for E2E
6. **Deployment**: Vercel (all-in-one) for simplicity

All NEEDS CLARIFICATION items from Technical Context resolved through comprehensive research.

---

## Phase 1: Design (Complete)

**Status**: ✅ Complete

**Artifacts Generated**:
- `data-model.md` - Complete database schema with Prisma models
- `contracts/openapi.yaml` - Full OpenAPI 3.0.3 REST API specification
- `contracts/README.md` - API documentation with examples
- `quickstart.md` - Developer setup and getting started guide

**Data Model Summary**:
- 4 entities: User, Session, BlogPost, ResumeItem
- Session-based authentication with rolling 30-minute expiration
- Blog posts support draft/published status
- Resume items with flexible ordering

**API Contract Summary**:
- 3 public endpoints (blog posts, resume)
- 3 authentication endpoints (login, logout, session check)
- 10 protected admin endpoints (CRUD for posts and resume items)
- Session cookie-based authentication (httpOnly, secure, sameSite)

---

## Constitution Check (Post-Design Re-evaluation)

**Status**: ✅ PASS (No changes from initial check)

No project-specific constitution principles defined. Architecture decisions align with best practices:
- ✅ Monolithic architecture appropriate for single-user blog scale
- ✅ Session-based auth simpler and more secure than JWT for single-user scenario
- ✅ PostgreSQL matches structured data requirements
- ✅ Next.js provides optimal SEO and performance for blog platform

No violations or complexity concerns identified.

---

## Next Steps

**Phase 2: Tasks** (Next command: `/speckit.tasks`)

The implementation tasks will be generated based on the prioritized user stories:
1. P1: Public Blog Reading
2. P1: Admin Authentication
3. P1: Blog Post Management
4. P2: Personal Information Display
5. P3: Resume Management

Each task will be independently testable and deliverable, following the MVP approach defined in the specification.
