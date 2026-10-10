# Security policy

## Scope

Sincebox is a local HTTP server and a JSON file. The MVP intentionally binds to loopback (`127.0.0.1`) and does not accept credentials or send telemetry.

## Safe use

- Do not expose the server port to a public interface or reverse proxy without adding authentication.
- Treat the data file as private local data.
- Do not place secrets in timer names; exported JSON contains names and timestamps.
- Review any future import or plugin feature before using it with sensitive data.

## Reporting

Please do not publish a vulnerability in a public issue. Use GitHub's private vulnerability reporting for this repository when available, or contact the maintainer through the profile linked in the repository. Include the affected version, operating system, reproduction steps, and impact. Do not include real secrets or private files.
