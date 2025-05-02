import { geolocation } from "@/db/schemas";
import { db } from "@/drizzle";
import "dotenv/config";

async function main() {
  const result = await db.execute(`
    SELECT 
      table_schema, 
      table_name, 
      column_name, 
      data_type, 
      is_nullable
    FROM information_schema.columns
    WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    ORDER BY table_schema, table_name, ordinal_position;
  `);

  console.log(result.rows);
}

// Em CommonJS, para usar await no topo, precisa fazer isso:

main();
