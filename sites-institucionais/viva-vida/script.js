// Ano no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Navbar: fechar ao clicar em um item (mobile) + overlay =====
// ===== Navbar: fechar no clique (mobile) e ao clicar fora =====
(function () {
  const collapseEl = document.getElementById('mainNav');
  const toggler = document.querySelector('.navbar-toggler');
  if (!collapseEl || !window.bootstrap || !toggler) return;

  const bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

  // Fecha quando clicar em qualquer link dentro do menu
  collapseEl.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const togglerVisible = getComputedStyle(toggler).display !== 'none';
    if (togglerVisible && collapseEl.classList.contains('show')) {
      bsCollapse.hide();
    }
  });

  // Fecha ao clicar fora do navbar (somente no mobile)
  document.addEventListener('click', (e) => {
    const togglerVisible = getComputedStyle(toggler).display !== 'none';
    if (!togglerVisible) return;
    const clickedInsideNav = !!e.target.closest('.navbar');
    if (!clickedInsideNav && collapseEl.classList.contains('show')) {
      bsCollapse.hide();
    }
  });
})();


// ===== Revelar ao rolar (suave) =====
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('vv-show');
      io.unobserve(e.target);
    }
  });
},{threshold:.14});

document.querySelectorAll('.vv-card, .stat, .mockup-card, .section-title')
  .forEach(el=>{
    el.classList.add('vv-reveal');
    io.observe(el);
  });

// animações CSS injetadas
(() => {
  const style = document.createElement('style');
  style.textContent = `
    .vv-reveal{opacity:0; transform:translateY(12px); transition:opacity .6s ease, transform .6s ease}
    .vv-show{opacity:1; transform:none}
  `;
  document.head.appendChild(style);
})();
