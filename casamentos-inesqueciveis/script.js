document.addEventListener("DOMContentLoaded", function() {

    // ======================================================
    // EFEITO PARALLAX (VERSÃO CORRIGIDA E EFICIENTE)
    // ======================================================
    const parallaxSection = document.querySelector('#parallax-services');
    if (parallaxSection) {
        const parallaxBg = parallaxSection.querySelector('.parallax-bg');
        if (parallaxBg) {
            window.addEventListener('scroll', function() {
                const sectionRect = parallaxSection.getBoundingClientRect();
                // Só executa o efeito quando a seção está visível
                if (sectionRect.top < window.innerHeight && sectionRect.bottom > 0) {
                    const speed = -0.3;
                    const movement = sectionRect.top * speed;
                    parallaxBg.style.transform = `translateY(${movement}px)`;
                }
            });
        }
    }

    // ======================================================
    // ANIMAÇÃO DE ENTRADA AO ROLAR (INTERSECTION OBSERVER)
    // ======================================================
    const revealElements = document.querySelectorAll('.animate-on-scroll, .reveal-on-scroll');
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ======================================================
    // FUNCIONALIDADE "VER MAIS" DA SEÇÃO SOBRE
    // ======================================================
    const rafaelCollapseElement = document.getElementById('rafaelTextCollapse');
    if (rafaelCollapseElement) {
        const verMaisBtn = document.querySelector('a[href="#rafaelTextCollapse"]');
        const collapsibleTextContainer = document.querySelector('.collapsible-text');

        if (verMaisBtn && collapsibleTextContainer) {
            const btnText = verMaisBtn.querySelector('.text');

            rafaelCollapseElement.addEventListener('show.bs.collapse', function() {
                if (btnText) btnText.textContent = 'Ver Menos';
                collapsibleTextContainer.classList.add('expanded');
            });

            rafaelCollapseElement.addEventListener('hide.bs.collapse', function() {
                if (btnText) btnText.textContent = 'Ver Mais';
                collapsibleTextContainer.classList.remove('expanded');
            });
        }
    }

    // ======================================================
    // FECHA O MENU NAVBAR AO CLICAR EM UM LINK (MOBILE)
    // ======================================================
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // ⚠️ Só cria o Collapse se o Bootstrap estiver carregado
    let bsCollapse = null;
    if (navbarCollapse && window.bootstrap && typeof window.bootstrap.Collapse === 'function') {
        bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });
    }

    if (navLinks.length > 0 && navbarCollapse) {
        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // se o menu está aberto e temos o collapse do bootstrap, fecha
                if (navbarCollapse.classList.contains('show') && bsCollapse) {
                    bsCollapse.hide();
                }
            });
        });
    }

    // ======================================================
    // FUNÇÃO PARA ENVIAR DADOS DO FORMULÁRIO PARA O WHATSAPP
    // (se o formulário existir na página)
    // ======================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // número atualizado
            const phoneNumber = '555499248998';

            const name = document.getElementById('nome')?.value || '';
            const email = document.getElementById('email')?.value || '';
            const eventDateInput = document.getElementById('data_evento')?.value || '';
            const message = document.getElementById('mensagem')?.value || '';

            let eventDate = "Não informada";
            if (eventDateInput) {
                const dateParts = eventDateInput.split('-');
                if (dateParts.length === 3) {
                    eventDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
                }
            }

            const whatsappMessage = `
Olá, Rafael! Gostaria de solicitar um orçamento.

*Nome:* ${name}
*Email:* ${email}
*Data do Evento:* ${eventDate}

*Mensagem:*
${message}
            `.trim();

            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

            window.open(whatsappURL, '_blank');
        });
    }

});
