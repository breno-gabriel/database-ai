import { order } from "@/db/schemas";
import { db } from "@/drizzle";
import pLimit from "p-limit";
import { readCsvToArray } from "../read-sheet";
import { parseCustomDate } from "../utils";

export async function populateOrder() {
  try {
    await db.delete(order);
    console.log("Reading orders sheet...");
    const result = readCsvToArray("./sheets/olist_orders_dataset.csv");

    const limit = pLimit(10); // Adjust concurrency level if needed

    let completed = 0;
    const total = result.length;

    const tasks = result.map((item) =>
      limit(async () => {
        await db.insert(order).values({
          id: item.order_id,
          customer_id: item.customer_id,
          order_status: item.order_status,
          order_purchase_timestamp: parseCustomDate(
            item.order_purchase_timestamp
          ),
          order_approved_at: parseCustomDate(item.order_approved_at),
          order_delivered_carrier_date: parseCustomDate(
            item.order_delivered_carrier_date
          ),
          order_delivered_customer_date: parseCustomDate(
            item.order_delivered_customer_date
          ),
          order_estimated_delivery_date: parseCustomDate(
            item.order_estimated_delivery_date
          ),
        });

        // Update progress
        completed++;
        if (completed % 50 === 0 || completed === total) {
          process.stdout.write(
            `\rProgress: ${((completed / total) * 100).toFixed(2)}%`
          );
        }
      })
    );

    await Promise.all(tasks);

    console.log("\nOrders populated successfully.");
  } catch (error) {
    console.error("Error populating Orders:", error);
  }
}
