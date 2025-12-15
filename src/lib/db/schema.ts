import { pgTable, uuid, text, timestamp, jsonb, date, numeric } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const tenants = pgTable("tenants", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  domain: text("domain").unique(),
  logoUrl: text("logo_url"),
  slogan: text("slogan"),
  branding: jsonb("branding"), // Stores generic branding config like colors
  seo: jsonb("seo"), // Stores { title, description, keywords }
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const platformSettings = pgTable("platform_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").unique().notNull(), // e.g., 'branding'
  value: jsonb("value").notNull(),     // Stores the configuration
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: text("clerk_id").unique().notNull(),
  tenantId: text("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  displayName: text("display_name"),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const schools = pgTable("schools", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const students = pgTable("students", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  studentId: text("student_id").notNull(), // NIS/NISN
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"), // male, female
  address: text("address"),
  parentName: text("parent_name"),
  parentPhone: text("parent_phone"),
  parentEmail: text("parent_email"),
  enrollmentDate: timestamp("enrollment_date"),
  status: text("status").notNull().default("active"), // active, inactive, graduated
  photo: text("photo"), // URL to student photo
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  teacherId: text("teacher_id").notNull(), // NIP/NUPTK
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  dateOfBirth: timestamp("date_of_birth"),
  gender: text("gender"), // male, female
  address: text("address"),
  subjects: text("subjects").array(), // Array of subjects taught
  qualification: text("qualification"), // Education level
  hireDate: timestamp("hire_date"),
  status: text("status").notNull().default("active"), // active, inactive, resigned
  photo: text("photo"), // URL to teacher photo
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export const classes = pgTable("classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g., "10-A", "7-B"
  gradeLevel: text("grade_level"), // e.g., "10", "7"
  academicYear: text("academic_year"), // e.g., "2024/2025"
  homeroomTeacherId: uuid("homeroom_teacher_id").references(() => teachers.id, { onDelete: "set null" }),
  maxStudents: text("max_students").default("40"),
  room: text("room"), // Classroom location
  schedule: text("schedule"), // Class schedule description
  status: text("status").notNull().default("active"), // active, inactive, archived
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const classStudents = pgTable("class_students", {
  classId: uuid("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
}, () => ({
  pk: sql`PRIMARY KEY (class_id, student_id)`,
}));

export const classTeachers = pgTable("class_teachers", {
  classId: uuid("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
  teacherId: uuid("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
  subject: text("subject"), // Subject taught in this class
  assignedAt: timestamp("assigned_at").defaultNow().notNull(),
}, () => ({
  pk: sql`PRIMARY KEY (class_id, teacher_id, subject)`,
}));

export const attendanceRecords = pgTable("attendance_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  classId: uuid("class_id").notNull().references(() => classes.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  date: date("date").notNull(), // YYYY-MM-DD
  status: text("status").notNull(), // present, absent, late, excused
  reason: text("reason"), // Optional note/reason for absence
  recordedBy: uuid("recorded_by").references(() => users.id), // Teacher/Admin who recorded it
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueAttendance: sql`UNIQUE (${table.studentId}, ${table.classId}, ${table.date})`,
}));

export const teacherAttendance = pgTable("teacher_attendance", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  teacherId: uuid("teacher_id").notNull().references(() => teachers.id, { onDelete: "cascade" }),
  date: date("date").notNull(), // YYYY-MM-DD
  checkIn: timestamp("check_in"),
  checkOut: timestamp("check_out"),
  status: text("status").notNull().default("present"), // present, absent, leave
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueTeacherAttendance: sql`UNIQUE (${table.teacherId}, ${table.date})`,
}));

// Payments Module
export const paymentCategories = pgTable("payment_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(), // e.g. SPP, Uniform, Building Fee
  amount: numeric("amount"), // Default amount if applicable
  period: text("period"), // monthly, one-time, yearly
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  studentId: uuid("student_id").notNull().references(() => students.id, { onDelete: "cascade" }),
  categoryId: uuid("category_id").references(() => paymentCategories.id, { onDelete: "set null" }),

  amount: numeric("amount").notNull(), // Total to pay
  paidAmount: numeric("paid_amount").default("0").notNull(), // Total paid so far

  status: text("status").notNull().default("unpaid"), // unpaid, partial, paid, overdue, cancelled
  dueDate: date("due_date").notNull(),

  title: text("title").notNull(), // e.g. "SPP October 2024"
  description: text("description"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: text("tenant_id").notNull().references(() => tenants.id, { onDelete: "cascade" }),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),

  amount: numeric("amount").notNull(),
  method: text("method").notNull().default("cash"), // cash, transfer, qris
  reference: text("reference"), // Transaction ID / Note

  recordedBy: uuid("recorded_by").references(() => users.id), // Admin who received/recorded
  paymentDate: timestamp("payment_date").defaultNow().notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: text("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id),
  action: text("action").notNull(),
  entity: text("entity").notNull(),
  entityId: uuid("entity_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
