/**
 * Haife Media - app.js
 *
 * Contém:
 * 1. Inicialização do AOS (Animação ao Rolar)
 * 2. Lógica do Cursor Customizado
 * 3. Lógica do Carrossel Interativo no Hero
 * 4. Inicialização do Scrollspy (Menu Ativo)
 * 5. Navbar "Shrink" ao Rolar
 * 6. Autoplay/Pause de Vídeos do Portfólio (IntersectionObserver)
 * 7. Ano Dinâmico no Footer
 * 8. Validação e Simulação de Sucesso do Formulário de Contato
 * 9. ATUALIZAÇÃO: Fechar menu mobile ao clicar no link
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Inicializa o AOS (Animação ao Rolar)
  AOS.init({
    duration: 600, // Duração da animação
    once: true,    // Animar apenas uma vez
    offset: 50,    // Offset para disparar a animação
  });

  // 2. Lógica do Cursor Customizado
  const cursorDot = document.querySelector('[data-cursor]');
  const cursorOutline = document.querySelector('[data-cursor-outline]');
  
  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    // Posiciona o ponto central
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Posiciona a borda (com um leve atraso)
    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: 'forwards' });
  });

  // Adiciona classes ao passar por cima de links/botões
  const interactiveElements = 'a, button, .btn, .accordion-button, .work-card, .phone-arrow';
  document.querySelectorAll(interactiveElements).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorOutline.style.borderColor = 'var(--accent)';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorOutline.style.borderColor = 'rgba(123, 92, 255, 0.5)';
    });
  });

  // 3. Lógica do Carrossel Interativo no Hero
  const carouselContent = document.querySelector('.phone-carousel-content');
  const slides = document.querySelectorAll('.phone-video');
  const dots = document.querySelectorAll('.phone-dot');
  // Adicionado 'if (slides.length > 0)' para evitar erros se não houver slides
  if (carouselContent && slides.length > 0 && dots.length > 0) {
    const totalSlides = slides.length;
    let currentSlide = 0;
    let autoPlayInterval;

    function goToSlide(slideIndex) {
      // Pausa o vídeo antigo
      if (slides[currentSlide]) slides[currentSlide].pause();

      // Atualiza o índice
      currentSlide = (slideIndex + totalSlides) % totalSlides;
      
      // Move o carrossel
      carouselContent.style.transform = `translateX(-${currentSlide * 100}%)`;

      // Atualiza os dots
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });

      // Toca o vídeo novo
      if (slides[currentSlide]) {
        slides[currentSlide].play().catch(() => { /* ignora erro se o usuário não interagiu */ });
      }
    }

    // Controles
    document.getElementById('nextSlide').addEventListener('click', () => {
      goToSlide(currentSlide + 1);
      resetAutoPlay();
    });
    document.getElementById('prevSlide').addEventListener('click', () => {
      goToSlide(currentSlide - 1);
      resetAutoPlay();
    });

    // Autoplay
    function startAutoPlay() {
      autoPlayInterval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 5000); // Troca a cada 5 segundos
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    // Toca o primeiro vídeo (após uma pequena espera para carregar)
    setTimeout(() => {
      if (slides[0]) slides[0].play().catch(() => {});
    }, 500);
    startAutoPlay();
  }


  // 4. Inicialização do Scrollspy (Menu Ativo)
  const mainNav = document.getElementById('topNav');
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#topNav',
      offset: 100, // Ajusta o offset para o menu "shrink"
    });
  }

  // 5. Navbar "Shrink" ao Rolar
  const topNav = document.getElementById('topNav');
  if (topNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 10) {
        topNav.classList.add('shrink');
      } else {
        topNav.classList.remove('shrink');
      }
    });
  }

  // 6. Autoplay/Pause de Vídeos do Portfólio (IntersectionObserver)
  const portfolioVids = document.querySelectorAll('.work-video');
  const observerOptions = {
    threshold: 0.6 // Toca quando 60% do vídeo está visível
  };

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const vid = entry.target;
      if (entry.isIntersecting) {
        const p = vid.play();
        if (p !== undefined) { p.catch(() => {/* ignore */}); }
      } else {
        vid.pause();
      }
    });
  }, observerOptions);

  portfolioVids.forEach(vid => videoObserver.observe(vid));


  // 7. Ano Dinâmico no Footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 8. Validação e Simulação de Sucesso do Formulário de Contato
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault(); // Sempre previne o envio real
      event.stopPropagation();

      if (!contactForm.checkValidity()) {
        // Se for inválido, só adiciona a classe de validação
        contactForm.classList.add('was-validated');
      } else {
        // Se for válido, simula o sucesso
        contactForm.style.display = 'none'; // Esconde o formulário
        formSuccess.style.display = 'block'; // Mostra a msg de sucesso
      }
    }, false);
  }

  // 9. ATUALIZAÇÃO: Fecha o menu mobile ao clicar em um link
  const navLinks = document.querySelectorAll('.nav-link');
  const navToggler = document.querySelector('.navbar-toggler');
  
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Verifica se o toggler está visível (indicando modo mobile)
      // e se o menu está aberto (toggler NÃO tem a classe 'collapsed')
      if (navToggler.offsetParent !== null && !navToggler.classList.contains('collapsed')) {
        navToggler.click(); // Simula o clique no toggler para fechar o menu
      }
    });
  });

});

