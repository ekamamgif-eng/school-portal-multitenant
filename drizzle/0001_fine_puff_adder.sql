ALTER TABLE "audit_logs" ALTER COLUMN "tenant_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "classes" ALTER COLUMN "tenant_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "schools" ALTER COLUMN "tenant_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "students" ALTER COLUMN "tenant_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tenants" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "tenants" ALTER COLUMN "id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "tenant_id" SET DATA TYPE text;