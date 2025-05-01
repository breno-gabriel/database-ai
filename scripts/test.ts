import {
  geolocation,
  customer,
  product,
  order, 
  productCategoryNameTranslation,
  orderReview
} from "@/db/schemas";
import { db } from "@/drizzle";
import "dotenv/config";

async function main() {
  const result = await db.select().from(orderReview);
  console.log(result);
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
