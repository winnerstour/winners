# Pacote pronto — Deploy com Interface (sem terminal)

## O que vem aqui
- `netlify.toml` + `netlify/functions/` → habilitam as rotas `/api/*`
- `index.html` + `evento.html` → já consomem `/api/events` e `/api/event?slug=...`
- `data/events/` → exemplos para testar (adicione os seus .json)
- `assets/img/banners/` → coloque `{slug}-banner.webp` (ou .jpg/.jpeg/.png)

## Como publicar SEM terminal (GitHub + Netlify)

### Parte 1 — GitHub (só pelo site)
1. Crie uma conta no GitHub (se ainda não tiver).
2. Clique em **New repository** → dê um nome (ex.: `winnerstour-site`).
3. Clique em **Add file** → **Upload files**.
4. Arraste **todos os arquivos/diretorios** desta pasta para a página do GitHub:
   - `index.html`, `evento.html`
   - pasta `data/` (com seus `.json`)
   - pasta `assets/` (com seus banners)
   - pasta `netlify/` (com `functions/*.js`)
   - arquivo `netlify.toml`
5. Clique em **Commit changes**.

### Parte 2 — Netlify (só pelo site)
1. Entre em **Netlify → Add new site → Import an existing project**.
2. Escolha **GitHub** e selecione o repositório que você acabou de criar.
3. Configuração:
   - **Base directory**: deixe em branco
   - **Build command**: deixe em branco (ou `echo "no build"`)
   - **Publish directory**: `.`
4. **Deploy site**.
5. Teste as rotas:
   - `https://SEU-SITE.netlify.app/api/hello` → deve responder `{ ok: true, ... }`
   - `https://SEU-SITE.netlify.app/api/events`
   - `https://SEU-SITE.netlify.app/evento.html?slug=escolar-office-brasil` (ajuste o slug)

### Dicas
- Sempre que subir novos `.json` em `data/events` ou banners em `assets/img/banners`, é só **enviar pelo GitHub (Upload files)** e dar **Commit**. O Netlify redeploya sozinho.
- **Estrutura obrigatória** na raiz: `netlify.toml` + pasta `netlify/functions`.

Qualquer dúvida, me chame aqui e eu ajusto.
