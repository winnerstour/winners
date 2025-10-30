/**
 * /.netlify/functions/events
 * Lista eventos lendo JSONs de:
 *  - assets/data/events
 *  - data/events   (fallback)
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
      if (fs.existsSync(p) && fs.readdirSync(p).some(f => f.endsWith(".json"))) {
        if (!uniq.includes(p)) uniq.push(p);
      }
    } catch {}
  }
  return uniq;
}

function safeParse(filePath) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function bannerPathsFromSlug(slug) {
  const base = `/assets/img/banners/${slug}`;
  return {
    banner: `${base}-hero.webp`,           // home usa hero
    hero: `${base}-hero.webp`,
    favicon: `${base}-favicon.webp`,
    bannerFull: `${base}-banner.webp`,
  };
}

exports.handler = async () => {
  try {
    const dirs = findEventDirs();
    if (dirs.length === 0) {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ count: 0, events: [], sourceDir: null }),
      };
    }
    const events = [];
    for (const dir of dirs) {
      const files = fs.readdirSync(dir).filter(f => f.endsWith(".json") && !f.startsWith("_") && !f.startsWith("manifest"));
      for (const file of files) {
        const full = path.join(dir, file);
        const data = safeParse(full);
        if (!data) continue;
        const slug = data.slug || path.basename(file, ".json");
        const banners = bannerPathsFromSlug(slug);
        events.push({
          slug,
          title: data.title || "",
          subtitle: data.subtitle || "",
          emoji: data.emoji || "",
          banner: banners.hero,
          favicon: banners.favicon,
          url: `evento.html?slug=${encodeURIComponent(slug)}`,
          dateHuman: data.dateHuman || "",
          dateShort: data.dateShort || "",
          __dir: dir
        });
      }
    }
    // de-duplica por slug priorizando o primeiro diretório (assets/data/events)
    const seen = new Set();
    const dedup = [];
    for (const ev of events) {
      if (seen.has(ev.slug)) continue;
      seen.add(ev.slug);
      dedup.push(ev);
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ count: dedup.length, events: dedup, sourceDir: dirs[0] }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ error: String(err) }),
    };
  }
};
