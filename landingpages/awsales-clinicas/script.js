// Aguarda o conteúdo da página ser totalmente carregado para executar qualquer script.
document.addEventListener("DOMContentLoaded", function () {

    // ======================================================
    // 1. DEFINIÇÕES DAS FUNÇÕES
    // ======================================================

    // --- Lógica para o Slider do Cabeçalho (Hero) ---
    function setupHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length === 0) return;
        let currentSlide = 0;
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }
        showSlide(currentSlide);
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }, 4000);
    }

    // —————————————————————————————————————————————
    // setupPlayerCarousel: Auto‑slide móvel de 3s + arraste
    // —————————————————————————————————————————————
// ====================================================== //
// --- Lógica para o Carrossel de Players (Slide Automático Inteligente) --- //
// ====================================================== //

function setupPlayerCarousel() {
    const carousel = document.querySelector('.logo-carousel');
    if (!carousel) return;

    let autoSlideInterval; // Variável para controlar o intervalo

    // 1. Duplica os cards para criar um loop infinito e contínuo
    function cloneCards() {
        if (!carousel.hasAttribute('data-cloned')) {
            const cards = Array.from(carousel.children);
            cards.forEach(card => {
                const clone = card.cloneNode(true);
                clone.setAttribute('aria-hidden', true);
                carousel.appendChild(clone);
            });
            carousel.setAttribute('data-cloned', 'true');
        }
    }

    // 2. Lógica do slide automático
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            const firstCard = carousel.querySelector('.player-card');
            if (!firstCard) return;

            const gap = parseInt(getComputedStyle(carousel).gap) || 0;
            const cardWidth = firstCard.offsetWidth + gap;

            // Move o scroll para a direita pelo tamanho de um card
            carousel.scrollBy({ left: cardWidth, behavior: 'smooth' });

            // Se o scroll estiver perto do final (na metade da área clonada),
            // reseta para o início sem animação para criar o loop
            if (carousel.scrollLeft >= carousel.scrollWidth / 2) {
                setTimeout(() => {
                    carousel.scrollTo({ left: 0, behavior: 'auto' });
                }, 500); // Espera a animação de scroll terminar
            }
        }, 2000); // Troca a cada 3 segundos (3000ms)
    }

    // 3. Pausa a animação com o mouse
    const carouselContainer = document.querySelector('.logo-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        carouselContainer.addEventListener('mouseleave', () => startAutoSlide());
    }

    // Inicia tudo
    cloneCards();
    startAutoSlide();
}

    function setupFloatingButton() {
        const floatingButton = document.querySelector('.botao-flutuante');
        // Aparece depois que o usuário rolar 400 pixels para baixo
        const scrollThreshold = 400;

        if (!floatingButton) return;

        function checkScroll() {
            if (window.scrollY > scrollThreshold) {
                floatingButton.classList.add('is-visible');
            } else {
                floatingButton.classList.remove('is-visible');
            }
        }
        window.addEventListener('scroll', checkScroll);
    }


    // ====================================================== //
    // --- Lógica para a Seção de Casos de Uso (Híbrida) --- //
    // ====================================================== //

    function setupUseCases() {
        const allNavButtons = document.querySelectorAll('.use-case-button');
        if (!allNavButtons.length) return;

        const imageSlides = document.querySelectorAll('.use-case-image');
        const textSlides = document.querySelectorAll('.use-case-text');
        let useCaseInterval; // Variável para controlar o autoplay

        // Função centralizada que troca o conteúdo
        function switchContentTo(caseName) {
            allNavButtons.forEach(btn => {
                btn.classList.toggle('active', btn.dataset.case === caseName);
            });
            imageSlides.forEach(image => image.classList.toggle('active', image.dataset.case === caseName));
            textSlides.forEach(text => text.classList.toggle('active', text.dataset.case === caseName));
        }

        // Adiciona o evento de clique para TODOS os botões
        allNavButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                // AQUI ESTÁ A MÁGICA: O autoplay é parado em qualquer clique manual
                clearInterval(useCaseInterval);
                switchContentTo(button.dataset.case);
            });
        });

        // --- Lógica Responsiva ---
        if (window.innerWidth <= 992) {
            // CELULAR: Inicia com autoplay
            const mobileNavButtons = Array.from(document.querySelectorAll('.use-cases-nav-mobile .use-case-button'));
            let currentIndex = 0;

            if (mobileNavButtons.length > 0) {
                switchContentTo(mobileNavButtons[currentIndex].dataset.case);
            }

            useCaseInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % mobileNavButtons.length;
                switchContentTo(mobileNavButtons[currentIndex].dataset.case);
            }, 4000); // Troca a cada 4 segundos

        } else {
            // DESKTOP: Apenas define o slide inicial (controle manual)
            switchContentTo('vendas');
        }
    }

    // --- LÓGICA RESPONSIVA PARA DEPOIMENTOS ---
    function setupTestimonials() {
        const scroller = document.querySelector('.testimonials-scroller');
        if (!scroller) return;
        if (window.innerWidth > 768) { // Desktop: Carrossel
            const cards = Array.from(scroller.children);
            if (cards.length > 0 && !scroller.hasAttribute('data-cloned')) {
                cards.forEach(card => {
                    const clone = card.cloneNode(true);
                    clone.setAttribute('aria-hidden', true);
                    scroller.appendChild(clone);
                });
                scroller.setAttribute('data-cloned', 'true');
            }
        } else { // Celular: Animação vertical
            ScrollReveal().reveal('.testimonial-card', {
                origin: 'bottom',
                distance: '40px',
                duration: 800,
                easing: 'cubic-bezier(0.5, 0, 0, 1)',
                interval: 150,
                reset: false
            });
        }
    }

    // ======================================================
    // 2. INICIALIZAÇÃO E CHAMADAS DAS FUNÇÕES
    // ======================================================

    setupHeroSlider();
    setupPlayerCarousel();
    setupFloatingButton();
    setupUseCases();
    setupTestimonials();

    // ScrollReveal geral para os outros elementos
    ScrollReveal().reveal('[data-sr]', {
        origin: 'bottom',
        distance: '40px',
        duration: 800,
        easing: 'cubic-bezier(0.5, 0, 0, 1)',
        interval: 100,
        reset: false
    });

});

// O bloco de código de "resize" que causava o problema foi completamente removido.