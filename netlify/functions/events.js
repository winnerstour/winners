const fs = require("fs");
const path = require("path");

function resolveEventsDir() {
  const candidates = [
    path.resolve("assets/data/events"),
    path.join(process.cwd(), "assets/data/events"),
    path.join(__dirname, "..", "..", "assets", "data", "events"),
    "/var/task/assets/data/events",
  ];
  for (const p of candidates) if (fs.existsSync(p)) return p;
  return null;
}

exports.handler = async () => {
  try {
    const dir = resolveEventsDir();
    if (!dir) {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json; charset=utf-8" },
        body: JSON.stringify({ count: 0, events: [], sourceDir: null }),
      };
    }

    const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
    const events = files.map(file => {
      const full = path.join(dir, file);
      const raw = fs.readFileSync(full, "utf8");
      const data = JSON.parse(raw);
      const slug = data.slug || path.basename(file, ".json");
      return {
        slug,
        title: data.title || "",
        subtitle: data.subtitle || "",
        banner: `/assets/img/banners/${slug}-hero.webp`,
        favicon: `/assets/img/banners/${slug}-favicon.webp`,
        url: `evento.html?slug=${slug}`,
      };
    });

    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ count: events.length, events, sourceDir: dir }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
