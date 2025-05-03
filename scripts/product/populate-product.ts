import { product } from "@/db/schemas";
import { db } from "@/drizzle";
import pLimit from "p-limit";
import { readCsvToArray } from "../read-sheet";

export async function populateProduct() {
  try {
    // Clear the product table
    await db.delete(product);
    console.log("Product table cleared.");

    // Read the CSV file into an array
    console.log("Reading product sheet...");
    const result = readCsvToArray("./sheets/olist_products_dataset.csv");

    const limit = pLimit(10); // Limit concurrency to 10
    let completed = 0;
    const total = result.length;

    // Map tasks with concurrency limit
    const tasks = result.map((item) =>
      limit(async () => {
        try {
          await db.insert(product).values({
            id: item.product_id,
            product_category_name: item.product_category_name,
            product_name_length: item.product_name_length
              ? +item.product_name_length
              : null,
            product_description_length: item.product_description_length
              ? +item.product_description_length
              : null,
            product_photos_qty: item.product_photos_qty
              ? +item.product_photos_qty
              : null,
            product_weight_g: item.product_weight_g
              ? +item.product_weight_g
              : null,
            product_length_cm: item.product_length_cm
              ? +item.product_length_cm
              : null,
            product_height_cm: item.product_height_cm
              ? +item.product_height_cm
              : null,
            product_width_cm: item.product_width_cm
              ? +item.product_width_cm
              : null,
          });

          completed++;
          if (completed % 50 === 0 || completed === total) {
            process.stdout.write(
              `\rProgress: ${((completed / total) * 100).toFixed(2)}%`
            );
          }
        } catch (err) {
          console.error(`Error inserting product with ID ${item.id}:`, err);
        }
      })
    );

    // Wait for all tasks to complete
    await Promise.all(tasks);

    console.log("\nProduct population completed successfully.");
  } catch (error) {
    console.error("Error populating products:", error);
  }
}
