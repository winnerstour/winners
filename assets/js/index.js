const grid = document.getElementById('eventsGrid');

function imgCandidates(slug, ev){
  const c = [];
  // prefer HERO on home, then banner
  c.push(`/assets/img/banners/${slug}-hero.webp`);
  c.push(`/assets/img/banners/${slug}-hero.jpg`);
  c.push(`/assets/img/banners/${slug}-banner.webp`);
  c.push(`/assets/img/banners/${slug}-banner.jpg`);
  if (ev.banner) c.push(ev.banner);
  c.push(`/assets/img/banners/${slug}.webp`);
  c.push(`/assets/img/banners/${slug}.jpg`);
  c.push(`/assets/img/banners/placeholder.webp`);
  return c;
}

function smallIcon(slug){
  return `/assets/img/banners/${slug}-favicon.webp`;
}

function card(ev){
  const slug = (ev.slug || ev.id || "").toLowerCase();
  const href = ev.url || `evento.html?slug=${encodeURIComponent(slug)}`;
  const title = ev.title || slug;
  const desc = ev.subtitle || ev.summary || "";
  const when = ev.dateShort || ev.dateHuman || "";
  const imgs = imgCandidates(slug, ev);
  const fav = smallIcon(slug);
  const [first, ...rest] = imgs;
  return `
    <a class="card" href="${href}">
      <div class="card__cover">
        <img class="card__img" alt="${title}" src="${first}" data-fallback="${rest.join("|")}" loading="lazy">
      </div>
      <div class="card__body">
        <div class="card__title"><img class="favicon" src="${fav}" alt="" onerror="this.remove()"> ${title}</div>
        <p class="card__desc">${when ? `<strong>${when}</strong> — ` : ""}${desc}</p>
      </div>
    </a>`;
}

function wireFallbacks(root=document){
  root.querySelectorAll('img[data-fallback]').forEach(img=>{
    img.addEventListener('error', ()=>{
      const list = (img.getAttribute('data-fallback')||'').split('|').filter(Boolean);
      if(!list.length) return;
      img.setAttribute('data-fallback', list.slice(1).join('|'));
      img.src = list[0];
    }, {once:false});
  });
}

async function load(){
  try{
    const res = await fetch('/api/events',{cache:'no-store'});
    const data = await res.json();
    const items = Array.isArray(data.events)? data.events : (Array.isArray(data)? data : []);
    grid.innerHTML = items.map(card).join("");
    wireFallbacks();
  }catch(e){
    grid.innerHTML = `<p class="muted">Falha ao carregar eventos.</p>`;
    console.error(e);
  }
}
load();
