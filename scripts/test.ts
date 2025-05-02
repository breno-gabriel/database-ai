import { getSystemInstruction } from "@/app/api/chatbot/send-message/utils";
import { geolocation } from "@/db/schemas";
import { db } from "@/drizzle";
import "dotenv/config";

async function main() {
  const result = await getSystemInstruction();

  console.log(result);
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
