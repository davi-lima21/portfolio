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

// CTA fixo: aparece depois do hero e some perto do checkout/rodapé
(function () {
  const cta = document.querySelector('.fixed-cta');
  const hero = document.querySelector('.hero');
  const checkout = document.querySelector('#checkout');
  const footer = document.querySelector('footer.footer-minimal');

  if (!cta || !hero) return;

  const getStopY = () => {
    // pega o primeiro que existir: checkout > footer
    if (checkout) {
      return checkout.getBoundingClientRect().top + window.scrollY;
    } else if (footer) {
      return footer.getBoundingClientRect().top + window.scrollY;
    }
    return Infinity;
  };

  const updateCta = () => {
    const heroHeight = hero.offsetHeight || 0;
    const triggerShow = heroHeight - 120;          // depois do hero
    const stopY = getStopY();                      // onde começa checkout/rodapé
    const viewportBottom = window.scrollY + window.innerHeight;
    const distanceToStop = stopY - viewportBottom; // se for pequeno, estamos embaixo

    // se estamos antes do hero -> não mostra
    if (window.scrollY <= triggerShow) {
      cta.classList.remove('is-visible');
      document.documentElement.style.setProperty('--fixed-cta-h', '0px');
      return;
    }

    // se estamos MUITO perto do checkout/rodapé -> não mostra
    // 80px = respiro para não encobrir CTA do checkout
    if (distanceToStop <= 80) {
      cta.classList.remove('is-visible');
      document.documentElement.style.setProperty('--fixed-cta-h', '0px');
      return;
    }

    // caso normal -> mostra
    cta.classList.add('is-visible');
    document.documentElement.style.setProperty('--fixed-cta-h', cta.offsetHeight + 'px');
  };

  updateCta();
  window.addEventListener('scroll', updateCta, { passive: true });
  window.addEventListener('resize', updateCta);
})();


// Melhorar a experiência de toque em dispositivos móveis
document.addEventListener('touchstart', function() {}, {passive: true});