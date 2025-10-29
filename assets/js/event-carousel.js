// event-carousel.js v16 — motivos funcionando + hoteis
function q(k){ return new URLSearchParams(location.search).get(k) || ""; }
async function loadJSON(url){
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(url + " " + r.status);
  return r.json();
}
const DATA_BASE = "/assets/data";

const IMG_FALLBACK = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAqMBR2F2kXUAAAAASUVORK5CYII=";
const safeImg = (src) => (src && typeof src === "string" ? src : IMG_FALLBACK);

function hotelCard(h){
  const slug = h.id || h.slug || (h.name||"").toLowerCase().replace(/\s+/g,"-");
  const img = `/assets/img/hotels/${slug}.webp`;
  const stars = h.stars ? `${h.stars}☆ ` : "";
  const title = `${stars}${h.name||"Hotel"}`;
  const url = h.book_url || h.url || "#";
  const distance = h.distance_min ? `<em>• ${h.distance_min} min do pavilhão</em>` : "";
  const price = h.nightly_from_brl ? `— <strong>a partir de R$ ${h.nightly_from_brl}</strong>` : "";
  return `
    <article class="hotel-card shrink-0 mr-4 p-4 text-center">
      <div class="aspect-[2/3] bg-neutral-100 rounded-xl mb-3 overflow-hidden">
        <img src="${img}" onerror="this.onerror=null;this.src='${safeImg(h.image)}'" class="w-full h-full object-cover" alt="">
      </div>
      <h3 class="font-extrabold leading-none mb-1">${title}</h3>
      <p class="text-sm text-gray-700 leading-snug">${h.description||""} ${distance} ${price}</p>
      <a href="${url}" class="mt-3 w-full rounded-xl bg-orange-600 hover:bg-orange-800 text-white py-2 text-sm font-semibold uppercase inline-block">Reservar</a>
    </article>`;
}

function motivoCard(m){
  return `
    <article class="motivo shrink-0 mr-4 p-6 rounded-2xl bg-white shadow-sm">
      <div class="mb-2 text-2xl">${m.emoji || "💡"}</div>
      <h3 class="font-extrabold leading-none mb-1">${m.title || ""}</h3>
      <p class="text-sm text-gray-700 leading-relaxed">${m.text || ""}</p>
    </article>`;
}

function renderHotels(list){
  const track = document.querySelector("#track");
  if (!track) return;
  const items = (Array.isArray(list) ? list : []).filter(h => h.type==="hotel" || h.type==="daytrip").slice(0,8);
  track.innerHTML = items.map(hotelCard).join("");
}

function renderMotivos(list){
  const track = document.querySelector("#track2");
  if (!track) return;
  const items = Array.isArray(list) ? list : [];
  track.innerHTML = items.map(motivoCard).join("");
}

// carrossel simples (prev/next)
function wireCarousel(trackSel, prevSel, nextSel){
  const track = document.querySelector(trackSel),
        prev  = document.querySelector(prevSel),
        next  = document.querySelector(nextSel);
  if (!track || !prev || !next) return;

  let index = 0;
  const slideW = () => {
    const el = track.querySelector("article.shrink-0");
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const gap = 16;
    const mr = parseFloat(getComputedStyle(el).marginRight||0) || 0;
    return r.width + Math.max(gap, mr);
  };

  function update(noAnim){
    const w = slideW();
    if (w <= 0) return;
    if (noAnim) track.style.transition = "none";
    track.style.transform = `translateX(-${index * w}px)`;
    if (noAnim) requestAnimationFrame(()=>track.style.transition="transform 200ms ease");
    prev.style.display = index > 0 ? "flex" : "none";
    const total = track.querySelectorAll("article.shrink-0").length;
    const max = Math.max(0, total - 1);
    next.style.display = index < max ? "flex" : "none";
  }

  function go(d){
    const total = track.querySelectorAll("article.shrink-0").length;
    const max = Math.max(0, total - 1);
    index = Math.min(Math.max(index + d, 0), max);
    update();
  }

  prev.addEventListener("click", ()=>go(-1));
  next.addEventListener("click", ()=>go(1));
  window.addEventListener("resize", ()=>update(true));
  setTimeout(()=>update(true), 0);
}

export async function bootEventCarousels(){
  const slug = q("slug");
  if (!slug) return;

  // carrega evento + venue
  let ev = {};
  try { ev = await loadJSON(`${DATA_BASE}/events/${slug}.json`); } catch(e){ console.warn("evento", e); }
  let venue = {};
  const venueSlug = ev.venue_slug || ev.venue || "";
  if (venueSlug){
    try { venue = await loadJSON(`${DATA_BASE}/venues/${venueSlug}.json`); } catch(e){ console.warn("venue", e); }
  }

  renderHotels(venue.hotels || []);
  renderMotivos(ev.motivos || []);

  wireCarousel("#track",  "#prevBtn",  "#nextBtn");
  wireCarousel("#track2", "#prevBtn2", "#nextBtn2");
}
