module.exports.handler = async () => ({
  statusCode: 200,
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ ok: true, now: new Date().toISOString(), note: "Funções ativas." })
});
