import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { seedSchemes, seedDemoData } from "./seed";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!_db) {
    const pool = new pg.Pool({
      connectionString: databaseUrl,
      // For serverless/lambda environments, we can configure pool settings
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    _db = drizzle(pool, { schema });

    // Seed schemes and demo data asynchronously
    seedSchemes(_db).catch((err) => {
      console.error("[db] Error seeding schemes:", err);
    });
    seedDemoData(_db).catch((err) => {
      console.error("[db] Error seeding demo data:", err);
    });
  }
  return _db;
}

export type AppDb = ReturnType<typeof getDb>;
export { schema };
