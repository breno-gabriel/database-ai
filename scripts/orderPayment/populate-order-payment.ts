import { orderPayment } from "@/db/schemas";
import { db } from "@/drizzle";
import pLimit from "p-limit";
import { readCsvToArray } from "../read-sheet";

export async function populateOrderPayments() {
  try {
    await db.delete(orderPayment);
    console.log("Reading order payments sheet...");
    const result = readCsvToArray("./sheets/olist_order_payments_dataset.csv");

    const limit = pLimit(10); // Adjust concurrency level as needed

    let completed = 0;
    const total = result.length;

    const tasks = result.map((item) =>
      limit(async () => {
        await db.insert(orderPayment).values({
          id: item.order_id,
          orderId: item.order_id,
          paymentType: item.payment_type,
          paymentInstallments: item.payment_installments
            ? +item.payment_installments
            : null,
          paymentSequential: item.payment_sequential
            ? +item.payment_sequential
            : null,
          paymentValue: item.payment_value ? +item.payment_value : null,
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
    console.log("\nOrder payments populated successfully.");
  } catch (error) {
    console.error("Error populating Order Payments:", error);
  }
}
