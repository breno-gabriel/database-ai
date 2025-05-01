import { db } from "@/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import "dotenv/config";

import { schema } from "../db/";

export const auth = betterAuth({
  trustedOrigins: [
    "http://localhost:3000",
    process.env.NEXT_PUBLIC_APP_URL ?? "",
  ], // Add your trusted origins here
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: schema,
  }),
  baseURL: process.env.NEXT_PUBLIC_APP_URL!,
  emailAndPassword: {
    enabled: true,
  },
});
