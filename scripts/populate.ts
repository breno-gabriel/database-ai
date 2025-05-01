import { populateOrderPayments } from "./orderPayment/populate-order-payment";

async function main() {
  try {
    // await populateCustomers();
    // await populateGeolocation();
    // await populateOrder();
    // await populateProduct();

    // await populateSeller();
    // await populateOrderItems();

    // await populateProductCategoryNameTranslation();
    await populateOrderPayments();
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
