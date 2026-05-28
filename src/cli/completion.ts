import t from "@bomb.sh/tab";

/**
 * Register the granola command tree with @bomb.sh/tab for shell completion.
 *
 * When the CLI is invoked as `granola complete <shell>` or `granola complete -- <args>`,
 * this definition drives completion output.
 */

// ── Global options (applied to every leaf command) ─────────────────────

function addGlobalOptions(cmd: ReturnType<typeof t.command>): void {
  cmd.option("json", "Emit machine-readable JSON");
  cmd.option("pretty", "Pretty-print JSON with --json");
  cmd.option("quiet", "Suppress non-error output");
  cmd.option("verbose", "Emit diagnostic output to stderr");
}

// ── auth ───────────────────────────────────────────────────────────────

t.command("auth", "Manage API key authentication");

const authLogin = t.command("auth login", "Save a Granola API key");
authLogin.argument("api-key");
addGlobalOptions(authLogin);

const authLogout = t.command("auth logout", "Remove the saved API key");
addGlobalOptions(authLogout);

const authStatus = t.command("auth status", "Show authentication status");
addGlobalOptions(authStatus);

// ── notes ──────────────────────────────────────────────────────────────

t.command("notes", "List and inspect meeting notes");

const notesList = t.command("notes list", "List meeting notes");
notesList.option("created-before", "Notes created before this date (ISO 8601)");
notesList.option("created-after", "Notes created after this date (ISO 8601)");
notesList.option("updated-after", "Notes updated after this date (ISO 8601)");
notesList.option("folder-id", "Filter notes in this folder (and children)");
notesList.option("cursor", "Pagination cursor");
notesList.option("page-size", "Results per page (1-30, default 10)");
addGlobalOptions(notesList);

const notesGet = t.command("notes get", "Get a single meeting note");
notesGet.argument("id");
notesGet.option("transcript", "Include transcript in output");
addGlobalOptions(notesGet);

// ── folders ─────────────────────────────────────────────────────────────

t.command("folders", "List and inspect folders");

const foldersList = t.command("folders list", "List folders");
foldersList.option("cursor", "Pagination cursor");
foldersList.option("page-size", "Results per page (1-30, default 10)");
addGlobalOptions(foldersList);

// ── handler ────────────────────────────────────────────────────────────

export function handleCompletion(argv: string[]): boolean {
  if (argv[2] !== "complete") {
    return false;
  }

  const shell = argv[3];
  if (shell === "--") {
    t.parse(argv.slice(4));
    return true;
  }

  t.setup("granola", "granola", shell);
  return true;
}
