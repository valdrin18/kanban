import { createAiFollowUp } from "./openAiFollowUpCore";

export const config = {
  runtime: "edge",
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

export default async function handler(request: Request) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const payload = await request.json();
    const result = await createAiFollowUp(payload, {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      OPENAI_MODEL: process.env.OPENAI_MODEL,
    });

    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate follow-up";
    return jsonResponse({ error: message }, { status: 500 });
  }
}
