import fs from "fs";
import path from "path";

const ROOT = process.env.LAMBDA_TASK_ROOT || process.cwd();
const CANDIDATES = [
  path.join(ROOT, "assets", "data", "events"),
  path.join(ROOT, "data", "events")
];
const BANNERS_DIR = path.join(ROOT, "assets", "img", "banners");

function findEventsDir(){
  for (const p of CANDIDATES){
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function safeReadJSON(fp){
  try { return JSON.parse(fs.readFileSync(fp, "utf-8")); } catch { return null; }
}

function pickSubtitle(ev){
  return ev.subtitle || ev.badge || ev.summary || ev.initial_description || ev.description || "";
}

function resolveBanner(slug, ev){
  if (ev.hero_image_path) return ev.hero_image_path;
  if (ev.banner_path) return ev.banner_path;
  if (ev.seo && ev.seo.image) return ev.seo.image;
  const exts = ["webp","jpg","jpeg","png"];
  for (const ext of exts){
    const fp = path.join(BANNERS_DIR, `${slug}-hero.${ext}`);
    if (fs.existsSync(fp)) return `/assets/img/banners/${slug}-hero.${ext}`;
  }
  for (const ext of exts){
    const fp = path.join(BANNERS_DIR, `${slug}-banner.${ext}`);
    if (fs.existsSync(fp)) return `/assets/img/banners/${slug}-banner.${ext}`;
  }
  return `/assets/img/banners/placeholder.webp`;
}

export const handler = async () => {
  try {
    const DIR = findEventsDir();
    if (!DIR) {
      return { statusCode: 200, headers: {"content-type":"application/json; charset=utf-8"}, body: JSON.stringify({count:0, events:[], sourceDir:null}) };
    }
    const files = fs.readdirSync(DIR).filter(f => f.endsWith(".json"));
    const events = [];
    for (const f of files){
      const ev = safeReadJSON(path.join(DIR, f));
      if (!ev || !ev.slug) continue;
      const slug = `${ev.slug}`.trim().toLowerCase();
      events.push({
        slug,
        title: (ev.title || slug).trim(),
        subtitle: pickSubtitle(ev).trim(),
        emoji: ev.emoji || "",
        banner: resolveBanner(slug, ev),
        url: `evento.html?slug=${slug}`,
        dateHuman: ev.date_human || "",
        dateShort: ev.date_short || ""
      });
    }
    events.sort((a,b)=> a.title.localeCompare(b.title, "pt-BR", {sensitivity:"base"}));
    return {
      statusCode: 200,
      headers: {"content-type":"application/json; charset=utf-8","cache-control":"no-store"},
      body: JSON.stringify({count: events.length, events, sourceDir: path.relative(ROOT, DIR)})
    };
  } catch (e){
    return { statusCode: 500, body: JSON.stringify({error: e.message}) };
  }
};
