// Type for selecting from the table

import { chat } from "@/db/schemas";
import { InferSelectModel } from "drizzle-orm";

export type ChatType = InferSelectModel<typeof chat>;
