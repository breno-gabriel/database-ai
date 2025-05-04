import { seller } from "@/db/schemas";
import { db } from "@/drizzle";
import pLimit from "p-limit";
import { readCsvToArray } from "../read-sheet";

export async function populateSeller() {
  try {
    await db.delete(seller);
    console.log("Reading seller sheet...");
    const result = readCsvToArray("./sheets/olist_sellers_dataset.csv");

    const limit = pLimit(10); // You can adjust this concurrency value

    let completed = 0;
    const total = result.length;

    const tasks = result.map((item) =>
      limit(async () => {
        await db.insert(seller).values({
          id: item.seller_id,
          seller_zip_code_prefix: item.seller_zipcode_prefix,
          seller_city: item.seller_city,
          seller_state: item.seller_state,
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
    console.log("\nSeller populated successfully.");
  } catch (error) {
    console.error("Error populating Seller:", error);
  }
}
