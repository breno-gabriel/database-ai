/* eslint-disable @typescript-eslint/no-explicit-any */
import { geolocation } from "@/db/schemas";
import { db } from "@/drizzle";
import { readCsvToArray } from "../read-sheet";

export async function populateGeolocation() {
  try {
    console.log("Reading geolocation sheet...");
    const result = readCsvToArray("./sheets/olist_geolocation_dataset.csv");

    for (const [index, item] of result.entries()) {
      const lat: any = item.geolocation_lat ? +item.geolocation_lat : null;
      const lng: any = item.geolocation_lng ? +item.geolocation_lng : null;
      await db.insert(geolocation).values({
        geolocationZipCodePrefix: item.geolocation_zip_code_prefix ?? "3123",
        geolocationLat: lat,
        geolocationLng: lng,
        geolocationCity: item.geolocation_city,
        geolocationState: item.geolocation_state,
      });

      if (index % 50 === 0 || index === result.length - 1) {
        process.stdout.write(
          `\rProgress: ${((index / result.length) * 100).toFixed(2)}%`
        );
      }
    }
    console.log("Geolocation populated successfully.");
  } catch (error) {
    console.error("Error populating Geolocation:", error);
  }
}
