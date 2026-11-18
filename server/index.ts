import { createServer } from "node:http";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

// The app is a single static page, so the server only has two jobs: serve the
// built files in production, and hand everything to Vite while developing.
const port = Number(process.env.PORT ?? 8080);
const hostname = "0.0.0.0";
const production = process.env.NODE_ENV === "production";

if (production) {
  const app = new Hono();
  app.use("/*", serveStatic({ root: "./dist" }));
  app.get("*", serveStatic({ path: "./dist/index.html" }));
  serve({ fetch: app.fetch, port, hostname }, () => {
    console.log(`Listening on http://${hostname}:${port}`);
  });
} else {
  // One process, like production: the dev server also builds on request and
  // reloads the page when a file changes.
  const { createServer: createVite } = await import("vite");
  const server = createServer();
  const vite = await createVite({
    server: { middlewareMode: true, ws: { server } },
    appType: "spa",
  });
  server.on("request", (req, res) => vite.middlewares(req, res));
  server.listen(port, hostname, () => {
    console.log(`Development server on http://${hostname}:${port}`);
  });
}
