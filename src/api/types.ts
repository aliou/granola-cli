/**
 * Type definitions for the Granola API.
 * Based on https://docs.granola.ai/api-reference
 */

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export interface User {
  name: string | null;
  email: string;
}

// ---------------------------------------------------------------------------
// Folders
// ---------------------------------------------------------------------------

export interface Folder {
  id: string;
  object: "folder";
  name: string;
  parent_folder_id: string | null;
}

export interface ListFoldersOutput {
  folders: Folder[];
  hasMore: boolean;
  cursor: string | null;
}

// ---------------------------------------------------------------------------
// Notes (summary — returned by list)
// ---------------------------------------------------------------------------

export interface NoteSummary {
  id: string;
  object: "note";
  title: string | null;
  owner: User;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// Notes (full — returned by get)
// ---------------------------------------------------------------------------

export interface Speaker {
  source: "microphone" | "speaker";
  diarization_label?: string;
}

export interface TranscriptItem {
  speaker: Speaker;
  text: string;
  start_time: string;
  end_time: string;
}

export interface CalendarInvitee {
  email: string;
}

export interface CalendarEvent {
  event_title: string | null;
  invitees: CalendarInvitee[];
  organiser: string | null;
  calendar_event_id: string | null;
  scheduled_start_time: string | null;
  scheduled_end_time: string | null;
}

export interface Note extends NoteSummary {
  web_url: string;
  calendar_event: CalendarEvent | null;
  attendees: User[];
  folder_membership: Folder[];
  summary_text: string;
  summary_markdown: string | null;
  transcript: TranscriptItem[] | null;
}

// ---------------------------------------------------------------------------
// List notes
// ---------------------------------------------------------------------------

export interface ListNotesParams {
  created_before?: string;
  created_after?: string;
  updated_after?: string;
  folder_id?: string;
  cursor?: string;
  page_size?: number;
}

export interface ListNotesOutput {
  notes: NoteSummary[];
  hasMore: boolean;
  cursor: string | null;
}

// ---------------------------------------------------------------------------
// Get note
// ---------------------------------------------------------------------------

export interface GetNoteParams {
  include?: "transcript";
}
