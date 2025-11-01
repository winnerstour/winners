(function(){
  const parts = location.pathname.split('/').filter(Boolean);
  let base = './';
  if (parts.length) base = `/${parts[0]}/`;
  if (window.__BASE_PATH_OVERRIDE__) base = window.__BASE_PATH_OVERRIDE__;
  window.__BASE_PATH__ = base;
  window.asset = function(path){ if (path.startsWith('/')) path = path.slice(1); return base + path; };
  window.pageUrl = function(page){ if (!page) return base; if (page.startsWith('/')) page = page.slice(1); return base + page; };
})();
