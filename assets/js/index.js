// index.js — atualizado
// - Usa HERO por padrão e faz fallback para BANNER
// - Insere favicon antes do título
// - Linka para `evento.html?slug=`
// - Mantém compatibilidade com window.__EVENTS e com a Function /.netlify/functions/events

(function () {
  const $list = document.querySelector("#events, #event-list, .events-list") || document.body;
  if (!$list) return;

  function resolveImage(slug, kind) {
    // kind: 'hero' | 'banner' | 'favicon'
    return `/assets/img/banners/${slug}-${kind}.webp`;
  }

  function cardTemplate(ev) {
    const hero = resolveImage(ev.slug, "hero");
    const banner = resolveImage(ev.slug, "banner");
    const favicon = resolveImage(ev.slug, "favicon");
    const url = `evento.html?slug=${encodeURIComponent(ev.slug)}`;

    // NOTA: usamos onerror inline para fazer fallback de HERO -> BANNER automaticamente
    return `
    <article class="event-card" data-slug="${ev.slug}">
      <a class="event-card__media" href="${url}">
        <img class="event-card__img" src="${hero}" alt="${ev.title} — imagem" 
             onerror="this.onerror=null;this.src='${banner}'" loading="lazy" />
      </a>
      <div class="event-card__body">
        <h3 class="event-card__title">
          <img class="event-card__favicon" src="${favicon}" alt="" 
               onerror="this.style.display='none'" width="20" height="20" />
          <a href="${url}" class="event-card__link">${ev.title}</a>
        </h3>
        ${ev.subtitle ? `<p class="event-card__subtitle">${ev.subtitle}</p>` : ""}
      </div>
    </article>`;
  }

  function render(events) {
    if (!Array.isArray(events)) return;
    const html = events.map(cardTemplate).join("");
    // Tenta preencher contêineres conhecidos sem quebrar layout existente
    const containers = [
      document.querySelector("#events"),
      document.querySelector("#event-list"),
      document.querySelector(".events-list")
    ].filter(Boolean);

    if (containers.length) {
      containers.forEach(el => el.innerHTML = html);
    } else {
      // fallback: injeta no body (não recomendado, mas evita tela vazia)
      const wrap = document.createElement("section");
      wrap.innerHTML = html;
      document.body.appendChild(wrap);
    }
  }

  async function load() {
    try {
      if (window.__EVENTS && Array.isArray(window.__EVENTS)) {
        render(window.__EVENTS);
        return;
      }
      const res = await fetch("/.netlify/functions/events");
      if (!res.ok) throw new Error("Falha ao carregar events function");
      const data = await res.json();
      render(data.events || []);
    } catch (e) {
      console.error("[index.js] Erro ao carregar eventos:", e);
    }
  }

  document.addEventListener("DOMContentLoaded", load);
})();