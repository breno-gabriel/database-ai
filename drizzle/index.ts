import "dotenv/config";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

const db =
  process.env.NODE_ENV === "production"
    ? neonDrizzle({ connection: process.env.NEON_DATABASE_URL! })
    : drizzle({ client: pool });

export { db };
