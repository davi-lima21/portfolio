/* =========================================================
   Flow Mobility Express — app.js
   Interações, CTA fixa e melhorias de UX
   ========================================================= */

// -----------------------------
// Suaviza âncoras (scroll)
// -----------------------------
document.addEventListener('click', function (e) {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;

  const id = a.getAttribute('href');
  if (!id || id === '#') return;

  const el = document.querySelector(id);
  if (el) {
    e.preventDefault();

    // Usa a altura real da CTA fixa (quando existir), senão 0
    const fixedCtaH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--fixed-cta-h')
    ) || 0;

    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - (window.innerWidth < 992 ? fixedCtaH + 8 : 0);

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
});

// ---------------------------------------------
// Pequeno “brilho” no hover dos botões terracota
// (classe .hovering já tratada no CSS, se desejar)
// ---------------------------------------------
(function () {
  const terracotas = document.querySelectorAll('.btn-terra');
  terracotas.forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.classList.add('hovering'));
    btn.addEventListener('mouseleave', () => btn.classList.remove('hovering'));
  });
})();

// ---------------------------------------------------
// Pausa/resume do carrossel de depoimentos no hover
// ---------------------------------------------------
(function () {
  const quotesCarousel = document.querySelector('#quotesCarousel');
  if (!quotesCarousel || typeof bootstrap === 'undefined') return;

  const instance = bootstrap.Carousel.getOrCreateInstance(quotesCarousel, {
    interval: 5000,
    ride: false,
    pause: false,
    touch: true,
    wrap: true
  });

  quotesCarousel.addEventListener('mouseenter', () => instance.pause());
  quotesCarousel.addEventListener('mouseleave', () => instance.cycle());
})();

// ----------------------------------------------------------
// Animação de entrada suave para elementos ao entrar na tela
// ----------------------------------------------------------
(function () {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.addEventListener('DOMContentLoaded', function () {
    const elementsToAnimate = document.querySelectorAll(
      '.card-minimal, .method-graphic, .price-chip, .hero-figure, .product-mockups, .plan-card'
    );
    elementsToAnimate.forEach(el => observer.observe(el));
  });
})();

// ------------------------------------------------------------------
// CTA fixo (mobile): aparece no bottom e some perto do checkout/rodapé
// ------------------------------------------------------------------
(function () {
  const cta = document.querySelector('.fixed-cta');
  const checkout = document.querySelector('#checkout');
  const footer = document.querySelector('footer.footer-minimal');

  if (!cta) return;

  const getStopY = () => {
    // Ponto onde a CTA deve sumir (começo do checkout; se não houver, o footer)
    if (checkout) return checkout.getBoundingClientRect().top + window.scrollY;
    if (footer) return footer.getBoundingClientRect().top + window.scrollY;
    return Infinity;
  };

  const showCTA = () => {
    cta.classList.add('is-visible');
    // Reserva espaço inferior para não esconder conteúdo
    document.documentElement.style.setProperty('--fixed-cta-h', cta.offsetHeight + 'px');
  };

  const hideCTA = () => {
    cta.classList.remove('is-visible');
    document.documentElement.style.setProperty('--fixed-cta-h', '0px');
  };

  const shouldHide = () => {
    // Desktop nunca mostra (o CSS já esconde), só tratamos mobile
    if (window.innerWidth >= 992) return true;

    const stopY = getStopY();
    const viewportBottom = window.scrollY + window.innerHeight;
    const distanceToStop = stopY - viewportBottom;

    // Quando a borda inferior da viewport chega perto do checkout/rodapé,
    // escondemos a CTA para não cobrir o botão final (80px de respiro).
    return distanceToStop <= 80;
  };

  const update = () => {
    if (shouldHide()) {
      hideCTA();
    } else {
      showCTA();
    }
  };

  document.addEventListener('DOMContentLoaded', update);
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
})();

// -------------------------------------------------------
// Melhor UX de toque em dispositivos móveis (passive)
// -------------------------------------------------------
document.addEventListener('touchstart', function () { }, { passive: true });
