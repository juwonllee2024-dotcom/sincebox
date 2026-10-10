# Founder decision record — 2026-10-10

## Four independent invention questions

| Candidate | Pain | Novelty | Build today | Shareability | OSS fit | Decision |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| **Sincebox** — elapsed-time board for “when did I last…?” | 5 | 4 | 5 | 4 | 5 | **Ship** |
| WorktreeHome — seed ignored local files into a new Git worktree | 4 | 2 | 5 | 3 | 4 | Reject: the same workflow is already covered by `wt`, `wtx`, VS Code settings, and several worktree helpers. |
| Shareveil — inspect hidden file metadata before sending | 4 | 2 | 4 | 4 | 5 | Reject: ExifTool, mat2, Safe to Send, and many newer scrubbers already occupy the promise. |
| ContextCapsule — portable browser/terminal/agent session bundle | 4 | 2 | 4 | 3 | 4 | Reject: overlaps this account’s Tab2Patch, Scopepin, Evidence Lane, Reprocard, and the crowded agent-context trend. |

### Candidate 1 — Sincebox

- **Fact:** a self-hosting discussion asks for custom buttons that answer how long it has been since an event, explicitly without habit tracking, calendars, or recurring tasks.
- **Hypothesis:** a single elapsed counter plus an optional interval is more likely to become a daily utility than a full planner because it answers one concrete question with one click.
- **Different:** “last done” is the primary object; there are no streaks, task queues, or guilt mechanics.
- **7-day experiment:** give ten people the local demo and measure whether each adds three timers and records two completions.

### Why now

GitHub’s current trending page is dominated by agent infrastructure and large systems, while the local-first developer trend is also visible in current weekly trend analysis. That makes a deliberately tiny, non-AI, local utility a useful counter-hypothesis: the product must be understandable in one screenshot, not explained by an agent.

## Boundaries

- No network calls from the app.
- No credentials, automatic reminders, or background watcher.
- Original data is not deleted by the MVP.
- Existing portfolio repositories remain untouched; this is a separate public repository.
