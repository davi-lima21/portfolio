// Ano automático no rodapé
document.getElementById('year').textContent = new Date().getFullYear();

// Navbar sticky shadow
const nav = document.querySelector('.navbar');
function onScroll(){
  if (window.scrollY > 8) nav.classList.add('stuck'); else nav.classList.remove('stuck');
}
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// LightGallery
const lgEl = document.getElementById('lightgallery');
if (lgEl && typeof lightGallery === 'function') {
  lightGallery(lgEl, {
    selector: '.gallery-item',
    download: false,
    speed: 350
  });
}

/* OPCIONAL: ocultar a seção Planos sem remover do HTML
   — descomente a linha abaixo caso não queira exibir agora */

// document.getElementById('planos')?.classList.add('d-none');
