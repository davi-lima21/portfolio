document.addEventListener("DOMContentLoaded", function() {
    // Efeito de scroll na navbar
    const navbar = document.querySelector('.navbar');

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }

    // Adiciona o listener de scroll
    window.addEventListener('scroll', handleScroll);

    // Garante que a função seja chamada no carregamento da página caso ela já esteja rolada
    handleScroll();

    // --- EFEITO PARALLAX ---
    const parallaxBg = document.querySelector('#parallax-services .parallax-bg');

    // Apenas executa o parallax se o elemento existir
    if (parallaxBg) {
        window.addEventListener('scroll', function() {
            // Calcula o deslocamento do scroll
            let offset = window.pageYOffset;
            // Move o fundo na metade da velocidade do scroll para criar o efeito
            parallaxBg.style.transform = 'translateY(' + offset * 0.5 + 'px)';
        });
    }

    // --- ANIMAÇÃO DE ENTRADA AO ROLAR ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    // Apenas executa se houver elementos para animar
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                // Se o elemento está visível na tela
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Opcional: para de observar o elemento após a animação para otimizar
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 // A animação começa quando 10% do elemento está visível
        });

        // Pede ao observer para observar cada um dos elementos
        revealElements.forEach(element => {
            observer.observe(element);
        });
    }
});