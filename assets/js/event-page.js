async function loadEvent() {
  const slug = new URLSearchParams(location.search).get("slug");
  if (!slug) return;
  const res = await fetch(`/.netlify/functions/event?slug=${slug}`);
  const json = await res.json();
  if (!json.ok) return;
  const ev = json.data;

  document.querySelector("#heroImg").src = ev.hero_image_path || ev.banner_path;
  document.querySelector("#faviconImg").src = ev.favicon_image_path;
  const motivos = document.querySelector("#motivos");
  if (Array.isArray(ev.motivos)) {
    motivos.innerHTML = ev.motivos.map(m => `
      <li>${m.emoji || ""} <strong>${m.title || ""}</strong> ${m.text || ""}</li>
    `).join("");
  }
}

document.addEventListener("DOMContentLoaded", loadEvent);
