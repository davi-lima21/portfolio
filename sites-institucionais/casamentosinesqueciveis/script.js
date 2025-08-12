document.addEventListener("DOMContentLoaded", function() {

    // ======================================================
    // EFEITO DE SCROLL NA NAVBAR
    // ======================================================
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        function handleScroll() {
            if (window.scrollY > 50) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        }
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Verifica no carregamento da página
    }

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

            rafaelCollapseElement.addEventListener('show.bs.collapse', function () {
                btnText.textContent = 'Ver Menos';
                collapsibleTextContainer.classList.add('expanded');
            });

            rafaelCollapseElement.addEventListener('hide.bs.collapse', function () {
                btnText.textContent = 'Ver Mais';
                collapsibleTextContainer.classList.remove('expanded');
            });
        }
    }
    
    // ======================================================
    // NOVO: FECHA O MENU NAVBAR AO CLICAR EM UM LINK (MOBILE)
    // ======================================================
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    // Apenas executa se houver um menu colapsável
    if (navbarCollapse) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: false // Evita que o menu feche ao iniciar
        });

        navLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                // Verifica se o menu está aberto (visível na tela mobile)
                if (navbarCollapse.classList.contains('show')) {
                    // Usa o método da API do Bootstrap para fechar o menu
                    bsCollapse.hide();
                }
            });
        });
    }
});