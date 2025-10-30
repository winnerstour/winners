
WinnersTour - Patch de Topbar + Hover dos Cards (NÃO sobrescreve seu CSS antigo)

O que vem neste pacote:
- snippets/css_additions.css  -> cole o conteúdo NO FINAL do seu assets/css/base.css
- snippets/header.html        -> substitui apenas o bloco <header> no seu index.html/evento.html se desejar
- snippets/menu-toggle.js     -> script simples para o botão burger (se já usa outro, ignore)
- snippets/google-fonts.html  -> tag <link> da Montserrat para colocar no <head>

Passos:
1) No <head> do seu(s) HTML(s), inclua:
   <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&display=swap" rel="stylesheet">

2) Abra assets/css/base.css e COLE o conteúdo de css_additions.css AO FINAL DO ARQUIVO (não apague nada do que existe).

3) Troque seu bloco <header> pelo que está em snippets/header.html (apenas se seu header atual não estiver igual).

4) Adicione o menu-toggle.js ao final do body:
   <script src="assets/js/menu-toggle.js"></script>

5) NÃO REMOVA o widget da loja/busca.
