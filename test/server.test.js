import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { request } from "node:http";
import { createAppServer } from "../src/server.js";

function call(port, method, path, body) {
  return new Promise((resolve, reject) => {
    const req = request({ hostname: "127.0.0.1", port, method, path, headers: body ? { "content-type": "application/json" } : {} }, (res) => {
      let text = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { text += chunk; });
      res.on("end", () => resolve({ status: res.statusCode, body: text ? JSON.parse(text) : null }));
    });
    req.on("error", reject);
    if (body) req.end(JSON.stringify(body)); else req.end();
  });
}

test("the local API creates and completes a timer without a cloud dependency", async () => {
  const home = await mkdtemp(join(tmpdir(), "sincebox-"));
  const server = createAppServer({ dataFile: join(home, "state.json") });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;

  try {
    const created = await call(port, "POST", "/api/items", { name: "Clean desk", intervalDays: 3 });
    assert.equal(created.status, 201);
    assert.equal(created.body.item.name, "Clean desk");

    const completed = await call(port, "POST", `/api/items/${created.body.item.id}/done`);
    assert.equal(completed.status, 200);
    assert.match(completed.body.item.lastDoneAt, /^2026|^20/);

    const listed = await call(port, "GET", "/api/items");
    assert.equal(listed.body.items.length, 1);
    assert.equal(listed.body.items[0].lastDoneAt, completed.body.item.lastDoneAt);
    assert.match(await readFile(join(home, "state.json"), "utf8"), /Clean desk/);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});
