import { populateOrderPayments } from "./orderPayment/populate-order-payment";

async function main() {
  try {
    // await populateCustomers();
    // await populateProduct(); 
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

main();
