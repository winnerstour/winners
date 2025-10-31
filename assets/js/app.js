// WINNERSTOUR PATCH v1
(async function() {
  const cards = document.getElementById('cards');
  const empty = document.getElementById('empty');
  const burger = document.getElementById('burger');

  burger?.addEventListener('click', () => {
    const nav = document.querySelector('.nav');
    const visible = getComputedStyle(nav).display !== 'none';
    nav.style.display = visible ? 'none' : 'flex';
  });

  try {
    const res = await fetch('data/events.json', {cache: 'no-store'});
    if (!res.ok) throw new Error('Falha ao carregar events.json');
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) {
      empty.hidden = false;
      return;
    }
    const fmt = (s) => s ?? '';
    const toCard = (e) => {
      const img = e.cover || e.hero_image || '';
      return `
      <article class="card">
        ${img ? `<img class="cover" src="${img}" alt="${fmt(e.title)}">` : `<div class="cover"></div>`}
        <div class="content">
          <h3>${fmt(e.title)}</h3>
          <div class="meta">
            ${e.city ? `<span class="chip">📍 ${fmt(e.city)}</span>` : ''}
            ${e.venue ? `<span class="chip">🏛️ ${fmt(e.venue)}</span>` : ''}
            ${e.date ? `<span class="chip">🗓️ ${fmt(e.date)}</span>` : ''}
            ${e.chipColor ? `<span class="chip" style="background:${fmt(e.chipColor)}">Categoria</span>` : ''}
          </div>
          ${e.url ? `<a class="cta" href="${e.url}" target="_blank" rel="noopener">Ver detalhes →</a>` : ''}
        </div>
      </article>`;
    };
    cards.innerHTML = items.map(toCard).join('');
    empty.hidden = true;
  } catch (err) {
    console.error(err);
    empty.hidden = false;
    empty.textContent = 'Não foi possível carregar os eventos.';
  }
})();