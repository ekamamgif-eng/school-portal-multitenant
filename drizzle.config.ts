import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_p1Ato0BUSDZK@ep-orange-brook-ad969ogn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
  verbose: true,
  migrations: {
    table: "drizzle_migrations",
    schema: "public",
  },
});
