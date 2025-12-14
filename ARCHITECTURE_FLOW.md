# Application Flow Architecture

## Visual Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                         CURSOR SCHOOL                            │
│                      (SaaS Platform)                             │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        ┌───────▼────────┐             ┌────────▼────────┐
        │  PORTAL SIDE   │             │   TENANT SIDE   │
        └───────┬────────┘             └────────┬────────┘
                │                               │
    ┌───────────┴──────────┐         ┌──────────┴──────────┐
    │                      │         │                     │
┌───▼────┐         ┌──────▼─────┐ ┌─▼──────┐      ┌──────▼──────┐
│Landing │         │Super Admin │ │Tenant  │      │Tenant Admin │
│  Page  │         │ Dashboard  │ │Landing │      │  Dashboard  │
└────────┘         └────────────┘ └────────┘      └─────────────┘
                                        │
                                  ┌─────▼──────┐
                                  │  Student/  │
                                  │   Parent   │
                                  │   Portal   │
                                  └────────────┘
```

## Detailed Flow Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                    http://localhost:3000/                            │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ HERO SECTION                                                │    │
│  │ • CursorSchool SaaS Platform                               │    │
│  │ • [Login Button] → /sign-in                                │    │
│  │ • Get Started CTA                                          │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ ABOUT PLATFORM                                             │    │
│  │ • What is CursorSchool                                     │    │
│  │ • Value proposition                                        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ FEATURED FEATURES                                          │    │
│  │ [Icon] Multi-tenant    [Icon] Branding    [Icon] Secure   │    │
│  │ [Icon] Analytics       [Icon] Payments    [Icon] Reports  │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ OUR PARTNER SCHOOLS                                        │    │
│  │ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                   │    │
│  │ │ Demo │  │SMPN1 │  │ SDN1 │  │SMPN2 │                   │    │
│  │ │School│  │Jakarta│  │Bandung│  │Surabaya│                 │    │
│  │ └──┬───┘  └──┬───┘  └──┬───┘  └──┬───┘                   │    │
│  │    │         │         │         │                         │    │
│  │    └─────────┴─────────┴─────────┘                        │    │
│  │              Links to /{slug}                              │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ TECHNOLOGY STACK                                           │    │
│  │ Next.js • PostgreSQL • Clerk • Drizzle • Tailwind         │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Hidden Access: Type /super-admin in browser                       │
└──────────────────────────────────────────────────────────────────────┘

                              ↓ Click tenant card

┌──────────────────────────────────────────────────────────────────────┐
│              http://localhost:3000/demo (Tenant Landing)             │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ HERO SECTION                                                │    │
│  │ [Logo] Demo School                                         │    │
│  │ "Excellence in Education"                                  │    │
│  │ [Student/Parent Portal Button] → /sign-in (tenant context)│    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ ABOUT THE SCHOOL                                           │    │
│  │ • Mission & Vision                                         │    │
│  │ • History                                                  │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ STATISTICS                                                 │    │
│  │ [450 Students] [32 Teachers] [15 Classes] [12 Awards]     │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ PROGRAMS & FEATURES                                        │    │
│  │ • Academic Programs                                        │    │
│  │ • Extracurricular Activities                              │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Hidden Access: Type /demo/admin in browser (for admins)           │
└──────────────────────────────────────────────────────────────────────┘

                    ↓ Admin types /demo/admin

┌──────────────────────────────────────────────────────────────────────┐
│           http://localhost:3000/demo/admin (Tenant Admin)            │
│                                                                      │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐   │
│  │ SIDEBAR  │  │ DASHBOARD                                     │   │
│  │          │  │ ┌──────────────────────────────────────┐     │   │
│  │Dashboard │  │ │ Statistics Overview                   │     │   │
│  │Students  │  │ │ • Total Students: 450                │     │   │
│  │Teachers  │  │ │ • Total Teachers: 32                 │     │   │
│  │Classes   │  │ │ • Attendance Today: 95%              │     │   │
│  │Attendance│  │ └──────────────────────────────────────┘     │   │
│  │Payments  │  │                                               │   │
│  │Reports   │  │ ┌──────────────────────────────────────┐     │   │
│  │Settings  │  │ │ Recent Activities                     │     │   │
│  │Branding  │  │ │ • New student enrolled                │     │   │
│  │          │  │ │ • Payment received                    │     │   │
│  └──────────┘  │ └──────────────────────────────────────┘     │   │
│                │                                               │   │
│                └───────────────────────────────────────────────┘   │
│                                                                      │
│  Authentication Required: org:admin or org:creator role             │
└──────────────────────────────────────────────────────────────────────┘

                ↓ Student/Parent clicks portal button

┌──────────────────────────────────────────────────────────────────────┐
│         http://localhost:3000/demo/portal (Student Portal)           │
│                                                                      │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐   │
│  │ SIDEBAR  │  │ DASHBOARD                                     │   │
│  │          │  │ ┌──────────────────────────────────────┐     │   │
│  │Dashboard │  │ │ Welcome, John Doe                     │     │   │
│  │Attendance│  │ │ Class: 10-A                          │     │   │
│  │Payments  │  │ └──────────────────────────────────────┘     │   │
│  │Grades    │  │                                               │   │
│  │Schedule  │  │ ┌──────────────────────────────────────┐     │   │
│  │          │  │ │ Upcoming Classes                      │     │   │
│  │          │  │ │ • Math - 09:00 AM                    │     │   │
│  │          │  │ │ • Science - 10:30 AM                 │     │   │
│  └──────────┘  │ └──────────────────────────────────────┘     │   │
│                │                                               │   │
│                │ ┌──────────────────────────────────────┐     │   │
│                │ │ Outstanding Fees                      │     │   │
│                │ │ $150.00 - Due: Dec 31, 2024          │     │   │
│                │ │ [Pay Now]                            │     │   │
│                │ └──────────────────────────────────────┘     │   │
│                └───────────────────────────────────────────────┘   │
│                                                                      │
│  Authentication Required: student or parent role                    │
└──────────────────────────────────────────────────────────────────────┘
```

## User Roles & Access

```
┌─────────────────┬──────────────────────────────────────────────────┐
│ Role            │ Access                                            │
├─────────────────┼──────────────────────────────────────────────────┤
│ Super Admin     │ • Portal landing page                            │
│                 │ • /super-admin/* (all super admin pages)         │
│                 │ • Can manage all tenants                         │
├─────────────────┼──────────────────────────────────────────────────┤
│ Tenant Admin    │ • Portal landing page                            │
│                 │ • Tenant landing page                            │
│                 │ • /{slug}/admin/* (tenant admin pages)           │
│                 │ • Can manage their school                        │
├─────────────────┼──────────────────────────────────────────────────┤
│ Student/Parent  │ • Portal landing page                            │
│                 │ • Tenant landing page                            │
│                 │ • /{slug}/portal/* (student portal pages)        │
│                 │ • Can view their own data                        │
├─────────────────┼──────────────────────────────────────────────────┤
│ Public/Guest    │ • Portal landing page                            │
│                 │ • Tenant landing pages                           │
│                 │ • Sign-in/Sign-up pages                          │
└─────────────────┴──────────────────────────────────────────────────┘
```

## Authentication Flow

```
User visits any page
        │
        ▼
┌───────────────┐
│ Is user       │ No
│ authenticated?├────► Redirect to /sign-in
└───────┬───────┘
        │ Yes
        ▼
┌───────────────┐
│ Detect user   │
│ role          │
└───────┬───────┘
        │
        ├─► Super Admin ──► Can access /super-admin/*
        │
        ├─► Tenant Admin ──► Can access /{slug}/admin/*
        │                    (only for their tenant)
        │
        ├─► Student/Parent ─► Can access /{slug}/portal/*
        │                     (only for their tenant)
        │
        └─► Guest ──────────► Can only view public pages
```

## Navigation Patterns

### Portal Side
```
Home (/) → View tenants → Click tenant card → Tenant landing page
                                                      │
                                                      ├─► Student login → Student portal
                                                      └─► Admin types /admin → Admin dashboard

Home (/) → Super admin types /super-admin → Super admin dashboard
```

### Tenant Side
```
Tenant Landing (/{slug})
    │
    ├─► Student/Parent clicks "Portal" → Sign in → Student Portal (/{slug}/portal)
    │                                                    │
    │                                                    ├─► View attendance
    │                                                    ├─► Make payments
    │                                                    ├─► View grades
    │                                                    └─► View schedule
    │
    └─► Admin types /{slug}/admin → Sign in → Tenant Admin Dashboard
                                                    │
                                                    ├─► Manage students
                                                    ├─► Manage teachers
                                                    ├─► Manage classes
                                                    ├─► Track attendance
                                                    ├─► Manage payments
                                                    └─► View reports
```
