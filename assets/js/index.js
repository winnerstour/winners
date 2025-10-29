// INDEX v7 — hero + favicon + link para evento.html
(function () {
  const ABS = /^https?:\/\//i;
  const norm = (u) => (!u ? "" : ABS.test(u) ? u : (u[0] === "/" ? u : "/" + u.replace(/^\.\//, "")));

  // CSS do topo (contorno preto e sem blur)
  function injectCSS() {
    const css = `
      :root{--topbar-bg:#FF6D2D;--wrap:1200px}
      .topbar{position:sticky;top:0;z-index:50;background:var(--topbar-bg);color:#fff}
      .topbar__in{max-width:var(--wrap);margin:0 auto;display:flex;align-items:center;gap:12px;padding:10px 12px}
      .brand{font-weight:900;font-size:20px;letter-spacing:.5px;text-transform:uppercase;
             color:#fff; -webkit-text-stroke:1.25px #000; text-shadow:1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000}
      .brand img{filter:none!important;image-rendering:auto}
      #eventsGrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px;max-width:var(--wrap);margin:20px auto;padding:0 12px}
      .card{border:1px solid #eee;border-radius:14px;overflow:hidden;background:#fff}
      .card .thumb{aspect-ratio:16/9;background:#f6f6f6;display:block;width:100%;object-fit:cover}
      .card .body{padding:12px}
      .card .ttl{display:flex;align-items:center;gap:8px;font-weight:800}
      .fav{width:22px;height:22px;flex:0 0 22px;object-fit:contain}
      .card a{color:inherit;text-decoration:none}
    `;
    const tag = document.createElement("style");
    tag.textContent = css.replace(/\s+/g, " ");
    document.head.appendChild(tag);
  }

  // carrega eventos da função ou do manifest
  async function fetchEvents() {
    try {
      const r = await fetch("/.netlify/functions/events", { cache: "no-store" });
      if (r.ok) { const j = await r.json(); return j.events || []; }
    } catch (_) {}
    // fallback: manifest.json
    const r2 = await fetch("/assets/data/manifest.json", { cache: "no-store" });
    const j2 = await r2.json();
    return j2.events || j2 || [];
  }

  // monta imagem: preferir HERO, cair para BANNER
  function heroFor(slug) {
    return `/assets/img/banners/${slug}-hero.webp`;
  }
  function bannerFor(slug) {
    return `/assets/img/banners/${slug}-banner.webp`;
  }
  function faviconFor(slug) {
    return `/assets/img/banners/${slug}-favicon.webp`;
  }

  function card(ev) {
    const slug = ev.slug;
    const url = `evento.html?slug=${encodeURIComponent(slug)}`;
    const imgHero = heroFor(slug);
    const imgBanner = bannerFor(slug);
    const fav = faviconFor(slug);
    return `
      <article class="card">
        <a href="${url}">
          <img class="thumb" src="${imgHero}" onerror="this.onerror=null;this.src='${imgBanner}'" alt="">
        </a>
        <div class="body">
          <a href="${url}" class="ttl">
            <img class="fav" src="${fav}" onerror="this.style.display='none'">
            <span>${ev.title || slug}</span>
          </a>
          <div class="sub">${ev.subtitle || ""}</div>
        </div>
      </article>
    `;
  }

  function renderTopbar() {
    const bar = document.createElement("div");
    bar.className = "topbar";
    bar.innerHTML = `<div class="topbar__in"><div class="brand">WINNERS TOUR</div></div>`;
    document.body.prepend(bar);
  }

  (async function init() {
    injectCSS();
    renderTopbar();
    const grid = document.getElementById("eventsGrid") || (() => {
      const g = document.createElement("section"); g.id = "eventsGrid"; document.body.appendChild(g); return g;
    })();

    const evts = await fetchEvents();
    grid.innerHTML = evts.map(card).join("");
  })();
})();
