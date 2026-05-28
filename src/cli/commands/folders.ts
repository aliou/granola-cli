import { command, number, string } from "@drizzle-team/brocli";
import { getGlobalOptions } from "../../main.js";
import { writeHuman, writeJson } from "../../output.js";
import { resolveClient } from "../context.js";

// ---------------------------------------------------------------------------
// folders list
// ---------------------------------------------------------------------------

const foldersListCommand = command({
  name: "list",
  desc: "List folders",
  options: {
    cursor: string().desc("Pagination cursor"),
    "page-size": number("page-size").desc(
      "Results per page (1-30, default 10)",
    ),
  },
  handler: async (opts) => {
    const options = getGlobalOptions();
    const client = await resolveClient();
    const result = await client.listFolders({
      cursor: opts.cursor,
      page_size: opts["page-size"],
    });

    if (options.json) {
      writeJson(result, options);
      return;
    }

    for (const folder of result.folders) {
      const parent = folder.parent_folder_id
        ? ` (parent: ${folder.parent_folder_id})`
        : "";
      writeHuman(`${folder.id}  ${folder.name}${parent}`, options);
    }

    if (result.hasMore && result.cursor) {
      writeHuman(`-- has more (cursor: ${result.cursor})`, {
        quiet: options.quiet,
      });
    }
  },
});

// ---------------------------------------------------------------------------
// folders command group
// ---------------------------------------------------------------------------

export const foldersCommand = command({
  name: "folders",
  desc: "List and inspect folders",
  subcommands: [foldersListCommand],
});
