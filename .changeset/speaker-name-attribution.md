---
"granola-cli": patch
---

Fix speaker attribution in transcript output. The Granola API returns a
resolved `speaker.name` (participant display name) on transcript items when a
speaker could be identified, but the CLI's `Speaker` type and transcript
renderer ignored it and fell back to `diarization_label` then the raw audio
`source` (`microphone`/`speaker`). This dropped real speaker attribution:
named participants were shown as `[microphone]`/`[speaker]` instead of their
names. Add `name` to the `Speaker` type and prefer it in the human-readable
transcript label, falling back to `diarization_label` then `source`.
