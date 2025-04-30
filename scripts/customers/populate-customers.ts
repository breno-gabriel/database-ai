import { customer } from "@/db/schemas";
import { db } from "@/drizzle";
import { readCsvToArray } from "../read-sheet";

export async function populateCustomers() {
  try {
    const result = readCsvToArray("./sheets/olist_customers_dataset.csv");

    for (const [index, item] of result.entries()) {
      await db.insert(customer).values({
        id: item.customer_id,
        customerUniqueId: item.customer_unique_id,
        customerZipCodePrefix: item.customer_zip_code_prefix,
        customerCity: item.customer_city,
        customerState: item.customer_state,
      });

      if (index % 50 === 0 || index === result.length - 1) {
        process.stdout.write(
          `\rProgress: ${((index / result.length) * 100).toFixed(2)}%`
        );
      }
    }

    console.log("Customers populated successfully.");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}
