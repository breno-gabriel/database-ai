import { populateProduct } from "./product/populate-product";
import { populateGeolocation } from "./geolocation/populate-geolocation";
import { populateProductCategoryNameTranslation } from "./categoryName/populate-category-name";
import { populateOrderReview } from "./orderReview/populate-order-review";
import { populateOrder } from "./order/populate-order";

async function main() {
  try {
    // await populateCustomers();
    // await populateProduct(); 
    // await populateGeolocation();
    await populateOrder();
    // await populateSeller();
    await populateOrderReview()
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

main();
