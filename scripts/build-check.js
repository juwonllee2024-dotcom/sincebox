import { access } from "node:fs/promises";

for (const file of ["src/cli.js", "src/server.js", "src/store.js", "public/index.html", "public/app.js", "public/styles.css"]) {
  await access(file);
}
console.log("Sincebox build check passed: runtime and browser assets are present.");
