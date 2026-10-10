import test from "node:test";
import assert from "node:assert/strict";
import { addItem, createState, daysSince, recordDone, serializeState } from "../src/store.js";

test("adding an item starts an honest never-done timer", () => {
  const state = addItem(createState(), { name: "Wash towels", intervalDays: 7 });

  assert.equal(state.items.length, 1);
  assert.equal(state.items[0].name, "Wash towels");
  assert.equal(state.items[0].intervalDays, 7);
  assert.equal(state.items[0].lastDoneAt, null);
  assert.equal(daysSince(state.items[0], new Date("2026-10-10T12:00:00.000Z")), null);
});

test("recording done updates only the selected item", () => {
  const original = addItem(addItem(createState(), { name: "Water filter" }), { name: "Clean desk" });
  const at = new Date("2026-10-08T12:00:00.000Z");
  const state = recordDone(original, original.items[0].id, at);

  assert.equal(state.items[0].lastDoneAt, at.toISOString());
  assert.equal(state.items[1].lastDoneAt, null);
  assert.equal(daysSince(state.items[0], new Date("2026-10-10T12:00:00.000Z")), 2);
});

test("serialization is versioned and round-trippable", () => {
  const state = addItem(createState(), { name: "Replace air filter" });
  const parsed = JSON.parse(serializeState(state));

  assert.equal(parsed.version, 1);
  assert.deepEqual(parsed.items, state.items);
});

test("invalid names are rejected before they reach storage", () => {
  assert.throws(() => addItem(createState(), { name: "   " }), /name/i);
});
