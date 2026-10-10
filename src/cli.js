#!/usr/bin/env node
import { homedir } from "node:os";
import { join } from "node:path";
import { loadState, addItem, daysSince, recordDone, saveState } from "./store.js";
import { startServer } from "./server.js";

const args = process.argv.slice(2);
const command = args[0] ?? "help";
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const dataFile = valueAfter("--data") ?? join(process.env.SINCEBOX_HOME ?? join(homedir(), ".sincebox"), "state.json");

function usage() {
  console.log(`Sincebox — answer “when did I last do this?” without streaks or accounts.

Commands:
  sincebox serve [--port 23456] [--data path]
  sincebox add "Wash towels" [--every 7] [--data path]
  sincebox done item-1 [--data path]
  sincebox list [--data path]`);
}

if (command === "help" || command === "--help") {
  usage();
} else if (command === "serve") {
  const { port } = await startServer({ dataFile, port: Number(valueAfter("--port") ?? 23456) });
  console.log(`Sincebox is local: http://127.0.0.1:${port}`);
  console.log(`Data file: ${dataFile}`);
} else if (command === "add") {
  const name = args[1];
  const intervalValue = valueAfter("--every");
  const state = await loadState(dataFile);
  const next = addItem(state, { name, intervalDays: intervalValue === undefined ? null : Number(intervalValue) });
  await saveState(dataFile, next);
  console.log(`Added ${next.items.at(-1).id}: ${next.items.at(-1).name}`);
} else if (command === "done") {
  const state = await loadState(dataFile);
  const next = recordDone(state, args[1]);
  await saveState(dataFile, next);
  console.log(`Done: ${next.items.find((item) => item.id === args[1]).name}`);
} else if (command === "list") {
  const state = await loadState(dataFile);
  if (state.items.length === 0) console.log("No timers yet. Add one with: sincebox add \"Wash towels\"");
  for (const item of state.items) {
    const elapsed = daysSince(item);
    const age = elapsed === null ? "never" : `${elapsed} day${elapsed === 1 ? "" : "s"} ago`;
    const due = item.intervalDays && elapsed !== null && elapsed >= item.intervalDays ? " · due" : "";
    console.log(`${item.id}\t${item.name}\t${age}${due}`);
  }
} else {
  console.error(`Unknown command: ${command}`);
  usage();
  process.exitCode = 1;
}
