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

exports.handler = async (evt) => {
  try {
    const slug = (evt.queryStringParameters?.slug || "").trim();
    const dir = resolveEventsDir();
    if (!slug || !dir) return { statusCode: 404, body: JSON.stringify({ ok: false }) };

    const file = path.join(dir, `${slug}.json`);
    if (!fs.existsSync(file)) return { statusCode: 404, body: JSON.stringify({ ok: false }) };

    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    const base = `/assets/img/banners/${slug}`;
    data.banner_path = `${base}-banner.webp`;
    data.hero_image_path = `${base}-hero.webp`;
    data.favicon_image_path = `${base}-favicon.webp`;

    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ ok: true, slug, data, sourceDir: dir }),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err) }) };
  }
};
