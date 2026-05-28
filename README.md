# granola-cli

CLI for [Granola](https://granola.ai) meeting notes.

## Install

```bash
pnpm install
```

## Usage

```bash
# Authenticate
granola auth login <api-key>
granola auth status

# List notes
granola notes list
granola notes list --created-after 2026-01-01 --page-size 20

# Get a note
granola notes get not_1d3tmYTlCICgjy
granola notes get not_1d3tmYTlCICgjy --transcript transcript

# List folders
granola folders list

# JSON output
granola notes list --json
granola notes list --json --pretty

# Quiet mode (suppress human output)
granola notes list --quiet
```

## Configuration

The API key can be set via:

1. Environment variable: `GRANOLA_API_KEY`
2. Config file: `~/.config/granola-cli/config.json` (via `granola auth login`)

Environment variable takes precedence.

## Build

```bash
pnpm build          # ESM + SEA binaries
```

Produces `dist/main.mjs` (ESM) and `dist/granola` (single executable).
