import { Hono } from "hono";
import { handle } from "hono/vercel";

import { db } from "@/db/drizzle";
import { accounts } from "@/db/schema";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.get("/cron", async (c) => {
  try {
    await db.select({ id: accounts.id }).from(accounts).limit(1);

    console.log("Supabase database pinged successfully");
    return c.json({ message: "Pinged" });
  } catch (error) {
    console.error("Cron job failed:", error);
    return c.json({ message: "Error in cron job" }, 500);
  }
});

export const GET = handle(app);