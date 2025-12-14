---
description: Restructure SaaS Portal and Tenant Page Flow
---

# SaaS Portal and Tenant Page Flow Restructure

## Overview
This workflow restructures the application to have a clear separation between:
1. **Portal** (SaaS landing page + Super Admin)
2. **Tenant Pages** (School landing page + Tenant Admin + Student/Parent pages)

---

## Phase 1: Portal Landing Page Restructure

### Current State
- Landing page shows tenant cards
- Has basic hero section
- Mixed purpose (both portal info and tenant selection)

### Target State
**URL:** `http://localhost:3000`

**Sections:**
1. **Hero Section**
   - Main headline about CursorSchool SaaS platform
   - Login button (general sign-in, not super admin specific)
   - Call-to-action for schools to join

2. **Global Information**
   - About CursorSchool platform
   - Value proposition
   - How it works

3. **Featured Features**
   - Multi-tenant architecture
   - Customizable branding
   - Student/Parent portals
   - Analytics & reporting
   - Secure & scalable

4. **Tenant Cards Section**
   - "Our Partner Schools" heading
   - Grid of tenant cards with branding
   - Each card links to tenant landing page

5. **Technology Stack**
   - Next.js 15
   - PostgreSQL (Neon)
   - Clerk Authentication
   - Drizzle ORM
   - Tailwind CSS

6. **Footer**
   - Contact information
   - Links to documentation
   - Social media

**Super Admin Access:**
- No visible button
- Access via `/super-admin` URL directly

---

## Phase 2: Super Admin Portal

### Current State
- Located at `/super-admin`
- Has basic navigation

### Target State
**URL:** `http://localhost:3000/super-admin`

**Features:**
1. **Side Menu Navigation**
   - Dashboard
   - Tenants Management
   - Platform Branding
   - Platform SEO
   - Modules Management
   - Settings
   - Profile

2. **Dashboard Page**
   - Total tenants
   - Total users across all tenants
   - System health metrics
   - Recent activities
   - Quick actions

3. **Management Pages**
   - Tenants (CRUD operations)
   - Platform settings
   - Analytics

---

## Phase 3: Tenant Landing Page Restructure

### Current State
- Located at `/{slug}`
- Shows school information
- Has branding edit dialog for tenant admins

### Target State
**URL:** `http://localhost:3000/{slug}` (e.g., `/demo`)

**Sections:**
1. **Hero Section**
   - School logo and name
   - School tagline/slogan
   - **Login button** → "Student/Parent Portal" (links to `/sign-in` with tenant context)
   - Enrollment CTA

2. **About the School**
   - Mission & vision
   - History
   - Achievements

3. **Programs & Features**
   - Academic programs
   - Extracurricular activities
   - Facilities

4. **Statistics**
   - Number of students
   - Number of teachers
   - Number of classes
   - Awards/achievements

5. **Contact Information**
   - Address
   - Phone
   - Email
   - Office hours

6. **Footer**
   - Quick links
   - Social media

**Tenant Admin Access:**
- No visible button
- Access via `/{slug}/admin` URL directly

---

## Phase 4: Tenant Admin Dashboard

### Current State
- Does not exist yet

### Target State
**URL:** `http://localhost:3000/{slug}/admin` (e.g., `/demo/admin`)

**Authentication:**
- Requires Clerk authentication
- User must have `org:admin` or `org:creator` role for the tenant
- Redirect to sign-in if not authenticated
- Show 403 if authenticated but not admin

**Features:**
1. **Side Menu Navigation**
   - Dashboard
   - Students Management
   - Teachers Management
   - Classes Management
   - Attendance
   - Payments
   - Reports
   - School Settings
   - Branding

2. **Dashboard Page**
   - Overview statistics
   - Recent activities
   - Quick actions
   - Attendance summary
   - Payment status

3. **Management Pages**
   - Students (CRUD)
   - Teachers (CRUD)
   - Classes (CRUD)
   - Attendance tracking
   - Payment management
   - Reports & analytics

---

## Phase 5: Student/Parent Portal

### Current State
- Does not exist yet

### Target State
**URL:** `http://localhost:3000/{slug}/portal` (e.g., `/demo/portal`)

**Authentication:**
- Requires Clerk authentication
- User must be associated with the tenant
- Role: `student` or `parent`

**Features:**
1. **Dashboard**
   - Student profile
   - Upcoming classes
   - Recent grades
   - Announcements

2. **Attendance**
   - View attendance history
   - Attendance percentage
   - Absence requests

3. **Payments**
   - View payment history
   - Outstanding fees
   - Make payments
   - Download receipts

4. **Grades & Reports**
   - View grades
   - Download report cards
   - Academic progress

5. **Schedule**
   - Class timetable
   - Exam schedule
   - Events calendar

6. **Communication**
   - Messages from teachers
   - Announcements
   - Parent-teacher meeting requests

---

## Implementation Steps

### Step 1: Update Portal Landing Page
**File:** `src/app/(public)/page.tsx`

- [ ] Enhance hero section with SaaS-focused messaging
- [ ] Add "About CursorSchool Platform" section
- [ ] Add "Featured Features" section with icons
- [ ] Keep tenant cards section with "Our Partner Schools" heading
- [ ] Add "Technology Stack" section
- [ ] Enhance footer with more information
- [ ] Remove super admin button (keep access via URL only)

### Step 2: Enhance Super Admin Dashboard
**Files:** 
- `src/app/super-admin/page.tsx`
- `src/components/super-admin/SuperAdminSidebar.tsx` (if exists, or create)

- [ ] Create/enhance sidebar navigation
- [ ] Add dashboard metrics
- [ ] Add recent activities widget
- [ ] Add quick actions

### Step 3: Update Tenant Landing Page
**File:** `src/app/(tenant)/[slug]/page.tsx`

- [ ] Simplify to focus on school information
- [ ] Update login button to say "Student/Parent Portal"
- [ ] Remove tenant admin edit button
- [ ] Add more school-specific sections
- [ ] Improve layout and design

### Step 4: Create Tenant Admin Dashboard
**New Files:**
- `src/app/(tenant)/[slug]/admin/layout.tsx`
- `src/app/(tenant)/[slug]/admin/page.tsx`
- `src/app/(tenant)/[slug]/admin/students/page.tsx`
- `src/app/(tenant)/[slug]/admin/teachers/page.tsx`
- `src/app/(tenant)/[slug]/admin/classes/page.tsx`
- `src/app/(tenant)/[slug]/admin/attendance/page.tsx`
- `src/app/(tenant)/[slug]/admin/payments/page.tsx`
- `src/app/(tenant)/[slug]/admin/reports/page.tsx`
- `src/app/(tenant)/[slug]/admin/settings/page.tsx`
- `src/components/tenant-admin/TenantAdminSidebar.tsx`

- [ ] Create admin layout with sidebar
- [ ] Implement authentication check
- [ ] Create dashboard page
- [ ] Create management pages (students, teachers, classes)
- [ ] Create attendance page
- [ ] Create payments page
- [ ] Create reports page
- [ ] Create settings page

### Step 5: Create Student/Parent Portal
**New Files:**
- `src/app/(tenant)/[slug]/portal/layout.tsx`
- `src/app/(tenant)/[slug]/portal/page.tsx`
- `src/app/(tenant)/[slug]/portal/attendance/page.tsx`
- `src/app/(tenant)/[slug]/portal/payments/page.tsx`
- `src/app/(tenant)/[slug]/portal/grades/page.tsx`
- `src/app/(tenant)/[slug]/portal/schedule/page.tsx`
- `src/components/student-portal/StudentPortalSidebar.tsx`

- [ ] Create portal layout with sidebar
- [ ] Implement authentication check
- [ ] Create dashboard page
- [ ] Create attendance page
- [ ] Create payments page
- [ ] Create grades page
- [ ] Create schedule page

### Step 6: Update Authentication Flow
**Files:**
- `src/middleware.ts` (if exists, or create)
- `src/lib/auth/roles.ts` (create)

- [ ] Create role-based access control
- [ ] Implement tenant context detection
- [ ] Add authentication middleware
- [ ] Handle redirects based on user role

### Step 7: Update Database Schema
**File:** `src/lib/db/schema.ts`

- [ ] Add `payments` table
- [ ] Add `attendance` table
- [ ] Add `grades` table
- [ ] Add `schedules` table
- [ ] Update `users` table with more roles

### Step 8: Create Server Actions
**New Files:**
- `src/lib/actions/students.ts`
- `src/lib/actions/teachers.ts`
- `src/lib/actions/classes.ts`
- `src/lib/actions/attendance.ts`
- `src/lib/actions/payments.ts`
- `src/lib/actions/grades.ts`

- [ ] Implement CRUD operations for each entity
- [ ] Add proper authorization checks
- [ ] Add validation

---

## URL Structure Summary

```
Portal:
├── /                           → Portal landing page
├── /sign-in                    → General sign-in
├── /sign-up                    → General sign-up
└── /super-admin                → Super admin dashboard
    ├── /tenants                → Tenant management
    ├── /branding               → Platform branding
    ├── /seo                    → Platform SEO
    ├── /modules                → Module management
    └── /profile                → Super admin profile

Tenant:
├── /{slug}                     → Tenant landing page
├── /{slug}/admin               → Tenant admin dashboard
│   ├── /students               → Student management
│   ├── /teachers               → Teacher management
│   ├── /classes                → Class management
│   ├── /attendance             → Attendance management
│   ├── /payments               → Payment management
│   ├── /reports                → Reports
│   └── /settings               → School settings
└── /{slug}/portal              → Student/Parent portal
    ├── /attendance             → View attendance
    ├── /payments               → View/make payments
    ├── /grades                 → View grades
    └── /schedule               → View schedule
```

---

## Priority Order

1. **High Priority** (Core functionality)
   - Portal landing page enhancement
   - Tenant landing page update
   - Tenant admin dashboard creation
   - Basic student/parent portal

2. **Medium Priority** (Enhanced features)
   - Attendance management
   - Payment management
   - Reports & analytics

3. **Low Priority** (Nice to have)
   - Advanced analytics
   - Communication features
   - Mobile app integration

---

## Notes

- All admin pages should check authentication and authorization
- Tenant context should be maintained throughout the tenant pages
- Use Clerk organizations to manage tenant membership
- Implement proper error handling and loading states
- Add breadcrumbs for better navigation
- Ensure responsive design for all pages
