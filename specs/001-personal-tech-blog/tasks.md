# Tasks: Personal Tech Blog Platform

**Input**: Design documents from `/specs/001-personal-tech-blog/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Stack**: Next.js 15 (App Router), TypeScript, Prisma, PostgreSQL, Tailwind CSS

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a web application following the structure defined in plan.md:
- Root project structure (Next.js monolith)
- API routes: `src/app/api/`
- Pages: `src/app/`
- Components: `src/components/`
- Utilities: `src/lib/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Next.js 15 project with TypeScript, Tailwind CSS, and App Router at repository root
- [ ] T002 Install core dependencies: @prisma/client, bcrypt, zod, next-auth
- [ ] T003 [P] Install dev dependencies: prisma, @types/bcrypt, vitest, @playwright/test
- [ ] T004 [P] Configure ESLint and Prettier in .eslintrc and .prettierrc
- [ ] T005 [P] Create .env.example with DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL placeholders
- [ ] T006 [P] Configure Tailwind CSS in tailwind.config.ts
- [ ] T007 [P] Setup TypeScript strict mode in tsconfig.json
- [ ] T008 [P] Configure Vitest in vitest.config.ts
- [ ] T009 [P] Configure Playwright in playwright.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Initialize Prisma with PostgreSQL in prisma/schema.prisma
- [ ] T011 Define Prisma schema with User, Session, BlogPost, ResumeItem models per data-model.md
- [ ] T012 Create initial database migration with `prisma migrate dev --name init`
- [ ] T013 Generate Prisma client with `prisma generate`
- [ ] T014 Create Prisma client singleton in src/lib/prisma.ts
- [ ] T015 [P] Create Zod validation schemas for BlogPost in src/lib/validation/blog.ts
- [ ] T016 [P] Create Zod validation schemas for ResumeItem in src/lib/validation/resume.ts
- [ ] T017 [P] Create Zod validation schemas for Auth (login) in src/lib/validation/auth.ts
- [ ] T018 [P] Create TypeScript shared types in src/types/index.ts for BlogPost, ResumeItem, User
- [ ] T019 Create root layout with navigation structure in src/app/layout.tsx
- [ ] T020 Create global styles in src/app/globals.css
- [ ] T021 [P] Create reusable UI components: Button in src/components/ui/button.tsx
- [ ] T022 [P] Create reusable UI components: Input in src/components/ui/input.tsx
- [ ] T023 [P] Create reusable UI components: Card in src/components/ui/card.tsx
- [ ] T024 Create Navigation component with Blog, About, Resume tabs in src/components/layout/navigation.tsx
- [ ] T025 Create database seed script in prisma/seed.ts with sample admin user, blog posts, and resume items
- [ ] T026 Run seed script with `pnpm prisma db seed` to populate development database

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 5 - Admin Authentication (Priority: P1) 🎯

**Goal**: Blog owner can securely log in to access admin interface with 30-minute session timeout

**Independent Test**: Attempt to access /admin without auth (should redirect to login), then login with valid credentials and access admin area successfully

**Why First**: Authentication is a prerequisite for US3 (Blog Post Management) and US4 (Resume Management). Must be completed before admin features.

### Database & Models for US5

- [ ] T027 [P] [US5] Verify User model exists in Prisma schema (created in T011)
- [ ] T028 [P] [US5] Verify Session model exists in Prisma schema (created in T011)

### Authentication Logic for US5

- [ ] T029 [US5] Create authentication utilities in src/lib/auth.ts for password hashing and session management
- [ ] T030 [US5] Create session validation middleware in src/middleware.ts for protecting admin routes

### API Endpoints for US5

- [ ] T031 [US5] Implement POST /api/auth/login endpoint in src/app/api/auth/login/route.ts
- [ ] T032 [US5] Implement POST /api/auth/logout endpoint in src/app/api/auth/logout/route.ts
- [ ] T033 [US5] Implement GET /api/auth/session endpoint in src/app/api/auth/session/route.ts

### UI for US5

- [ ] T034 [US5] Create login page in src/app/login/page.tsx with email/password form
- [ ] T035 [US5] Create admin layout wrapper in src/app/admin/layout.tsx that verifies authentication
- [ ] T036 [US5] Create admin dashboard landing page in src/app/admin/page.tsx

### Integration for US5

- [ ] T037 [US5] Add authentication redirect logic to middleware for /admin/* routes
- [ ] T038 [US5] Test login flow: unauthenticated access redirects, valid login grants access, session expires after 30 minutes

**Checkpoint**: Admin authentication is fully functional - admin features can now be built

---

## Phase 4: User Story 1 - Public Blog Reading (Priority: P1) 🎯 MVP

**Goal**: Visitors can browse and read published blog posts without authentication

**Independent Test**: Visit /blog page, verify published posts are visible with titles and previews, click a post to read full content

**Why Core MVP**: This is the primary value proposition - sharing tech content. Can be deployed independently for immediate value.

### Database & Models for US1

- [ ] T039 [P] [US1] Verify BlogPost model exists in Prisma schema (created in T011)

### API Endpoints for US1

- [ ] T040 [US1] Implement GET /api/posts endpoint in src/app/api/posts/route.ts to return published posts only
- [ ] T041 [US1] Implement GET /api/posts/[slug] endpoint in src/app/api/posts/[slug]/route.ts to return single post

### UI Components for US1

- [ ] T042 [P] [US1] Create BlogPostCard component in src/components/blog/blog-post-card.tsx for post previews
- [ ] T043 [P] [US1] Create BlogPostContent component in src/components/blog/blog-post-content.tsx for full post display

### Pages for US1

- [ ] T044 [US1] Create blog list page in src/app/blog/page.tsx that fetches and displays published posts
- [ ] T045 [US1] Create individual blog post page in src/app/blog/[slug]/page.tsx that displays full content
- [ ] T046 [US1] Update homepage in src/app/page.tsx with brief introduction and link to blog

### Styling & Polish for US1

- [ ] T047 [US1] Style blog feed page with Tailwind CSS for responsive design (desktop and mobile)
- [ ] T048 [US1] Style individual blog post page with readable typography and formatting

### Integration for US1

- [ ] T049 [US1] Update Navigation component to highlight active Blog tab
- [ ] T050 [US1] Test complete blog reading flow: homepage → blog list → individual post → navigation

**Checkpoint**: Blog reading functionality is fully operational and can be deployed as MVP

---

## Phase 5: User Story 3 - Blog Post Management (Priority: P1)

**Goal**: Admin can create, edit, publish, and delete blog posts through secure admin interface

**Independent Test**: Login to admin area, create new draft post, publish it and verify it appears in public feed, edit published post and verify changes, delete post

**Depends On**: US5 (Admin Authentication) must be complete

### API Endpoints for US3

- [ ] T051 [US3] Implement GET /api/admin/posts endpoint in src/app/api/admin/posts/route.ts to return all posts including drafts
- [ ] T052 [US3] Implement POST /api/admin/posts endpoint in src/app/api/admin/posts/route.ts to create new blog post
- [ ] T053 [US3] Implement GET /api/admin/posts/[id] endpoint in src/app/api/admin/posts/[id]/route.ts to get single post by ID
- [ ] T054 [US3] Implement PUT /api/admin/posts/[id] endpoint in src/app/api/admin/posts/[id]/route.ts to update post
- [ ] T055 [US3] Implement DELETE /api/admin/posts/[id] endpoint in src/app/api/admin/posts/[id]/route.ts to delete post

### UI Components for US3

- [ ] T056 [P] [US3] Create PostEditor component in src/components/admin/post-editor.tsx with title, slug, content, excerpt, status fields
- [ ] T057 [P] [US3] Create PostListTable component in src/components/admin/post-list-table.tsx showing all posts with edit/delete actions
- [ ] T058 [P] [US3] Create PostForm validation and submission logic in src/components/admin/post-form.tsx

### Pages for US3

- [ ] T059 [US3] Create admin blog posts list page in src/app/admin/posts/page.tsx
- [ ] T060 [US3] Create new blog post page in src/app/admin/posts/new/page.tsx
- [ ] T061 [US3] Create edit blog post page in src/app/admin/posts/[id]/edit/page.tsx

### Features for US3

- [ ] T062 [US3] Implement auto-slug generation from title in PostForm
- [ ] T063 [US3] Implement draft/publish toggle with publishedAt timestamp logic
- [ ] T064 [US3] Add confirmation dialog for post deletion
- [ ] T065 [US3] Add client-side form validation with Zod schema

### Integration for US3

- [ ] T066 [US3] Add "Manage Posts" link to admin dashboard
- [ ] T067 [US3] Test complete CRUD flow: create draft → edit → publish → verify in public blog → unpublish → delete

**Checkpoint**: Blog post management is fully functional for admin

---

## Phase 6: User Story 2 - Personal Information Display (Priority: P2)

**Goal**: Visitors can view blog author's personal information on About and Resume pages

**Independent Test**: Navigate to /about page and verify personal introduction is displayed, navigate to /resume page and verify work experience is listed chronologically

### Database & Models for US2

- [ ] T068 [P] [US2] Verify ResumeItem model exists in Prisma schema (created in T011)

### API Endpoints for US2

- [ ] T069 [US2] Implement GET /api/resume endpoint in src/app/api/resume/route.ts to return all resume items sorted by displayOrder and startDate

### UI Components for US2

- [ ] T070 [P] [US2] Create ResumeCard component in src/components/resume/resume-card.tsx for displaying work experience
- [ ] T071 [P] [US2] Create AboutSection component in src/components/about/about-section.tsx for personal introduction

### Pages for US2

- [ ] T072 [US2] Create About page in src/app/about/page.tsx with personal introduction content
- [ ] T073 [US2] Create Resume page in src/app/resume/page.tsx that fetches and displays resume items

### Content for US2

- [ ] T074 [US2] Add static about content (personal introduction) to About page or database
- [ ] T075 [US2] Style Resume page to display current position (endDate=null) as "Present"

### Integration for US2

- [ ] T076 [US2] Update Navigation component to include About and Resume tabs
- [ ] T077 [US2] Test navigation flow: homepage → about → resume → blog

**Checkpoint**: About and Resume pages are fully functional

---

## Phase 7: User Story 4 - Resume Management (Priority: P3)

**Goal**: Admin can add, edit, and delete resume items through admin interface

**Independent Test**: Login to admin, add new work experience, verify it appears on public resume page, edit experience details, delete old item

**Depends On**: US5 (Admin Authentication) must be complete

### API Endpoints for US4

- [ ] T078 [US4] Implement GET /api/admin/resume endpoint in src/app/api/admin/resume/route.ts to return all resume items
- [ ] T079 [US4] Implement POST /api/admin/resume endpoint in src/app/api/admin/resume/route.ts to create new resume item
- [ ] T080 [US4] Implement GET /api/admin/resume/[id] endpoint in src/app/api/admin/resume/[id]/route.ts to get single item
- [ ] T081 [US4] Implement PUT /api/admin/resume/[id] endpoint in src/app/api/admin/resume/[id]/route.ts to update item
- [ ] T082 [US4] Implement DELETE /api/admin/resume/[id] endpoint in src/app/api/admin/resume/[id]/route.ts to delete item

### UI Components for US4

- [ ] T083 [P] [US4] Create ResumeItemEditor component in src/components/admin/resume-item-editor.tsx with company, position, dates, description fields
- [ ] T084 [P] [US4] Create ResumeListTable component in src/components/admin/resume-list-table.tsx showing all items with edit/delete actions

### Pages for US4

- [ ] T085 [US4] Create admin resume items list page in src/app/admin/resume/page.tsx
- [ ] T086 [US4] Create new resume item page in src/app/admin/resume/new/page.tsx
- [ ] T087 [US4] Create edit resume item page in src/app/admin/resume/[id]/edit/page.tsx

### Features for US4

- [ ] T088 [US4] Implement date validation (startDate <= endDate, no future dates)
- [ ] T089 [US4] Implement displayOrder field for manual sorting with drag-and-drop or number input
- [ ] T090 [US4] Add "Current Position" checkbox that sets endDate to null
- [ ] T091 [US4] Add confirmation dialog for resume item deletion

### Integration for US4

- [ ] T092 [US4] Add "Manage Resume" link to admin dashboard
- [ ] T093 [US4] Test complete CRUD flow: create item → verify on public resume → edit → delete

**Checkpoint**: Resume management is fully functional for admin

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validation across all user stories

### Performance & Optimization

- [ ] T094 [P] Add Next.js Image component optimization for any images in blog posts
- [ ] T095 [P] Implement caching for published blog posts list with revalidation
- [ ] T096 [P] Implement caching for resume items with long TTL
- [ ] T097 [P] Add loading states and skeleton components for all data-fetching pages

### Error Handling

- [ ] T098 [P] Add global error boundary in src/app/error.tsx
- [ ] T099 [P] Add 404 page in src/app/not-found.tsx
- [ ] T100 [P] Add API error handling middleware for consistent error responses

### Security Hardening

- [ ] T101 [P] Implement rate limiting on /api/auth/login endpoint (5 attempts per 15 min)
- [ ] T102 [P] Add CSRF protection to all POST/PUT/DELETE endpoints
- [ ] T103 [P] Verify httpOnly, secure, sameSite=strict cookie flags in session management
- [ ] T104 [P] Add input sanitization for blog post content to prevent XSS

### Testing & Validation

- [ ] T105 [P] Create E2E test for public blog reading flow in tests/e2e/blog-reading.spec.ts
- [ ] T106 [P] Create E2E test for admin login and post management in tests/e2e/admin-post-management.spec.ts
- [ ] T107 [P] Create E2E test for resume management in tests/e2e/resume-management.spec.ts
- [ ] T108 Validate all pages load within 3 seconds (per SC-004)
- [ ] T109 Validate mobile responsiveness on desktop and mobile viewports (per SC-006)

### Documentation & Deployment

- [ ] T110 [P] Create .env.example with all required environment variables
- [ ] T111 [P] Update README.md with setup instructions from quickstart.md
- [ ] T112 [P] Create deployment guide for Vercel in docs/deployment.md
- [ ] T113 Run through quickstart.md validation end-to-end on fresh environment

### Final Validation

- [ ] T114 Verify FR-001 to FR-022: All functional requirements met
- [ ] T115 Verify SC-001 to SC-008: All success criteria met
- [ ] T116 Test all user acceptance scenarios from spec.md
- [ ] T117 Test all edge cases documented in spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories**: All depend on Foundational (Phase 2) completion
  - **US5 (Phase 3 - Auth)**: Depends on Foundational only - MUST complete before US3 and US4
  - **US1 (Phase 4 - Blog Reading)**: Depends on Foundational only - Independent of other stories
  - **US3 (Phase 5 - Blog Management)**: Depends on Foundational + US5 (Auth)
  - **US2 (Phase 6 - About/Resume Display)**: Depends on Foundational only - Independent of other stories
  - **US4 (Phase 7 - Resume Management)**: Depends on Foundational + US5 (Auth)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### Critical Path for MVP

1. Phase 1: Setup (T001-T009)
2. Phase 2: Foundational (T010-T026) ← **BLOCKING**
3. Phase 3: US5 - Admin Auth (T027-T038) ← **Required for admin features**
4. Phase 4: US1 - Blog Reading (T039-T050) ← **MVP CORE**

**MVP Delivery Point**: After T050, you have a functional blog that visitors can read

### Recommended Implementation Order

**Week 1: Foundation**
- Complete Phase 1: Setup (T001-T009)
- Complete Phase 2: Foundational (T010-T026)

**Week 2-3: Core MVP (P1 Stories)**
- Complete Phase 3: US5 - Admin Auth (T027-T038)
- Complete Phase 4: US1 - Blog Reading (T039-T050)
- Complete Phase 5: US3 - Blog Management (T051-T067)

**MVP Checkpoint**: At this point, blog owner can create content and visitors can read it

**Week 4: Enhancement (P2 Story)**
- Complete Phase 6: US2 - Personal Info Display (T068-T077)

**Week 5: Lower Priority (P3 Story)**
- Complete Phase 7: US4 - Resume Management (T078-T093)

**Week 6: Polish & Deploy**
- Complete Phase 8: Polish & Cross-Cutting (T094-T117)

### User Story Independence

Each user story can be tested independently:

- **US5 (Auth)**: Login → access admin dashboard → logout → session expires after 30 min
- **US1 (Blog Reading)**: Visit /blog → see published posts → click post → read content
- **US3 (Blog Management)**: Login → create draft post → publish → verify in public feed → edit → delete
- **US2 (About/Resume)**: Visit /about → see intro → visit /resume → see work history
- **US4 (Resume Management)**: Login → add resume item → verify on public resume → edit → delete

### Parallel Opportunities

**Within Foundational Phase (after T014)**:
- T015, T016, T017 (Zod schemas) can run in parallel
- T018 (TypeScript types) can run in parallel
- T021, T022, T023 (UI components) can run in parallel

**Within US1 (after T039)**:
- T042, T043 (Blog components) can run in parallel

**Within US3 (after T050)**:
- T056, T057, T058 (Admin components) can run in parallel

**Across User Stories** (if multiple developers):
- After US5 (Auth) completes:
  - One developer can work on US3 (Blog Management)
  - Another can work on US1 (Blog Reading) - no dependencies
  - Another can work on US2 (About/Resume) - no dependencies
- US4 can start after US5 completes (independent of US1, US2, US3)

**Within Polish Phase**:
- T094-T104 (Performance, errors, security) can all run in parallel
- T105-T107 (E2E tests) can run in parallel

---

## Parallel Example: Foundational Phase

After completing T001-T014, launch these tasks together:

```bash
# Zod validation schemas (different files, no dependencies)
Task T015: "Create Zod validation schemas for BlogPost in src/lib/validation/blog.ts"
Task T016: "Create Zod validation schemas for ResumeItem in src/lib/validation/resume.ts"
Task T017: "Create Zod validation schemas for Auth in src/lib/validation/auth.ts"

# UI components (different files, no dependencies)
Task T021: "Create Button component in src/components/ui/button.tsx"
Task T022: "Create Input component in src/components/ui/input.tsx"
Task T023: "Create Card component in src/components/ui/card.tsx"
```

---

## Parallel Example: User Story 1

After completing T039 (GET /api/posts endpoint), launch these together:

```bash
# Blog UI components (different files, no dependencies on each other)
Task T042: "Create BlogPostCard component in src/components/blog/blog-post-card.tsx"
Task T043: "Create BlogPostContent component in src/components/blog/blog-post-content.tsx"
```

---

## Implementation Strategy

### MVP First (Fastest Path to Value)

1. **Week 1**: Complete Setup + Foundational (T001-T026)
2. **Week 2**: Complete US5 Auth (T027-T038) + US1 Blog Reading (T039-T050)
3. **Week 3**: Complete US3 Blog Management (T051-T067)
4. **STOP and VALIDATE**: Test complete MVP workflow:
   - Admin can login → create post → publish
   - Visitors can read published posts
5. **Deploy MVP** to production

### Incremental Delivery (Add Value Progressively)

1. **Deploy MVP**: US5 + US1 + US3 (Auth + Reading + Management)
2. **Deploy v1.1**: Add US2 (About + Resume pages)
3. **Deploy v1.2**: Add US4 (Resume management)
4. **Deploy v2.0**: Add Polish features (performance, testing, security hardening)

Each deployment adds value without breaking previous functionality.

### Parallel Team Strategy (Maximize Throughput)

With 3 developers after Foundational phase:

**Phase A** (Parallel - Week 2):
- Dev 1: US5 (Auth) T027-T038 ← **BLOCKING US3 and US4**
- Dev 2: US1 (Blog Reading) T039-T050 ← Independent
- Dev 3: US2 (About/Resume) T068-T077 ← Independent

**Phase B** (Parallel - Week 3):
- Dev 1: US3 (Blog Management) T051-T067 ← Depends on US5
- Dev 2: US4 (Resume Management) T078-T093 ← Depends on US5
- Dev 3: Polish (Performance/Security) T094-T104 ← Starts early

**Phase C** (Parallel - Week 4):
- All devs: E2E Testing T105-T107, Final Validation T108-T117

---

## Notes

- **[P] marker**: Tasks marked [P] can run in parallel (different files, no dependencies)
- **[Story] label**: Maps task to specific user story (US1-US5) for traceability
- **File paths**: All tasks include exact file paths for implementation
- **Checkpoints**: Each user story ends with a checkpoint for independent validation
- **MVP scope**: US5 + US1 + US3 = Core blog functionality (auth + reading + management)
- **Independent testing**: Each user story has defined independent test criteria
- **Commit strategy**: Commit after each task or logical group of parallel tasks
- **Validation**: Run E2E tests (T105-T107) and validate all acceptance scenarios (T116)

---

## Total Task Count: 117 tasks

**By Phase**:
- Setup: 9 tasks (T001-T009)
- Foundational: 17 tasks (T010-T026)
- US5 (Auth): 12 tasks (T027-T038)
- US1 (Blog Reading): 12 tasks (T039-T050)
- US3 (Blog Management): 17 tasks (T051-T067)
- US2 (About/Resume): 10 tasks (T068-T077)
- US4 (Resume Management): 16 tasks (T078-T093)
- Polish: 24 tasks (T094-T117)

**By User Story**:
- US1 (Blog Reading - P1): 12 tasks
- US2 (About/Resume - P2): 10 tasks
- US3 (Blog Management - P1): 17 tasks
- US4 (Resume Management - P3): 16 tasks
- US5 (Authentication - P1): 12 tasks
- Infrastructure (Setup + Foundational): 26 tasks
- Polish (Cross-cutting): 24 tasks

**Parallel Opportunities**: 42 tasks marked [P] can run in parallel within their phase
