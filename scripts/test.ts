import { geolocation } from "@/db/schemas";
import { db } from "@/drizzle";
import "dotenv/config";

async function main() {
  const result = await db.select().from(geolocation);
  console.log(result);
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
