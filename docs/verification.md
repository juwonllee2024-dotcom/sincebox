# Verification record — 2026-10-10

Environment: Windows PowerShell, Node.js `v26.5.0`, package has zero runtime dependencies.

## Test-first evidence

1. **RED:** `npm test` failed because the intentionally referenced `src/store.js` and `src/server.js` did not exist.
2. **GREEN:** after the minimum implementation, `npm test` passed: **5 tests, 5 pass, 0 fail**.

## Fresh checks

- `npm test` — pass, 5/5.
- `npm run lint` — pass (`node --check` for runtime and browser modules).
- `npm run build` — pass; all runtime and browser assets found.
- `npm audit --omit=dev` — pass: 0 dependencies and 0 vulnerabilities.
- CLI smoke: add → list → done → list using a temporary JSON data file.
- HTTP smoke: loopback `POST /api/items` → `POST /api/items/:id/done` → `GET /api/items`.
- `git diff --check` — required before commit.

## Recorded smoke output

```text
Added item-1: Wash towels
item-1  Wash towels  never
Done: Wash towels
item-1  Wash towels  0 days ago
```

```json
{"createStatus":201,"doneStatus":200,"listStatus":200,"items":1}
```

## Known limits

The MVP records explicit user actions. It does not prove retention, reminder effectiveness, or demand beyond the cited discussion; those are the next experiment.
