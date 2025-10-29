
const fs = require("fs");
const path = require("path");

const ROOT = process.env.LAMBDA_TASK_ROOT || process.cwd();
const PRIMARY_DIR = path.join(ROOT, "data", "events");
const LEGACY_DIR  = path.join(ROOT, "assets", "data", "events");
const BANNERS_DIR = path.join(ROOT, "assets", "img", "banners");

function existingDir(...p) {
  const dir = path.join(...p);
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

function eventsDir() {
  // Prefer /data/events; fallback /assets/data/events
  if (existingDir(ROOT, "data", "events")) return PRIMARY_DIR;
  if (existingDir(ROOT, "assets", "data", "events")) return LEGACY_DIR;
  return PRIMARY_DIR; // default (mesmo não existindo)
}

function safeReadJSON(fp) {
  try { return JSON.parse(fs.readFileSync(fp, "utf-8")); }
  catch { return null; }
}

function pickSubtitle(ev) {
  return ev.subtitle || ev.summary || ev.badge || ev.initial_description || ev.description || ev.sub || "";
}

function resolveBanner(slug, ev) {
  if (ev.banner_path && (ev.banner_path.startsWith("/") || ev.banner_path.startsWith("http"))) return ev.banner_path;
  if (ev.seo && ev.seo.image) return ev.seo.image;
  const exts = ["webp","jpg","jpeg","png"];
  for (const ext of exts) {
    const fp = path.join(BANNERS_DIR, `${slug}-banner.${ext}`);
    if (fs.existsSync(fp)) return `/assets/img/banners/${slug}-banner.${ext}`;
  }
  for (const ext of exts) {
    const fp = path.join(BANNERS_DIR, `${slug}.${ext}`);
    if (fs.existsSync(fp)) return `/assets/img/banners/${slug}.${ext}`;
  }
  return `/assets/img/banners/fallback.webp`;
}

module.exports.handler = async () => {
  try {
    const DIR = eventsDir();
    const files = fs.existsSync(DIR) ? fs.readdirSync(DIR).filter(f => f.endsWith(".json")) : [];
    const events = [];
    for (const f of files) {
      const ev = safeReadJSON(path.join(DIR, f));
      if (!ev || !ev.slug || !ev.title) continue;
      const slug = String(ev.slug).trim();
      events.push({
        slug,
        title: String(ev.title).trim(),
        subtitle: String(pickSubtitle(ev)).trim(),
        emoji: ev.emoji || "",
        banner: resolveBanner(slug, ev),
        url: `evento.html?slug=${slug}`,
        dateHuman: ev.date_human || "",
        dateShort: ev.date_short || ""
      });
    }
    events.sort((a,b)=> a.title.localeCompare(b.title, "pt-BR", { sensitivity: "base" }));
    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
      body: JSON.stringify({ count: events.length, events, sourceDir: path.relative(ROOT, eventsDir()) }, null, 2)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
