import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { surahRoutes } from "./routes/surahs";
import { searchRoutes } from "./routes/search";
import { serve } from "@hono/node-server";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", prettyJSON());
app.use(
  "*",
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    allowMethods: ["GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Health check
app.get("/", (c) => c.json({ status: "ok", message: "Quran API is running" }));
app.get("/health", (c) => c.json({ status: "healthy", timestamp: new Date().toISOString() }));

// Routes
app.route("/api/surahs", surahRoutes);
app.route("/api/search", searchRoutes);

// 404
app.notFound((c) => c.json({ error: "Route not found" }, 404));

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

const port = parseInt(process.env.PORT || "3001");
console.log(`🕌 Quran API running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
