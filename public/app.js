const items = document.querySelector("#items");
const count = document.querySelector("#count");
const form = document.querySelector("#add-form");

const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const elapsedText = (item) => item.daysSince === null ? "Never yet" : `${item.daysSince} day${item.daysSince === 1 ? "" : "s"} ago`;

function render(list) {
  count.textContent = `${list.length} timer${list.length === 1 ? "" : "s"}`;
  if (list.length === 0) {
    items.innerHTML = '<p class="empty">Nothing here yet. Add the small thing you keep forgetting.</p>';
    return;
  }
  items.innerHTML = list.map((item) => {
    const due = item.intervalDays && item.daysSince !== null && item.daysSince >= item.intervalDays;
    return `<article class="card ${due ? "due" : ""}">
      <div><p class="card-name">${escapeHtml(item.name)}</p><p class="card-age">${elapsedText(item)}${due ? ` <span class="due-label">· due</span>` : ""}</p></div>
      <button class="done" data-id="${escapeHtml(item.id)}">I did it <span>✓</span></button>
    </article>`;
  }).join("");
}

async function refresh() {
  const response = await fetch("/api/items");
  const data = await response.json();
  render(data.items);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const response = await fetch("/api/items", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: formData.get("name"), intervalDays: formData.get("intervalDays") }) });
  if (!response.ok) return alert((await response.json()).error);
  form.reset();
  await refresh();
});

items.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-id]");
  if (!button) return;
  button.disabled = true;
  const response = await fetch(`/api/items/${encodeURIComponent(button.dataset.id)}/done`, { method: "POST" });
  if (!response.ok) alert((await response.json()).error);
  await refresh();
});

refresh().catch((error) => { items.innerHTML = `<p class="empty">Could not load local data: ${escapeHtml(error.message)}</p>`; });
