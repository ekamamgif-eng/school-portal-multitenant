import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_p1Ato0BUSDZK@ep-orange-brook-ad969ogn-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });