# Sincebox ⏳

### When did I last do this?

Sincebox is a tiny, local-first timer for the jobs that do not belong in a calendar.

**Wash towels. Replace the water filter. Clean the desk fan. Back up the laptop.**

You press **I did it** once. Sincebox tells you how long it has been. No streaks, no guilt, no account, no cloud.

> **A calm answer to “when was the last time?” — in one local page.**

## Why this exists

People repeatedly ask for a tool that answers “how long since I last did this?” without turning household maintenance into a habit tracker or a project-management system. A [high-engagement self-hosting discussion](https://www.reddit.com/r/selfhosted/comments/1tukylp/selfhosted_app_for_tracking_last_time_i_did_x/) describes that exact gap: simple custom buttons, elapsed counters, and a mobile-friendly screen — explicitly not calendars or streaks.

Sincebox is the smallest useful version of that idea:

- 🏠 **Local by default** — state is one JSON file on your machine.
- 🧠 **Memory, not management** — it records the last occurrence; it does not judge you.
- ⚡ **Visible payoff** — every button press turns into a concrete “2 days ago” answer.
- 🔒 **No silent work** — no network calls, accounts, analytics, or background watcher.
- 📦 **Portable** — Node.js 18+, zero runtime dependencies, CLI plus browser UI.

## Quick start

```bash
npm start
```

Open <http://127.0.0.1:23456>.

Add a thing, optionally give it an interval, then press **I did it** when it happens. The orange `due` state is only a visual aid — nothing runs automatically.

## CLI

```bash
# Start the local web board
sincebox serve --port 23456

# Or use the data file directly
sincebox add "Wash towels" --every 7
sincebox add "Clean desk fan"
sincebox done item-1
sincebox list
```

Choose another data location without changing the app:

```bash
sincebox list --data ./examples/demo-state.json
```

The default file is `%USERPROFILE%/.sincebox/state.json` on Windows and `~/.sincebox/state.json` elsewhere. Use `SINCEBOX_HOME` to choose another directory.

## What it is not

Sincebox is intentionally not a habit tracker, calendar, todo list, reminder service, social app, or AI wrapper. It does not send notifications or make claims about what you “should” do. If you need recurring alarms, use a calendar; if you need streaks, use a habit app.

## Data and safety

- The server binds to `127.0.0.1` only.
- Files are written only when you add a timer or mark one done.
- The original JSON is never overwritten by a destructive cleanup action; there is no delete command in the MVP.
- `Export your data` downloads the current state as plain JSON.
- The API rejects invalid names and intervals before writing.

This is local software, not a guarantee that every machine or filesystem is safe. See [SECURITY.md](SECURITY.md).

## Development

```bash
npm test
npm run lint
npm run build
npm audit --omit=dev
```

There are no runtime dependencies. Tests use Node's built-in test runner and include a live loopback HTTP integration test.

## Product hypothesis

The first users are people who maintain a home, studio, lab, or small self-hosted setup and keep asking “when did I last…?” The 7-day experiment is simple: share the local demo with ten such people and measure whether they add three timers and return to press **I did it** twice. The current code proves the workflow, not retention or demand.

Possible future funding is optional hosted sync or team/shared boards; the local app remains free and useful without it. No revenue or star count is promised.

## License

MIT. See [LICENSE](LICENSE).
