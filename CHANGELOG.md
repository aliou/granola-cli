# granola-cli

## 0.2.3

### Patch Changes

- 0deb881: Fix speaker attribution in transcript output. The Granola API returns a
  resolved `speaker.name` (participant display name) on transcript items when a
  speaker could be identified, but the CLI's `Speaker` type and transcript
  renderer ignored it and fell back to `diarization_label` then the raw audio
  `source` (`microphone`/`speaker`). This dropped real speaker attribution:
  named participants were shown as `[microphone]`/`[speaker]` instead of their
  names. Add `name` to the `Speaker` type and prefer it in the human-readable
  transcript label, falling back to `diarization_label` then `source`.

## 0.2.2

### Patch Changes

- 95158b1: Add pre-validation for API arguments and limits, and remove cursor value from human-readable pagination output.

## 0.2.1

### Patch Changes

- 1c294cb: Add x86_64 Linux release binaries and expose the CLI through the flake packages.

## 0.2.0

### Minor Changes

- d2d8d19: Add shell tab completion via `@bomb.sh/tab`. Supports bash, zsh, and fish.

  ```sh
  # zsh
  eval "$(granola complete zsh)"

  # bash
  source <(granola complete bash)

  # fish
  granola complete fish | source
  ```

## 0.1.0

### Minor Changes

- 7efd8fa: Initial release of granola-cli — a CLI for Granola meeting notes.

  - `auth login/logout/status` — API key management
  - `notes list` — list meeting notes with date/folder filtering and cursor pagination
  - `notes get` — retrieve a single note with summary, transcript, attendees, and calendar event
  - `folders list` — list folders with cursor pagination
  - `--json`/`--pretty`/`--quiet` global flags
  - Config via `~/.config/granola-cli/config.json` or `GRANOLA_API_KEY` env var
  - Node SEA binary builds (darwin-arm64, linux-arm64)
