---
name: granola-cli
description: "Use the granola-cli to access Granola meeting notes, transcripts, summaries, and folders from the terminal. Use when performing any Granola task via CLI: listing notes, reading a note with its transcript, browsing folders, or authenticating."
---

# granola-cli

A CLI for [Granola](https://granola.ai) meeting notes. Built on the Granola REST API.

## Setup

```sh
granola auth login <api-key>
```

Get an API key from the Granola desktop app: Settings > Connectors > API keys.

Key resolution order: `GRANOLA_API_KEY` env var, then `~/.config/granola-cli/config.json`.

## Commands

```
granola <command> [subcommand] [flags]
```

All commands support `--json`, `--pretty`, and `--quiet` flags.

| Command   | Subcommands            | Description                        |
|-----------|------------------------|------------------------------------|
| `auth`    | `login`, `logout`, `status` | API key management           |
| `notes`   | `list`, `get`          | List and inspect meeting notes     |
| `folders` | `list`                 | List and inspect folders           |

## Common workflows

```sh
# Check authentication
granola auth status

# List recent notes
granola notes list
granola notes list --created-after 2026-01-01 --page-size 20

# Get a note with transcript
granola notes get not_1d3tmYTlCICgjy --transcript

# List folders
granola folders list

# JSON output
granola notes list --json --pretty
```

## API notes

- Only notes that have a generated AI summary and transcript appear in responses
- Rate limit: 5 requests/second sustained, 25 burst
- API keys can have "Personal notes" and/or "Public notes" access scopes
