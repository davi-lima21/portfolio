// Aguarda o conteúdo da página ser totalmente carregado para executar qualquer script.
// Este é o único "ouvinte" de DOMContentLoaded que precisamos.
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
        }, 4000); // 4000ms = 4 segundos
    }

    // --- LÓGICA HÍBRIDA PARA CARROSSEL DE PLAYERS ---
    function setupPlayerCarousel() {
        const carousel = document.querySelector('.logo-carousel');
        if (!carousel) return;
        if (window.innerWidth > 768) { // Desktop: Rolagem automática
            const originalCards = Array.from(carousel.children);
            if (originalCards.length > 0 && !carousel.hasAttribute('data-cloned')) {
                originalCards.forEach(card => {
                    const clone = card.cloneNode(true);
                    clone.setAttribute('aria-hidden', true);
                    carousel.appendChild(clone);
                });
                carousel.setAttribute('data-cloned', 'true');
            }
        } else { // Celular: Arrastar com o dedo
            let isDown = false;
            let startX;
            let scrollLeft;
            carousel.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - carousel.offsetLeft;
                scrollLeft = carousel.scrollLeft;
            });
            carousel.addEventListener('mouseleave', () => { isDown = false; });
            carousel.addEventListener('mouseup', () => { isDown = false; });
            carousel.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - carousel.offsetLeft;
                const walk = (x - startX) * 2;
                carousel.scrollLeft = scrollLeft - walk;
            });
            carousel.addEventListener('touchstart', (e) => {
                isDown = true;
                startX = e.touches[0].pageX - carousel.offsetLeft;
                scrollLeft = carousel.scrollLeft;
            }, { passive: true });
            carousel.addEventListener('touchend', () => { isDown = false; });
            carousel.addEventListener('touchmove', (e) => {
                if (!isDown) return;
                const x = e.touches[0].pageX - carousel.offsetLeft;
                const walk = (x - startX) * 2;
                carousel.scrollLeft = scrollLeft - walk;
            }, { passive: true });
        }
    }

    function setupStickyButton() {
    const stickyBtnWrapper = document.querySelector('.botao-fixo');
    const heroSection = document.querySelector('.hero-section'); // A seção que precisa ser rolada para o botão aparecer

    // Se os elementos não existirem, a função para.
    if (!stickyBtnWrapper || !heroSection) return;

    // Função que verifica a posição da rolagem
    function checkScroll() {
        // Pega a altura da seção hero
        const heroHeight = heroSection.offsetHeight;

        // Se a rolagem passar da metade da altura da seção hero, mostra o botão
        if (window.scrollY > heroHeight / 2) {
            stickyBtnWrapper.classList.add('is-visible');
        } else {
            stickyBtnWrapper.classList.remove('is-visible');
        }
    }

    // "Ouve" o evento de rolagem da página para executar a verificação
    window.addEventListener('scroll', checkScroll);
}

    // --- LÓGICA PARA A SEÇÃO DE CASOS DE USO ---
    function setupUseCases() {
        const navButtons = document.querySelectorAll('.use-case-button');
        if (!navButtons.length) return;
        const imageSlides = document.querySelectorAll('.use-case-image');
        const textSlides = document.querySelectorAll('.use-case-text');
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                const activeCase = button.dataset.case;
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                imageSlides.forEach(image => image.classList.toggle('active', image.dataset.case === activeCase));
                textSlides.forEach(text => text.classList.toggle('active', text.dataset.case === activeCase));
            });
        });
        const initialButton = document.querySelector('.use-case-button[data-case="atendimento"]');
        if (initialButton) {
            initialButton.click();
        } else {
            navButtons[0].click();
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

    setupHeroSlider(); // NOVA função para o cabeçalho
    setupPlayerCarousel();
    setupUseCases();
    setupTestimonials();
    setupStickyButton();

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

// ======================================================
// 3. EVENT LISTENERS GLOBAIS
// ======================================================

// Recarrega a página ao redimensionar para garantir a lógica correta (desktop vs. mobile)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        window.location.reload();
    }, 250);
});