# Contributing to Sincebox

Thanks for helping keep this small and calm.

## Before opening a change

1. Search existing issues first.
2. Keep the local-first, no-account boundary intact.
3. Prefer one narrow user-visible improvement over a framework or service dependency.
4. Do not add telemetry, automatic network calls, silent notifications, or destructive file operations.

## Development loop

```bash
npm test
npm run lint
npm run build
npm audit --omit=dev
```

Add a failing test before production code for behavior changes. Keep public APIs documented in the README and update `CHANGELOG.md`.

## Pull requests

Describe the user problem, the smallest behavior change, how it was tested, and any privacy or data-storage effect. Small screenshots or terminal output are welcome.
