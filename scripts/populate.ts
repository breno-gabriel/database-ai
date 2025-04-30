import { populateGeolocation } from "./geolocation/populate-geolocation";

async function main() {
  try {
    // await populateCustomers();
    await populateGeolocation();
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
