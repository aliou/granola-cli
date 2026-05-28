import { getApiKey } from "../config.js";
import { GranolaCliError } from "../errors.js";
import { getGlobalOptions } from "../main.js";

export async function resolveClient() {
  const apiKey = await getApiKey();

  if (!apiKey) {
    throw new GranolaCliError(
      "NO_API_KEY",
      "No API key configured. Set GRANOLA_API_KEY or run: granola auth login",
    );
  }

  const { GranolaClient } = await import("../api/client.js");
  return new GranolaClient(apiKey);
}

export function requireGlobalOptions() {
  return getGlobalOptions();
}
