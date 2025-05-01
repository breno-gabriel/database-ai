import { populateCustomers } from "./customers/populate-customers";
import { populateGeolocation } from "./geolocation/populate-geolocation";
import { populateOrder } from "./order/populate-order";
import { populateOrderItems } from "./orderItems/populate-order-items";
import { populateOrderPayments } from "./orderPayment/populate-order-payment";
import { populateProduct } from "./product/populate-product";
import { populateProductCategoryNameTranslation } from "./productCategoryNamerTranslation/populate-product-category-name-translation";
import { populateSeller } from "./seller/populate-seller";

async function main() {
  try {
    await populateCustomers();
    await populateGeolocation();
    await populateOrder();
    await populateProduct();

    await populateSeller();
    await populateOrderItems();

    await populateProductCategoryNameTranslation();
    await populateOrderPayments();
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
