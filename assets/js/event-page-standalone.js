(function(){
  function getSlug(){ return new URLSearchParams(location.search).get('slug') || ''; }

  async function loadEvent(){
    const slug = getSlug(); if(!slug) return;
    try{
      const url = window.asset(`assets/data/events/${slug}.json`) + `?v=${Date.now()}`;
      const res = await fetch(url, { cache:'no-store' });
      if (!res.ok) throw new Error('Evento não encontrado');
      const ev = await res.json();

      const title = document.getElementById('title');
      const subtitle = document.getElementById('subtitle');
      const bannerEl = document.getElementById('banner');

      title.textContent = ev.title || slug;
      subtitle.textContent = ev.subtitle || '';

      const hero = window.asset(`assets/img/banners/${slug}-banner.webp`);
      const fallback = window.asset(`assets/img/banners/${slug}-hero.webp`);
      bannerEl.src = hero;
      bannerEl.alt = ev.title || slug;
      bannerEl.onerror = () => { bannerEl.src = fallback; };
    } catch(e){
      console.error('Erro ao carregar evento:', e);
    }
  }
  document.addEventListener('DOMContentLoaded', loadEvent);
})();
