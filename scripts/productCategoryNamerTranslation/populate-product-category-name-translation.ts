import { productCategoryNameTranslation } from "@/db/schemas";
import { db } from "@/drizzle";
import pLimit from "p-limit";
import { readCsvToArray } from "../read-sheet";

export async function populateProductCategoryNameTranslation() {
  try {
    await db.delete(productCategoryNameTranslation);
    console.log("Reading product category name translation sheet...");
    const result = readCsvToArray(
      "./sheets/product_category_name_translation.csv"
    );

    const limit = pLimit(10); // You can adjust this concurrency value

    let completed = 0;
    const total = result.length;

    const tasks = result.map((item) =>
      limit(async () => {
        await db.insert(productCategoryNameTranslation).values({
          productCategoryName: item.product_category_name,
          productCategoryNameEnglish: item.product_category_name_english,
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
    console.log("\nProduct category name translation populated successfully.");
  } catch (error) {
    console.error("Error populating Product category name translation:", error);
  }
}
