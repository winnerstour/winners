(function(){
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  function card(ev){
    const slug = ev.slug;
    const hero = window.asset(`assets/img/banners/${slug}-hero.webp`);
    const banner = window.asset(`assets/img/banners/${slug}-banner.webp`);
    const fav = window.asset(`assets/img/banners/${slug}-favicon.webp`);
    const href = window.pageUrl(`evento.html?slug=${encodeURIComponent(slug)}`);
    const subtitle = ev.subtitle ? `<p class="subtitle">${ev.subtitle}</p>` : '';

    return `
      <a class="card" href="${href}" aria-label="${ev.title||slug}">
        <div class="media">
          <img loading="lazy" src="${hero}" onerror="this.onerror=null;this.src='${banner}'" alt="${ev.title||slug}">
        </div>
        <div class="body">
          <h3 class="title">${ev.title ? `<img class="fav" src="${fav}" alt="" aria-hidden="true"> <span>${ev.title}</span>` : (ev.title||slug)}</h3>
          ${subtitle}
        </div>
      </a>
    `;
  }

  async function load(){
    try {
      const url = window.asset('assets/data/events/index.json') + `?v=${Date.now()}`;
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error('index.json não encontrado');
      const events = await res.json();
      grid.innerHTML = events.map(card).join('');
    } catch (e) {
      console.error('Falha ao carregar lista de eventos:', e);
      grid.innerHTML = `<p>Não foi possível carregar os eventos.</p>`;
    }
  }
  document.addEventListener('DOMContentLoaded', load);
})();
