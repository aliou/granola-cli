import type { Command } from "@drizzle-team/brocli";
import { authCommand } from "./auth.js";
import { foldersCommand } from "./folders.js";
import { notesCommand } from "./notes.js";

export const commands: Command[] = [authCommand, notesCommand, foldersCommand];
