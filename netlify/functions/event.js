/**
 * /.netlify/functions/event?slug=...
 * Retorna o JSON do evento + paths de imagens (banner/hero/favicon).
 */
const fs = require("fs");
const path = require("path");

function findEventDirs() {
  const candidates = [
    path.resolve("assets/data/events"),
    path.resolve("data/events"),
    path.join(process.cwd(), "assets/data/events"),
    path.join(process.cwd(), "data/events"),
    path.join(__dirname, "..", "..", "assets", "data", "events"),
    path.join(__dirname, "..", "..", "data", "events"),
    "/var/task/assets/data/events",
    "/var/task/data/events",
  ];
  const uniq = [];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        if (!uniq.includes(p)) uniq.push(p);
      }
    } catch {}
  }
  return uniq;
}

function safeReadJSON(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function bannerPathsFromSlug(slug) {
  const base = `/assets/img/banners/${slug}`;
  return {
    banner_path: `${base}-banner.webp`,
    hero_image_path: `${base}-hero.webp`,
    favicon_image_path: `${base}-favicon.webp`,
  };
}

exports.handler = async (evt) => {
  try {
    const slug = (evt.queryStringParameters?.slug || "").trim();
    if (!slug) return { statusCode: 400, body: JSON.stringify({ ok:false, error:"missing slug"}) };

    const dirs = findEventDirs();
    for (const dir of dirs) {
      const file = path.join(dir, `${slug}.json`);
      if (fs.existsSync(file)) {
        const data = safeReadJSON(file);
        if (!data) continue;
        const images = bannerPathsFromSlug(slug);
        const merged = { ...data, ...images };

        return {
          statusCode: 200,
          headers: { "content-type": "application/json; charset=utf-8" },
          body: JSON.stringify({ ok:true, slug, data: merged, sourceDir: dir }),
        };
      }
    }
    return { statusCode: 404, body: JSON.stringify({ ok:false, error:"not found"}) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:String(err) }) };
  }
};
