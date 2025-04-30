import { populateCustomers } from "./customers/populate-customers";
import { populateGeolocation } from "./geolocation/populate-geolocation";
import { populateOrder } from "./order/populate-order";
import { populateProductCategoryNameTranslation } from "./productCategoryNamerTranslation/populate-product-category-name-translation";
import { populateSeller } from "./seller/populate-seller";

async function main() {
  try {
    await populateCustomers();
    await populateGeolocation();
    await populateOrder();
    await populateOrder();
    await populateSeller();
    await populateProductCategoryNameTranslation();
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
