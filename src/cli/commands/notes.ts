import {
  boolean,
  command,
  number,
  positional,
  string,
} from "@drizzle-team/brocli";
import { getGlobalOptions } from "../../main.js";
import { writeHuman, writeJson } from "../../output.js";
import { resolveClient } from "../context.js";

// ---------------------------------------------------------------------------
// notes list
// ---------------------------------------------------------------------------

const notesListCommand = command({
  name: "list",
  desc: "List meeting notes",
  options: {
    "created-before": string("created-before").desc(
      "Notes created before this date (ISO 8601)",
    ),
    "created-after": string("created-after").desc(
      "Notes created after this date (ISO 8601)",
    ),
    "updated-after": string("updated-after").desc(
      "Notes updated after this date (ISO 8601)",
    ),
    "folder-id": string("folder-id").desc(
      "Filter notes in this folder (and children)",
    ),
    cursor: string().desc("Pagination cursor"),
    "page-size": number("page-size").desc(
      "Results per page (1-30, default 10)",
    ),
  },
  handler: async (opts) => {
    const options = getGlobalOptions();
    const client = await resolveClient();
    const result = await client.listNotes({
      created_before: opts["created-before"],
      created_after: opts["created-after"],
      updated_after: opts["updated-after"],
      folder_id: opts["folder-id"],
      cursor: opts.cursor,
      page_size: opts["page-size"],
    });

    if (options.json) {
      writeJson(result, options);
      return;
    }

    for (const note of result.notes) {
      const created = note.created_at.slice(0, 10);
      const title = note.title ?? "(untitled)";
      writeHuman(`${note.id}  ${created}  ${title}`, options);
    }

    if (result.hasMore && result.cursor) {
      writeHuman(`-- has more (cursor: ${result.cursor})`, {
        quiet: options.quiet,
      });
    }
  },
});

// ---------------------------------------------------------------------------
// notes get
// ---------------------------------------------------------------------------

const notesGetCommand = command({
  name: "get",
  desc: "Get a single meeting note",
  options: {
    id: positional("id").desc("Note ID (not_...)").required(),
    transcript: boolean().desc("Include transcript in output").default(false),
  },
  handler: async (opts) => {
    const options = getGlobalOptions();
    const client = await resolveClient();
    const include = opts.transcript ? ("transcript" as const) : undefined;
    const note = await client.getNote(opts.id, { include });

    if (options.json) {
      writeJson(note, options);
      return;
    }

    writeHuman(`Title:   ${note.title ?? "(untitled)"}`, options);
    writeHuman(`ID:      ${note.id}`, options);
    writeHuman(`Created: ${note.created_at}`, options);
    writeHuman(`Updated: ${note.updated_at}`, options);
    writeHuman(`Owner:   ${note.owner.name ?? note.owner.email}`, options);
    writeHuman(`URL:     ${note.web_url}`, options);

    if (note.calendar_event) {
      writeHuman("", options);
      writeHuman("Calendar:", options);
      writeHuman(
        `  Title:  ${note.calendar_event.event_title ?? "(none)"}`,
        options,
      );
      writeHuman(
        `  Start:  ${note.calendar_event.scheduled_start_time ?? "N/A"}`,
        options,
      );
      writeHuman(
        `  End:    ${note.calendar_event.scheduled_end_time ?? "N/A"}`,
        options,
      );
    }

    if (note.attendees.length > 0) {
      writeHuman("", options);
      writeHuman("Attendees:", options);
      for (const attendee of note.attendees) {
        writeHuman(`  ${attendee.name ?? attendee.email}`, options);
      }
    }

    if (note.folder_membership.length > 0) {
      writeHuman("", options);
      writeHuman("Folders:", options);
      for (const folder of note.folder_membership) {
        writeHuman(`  ${folder.name} (${folder.id})`, options);
      }
    }

    if (note.summary_text) {
      writeHuman("", options);
      writeHuman("Summary:", options);
      for (const line of note.summary_text.split("\n")) {
        writeHuman(`  ${line}`, options);
      }
    }

    if (note.transcript && note.transcript.length > 0) {
      writeHuman("", options);
      writeHuman("Transcript:", options);
      for (const item of note.transcript) {
        const label = item.speaker.diarization_label ?? item.speaker.source;
        writeHuman(`  [${label}] ${item.text}`, options);
      }
    }
  },
});

// ---------------------------------------------------------------------------
// notes command group
// ---------------------------------------------------------------------------

export const notesCommand = command({
  name: "notes",
  desc: "List and inspect meeting notes",
  subcommands: [notesListCommand, notesGetCommand],
});
