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

// --- LÓGICA PARA CARROSSEL DE PLAYERS (SEMPRE AUTOMÁTICO) ---
function setupPlayerCarousel() {
    const carousel = document.querySelector('.logo-carousel');
    if (!carousel) return;

    // A lógica agora é a mesma para todos os dispositivos: duplicar os cards.
    const originalCards = Array.from(carousel.children);
    if (originalCards.length > 0 && !carousel.hasAttribute('data-cloned')) {
        originalCards.forEach(card => {
            const clone = card.cloneNode(true);
            clone.setAttribute('aria-hidden', true);
            carousel.appendChild(clone);
        });
        carousel.setAttribute('data-cloned', 'true');
    }
}
    // --- LÓGICA PARA O BOTÃO FIXO QUE APARECE COM A ROLAGEM ---
    function setupStickyButton() {
        const stickyBtnWrapper = document.querySelector('.botao-fixo');
        const heroSection = document.querySelector('.hero-section');
        if (!stickyBtnWrapper || !heroSection) return;
        function checkScroll() {
            const heroHeight = heroSection.offsetHeight;
            if (window.scrollY > heroHeight / 2) {
                stickyBtnWrapper.classList.add('is-visible');
            } else {
                stickyBtnWrapper.classList.remove('is-visible');
            }
        }
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

    setupHeroSlider();
    setupPlayerCarousel();
    setupStickyButton();
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