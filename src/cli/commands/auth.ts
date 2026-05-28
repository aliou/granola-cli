import { command, positional } from "@drizzle-team/brocli";
import { GranolaApiError } from "../../api/client.js";
import { loadConfig, saveConfig } from "../../config.js";
import { getGlobalOptions } from "../../main.js";
import { writeHuman, writeJson } from "../../output.js";

// ---------------------------------------------------------------------------
// auth login
// ---------------------------------------------------------------------------

const authLoginCommand = command({
  name: "login",
  desc: "Save a Granola API key",
  options: {
    "api-key": positional("api-key")
      .desc("API key (starts with grn_)")
      .required(),
  },
  handler: async (opts) => {
    const options = getGlobalOptions();
    const apiKey = opts["api-key"];

    // Validate the key by making a lightweight request
    const { GranolaClient } = await import("../../api/client.js");
    const client = new GranolaClient(apiKey);

    try {
      await client.listNotes({ page_size: 1 });
    } catch (error) {
      if (error instanceof GranolaApiError && error.status === 401) {
        process.stderr.write("Invalid API key\n");
        process.exit(1);
      }
      // Non-auth errors are fine — the key works, just no notes
    }

    await saveConfig({ apiKey });

    if (options.json) {
      writeJson({ ok: true }, options);
      return;
    }

    writeHuman("API key saved.", options);
  },
});

// ---------------------------------------------------------------------------
// auth logout
// ---------------------------------------------------------------------------

const authLogoutCommand = command({
  name: "logout",
  desc: "Remove the saved API key",
  handler: async () => {
    const options = getGlobalOptions();
    await saveConfig({ apiKey: undefined });

    if (options.json) {
      writeJson({ ok: true }, options);
      return;
    }

    writeHuman("API key removed.", options);
  },
});

// ---------------------------------------------------------------------------
// auth status
// ---------------------------------------------------------------------------

const authStatusCommand = command({
  name: "status",
  desc: "Show authentication status",
  handler: async () => {
    const options = getGlobalOptions();
    const envKey = process.env.GRANOLA_API_KEY;
    const config = await loadConfig();
    const source = envKey ? "env" : config.apiKey ? "config" : null;
    const hasKey = Boolean(envKey || config.apiKey);

    if (options.json) {
      writeJson(
        {
          authenticated: hasKey,
          source,
        },
        options,
      );
      return;
    }

    if (hasKey) {
      writeHuman(`Authenticated (via ${source})`, options);
    } else {
      writeHuman(
        "Not authenticated. Set GRANOLA_API_KEY or run: granola auth login",
        options,
      );
    }
  },
});

// ---------------------------------------------------------------------------
// auth command group
// ---------------------------------------------------------------------------

export const authCommand = command({
  name: "auth",
  desc: "Manage API key authentication",
  subcommands: [authLoginCommand, authLogoutCommand, authStatusCommand],
});
