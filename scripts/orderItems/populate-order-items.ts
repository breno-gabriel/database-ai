/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderItem } from "@/db/schemas";
import { db } from "@/drizzle";
import { readCsvToArray } from "../read-sheet";

export async function populateOrderItems() {
  try {
    console.log("Reading order items sheet...");
    const result = readCsvToArray("./sheets/olist_order_items_dataset.csv");

    for (const [index, item] of result.entries()) {
      const price: any = item.order_item_price ? +item.order_item_price : null;
      const freightValue: any = item.order_item_freight_value
        ? +item.order_item_freight_value
        : null;

      await db.insert(orderItem).values({
        id: item.order_item_id,
        orderId: item.order_id,
        productId: item.order_item_product_id,
        sellerId: item.order_item_seller_id,
        shippingLimitDate: item.order_item_shipping_limit_date,
        price: price,
        freightValue: freightValue,
      });

      if (index % 50 === 0 || index === result.length - 1) {
        process.stdout.write(
          `\rProgress: ${((index / result.length) * 100).toFixed(2)}%`
        );
      }
    }
    console.log("Order items populated successfully.");
  } catch (error) {
    console.error("Error populating Order Items:", error);
  }
}
