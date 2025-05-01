import { geolocation } from "@/db/schemas";
import { db } from "@/drizzle";
import "dotenv/config";

async function main() {
  await db.select().from(geolocation);
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
