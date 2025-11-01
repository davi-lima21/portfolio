// Suaviza âncoras (scroll)
document.addEventListener('click', function(e){
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  const id = a.getAttribute('href');
  const el = document.querySelector(id);
  if(el){
    e.preventDefault();
    // Ajuste para mobile considerando a barra fixa
    const offset = window.innerWidth < 992 ? 80 : 0;
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
});

// Pequeno brilho no hover dos botões terracota
document.querySelectorAll('.btn-terra').forEach(btn=>{
  btn.addEventListener('mouseenter', ()=> btn.classList.add('hovering'));
  btn.addEventListener('mouseleave', ()=> btn.classList.remove('hovering'));
});

// Opcional: pausa/resume do carrossel ao focar
const quotesCarousel = document.querySelector('#quotesCarousel');
if (quotesCarousel){
  quotesCarousel.addEventListener('mouseenter', ()=> {
    const carousel = bootstrap.Carousel.getOrCreateInstance(quotesCarousel);
    carousel.pause();
  });
  quotesCarousel.addEventListener('mouseleave', ()=> {
    const carousel = bootstrap.Carousel.getOrCreateInstance(quotesCarousel);
    carousel.cycle();
  });
}

// Adicionar classe para animação de entrada dos elementos
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

// Observar elementos para animação
document.addEventListener('DOMContentLoaded', function() {
  const elementsToAnimate = document.querySelectorAll('.card-minimal, .method-graphic, .price-chip, .hero-figure');
  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });
});

// Melhorar a experiência de toque em dispositivos móveis
document.addEventListener('touchstart', function() {}, {passive: true});