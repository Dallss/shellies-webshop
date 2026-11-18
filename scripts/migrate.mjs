// Applies db/schema.sql (idempotent) using the direct Postgres connection.
// Runs automatically in the Vercel build (see "build" in package.json). Locally it's skipped
// unless you pass --force, e.g. `npm run db:migrate -- --force`.
import { readFileSync } from "node:fs";
import postgres from "postgres";

const force = process.argv.includes("--force");
if (!process.env.VERCEL && !force) {
  console.log("db:migrate: not on Vercel, skipping (use --force to run locally).");
  process.exit(0);
}

const raw = process.env.POSTGRES_URL_NON_POOLING;
if (!raw) {
  console.error("db:migrate: POSTGRES_URL_NON_POOLING is not set.");
  process.exit(1);
}
const url = new URL(raw);
url.search = "";

const sql = postgres(url.toString(), { ssl: "require", max: 1, connect_timeout: 20, onnotice: () => {} });
try {
  await sql.unsafe(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
  const [c] = await sql`select (select count(*) from products)::int as products, (select count(*) from posts)::int as posts, (select count(*) from orders)::int as orders`;
  console.log(`db:migrate: schema applied. products=${c.products} posts=${c.posts} orders=${c.orders}`);
} finally {
  await sql.end({ timeout: 5 });
}
