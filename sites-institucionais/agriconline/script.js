// script.js — AgricOnline
document.addEventListener('DOMContentLoaded', () => {
  /* ======================================================
     1. Navbar: muda cor ao rolar
  ====================================================== */
  const nav = document.querySelector('.navbar-agri');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll);
    onScroll(); // força estado inicial
  }

  /* ======================================================
     2. Toggler custom (hambúrguer -> X)
  ====================================================== */
  const toggler = document.querySelector('.custom-toggler');
  // tenta pegar o collapse por id (pode ser navbarAgri OU mainNav)
  const collapseEl =
    document.getElementById('navbarAgri') ||
    document.getElementById('mainNav');

  if (toggler && collapseEl) {
    // eventos do Bootstrap
    collapseEl.addEventListener('show.bs.collapse', () => {
      toggler.classList.add('active');
    });
    collapseEl.addEventListener('hide.bs.collapse', () => {
      toggler.classList.remove('active');
    });
  }

  /* ======================================================
     3. Dropdown no hover (desktop) e click (mobile)
     Use .dropdown-on-hover no <li>
  ====================================================== */
  const DESKTOP_BREAKPOINT = 992; // mesmo do Bootstrap
  const dropdownParents = document.querySelectorAll('.dropdown-on-hover');

  dropdownParents.forEach(parent => {
    const trigger = parent.querySelector('[data-bs-toggle="dropdown"]');
    const menu = parent.querySelector('.dropdown-menu');

    if (!trigger || !menu) return;

    // hover só no desktop
    parent.addEventListener('mouseenter', () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        const bsDropdown = bootstrap.Dropdown.getOrCreateInstance(trigger);
        bsDropdown.show();
      }
    });

    parent.addEventListener('mouseleave', () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) {
        const bsDropdown = bootstrap.Dropdown.getOrCreateInstance(trigger);
        bsDropdown.hide();
      }
    });

    // no mobile deixa o click normal do Bootstrap
  });

  /* ======================================================
     4. FAQ com animação suave (max-height)
  ====================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length) {
    faqItems.forEach((item, index) => {
      const btn = item.querySelector('.faq-btn');
      const body = item.querySelector('.faq-body');

      if (!btn || !body) return;

      // primeiro já aberto
      if (index === 0) {
        item.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      } else {
        body.style.maxHeight = null;
      }

      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // fecha todos primeiro
        faqItems.forEach(other => {
          const otherBody = other.querySelector('.faq-body');
          other.classList.remove('active');
          if (otherBody) {
            otherBody.style.maxHeight = null;
          }
        });

        // se o clicado não estava aberto, abre agora
        if (!isOpen) {
          item.classList.add('active');
          body.style.maxHeight = body.scrollHeight + 'px';
        }
        // se já estava aberto, ele só fecha (não reabre)
      });
    });

    // recalcula alturas se a pessoa redimensionar
    window.addEventListener('resize', () => {
      const current = document.querySelector('.faq-item.active .faq-body');
      if (current) {
        current.style.maxHeight = current.scrollHeight + 'px';
      }
    });
  }

  /* ======================================================
     5. Formulário de contato fake (somente UX)
  ====================================================== */
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('form-message');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      formMessage.innerHTML = `
        <div class="alert alert-success mb-0" role="alert">
          <strong>Mensagem enviada!</strong> Em breve nossa equipe entra em contato.
        </div>
      `;

      contactForm.reset();

      setTimeout(() => {
        formMessage.innerHTML = '';
      }, 5000);
    });
  }

  // 4. Abas dos cursos
const courseTabs = document.querySelectorAll('.courses-tab');
const coursePanels = document.querySelectorAll('.courses-panel');

courseTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.getAttribute('data-tab');

    // ativa botão
    courseTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // mostra painel
    coursePanels.forEach(panel => {
      if (panel.getAttribute('data-panel') === target) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  });
});


 const items = document.querySelectorAll('.testimonial-item');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const prev = document.querySelector('.testimonial-prev');
  const next = document.querySelector('.testimonial-next');

  if (!items.length) return;

  let current = 0;

  function showTestimonial(index) {
    items.forEach((el, i) => {
      el.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    current = index;
  }

  function nextTestimonial() {
    const nextIndex = (current + 1) % items.length;
    showTestimonial(nextIndex);
  }

  function prevTestimonial() {
    const prevIndex = (current - 1 + items.length) % items.length;
    showTestimonial(prevIndex);
  }

  // botões
  if (next) next.addEventListener('click', nextTestimonial);
  if (prev) prev.addEventListener('click', prevTestimonial);

  // dots
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => showTestimonial(i));
  });

  // autoplay leve
  setInterval(nextTestimonial, 8000);

});
