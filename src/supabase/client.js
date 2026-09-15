import { SUPABASE_KEY, SUPABASE_URL } from "./config.js";

export async function rpc(functionName, payload = {}) {
  let response;
  try {
    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    throw new Error(`Unable to connect to the game server. Check internet connection or Supabase configuration. Detail: ${error.message}`);
  }

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = body && (body.message || body.error_description || body.details) ? (body.message || body.error_description || body.details) : text;
    throw new Error(message || `Supabase RPC failed: ${response.status}`);
  }

  return body;
}
