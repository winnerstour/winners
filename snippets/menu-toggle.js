
(function(){
  const btn = document.getElementById('menuBtn');
  if(!btn) return;
  btn.addEventListener('click', function(){
    document.documentElement.classList.toggle('menu-open');
    document.body.classList.toggle('menu-open');
  });
})();
