import { populateOrder } from "./order/populate-order";

async function main() {
  try {
    // await populateCustomers();
    // await populateGeolocation();
    await populateOrder();
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
