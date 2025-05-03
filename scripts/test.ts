import { getSystemInstruction } from "@/app/api/chatbot/send-message/utils";
import { customer, geolocation } from "@/db/schemas";
import { db } from "@/drizzle";
import "dotenv/config";

async function main() {
  console.log("Deleting geolocation");
  await db.delete(geolocation);

  console.log("Geolocation deleted");
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
