# granola-cli

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
