
/**
 * WinnersTour — renderização correta dos cards no INDEX
 * - Usa imagem HERO (fallback para BANNER se não existir)
 * - Mostra favicon antes do título
 * - Não altera a API nem o HTML base: só a montagem do card
 */

(function () {
  const grid = document.querySelector('[data-events-grid], #eventsGrid, .events-grid');

  // Função util: a partir do objeto de evento vindo da API
  // decide qual imagem usar (preferência pelo HERO)
  function resolveHero(ev) {
    // Se veio 'banner' da API, tenta trocar por hero
    if (ev.banner && typeof ev.banner === 'string') {
      const candidate = ev.banner.replace('-banner.webp', '-hero.webp');
      return { primary: candidate, fallback: ev.banner };
    }
    // Se não tem banner no JSON, constrói pelo slug (padrão de arquivos)
    if (ev.slug) {
      const base = `/assets/img/banners/${ev.slug}`;
      return { primary: `${base}-hero.webp`, fallback: `${base}-banner.webp` };
    }
    return { primary: '', fallback: '' };
  }

  function resolveFavicon(ev) {
    if (ev.slug) return `/assets/img/banners/${ev.slug}-favicon.webp`;
    return '';
  }

  // Monta o HTML de 1 card
  function buildCard(ev) {
    const img = resolveHero(ev);
    const fav = resolveFavicon(ev);
    const a = document.createElement('a');
    a.href = ev.url || `evento.html?slug=${ev.slug}`;
    a.className = 'event-card';
    a.setAttribute('aria-label', ev.title || ev.slug);

    a.innerHTML = `
      <div class="card-media">
        <img loading="lazy" src="${img.primary}"
             onerror="this.onerror=null; if (this.dataset.fallback) this.src=this.dataset.fallback;"
             data-fallback="${img.fallback}" alt="${ev.title || ''}">
      </div>
      <div class="card-body">
        <h3 class="card-title">
          ${fav ? `<img class="favicon" src="${fav}" alt="" aria-hidden="true">` : ''}
          <span>${ev.title || ''}</span>
        </h3>
        ${ev.subtitle ? `<p class="card-subtitle">${ev.subtitle}</p>` : ''}
      </div>
    `;
    return a;
  }

  // Renderiza a grade inteira
  function render(events) {
    if (!grid) return;
    grid.innerHTML = '';
    const frag = document.createDocumentFragment();
    events.forEach(ev => frag.appendChild(buildCard(ev)));
    grid.appendChild(frag);
  }

  // Se a página já carregou dados (ex.: window.__EVENTS), usa:
  if (window.__EVENTS && Array.isArray(window.__EVENTS)) {
    render(window.__EVENTS);
  }

  // Caso esteja usando a função serverless /events
  async function tryFetch() {
    try {
      const res = await fetch('/.netlify/functions/events', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data?.events) && data.events.length) {
        render(data.events);
      }
    } catch (e) { /* silencioso */ }
  }
  tryFetch();
})();
