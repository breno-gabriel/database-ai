import { getSystemInstruction } from "@/app/api/chatbot/send-message/utils";
import { customer, geolocation } from "@/db/schemas";
import { db } from "@/drizzle";
import "dotenv/config";

async function main() {
  const customers = await db.select().from(customer);

  console.log(customers);
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
