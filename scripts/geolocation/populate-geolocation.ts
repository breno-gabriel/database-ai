/* eslint-disable @typescript-eslint/no-explicit-any */
import { geolocation } from "@/db/schemas";
import { db } from "@/drizzle";
import pLimit from "p-limit";
import { readCsvToArray } from "../read-sheet";

export async function populateGeolocation() {
  try {
    await db.delete(geolocation);
    console.log("Reading geolocation sheet...");
    const result = readCsvToArray("./sheets/olist_geolocation_dataset.csv");

    const limit = pLimit(10); // You can adjust this concurrency value

    let completed = 0;
    const total = result.length;

    const tasks = result.map((item) =>
      limit(async () => {
        const lat: any = item.geolocation_lat ? +item.geolocation_lat : null;
        const lng: any = item.geolocation_lng ? +item.geolocation_lng : null;

        await db.insert(geolocation).values({
          geolocationZipCodePrefix: item.geolocation_zip_code_prefix,
          geolocationLat: lat,
          geolocationLng: lng,
          geolocationCity: item.geolocation_city,
          geolocationState: item.geolocation_state,
        });

        // Update progress
        completed++;
        if (completed % 50 === 0 || completed === total) {
          process.stdout.write(
            `\rProgress: ${((completed / total) * 100).toFixed(2)}%`
          );
        }
      })
    );

    await Promise.all(tasks);
    console.log("\nGeolocation populated successfully.");
  } catch (error) {
    console.error("Error populating Geolocation:", error);
  }
}
