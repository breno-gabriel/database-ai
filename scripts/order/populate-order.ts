import { order } from "@/db/schemas";
import { db } from "@/drizzle";
import { readCsvToArray } from "../read-sheet";
import { parseCustomDate } from "../utils";

export async function populateOrder() {
  try {
    await db.delete(order);
    console.log("Reading orders sheet...");
    const result = readCsvToArray("./sheets/olist_orders_dataset.csv");

    for (const [index, item] of result.entries()) {
      await db.insert(order).values({
        id: item.order_id,
        customerId: item.customer_id,
        orderStatus: item.order_status,
        orderPurchaseTimestamp: parseCustomDate(item.order_purchase_timestamp),
        orderApprovedAt: parseCustomDate(item.order_approved_at),
        orderDeliveredCarrierDate: parseCustomDate(
          item.order_delivered_carrier_date
        ),
        orderDeliveredCustomerDate: parseCustomDate(
          item.order_delivered_customer_date
        ),

        orderEstimatedDeliveryDate: parseCustomDate(
          item.order_estimated_delivery_date
        ),
      });

      if (index % 50 === 0 || index === result.length - 1) {
        process.stdout.write(
          `\rProgress: ${((index / result.length) * 100).toFixed(2)}%`
        );
      }
    }

    console.log("Orders populated successfully.");
  } catch (error) {
    console.error("Error populating Orders:", error);
  }
}
