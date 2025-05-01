import { productCategoryNameTranslation } from "../../db/schemas/schema";
import { db } from "@/drizzle";
import { readCsvToArray } from "../read-sheet";

export async function populateProductCategoryNameTranslation() {
  try {
    const result = readCsvToArray("./sheets/product_category_name_translation.csv");

    for (const [index, item] of result.entries()) {
      await db.insert(productCategoryNameTranslation).values({
        productCategoryName: item.product_category_name, 
        productCategoryNameEnglish: item.product_category_name_english 
      });

      if (index % 50 === 0 || index === result.length - 1) {
        process.stdout.write(
          `\rProgress: ${((index / result.length) * 100).toFixed(2)}%`
        );
      }
    }

    console.log("Product_category_name populated successfully.");
  } catch (error) {
    console.log("Error populating database: ", error);
  }
}
