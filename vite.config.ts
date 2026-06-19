import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { createAiFollowUp } from "./api/openAiFollowUpCore";

function readRequestBody(req: {
  on: (event: string, callback: (chunk?: { toString: () => string }) => void) => void;
}) {
  return new Promise<string>((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk?.toString() ?? "";
    });
    req.on("end", () => resolve(body));
    req.on("error", () => reject(new Error("Could not read request body")));
  });
}

function aiFollowUpDevApi(): Plugin {
  return {
    name: "guhr-ai-follow-up-dev-api",
    configureServer(server) {
      server.middlewares.use("/api/generate-follow-up", async (req, res, next) => {
        if (req.method !== "POST") {
          next();
          return;
        }

        try {
          const rawBody = await readRequestBody(req);
          const payload = JSON.parse(rawBody || "{}");
          const result = await createAiFollowUp(payload, process.env);

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result));
        } catch (error) {
          const message = error instanceof Error ? error.message : "Could not generate follow-up";

          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  Object.assign(process.env, env);

  return {
    plugins: [react(), aiFollowUpDevApi()],
  };
});
