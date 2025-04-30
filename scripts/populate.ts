import { populateCustomers } from "./customers/populate-customers";
import { populateOrder } from "./order/populate-order";
import { populateProduct } from "./product/populate-product";

async function main() {
  try {
    // await populateCustomers();
    // await populateGeolocation();
    // await populateOrder();
    await populateProduct(); 
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
