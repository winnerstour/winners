
const fs = require("fs");
const path = require("path");

const ROOT = process.env.LAMBDA_TASK_ROOT || process.cwd();
const PRIMARY_DIR = path.join(ROOT, "data", "events");
const LEGACY_DIR  = path.join(ROOT, "assets", "data", "events");

function existingDir(...p) {
  const dir = path.join(...p);
  return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
}

function eventsDir() {
  if (existingDir(ROOT, "data", "events")) return PRIMARY_DIR;
  if (existingDir(ROOT, "assets", "data", "events")) return LEGACY_DIR;
  return PRIMARY_DIR;
}

module.exports.handler = async (evt) => {
  try {
    const slug = (evt.queryStringParameters && evt.queryStringParameters.slug || "").trim();
    if (!slug) return { statusCode: 400, body: "slug obrigatório" };
    const DIR = eventsDir();
    const fp = path.join(DIR, `${slug}.json`);
    if (!fs.existsSync(fp)) return { statusCode: 404, body: "evento não encontrado" };
    const data = JSON.parse(fs.readFileSync(fp, "utf-8"));
    return {
      statusCode: 200,
      headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
      body: JSON.stringify(data)
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
