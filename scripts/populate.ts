import { populateCustomers } from "./customers/populate-customers";
import { populateGeolocation } from "./geolocation/populate-geolocation";
import { populateOrder } from "./order/populate-order";
import { populateOrderItems } from "./orderItems/populate-order-items";
import { populateOrderPayments } from "./orderPayment/populate-order-payment";
import { populateProduct } from "./product/populate-product";
import { populateProductCategoryNameTranslation } from "./productCategoryNamerTranslation/populate-product-category-name-translation";
import { populateSeller } from "./seller/populate-seller";
import { populateOrderReview } from "./orderReview/populate-order-review";

async function main() {
  try {
    // await populateCustomers();
    // await populateProduct();
    // await populateGeolocation();
    // await populateOrder();
    // await populateSeller();
    // await populateOrderItems();
    // await populateProductCategoryNameTranslation();
    await populateOrderPayments();
    // await populateOrderReview();
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

main();
