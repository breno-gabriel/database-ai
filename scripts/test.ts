import { getSystemInstruction } from "@/app/api/chatbot/send-message/utils";
import { geolocation } from "@/db/schemas";
import { db } from "@/drizzle";
import "dotenv/config";

async function main() {
  const result = await db.execute(
    ` SELECT s.seller_id, COUNT(oi.product_id) AS product_count FROM order_item AS oi JOIN seller AS s ON oi.seller_id = s.id GROUP BY s.seller_id ORDER BY product_count DESC LIMIT 5`
  );

  console.log(result);
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
