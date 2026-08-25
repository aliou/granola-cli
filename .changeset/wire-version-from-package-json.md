---
"granola-cli": patch
---

Derive the CLI `--version` from `package.json` instead of a hardcoded
constant. `src/constants.ts` imported a stale `VERSION = "0.1.0"` that was
never bumped through the 0.2.x releases, so `granola --version` reported
`0.1.0` even on installed 0.2.3 builds. Import `package.json` as the single
source of truth so the reported version tracks releases automatically.
