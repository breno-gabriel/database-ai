import { geolocation, customer, product } from "@/db/schemas";
import { db } from "@/drizzle";
import "dotenv/config";

async function main() {
  const result = await db.select().from(product);
  console.log(result);
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
