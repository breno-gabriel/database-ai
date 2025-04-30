import { customer } from "@/db/schemas";
import { db } from "@/drizzle";
import pLimit from "p-limit";
import { readCsvToArray } from "../read-sheet";

export async function populateCustomers() {
  try {
    const result = readCsvToArray("./sheets/olist_customers_dataset.csv");

    const limit = pLimit(10); // Adjust concurrency as needed

    let completed = 0;
    const total = result.length;

    const tasks = result.map((item) =>
      limit(async () => {
        await db.insert(customer).values({
          id: item.customer_id,
          customerUniqueId: item.customer_unique_id,
          customerZipCodePrefix: item.customer_zip_code_prefix,
          customerCity: item.customer_city,
          customerState: item.customer_state,
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

    console.log("\nCustomers populated successfully.");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}
