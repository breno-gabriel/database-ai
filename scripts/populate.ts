import { populateCustomers } from "./customers/populate-customers";

async function main() {
  try {
    await populateCustomers();
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
