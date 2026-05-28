import { GRANOLA_API_BASE } from "../constants.js";
import type {
  GetNoteParams,
  ListFoldersOutput,
  ListNotesOutput,
  ListNotesParams,
  Note,
} from "./types.js";

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class GranolaApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "GranolaApiError";
  }
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class GranolaClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl = GRANOLA_API_BASE) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  // -------------------------------------------------------------------------
  // Notes
  // -------------------------------------------------------------------------

  async listNotes(params: ListNotesParams = {}): Promise<ListNotesOutput> {
    const url = buildUrl(`${this.baseUrl}/notes`, { ...params });
    const response = await this.fetch(url);

    return (await response.json()) as ListNotesOutput;
  }

  async getNote(noteId: string, params: GetNoteParams = {}): Promise<Note> {
    const url = buildUrl(`${this.baseUrl}/notes/${noteId}`, { ...params });
    const response = await this.fetch(url);

    if (response.status === 404) {
      throw new GranolaApiError(
        `Note not found: ${noteId}`,
        404,
        "NOTE_NOT_FOUND",
      );
    }

    return (await response.json()) as Note;
  }

  // -------------------------------------------------------------------------
  // Folders
  // -------------------------------------------------------------------------

  async listFolders(
    params: { cursor?: string; page_size?: number } = {},
  ): Promise<ListFoldersOutput> {
    const url = buildUrl(`${this.baseUrl}/folders`, { ...params });
    const response = await this.fetch(url);

    return (await response.json()) as ListFoldersOutput;
  }

  // -------------------------------------------------------------------------
  // Internals
  // -------------------------------------------------------------------------

  private async fetch(url: string | URL): Promise<Response> {
    const response = await globalThis.fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: "application/json",
      },
    });

    if (response.status === 401) {
      throw new GranolaApiError(
        "Unauthorized — check your API key",
        401,
        "UNAUTHORIZED",
      );
    }

    if (response.status === 429) {
      throw new GranolaApiError(
        "Rate limited — try again in a few seconds",
        429,
        "RATE_LIMITED",
      );
    }

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new GranolaApiError(
        body || `HTTP ${response.status}`,
        response.status,
      );
    }

    return response;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildUrl(base: string, params: Record<string, unknown>): URL {
  const url = new URL(base);
  const entries = Object.entries(params) as Array<[string, unknown]>;
  for (const [key, value] of entries) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}
