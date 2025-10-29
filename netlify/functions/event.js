import fs from "fs";
import path from "path";

const ROOT = process.env.LAMBDA_TASK_ROOT || process.cwd();
const CANDIDATES = [
  path.join(ROOT, "assets", "data", "events"),
  path.join(ROOT, "data", "events")
];

function findEventsDir(){
  for (const p of CANDIDATES){
    if (fs.existsSync(p)) return p;
  }
  return null;
}

export const handler = async (evt) => {
  try {
    const slug = (evt.queryStringParameters?.slug || "").trim().toLowerCase();
    if (!slug) return { statusCode: 400, body: "slug obrigatório" };
    const DIR = findEventsDir();
    if (!DIR) return { statusCode: 404, body: "diretório de eventos não encontrado" };
    const fp = path.join(DIR, `${slug}.json`);
    if (!fs.existsSync(fp)) return { statusCode: 404, body: "evento não encontrado" };
    const data = JSON.parse(fs.readFileSync(fp, "utf-8"));
    return { statusCode: 200, headers: {"content-type":"application/json; charset=utf-8", "cache-control":"no-store"}, body: JSON.stringify(data) };
  } catch (e){
    return { statusCode: 500, body: JSON.stringify({error: e.message}) };
  }
};
