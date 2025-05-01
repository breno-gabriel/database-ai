/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderItem } from "@/db/schemas";
import { db } from "@/drizzle";
import pLimit from "p-limit";
import { readCsvToArray } from "../read-sheet";

export async function populateOrderItems() {
  try {
    console.log("Reading order items sheet...");
    const result = readCsvToArray("./sheets/olist_order_items_dataset.csv");

    const limit = pLimit(10); // Adjust concurrency level as needed

    let completed = 0;
    const total = result.length;

    const tasks = result.map((item) =>
      limit(async () => {
        const price: any = item.order_item_price
          ? +item.order_item_price
          : null;
        const freightValue: any = item.order_item_freight_value
          ? +item.order_item_freight_value
          : null;

        await db.insert(orderItem).values({
          id: item.order_item_id,
          orderId: item.order_id,
          productId: item.order_item_product_id,
          sellerId: item.order_item_seller_id,
          shippingLimitDate: item.order_item_shipping_limit_date,
          price,
          freightValue,
        });

        completed++;
        if (completed % 50 === 0 || completed === total) {
          process.stdout.write(
            `\rProgress: ${((completed / total) * 100).toFixed(2)}%`
          );
        }
      })
    );

    await Promise.all(tasks);
    console.log("\nOrder items populated successfully.");
  } catch (error) {
    console.error("Error populating Order Items:", error);
  }
}
