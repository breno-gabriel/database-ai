import { customer } from "@/db/schemas";
import { db } from "@/drizzle";
import pLimit from "p-limit";
import { readCsvToArray } from "../read-sheet";

export async function populateCustomers() {
  try {
    console.log("Start deleting customers...");
    await db.delete(customer);
    console.log("Reading customers sheet...");
    const result = readCsvToArray("./sheets/olist_customers_dataset.csv");

    const limit = pLimit(10); // Adjust concurrency as needed

    let completed = 0;
    const total = result.length;

    const tasks = result.map((item) =>
      limit(async () => {
        await db.insert(customer).values({
          id: item.customer_id,
          customer_unique_id: item.customer_unique_id,
          customer_zip_code_prefix: item.customer_zip_code_prefix,
          customer_city: item.customer_city,
          customer_state: item.customer_state,
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

    console.log("Start populating customers...");
    await Promise.all(tasks);

    console.log("\nCustomers populated successfully.");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}
