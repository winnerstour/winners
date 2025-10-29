function getSlug(){ return new URLSearchParams(location.search).get("slug") || ""; }

function pickImage(ev){
  const s = ev.slug || "";
  const c = [];
  // prefer HERO on event page too
  c.push(`/assets/img/banners/${s}-hero.webp`);
  c.push(`/assets/img/banners/${s}-hero.jpg`);
  if (ev.banner_path) c.push(ev.banner_path);
  if (ev.seo && ev.seo.image) c.push(ev.seo.image);
  c.push(`/assets/img/banners/${s}-banner.webp`);
  c.push(`/assets/img/banners/${s}-banner.jpg`);
  return c[0];
}

function setHero(ev){
  const el = document.getElementById('heroBg');
  if (!el) return;
  el.style.backgroundImage = `url('${pickImage(ev)}')`;
}

function htmlescape(s){ return (s||"").replace(/[&<>]/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;"}[m])); }

function renderMotivos(ev){
  const wrap = document.getElementById('track2');
  const title = document.getElementById('motivosTitle');
  if(!wrap) return;
  const list = Array.isArray(ev.motivos)? ev.motivos : [];
  if (title && ev.title) title.textContent = `6 MOTIVOS PRA IR À ${ev.title.toUpperCase()}`;
  if (!list.length){ wrap.innerHTML = `<div class="p-4 muted">Motivos não informados.</div>`; return; }

  const norm = list.map(m=>{
    if (typeof m === "string") return {emoji:"", title:"", text:m};
    return {emoji: m.emoji || "", title: m.title || m.titulo || "", text: m.text || m.conteudo || m.content || ""};
  });

  wrap.innerHTML = norm.map(m=>`
    <article class="card" style="min-width:320px;max-width:420px">
      <div class="card__body">
        <div class="card__title">${htmlescape(m.emoji||"")} ${htmlescape(m.title)}</div>
        <p class="card__desc">${m.text}</p>
      </div>
    </article>
  `).join("");
}

async function load(){
  const slug = getSlug();
  if (!slug) return;
  const res = await fetch(`/api/event?slug=${encodeURIComponent(slug)}`,{cache:'no-store'});
  if (!res.ok){ console.error('evento não encontrado'); return; }
  const ev = await res.json();
  document.title = `${ev.title || "Evento"} • WinnersTour`;

  // Título/sub
  const t = document.getElementById('evTitle'); if (t) t.textContent = ev.title || "";
  const s = document.getElementById('evSubtitle'); if (s) s.innerHTML = ev.subtitle || ev.summary || "";

  setHero(ev);
  renderMotivos(ev);
}

document.readyState !== "loading" ? load() : document.addEventListener("DOMContentLoaded", load);
