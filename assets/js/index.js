// Render cards na home com hero.webp e favicon do slug
async function loadEvents() {
  const grid = document.getElementById("eventsGrid");
  if (!grid) return;

  try {
    const res = await fetch("/.netlify/functions/events", { cache: "no-store" });
    const json = await res.json();
    const events = Array.isArray(json.events) ? json.events : [];

    if (events.length === 0) {
      grid.innerHTML = `<p class="muted">Nenhum evento encontrado.</p>`;
      return;
    }

    grid.innerHTML = events.map(ev => `
      <article class="card">
        <a class="card__media" href="${ev.url}">
          <img loading="lazy" src="${ev.banner}" alt="${ev.title}">
        </a>
        <header class="card__header">
          ${ev.favicon ? `<img class="card__favicon" src="${ev.favicon}" alt="" aria-hidden="true">` : ""}
          <h3 class="card__title"><a href="${ev.url}">${ev.title}</a></h3>
        </header>
        <p class="card__subtitle">${ev.subtitle ?? ""}</p>
      </article>
    `).join("");
  } catch (e) {
    grid.innerHTML = `<p class="error">Erro ao carregar eventos.</p>`;
  }
}
document.addEventListener("DOMContentLoaded", loadEvents);
