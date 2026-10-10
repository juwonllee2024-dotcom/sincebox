import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const VERSION = 1;
const DAY_MS = 24 * 60 * 60 * 1000;

export function createState() {
  return { version: VERSION, nextId: 1, items: [] };
}

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

export function normalizeState(value) {
  if (!value || typeof value !== "object" || !Array.isArray(value.items)) {
    return createState();
  }

  const items = value.items
    .filter((item) => item && typeof item === "object" && typeof item.id === "string" && typeof item.name === "string")
    .map((item) => ({
      id: item.id,
      name: item.name.trim(),
      intervalDays: Number.isInteger(item.intervalDays) && item.intervalDays > 0 ? item.intervalDays : null,
      lastDoneAt: typeof item.lastDoneAt === "string" ? item.lastDoneAt : null,
      createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date(0).toISOString()
    }))
    .filter((item) => item.name.length > 0);

  const highestId = items.reduce((highest, item) => {
    const match = /^item-(\d+)$/.exec(item.id);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 0);

  return {
    version: VERSION,
    nextId: Math.max(Number.isInteger(value.nextId) ? value.nextId : 1, highestId + 1),
    items
  };
}

export function addItem(state, { name, intervalDays = null }) {
  const cleanName = typeof name === "string" ? name.trim() : "";
  if (!cleanName) throw new Error("name is required");
  if (intervalDays !== null && (!Number.isInteger(intervalDays) || intervalDays < 1)) {
    throw new Error("intervalDays must be a positive integer or null");
  }

  const next = cloneState(normalizeState(state));
  next.items.push({
    id: `item-${next.nextId}`,
    name: cleanName,
    intervalDays,
    lastDoneAt: null,
    createdAt: new Date().toISOString()
  });
  next.nextId += 1;
  return next;
}

export function recordDone(state, id, at = new Date()) {
  const date = at instanceof Date ? at : new Date(at);
  if (Number.isNaN(date.getTime())) throw new Error("invalid completion time");

  const next = cloneState(normalizeState(state));
  const item = next.items.find((candidate) => candidate.id === id);
  if (!item) throw new Error(`unknown item: ${id}`);
  item.lastDoneAt = date.toISOString();
  return next;
}

export function daysSince(item, now = new Date()) {
  if (!item?.lastDoneAt) return null;
  const last = new Date(item.lastDoneAt);
  const current = now instanceof Date ? now : new Date(now);
  if (Number.isNaN(last.getTime()) || Number.isNaN(current.getTime())) return null;
  return Math.max(0, Math.floor((current.getTime() - last.getTime()) / DAY_MS));
}

export function serializeState(state) {
  return `${JSON.stringify(normalizeState(state), null, 2)}\n`;
}

export async function loadState(file) {
  try {
    return normalizeState(JSON.parse(await readFile(file, "utf8")));
  } catch (error) {
    if (error.code === "ENOENT" || error instanceof SyntaxError) return createState();
    throw error;
  }
}

export async function saveState(file, state) {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, serializeState(state), "utf8");
}
