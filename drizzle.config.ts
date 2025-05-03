import "dotenv/config";
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  out: "./drizzle",
  schema: "./db/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url:
      process.env.NODE_ENV === "production"
        ? process.env.NEON_DATABASE_URL!
        : process.env.DATABASE_URL!,
  },
});
