// Renderiza a página de evento e os motivos
async function loadEventPage() {
  const slug = new URLSearchParams(location.search).get("slug");
  if (!slug) return;

  try {
    const res = await fetch(`/.netlify/functions/event?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
    const json = await res.json();
    if (!json.ok) return;

    const ev = json.data;
    const hero = document.querySelector("#heroImg");
    if (hero && ev.hero_image_path) hero.src = ev.hero_image_path;
    const fav = document.querySelector("#faviconImg");
    if (fav && ev.favicon_image_path) fav.src = ev.favicon_image_path;

    const motivosBox = document.querySelector("#motivos");
    const motivos = Array.isArray(ev.motivos) ? ev.motivos : [];
    if (motivosBox) {
      motivosBox.innerHTML = motivos.map(m => {
        const emoji = m.emoji || "";
        const title = m.title || m.titulo || "";
        const text = m.text || m.content || m.descricao || "";
        return `
          <li class="motivo">
            ${emoji ? `<span class="m-emoji">${emoji}</span>` : ""}
            <div class="m-body">
              <strong>${title}</strong>
              <p>${text}</p>
            </div>
          </li>
        `;
      }).join("");
    }
  } catch (e) {
    // no-op
  }
}
document.addEventListener("DOMContentLoaded", loadEventPage);
