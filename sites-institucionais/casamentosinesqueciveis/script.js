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
                    // Move o fundo para cima mais devagar que a rolagem
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
        if (verMaisBtn) { // Adiciona verificação para o caso de o botão não existir
            const btnText = verMaisBtn.querySelector('.text');
            const collapsibleTextContainer = document.querySelector('.collapsible-text');

            rafaelCollapseElement.addEventListener('show.bs.collapse', function() {
                btnText.textContent = 'Ver Menos';
                collapsibleTextContainer.classList.add('expanded');
            });

            rafaelCollapseElement.addEventListener('hide.bs.collapse', function() {
                btnText.textContent = 'Ver Mais';
                collapsibleTextContainer.classList.remove('expanded');
            });
        }
    }

    // ======================================================
    // FECHA O MENU NAVBAR AO CLICAR EM UM LINK (MOBILE)
    // ======================================================
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarCollapse) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false
        });

        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                if (navbarCollapse.classList.contains('show')) {
                    bsCollapse.hide();
                }
            });
        });
    }

    // ======================================================
    // FUNÇÃO PARA ENVIAR DADOS DO FORMULÁRIO PARA O WHATSAPP
    // ======================================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // 1. Previne o comportamento padrão do formulário
            event.preventDefault();

            // 2. NÚMERO DE WHATSAPP ATUALIZADO
            const phoneNumber = '555499248998'; // Número correto

            // 3. Pega os valores preenchidos nos campos
            const name = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const eventDateInput = document.getElementById('data_evento').value;
            const message = document.getElementById('mensagem').value;

            // 4. Formata a data para (DD/MM/AAAA)
            let eventDate = "Não informada";
            if (eventDateInput) {
                const dateParts = eventDateInput.split('-');
                eventDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
            }

            // 5. Cria o texto da mensagem
            const whatsappMessage = `
Olá, Rafael! Gostaria de solicitar um orçamento.

*Nome:* ${name}
*Email:* ${email}
*Data do Evento:* ${eventDate}

*Mensagem:*
${message}
            `.trim();

            // 6. Codifica a mensagem para a URL
            const encodedMessage = encodeURIComponent(whatsappMessage);

            // 7. Cria o link final do WhatsApp
            const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;

            // 8. Abre o WhatsApp em uma nova aba
            window.open(whatsappURL, '_blank');
        });
    }

});