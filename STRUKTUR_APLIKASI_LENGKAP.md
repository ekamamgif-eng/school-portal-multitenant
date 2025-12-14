# STRUKTUR APLIKASI LENGKAP - CURSORSCHOOL

## 🏗️ ARSITEKTUR KESELURUHAN

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         CURSORSCHOOL PLATFORM                            │
│                     Multi-Tenant School Management                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
            ┌───────▼────────┐              ┌───────▼────────┐
            │  PORTAL SIDE   │              │  TENANT SIDE   │
            │  (SaaS Layer)  │              │ (School Layer) │
            └───────┬────────┘              └───────┬────────┘
                    │                               │
        ┌───────────┴──────────┐        ┌──────────┴──────────────┐
        │                      │        │                          │
    ┌───▼────┐         ┌──────▼─────┐ ┌▼──────┐  ┌──────▼──────┐ │
    │Landing │         │Super Admin │ │Tenant │  │Tenant Admin │ │
    │  Page  │         │ Dashboard  │ │Landing│  │  Dashboard  │ │
    └────────┘         └────────────┘ └───────┘  └─────────────┘ │
                                           │                       │
                                      ┌────▼─────┐                │
                                      │ Student/ │                │
                                      │  Parent  │                │
                                      │  Portal  │                │
                                      └──────────┘                │
```

---

## 📂 STRUKTUR FOLDER LENGKAP

```
cursorschool/
│
├── src/
│   ├── app/
│   │   │
│   │   ├── (public)/                          # Portal SaaS (Public)
│   │   │   └── page.tsx                       # Landing page utama
│   │   │
│   │   ├── (tenant)/                          # Tenant routes
│   │   │   └── [slug]/                        # Dynamic tenant route
│   │   │       │
│   │   │       ├── page.tsx                   # Tenant landing page
│   │   │       │
│   │   │       ├── admin/                     # 🔐 TENANT ADMIN DASHBOARD
│   │   │       │   ├── layout.tsx             # Admin layout + sidebar
│   │   │       │   ├── page.tsx               # Admin dashboard
│   │   │       │   │
│   │   │       │   ├── students/              # Manajemen Siswa
│   │   │       │   │   ├── page.tsx           # List siswa
│   │   │       │   │   ├── [id]/
│   │   │       │   │   │   └── page.tsx       # Detail siswa
│   │   │       │   │   └── create/
│   │   │       │   │       └── page.tsx       # Tambah siswa
│   │   │       │   │
│   │   │       │   ├── teachers/              # Manajemen Guru
│   │   │       │   │   ├── page.tsx           # List guru
│   │   │       │   │   ├── [id]/
│   │   │       │   │   │   └── page.tsx       # Detail guru
│   │   │       │   │   └── create/
│   │   │       │   │       └── page.tsx       # Tambah guru
│   │   │       │   │
│   │   │       │   ├── classes/               # Manajemen Kelas
│   │   │       │   │   ├── page.tsx           # List kelas
│   │   │       │   │   ├── [id]/
│   │   │       │   │   │   └── page.tsx       # Detail kelas
│   │   │       │   │   └── create/
│   │   │       │   │       └── page.tsx       # Tambah kelas
│   │   │       │   │
│   │   │       │   ├── attendance/            # Manajemen Absensi
│   │   │       │   │   ├── page.tsx           # Dashboard absensi
│   │   │       │   │   ├── mark/
│   │   │       │   │   │   └── page.tsx       # Input absensi
│   │   │       │   │   └── reports/
│   │   │       │   │       └── page.tsx       # Laporan absensi
│   │   │       │   │
│   │   │       │   ├── payments/              # Manajemen Pembayaran
│   │   │       │   │   ├── page.tsx           # Dashboard pembayaran
│   │   │       │   │   ├── invoices/
│   │   │       │   │   │   └── page.tsx       # Buat invoice
│   │   │       │   │   └── history/
│   │   │       │   │       └── page.tsx       # Riwayat pembayaran
│   │   │       │   │
│   │   │       │   ├── grades/                # Manajemen Nilai
│   │   │       │   │   ├── page.tsx           # Input nilai
│   │   │       │   │   └── reports/
│   │   │       │   │       └── page.tsx       # Rapor
│   │   │       │   │
│   │   │       │   ├── reports/               # Laporan & Analitik
│   │   │       │   │   ├── page.tsx           # Dashboard laporan
│   │   │       │   │   ├── academic/
│   │   │       │   │   │   └── page.tsx       # Laporan akademik
│   │   │       │   │   └── financial/
│   │   │       │   │       └── page.tsx       # Laporan keuangan
│   │   │       │   │
│   │   │       │   ├── settings/              # Pengaturan Sekolah
│   │   │       │   │   ├── page.tsx           # Pengaturan umum
│   │   │       │   │   ├── branding/
│   │   │       │   │   │   └── page.tsx       # Branding sekolah
│   │   │       │   │   └── users/
│   │   │       │   │       └── page.tsx       # Manajemen user
│   │   │       │   │
│   │   │       │   └── announcements/         # Pengumuman
│   │   │       │       ├── page.tsx           # List pengumuman
│   │   │       │       └── create/
│   │   │       │           └── page.tsx       # Buat pengumuman
│   │   │       │
│   │   │       └── portal/                    # 🎓 STUDENT/PARENT PORTAL
│   │   │           ├── layout.tsx             # Portal layout + sidebar
│   │   │           ├── page.tsx               # Portal dashboard
│   │   │           │
│   │   │           ├── profile/               # Profil Siswa
│   │   │           │   └── page.tsx           # Lihat/edit profil
│   │   │           │
│   │   │           ├── attendance/            # Absensi Siswa
│   │   │           │   ├── page.tsx           # Lihat absensi
│   │   │           │   └── history/
│   │   │           │       └── page.tsx       # Riwayat absensi
│   │   │           │
│   │   │           ├── payments/              # Pembayaran
│   │   │           │   ├── page.tsx           # Tagihan & pembayaran
│   │   │           │   ├── history/
│   │   │           │   │   └── page.tsx       # Riwayat pembayaran
│   │   │           │   └── pay/
│   │   │           │       └── page.tsx       # Bayar tagihan
│   │   │           │
│   │   │           ├── grades/                # Nilai & Rapor
│   │   │           │   ├── page.tsx           # Lihat nilai
│   │   │           │   └── report-card/
│   │   │           │       └── page.tsx       # Download rapor
│   │   │           │
│   │   │           ├── schedule/              # Jadwal
│   │   │           │   ├── page.tsx           # Jadwal pelajaran
│   │   │           │   └── exams/
│   │   │           │       └── page.tsx       # Jadwal ujian
│   │   │           │
│   │   │           ├── announcements/         # Pengumuman
│   │   │           │   └── page.tsx           # Lihat pengumuman
│   │   │           │
│   │   │           └── messages/              # Pesan
│   │   │               ├── page.tsx           # Inbox
│   │   │               └── [id]/
│   │   │                   └── page.tsx       # Baca pesan
│   │   │
│   │   ├── super-admin/                       # 👑 SUPER ADMIN DASHBOARD
│   │   │   ├── layout.tsx                     # Super admin layout
│   │   │   ├── page.tsx                       # Super admin dashboard
│   │   │   │
│   │   │   ├── tenants/                       # Manajemen Tenant
│   │   │   │   ├── page.tsx                   # List tenant
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx               # Detail tenant
│   │   │   │   └── create/
│   │   │   │       └── page.tsx               # Buat tenant baru
│   │   │   │
│   │   │   ├── branding/                      # Platform Branding
│   │   │   │   └── page.tsx                   # Edit branding platform
│   │   │   │
│   │   │   ├── seo/                           # Platform SEO
│   │   │   │   └── page.tsx                   # Edit SEO platform
│   │   │   │
│   │   │   ├── modules/                       # Manajemen Modul
│   │   │   │   └── page.tsx                   # Enable/disable modul
│   │   │   │
│   │   │   ├── analytics/                     # Analitik Platform
│   │   │   │   └── page.tsx                   # Statistik keseluruhan
│   │   │   │
│   │   │   └── profile/                       # Profil Super Admin
│   │   │       └── page.tsx                   # Edit profil
│   │   │
│   │   ├── sign-in/                           # Halaman Sign In
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx                   # Clerk sign in
│   │   │
│   │   ├── sign-up/                           # Halaman Sign Up
│   │   │   └── [[...sign-up]]/
│   │   │       └── page.tsx                   # Clerk sign up
│   │   │
│   │   ├── layout.tsx                         # Root layout
│   │   ├── globals.css                        # Global styles
│   │   └── favicon.ico                        # Favicon
│   │
│   ├── components/
│   │   │
│   │   ├── portal/                            # Portal Components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── TenantCardsSection.tsx
│   │   │   ├── TechnologyStack.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── super-admin/                       # Super Admin Components
│   │   │   ├── SuperAdminSidebar.tsx
│   │   │   ├── TenantList.tsx
│   │   │   ├── TenantDetailsEditor.tsx
│   │   │   ├── PlatformBrandingForm.tsx
│   │   │   └── AnalyticsDashboard.tsx
│   │   │
│   │   ├── tenant-admin/                      # Tenant Admin Components
│   │   │   ├── TenantAdminSidebar.tsx
│   │   │   ├── StudentList.tsx
│   │   │   ├── StudentForm.tsx
│   │   │   ├── TeacherList.tsx
│   │   │   ├── TeacherForm.tsx
│   │   │   ├── ClassList.tsx
│   │   │   ├── ClassForm.tsx
│   │   │   ├── AttendanceMarker.tsx
│   │   │   ├── AttendanceReport.tsx
│   │   │   ├── PaymentInvoiceForm.tsx
│   │   │   ├── PaymentHistory.tsx
│   │   │   ├── GradeInput.tsx
│   │   │   └── ReportCard.tsx
│   │   │
│   │   ├── student-portal/                    # Student Portal Components
│   │   │   ├── StudentPortalSidebar.tsx
│   │   │   ├── StudentDashboard.tsx
│   │   │   ├── AttendanceCalendar.tsx
│   │   │   ├── PaymentCard.tsx
│   │   │   ├── GradeTable.tsx
│   │   │   ├── ScheduleTable.tsx
│   │   │   └── AnnouncementCard.tsx
│   │   │
│   │   ├── branding/                          # Branding Components
│   │   │   ├── TenantBrandingProvider.tsx
│   │   │   └── BrandingEditDialog.tsx
│   │   │
│   │   ├── seo/                               # SEO Components
│   │   │   ├── SEOHead.tsx
│   │   │   └── SEOEditForm.tsx
│   │   │
│   │   └── ui/                                # UI Components (shadcn/ui)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── table.tsx
│   │       ├── dialog.tsx
│   │       ├── select.tsx
│   │       ├── badge.tsx
│   │       ├── avatar.tsx
│   │       ├── separator.tsx
│   │       ├── tabs.tsx
│   │       ├── calendar.tsx
│   │       ├── chart.tsx
│   │       └── ... (other UI components)
│   │
│   ├── lib/
│   │   │
│   │   ├── actions/                           # Server Actions
│   │   │   ├── branding.ts                    # Platform branding actions
│   │   │   ├── tenants.ts                     # Tenant CRUD actions
│   │   │   ├── students.ts                    # Student CRUD actions
│   │   │   ├── teachers.ts                    # Teacher CRUD actions
│   │   │   ├── classes.ts                     # Class CRUD actions
│   │   │   ├── attendance.ts                  # Attendance actions
│   │   │   ├── payments.ts                    # Payment actions
│   │   │   ├── grades.ts                      # Grade actions
│   │   │   ├── schedules.ts                   # Schedule actions
│   │   │   ├── announcements.ts               # Announcement actions
│   │   │   ├── messages.ts                    # Message actions
│   │   │   └── super-admin.ts                 # Super admin actions
│   │   │
│   │   ├── db/                                # Database
│   │   │   ├── index.ts                       # DB connection
│   │   │   └── schema.ts                      # Drizzle schema
│   │   │
│   │   ├── auth/                              # Authentication
│   │   │   ├── roles.ts                       # Role definitions
│   │   │   ├── permissions.ts                 # Permission checks
│   │   │   └── middleware.ts                  # Auth middleware
│   │   │
│   │   ├── utils/                             # Utilities
│   │   │   ├── cn.ts                          # Class name utility
│   │   │   ├── date.ts                        # Date utilities
│   │   │   ├── currency.ts                    # Currency formatting
│   │   │   └── validators.ts                  # Validation functions
│   │   │
│   │   └── types/                             # TypeScript Types
│   │       ├── tenant.ts
│   │       ├── student.ts
│   │       ├── teacher.ts
│   │       ├── attendance.ts
│   │       ├── payment.ts
│   │       └── grade.ts
│   │
│   └── middleware.ts                          # Next.js middleware
│
├── public/                                    # Static files
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── drizzle/                                   # Database migrations
│   └── migrations/
│
├── .env.local                                 # Environment variables
├── .env.example                               # Environment template
├── package.json                               # Dependencies
├── tsconfig.json                              # TypeScript config
├── next.config.ts                             # Next.js config
├── tailwind.config.ts                         # Tailwind config
├── drizzle.config.ts                          # Drizzle config
└── README.md                                  # Documentation
```

---

## 🗄️ DATABASE SCHEMA LENGKAP

```sql
-- ============================================
-- CORE TABLES
-- ============================================

-- Tenants (Sekolah)
CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE,
  logo_url TEXT,
  slogan TEXT,
  branding JSONB,              -- {primary, secondary, accent, features[]}
  seo JSONB,                   -- {title, description, keywords}
  created_at TIMESTAMP DEFAULT NOW()
);

-- Platform Settings
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users (Semua pengguna)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user',  -- super_admin, tenant_admin, teacher, student, parent
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ACADEMIC TABLES
-- ============================================

-- Students (Siswa)
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  student_id TEXT NOT NULL,        -- NIS/NISN
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  parent_name TEXT,
  parent_phone TEXT,
  parent_email TEXT,
  enrollment_date DATE,
  status TEXT DEFAULT 'active',    -- active, inactive, graduated
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, student_id)
);

-- Teachers (Guru)
CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  teacher_id TEXT NOT NULL,        -- NIP/NUPTK
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  subjects TEXT[],                 -- Array of subjects
  hire_date DATE,
  status TEXT DEFAULT 'active',    -- active, inactive, resigned
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, teacher_id)
);

-- Classes (Kelas)
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,              -- e.g., "10-A", "7-B"
  grade_level TEXT,                -- e.g., "10", "7"
  academic_year TEXT,              -- e.g., "2024/2025"
  homeroom_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  max_students INTEGER DEFAULT 40,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Class Students (Relasi Siswa-Kelas)
CREATE TABLE class_students (
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (class_id, student_id)
);

-- ============================================
-- ATTENDANCE TABLES
-- ============================================

-- Attendance (Absensi)
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  status TEXT NOT NULL,            -- present, absent, late, excused, sick
  notes TEXT,
  marked_by UUID REFERENCES users(id),
  marked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Attendance Summary (Ringkasan Absensi per Bulan)
CREATE TABLE attendance_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  month INTEGER NOT NULL,          -- 1-12
  year INTEGER NOT NULL,
  present_count INTEGER DEFAULT 0,
  absent_count INTEGER DEFAULT 0,
  late_count INTEGER DEFAULT 0,
  excused_count INTEGER DEFAULT 0,
  sick_count INTEGER DEFAULT 0,
  total_days INTEGER DEFAULT 0,
  attendance_percentage DECIMAL(5,2),
  UNIQUE(student_id, month, year)
);

-- ============================================
-- PAYMENT TABLES
-- ============================================

-- Payment Categories (Kategori Pembayaran)
CREATE TABLE payment_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,              -- e.g., "SPP", "Uang Bangunan", "Seragam"
  description TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments (Pembayaran)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  category_id UUID REFERENCES payment_categories(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  paid_amount DECIMAL(12,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',   -- pending, partial, paid, overdue, cancelled
  payment_method TEXT,             -- cash, transfer, credit_card, etc.
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment Transactions (Transaksi Pembayaran)
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_date TIMESTAMP DEFAULT NOW(),
  reference_number TEXT,
  notes TEXT,
  processed_by UUID REFERENCES users(id)
);

-- ============================================
-- ACADEMIC PERFORMANCE TABLES
-- ============================================

-- Subjects (Mata Pelajaran)
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Grades (Nilai)
CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  semester INTEGER NOT NULL,       -- 1 or 2
  academic_year TEXT NOT NULL,     -- e.g., "2024/2025"
  grade_type TEXT NOT NULL,        -- daily, midterm, final, project
  score DECIMAL(5,2) NOT NULL,
  max_score DECIMAL(5,2) DEFAULT 100,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Report Cards (Rapor)
CREATE TABLE report_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  semester INTEGER NOT NULL,
  academic_year TEXT NOT NULL,
  average_score DECIMAL(5,2),
  rank INTEGER,
  total_students INTEGER,
  attendance_percentage DECIMAL(5,2),
  teacher_notes TEXT,
  principal_notes TEXT,
  issued_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, semester, academic_year)
);

-- ============================================
-- SCHEDULE TABLES
-- ============================================

-- Schedules (Jadwal Pelajaran)
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
  day_of_week INTEGER NOT NULL,   -- 1=Monday, 7=Sunday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  academic_year TEXT,
  semester INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exam Schedules (Jadwal Ujian)
CREATE TABLE exam_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
  exam_type TEXT NOT NULL,         -- daily, midterm, final
  exam_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  academic_year TEXT,
  semester INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- COMMUNICATION TABLES
-- ============================================

-- Announcements (Pengumuman)
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  target_role TEXT[],              -- ['student', 'parent', 'teacher']
  priority TEXT DEFAULT 'normal',  -- low, normal, high, urgent
  published_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Messages (Pesan)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- AUDIT & LOGS
-- ============================================

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id TEXT REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,            -- create, update, delete, login, etc.
  entity TEXT NOT NULL,            -- student, teacher, payment, etc.
  entity_id UUID,
  changes JSONB,                   -- Store what changed
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- INDEXES untuk Performance
-- ============================================

CREATE INDEX idx_students_tenant ON students(tenant_id);
CREATE INDEX idx_teachers_tenant ON teachers(tenant_id);
CREATE INDEX idx_classes_tenant ON classes(tenant_id);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_schedules_class ON schedules(class_id);
CREATE INDEX idx_announcements_tenant ON announcements(tenant_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
```

---

## 🔐 ROLE & PERMISSION SYSTEM

```typescript
// lib/auth/roles.ts

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  TENANT_ADMIN = 'tenant_admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
}

export const RolePermissions = {
  super_admin: {
    canAccessSuperAdmin: true,
    canManageTenants: true,
    canManagePlatformSettings: true,
    canViewAllData: true,
  },
  tenant_admin: {
    canAccessTenantAdmin: true,
    canManageStudents: true,
    canManageTeachers: true,
    canManageClasses: true,
    canManagePayments: true,
    canViewReports: true,
    canManageSettings: true,
  },
  teacher: {
    canAccessPortal: true,
    canMarkAttendance: true,
    canInputGrades: true,
    canViewStudents: true,
    canSendMessages: true,
  },
  student: {
    canAccessPortal: true,
    canViewOwnData: true,
    canMakePayments: true,
    canViewGrades: true,
    canViewSchedule: true,
  },
  parent: {
    canAccessPortal: true,
    canViewChildData: true,
    canMakePayments: true,
    canViewGrades: true,
    canCommunicateWithTeachers: true,
  },
};
```

---

## 🌐 URL ROUTING LENGKAP

```
┌─────────────────────────────────────────────────────────────────────┐
│ PORTAL SIDE (SaaS Platform)                                         │
└─────────────────────────────────────────────────────────────────────┘

http://localhost:3000/
├── /                                    → Portal landing page
├── /sign-in                             → Sign in page
├── /sign-up                             → Sign up page
└── /super-admin                         → Super admin dashboard
    ├── /                                → Dashboard
    ├── /tenants                         → List all tenants
    ├── /tenants/create                  → Create new tenant
    ├── /tenants/[id]                    → Tenant details
    ├── /branding                        → Platform branding
    ├── /seo                             → Platform SEO
    ├── /modules                         → Module management
    ├── /analytics                       → Platform analytics
    └── /profile                         → Super admin profile

┌─────────────────────────────────────────────────────────────────────┐
│ TENANT SIDE (School)                                                 │
└─────────────────────────────────────────────────────────────────────┘

http://localhost:3000/{slug}             (e.g., /demo, /smpn1)
├── /                                    → Tenant landing page
│
├── /admin                               → Tenant admin dashboard
│   ├── /                                → Dashboard
│   ├── /students                        → List students
│   ├── /students/create                 → Add student
│   ├── /students/[id]                   → Student details
│   ├── /teachers                        → List teachers
│   ├── /teachers/create                 → Add teacher
│   ├── /teachers/[id]                   → Teacher details
│   ├── /classes                         → List classes
│   ├── /classes/create                  → Add class
│   ├── /classes/[id]                    → Class details
│   ├── /attendance                      → Attendance dashboard
│   ├── /attendance/mark                 → Mark attendance
│   ├── /attendance/reports              → Attendance reports
│   ├── /payments                        → Payment dashboard
│   ├── /payments/invoices               → Create invoices
│   ├── /payments/history                → Payment history
│   ├── /grades                          → Grade management
│   ├── /grades/reports                  → Report cards
│   ├── /reports                         → Reports dashboard
│   ├── /reports/academic                → Academic reports
│   ├── /reports/financial               → Financial reports
│   ├── /settings                        → School settings
│   ├── /settings/branding               → School branding
│   ├── /settings/users                  → User management
│   ├── /announcements                   → Announcements
│   └── /announcements/create            → Create announcement
│
└── /portal                              → Student/Parent portal
    ├── /                                → Portal dashboard
    ├── /profile                         → Student profile
    ├── /attendance                      → View attendance
    ├── /attendance/history              → Attendance history
    ├── /payments                        → View payments
    ├── /payments/history                → Payment history
    ├── /payments/pay                    → Make payment
    ├── /grades                          → View grades
    ├── /grades/report-card              → Download report card
    ├── /schedule                        → Class schedule
    ├── /schedule/exams                  → Exam schedule
    ├── /announcements                   → View announcements
    ├── /messages                        → Messages inbox
    └── /messages/[id]                   → Read message
```

---

## 🎨 COMPONENT HIERARCHY

```
App
│
├── Portal Landing Page
│   ├── Header
│   │   ├── Logo
│   │   ├── Navigation
│   │   └── Auth Buttons
│   ├── Hero Section
│   │   ├── Headline
│   │   ├── Subheadline
│   │   └── CTA Buttons
│   ├── About Section
│   ├── Features Section
│   │   └── Feature Cards (6x)
│   ├── Tenant Cards Section
│   │   └── Tenant Cards (dynamic)
│   ├── Technology Stack
│   │   └── Tech Icons
│   └── Footer
│
├── Super Admin Dashboard
│   ├── Super Admin Layout
│   │   ├── Sidebar
│   │   │   └── Navigation Links
│   │   └── Main Content Area
│   ├── Dashboard Page
│   │   ├── Stats Cards
│   │   ├── Charts
│   │   └── Recent Activities
│   └── Management Pages
│       ├── Tenant List
│       ├── Tenant Form
│       ├── Branding Form
│       └── SEO Form
│
├── Tenant Landing Page
│   ├── Header
│   │   ├── School Logo
│   │   ├── School Name
│   │   └── Portal Button
│   ├── Hero Section
│   ├── About School
│   ├── Statistics
│   ├── Programs
│   ├── Contact Info
│   └── Footer
│
├── Tenant Admin Dashboard
│   ├── Tenant Admin Layout
│   │   ├── Sidebar
│   │   │   ├── Dashboard Link
│   │   │   ├── Students Link
│   │   │   ├── Teachers Link
│   │   │   ├── Classes Link
│   │   │   ├── Attendance Link
│   │   │   ├── Payments Link
│   │   │   ├── Grades Link
│   │   │   ├── Reports Link
│   │   │   └── Settings Link
│   │   └── Main Content Area
│   ├── Dashboard Page
│   │   ├── Overview Stats
│   │   ├── Quick Actions
│   │   └── Recent Activities
│   ├── Student Management
│   │   ├── Student List Table
│   │   ├── Student Form
│   │   └── Student Detail
│   ├── Teacher Management
│   │   ├── Teacher List Table
│   │   ├── Teacher Form
│   │   └── Teacher Detail
│   ├── Class Management
│   │   ├── Class List
│   │   ├── Class Form
│   │   └── Class Detail
│   ├── Attendance Management
│   │   ├── Attendance Marker
│   │   ├── Attendance Calendar
│   │   └── Attendance Reports
│   ├── Payment Management
│   │   ├── Invoice Creator
│   │   ├── Payment List
│   │   └── Payment History
│   ├── Grade Management
│   │   ├── Grade Input Form
│   │   └── Report Card Generator
│   └── Reports
│       ├── Academic Reports
│       └── Financial Reports
│
└── Student/Parent Portal
    ├── Student Portal Layout
    │   ├── Sidebar
    │   │   ├── Dashboard Link
    │   │   ├── Profile Link
    │   │   ├── Attendance Link
    │   │   ├── Payments Link
    │   │   ├── Grades Link
    │   │   ├── Schedule Link
    │   │   ├── Announcements Link
    │   │   └── Messages Link
    │   └── Main Content Area
    ├── Dashboard Page
    │   ├── Welcome Card
    │   ├── Upcoming Classes
    │   ├── Outstanding Fees
    │   └── Recent Announcements
    ├── Profile Page
    ├── Attendance Page
    │   ├── Attendance Calendar
    │   └── Attendance Stats
    ├── Payments Page
    │   ├── Outstanding Invoices
    │   ├── Payment Form
    │   └── Payment History
    ├── Grades Page
    │   ├── Grade Table
    │   └── Report Card Download
    ├── Schedule Page
    │   ├── Class Schedule Table
    │   └── Exam Schedule
    ├── Announcements Page
    └── Messages Page
        ├── Message List
        └── Message Detail
```

---

## 🚦 USER FLOW DIAGRAMS

### Flow 1: Super Admin
```
1. Buka browser
2. Ketik: http://localhost:3000/super-admin
3. Sign in dengan akun super admin
4. Masuk ke Super Admin Dashboard
5. Pilih menu (Tenants, Branding, SEO, dll)
6. Kelola platform
```

### Flow 2: Tenant Admin
```
1. Buka browser
2. Ketik: http://localhost:3000/demo/admin
3. Sign in dengan akun tenant admin
4. Masuk ke Tenant Admin Dashboard
5. Pilih menu (Students, Teachers, Attendance, dll)
6. Kelola sekolah
```

### Flow 3: Student/Parent
```
1. Buka browser
2. Ketik: http://localhost:3000/demo
3. Klik tombol "Student/Parent Portal"
4. Sign in dengan akun student/parent
5. Masuk ke Student Portal
6. Lihat absensi, bayar tagihan, cek nilai, dll
```

### Flow 4: Guest/Visitor
```
1. Buka browser
2. Ketik: http://localhost:3000
3. Lihat informasi tentang CursorSchool
4. Lihat daftar sekolah partner
5. Klik card sekolah untuk lihat info sekolah
6. Sign up atau hubungi sekolah
```

---

## 📊 DATA FLOW

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   Next.js Pages     │
│   (Server Side)     │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Server Actions     │
│  (lib/actions/*)    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Drizzle ORM        │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  PostgreSQL (Neon)  │
└─────────────────────┘
```

---

## 🎯 NEXT STEPS - PRIORITAS IMPLEMENTASI

### ✅ SUDAH ADA
1. Portal landing page (perlu enhancement)
2. Super admin dashboard (perlu enhancement)
3. Tenant landing page (perlu simplifikasi)
4. Database schema dasar
5. Authentication (Clerk)

### 🔨 PERLU DIBUAT (Prioritas Tinggi)
1. **Tenant Admin Dashboard** (`/{slug}/admin`)
   - Layout dengan sidebar
   - Dashboard page
   - Student management
   - Teacher management
   - Class management

2. **Student/Parent Portal** (`/{slug}/portal`)
   - Layout dengan sidebar
   - Dashboard page
   - Attendance viewing
   - Payment viewing

3. **Database Schema Expansion**
   - Attendance tables
   - Payment tables
   - Grade tables
   - Schedule tables

### 📋 PERLU DIBUAT (Prioritas Sedang)
4. Attendance management system
5. Payment management system
6. Grade management system
7. Report generation

### 🎨 PERLU DIBUAT (Prioritas Rendah)
8. Advanced analytics
9. Communication features
10. Mobile responsiveness optimization

---

Apakah Anda ingin saya mulai implementasi dari bagian tertentu? Saya siap membantu!
