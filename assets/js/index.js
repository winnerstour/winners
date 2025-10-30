async function loadEvents() {
  const res = await fetch("/.netlify/functions/events");
  const { events = [] } = await res.json();
  const grid = document.getElementById("eventsGrid");

  grid.innerHTML = events.map(ev => `
    <article class="card">
      <a href="${ev.url}" class="card__media">
        <img src="${ev.banner}" alt="${ev.title}" loading="lazy">
      </a>
      <header class="card__header">
        ${ev.favicon ? `<img class="card__favicon" src="${ev.favicon}" alt="">` : ""}
        <h3><a href="${ev.url}">${ev.title}</a></h3>
      </header>
      <p>${ev.subtitle || ""}</p>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", loadEvents);
