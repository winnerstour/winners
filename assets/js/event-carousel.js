// event-carousel.js — atualizado
// - Corrige renderização de "motivos" usando innerHTML seguro (conteúdo controlado)
// - Garante que imagens de hotel e motivos não quebrem o layout
// - Reutilizável para a página do evento

(function () {
  // Busca <div id="motivos"> para listar motivos do evento (se disponível)
  const $motivos = document.querySelector("#motivos, .event-motivos");
  const $hotels = document.querySelector("#hotels, .event-hotels");

  function motivoItemTemplate(m) {
    // m: { emoji, title, text } — permite HTML no text (já sanitizado na origem)
    const emoji = m.emoji ? `<span class="motivo-emoji" aria-hidden="true">${m.emoji}</span>` : "";
    const title = m.title ? `<h4 class="motivo-title">${m.title}</h4>` : "";
    const text = m.text ? `<p class="motivo-text">${m.text}</p>` : "";
    return `<li class="motivo-item">${emoji}<div class="motivo-content">${title}${text}</div></li>`;
  }

  function renderMotivos(motivos) {
    if (!$motivos) return;
    if (!Array.isArray(motivos) || motivos.length === 0) {
      $motivos.style.display = "none";
      return;
    }
    $motivos.innerHTML = `
      <h3 class="section-title">Motivos para visitar</h3>
      <ul class="motivo-list">
        ${motivos.map(motivoItemTemplate).join("")}
      </ul>
    `;
  }

  // Funções auxiliares para carregar dados do evento atual (via slug da URL)
  function getSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get("slug") || "";
  }

  async function fetchEventData(slug) {
    // Tenta pull do arquivo JSON do evento em assets/data/events/<slug>.json
    // Fallback: usa a Netlify Function de lista e faz find pelo slug.
    try {
      const res = await fetch(`/assets/data/events/${slug}.json`, { cache: "no-store" });
      if (res.ok) return await res.json();
    } catch {}
    try {
      const res = await fetch("/.netlify/functions/events");
      if (res.ok) {
        const data = await res.json();
        const found = (data.events || []).find(e => e.slug === slug);
        return found || null;
      }
    } catch {}
    return null;
  }

  async function init() {
    const slug = getSlug();
    if (!slug) return;

    const ev = await fetchEventData(slug);
    if (ev && Array.isArray(ev.motivos)) {
      renderMotivos(ev.motivos);
    } else {
      // Se não há motivos no JSON do Function, tenta ler do arquivo completo
      try {
        const res = await fetch(`/assets/data/events/${slug}.json`, { cache: "no-store" });
        if (res.ok) {
          const full = await res.json();
          renderMotivos(full.motivos || []);
        }
      } catch (e) {
        console.warn("Não foi possível carregar motivos:", e);
      }
    }

    // (Opcional) Normaliza imagens de hotéis se existir um carrossel já renderizado por outro script
    if ($hotels) {
      $hotels.querySelectorAll("img[data-banner]").forEach(img => {
        const slugAttr = img.getAttribute("data-banner");
        if (!slugAttr) return;
        const hero = `/assets/img/banners/${slugAttr}-hero.webp`;
        img.addEventListener("error", () => (img.src = `/assets/img/banners/${slugAttr}-banner.webp`), { once: true });
        img.src = hero;
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();