// ============================
// UTILIDADES BÁSICAS
// ============================

// Helper de throttle pro scroll (evita travar no mobile)
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// ============================
// ELEMENTOS PRINCIPAIS
// ============================
const scrollProgress = document.getElementById('scrollProgress');
const navbar = document.querySelector('.main-navbar');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const floatingWhatsApp = document.getElementById('floatingWhatsApp');
const currentYearEl = document.getElementById('currentYear');

// Ano dinâmico no rodapé
if (currentYearEl) {
  currentYearEl.textContent = new Date().getFullYear();
}

// ============================
// BARRA DE PROGRESSO + NAVBAR SCROLLED + BOTÃO VOLTAR AO TOPO
// ============================
function handleScroll() {
  const scrollY = window.scrollY || window.pageYOffset;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

  // barra de progresso
  if (scrollProgress) {
    scrollProgress.style.width = progress + '%';
  }

  // navbar com fundo escuro
  if (navbar) {
    if (scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // botão de voltar ao topo
  if (scrollTopBtn) {
    if (scrollY > 350) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }
}

window.addEventListener('scroll', throttle(handleScroll, 20));
handleScroll(); // rodar uma vez no load

// ============================
// SCROLL SUAVE PARA ÂNCORAS
// ============================
function smoothScrollTo(targetSelector) {
  if (!targetSelector || targetSelector === '#') return;

  const target = document.querySelector(targetSelector);
  if (!target) return;

  // compensa o header fixo
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  const rect = target.getBoundingClientRect();
  const offsetTop = rect.top + window.pageYOffset - (navbarHeight + 10);

  window.scrollTo({
    top: offsetTop,
    behavior: 'smooth',
  });
}

// links com data-scroll
document.querySelectorAll('[data-scroll]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const selector = btn.getAttribute('data-scroll');
    smoothScrollTo(selector);
  });
});

// links de navegação que apontam pra seção com hash
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    const isToggle = link.getAttribute('data-bs-toggle');
    if (isToggle) return; // deixa o Bootstrap cuidar do toggler

    const targetId = href;
    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    smoothScrollTo(targetId);

    // fecha o menu mobile depois de clicar
    const navbarCollapse = document.getElementById('mainNav');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  });
});

// botão voltar ao topo
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// floating WhatsApp (se quiser rolar até o topo ou abrir link)
if (floatingWhatsApp) {
  floatingWhatsApp.addEventListener('click', (e) => {
    // se você for colocar link de Whats real, pode remover esse preventDefault
    // e apenas deixar o href="https://wa.me/..."
    e.preventDefault();
    // exemplo: rolar pro topo ou pra seção de contato
    smoothScrollTo('#contato');
  });
}

// ============================
// ANIMAÇÃO "APARECER AO ROLAR"
// ============================
const animatedEls = document.querySelectorAll('.animate-on-scroll');

if ('IntersectionObserver' in window && animatedEls.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.18,
    }
  );

  animatedEls.forEach((el) => {
    const animateType = el.getAttribute('data-animate');
    if (animateType) {
      // adiciona a classe fade-right / fade-left que você já usa no CSS
      el.classList.add(animateType);
    }
    observer.observe(el);
  });
} else {
  // fallback simples: se não tiver IntersectionObserver, mostra tudo
  animatedEls.forEach((el) => {
    const animateType = el.getAttribute('data-animate');
    if (animateType) el.classList.add(animateType);
    el.classList.add('in-view');
  });
}
