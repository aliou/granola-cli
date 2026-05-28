#!/usr/bin/env node

import { boolean, run } from "@drizzle-team/brocli";
import { commands } from "./cli/commands/index.js";
import { APP_NAME, VERSION } from "./constants.js";
import { handleCliError, setGlobalOptionsGetter } from "./errors.js";

// ---------------------------------------------------------------------------
// Global options
// ---------------------------------------------------------------------------

export type GlobalOptions = {
  json: boolean;
  pretty: boolean;
  quiet: boolean;
  verbose: boolean;
};

export const globalOptions = {
  json: boolean().desc("Emit machine-readable JSON").default(false),
  pretty: boolean()
    .desc("Pretty-print JSON when used with --json")
    .default(false),
  quiet: boolean().desc("Suppress non-error human output").default(false),
  verbose: boolean().desc("Emit diagnostic output to stderr").default(false),
};

let activeGlobals: GlobalOptions = {
  json: false,
  pretty: false,
  quiet: false,
  verbose: false,
};

export function getGlobalOptions(): GlobalOptions {
  return activeGlobals;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  setGlobalOptionsGetter(() => activeGlobals);

  await run(commands, {
    name: APP_NAME,
    description: "CLI for Granola meeting notes",
    version: VERSION,
    globals: globalOptions,
    omitKeysOfUndefinedOptions: true,
    hook: (event, _command, globals) => {
      if (event === "before") {
        activeGlobals = globals as GlobalOptions;
      }
    },
    theme: (event) => {
      if (event.type === "error" && event.violation === "unknown_error") {
        handleCliError(event.error, activeGlobals);
      }
      return false;
    },
  });
}

main().catch((error: unknown) => {
  handleCliError(error, activeGlobals);
});
