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
// ====================================================== //
// --- Carrossel contínuo (ticker) com rAF + arraste --- //
// ====================================================== //
function setupCarouselAnimation() {
    const track = document.querySelector('.logo-carousel');
    if (!track) return;

    const viewport = track.parentElement || track; // wrapper imediato
    // Garantias de estilo para o efeito
    viewport.style.overflow = 'hidden';
    track.style.display = 'flex';
    track.style.willChange = 'transform';
    track.style.transform = 'translateX(0px)';
    track.style.animation = 'none'; // cancela possíveis animações de CSS

    let x = 0;                        // deslocamento atual em px
    let paused = false;               // pausa automática (hover/drag)
    let isDragging = false;           // estado de arraste
    let startX = 0;                   // posição inicial do ponteiro
    let startOffsetX = 0;             // offset no começo do drag
    let lastTime = null;              // timestamp do último frame
    let gap = getGap(track);          // gap entre itens (px)
    let speed = getSpeed();           // px/s conforme viewport

    // 1) Garantir conteúdo suficiente (>= 2x viewport) clonando itens
    const originals = Array.from(track.children);
    ensureFilled();

    // 2) Loop de animação
    function tick(ts) {
        if (lastTime == null) lastTime = ts;
        const dt = (ts - lastTime) / 1000; // em segundos
        lastTime = ts;

        if (!paused && !isDragging) {
            x -= speed * dt;
        }

        // Se o primeiro item saiu inteiro pela esquerda, empurra para o fim
        let first = track.firstElementChild;
        while (first && x <= -(first.offsetWidth + gap)) {
            x += first.offsetWidth + gap;
            track.appendChild(first);
            first = track.firstElementChild;
        }

        // Se arrastando para a direita e x > 0, puxa o último para frente
        let last = track.lastElementChild;
        while (last && x > 0) {
            x -= last.offsetWidth + gap;
            track.insertBefore(last, track.firstElementChild);
            last = track.lastElementChild;
        }

        track.style.transform = `translateX(${x}px)`;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // 3) Interações: pausa no hover (desktop) e arraste (mobile/desktop)
    track.addEventListener('mouseenter', () => paused = true);
    track.addEventListener('mouseleave', () => paused = false);

    track.addEventListener('pointerdown', (e) => {
        isDragging = true;
        paused = true;
        startX = e.clientX;
        startOffsetX = x;
        try { track.setPointerCapture(e.pointerId); } catch {}
        track.style.cursor = 'grabbing';
    });

    track.addEventListener('pointermove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        x = startOffsetX + dx;
    });

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        paused = false;
        try { track.releasePointerCapture(e.pointerId); } catch {}
        track.style.cursor = '';
    }
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('pointerleave', () => { if (isDragging) { isDragging = false; paused = false; } });

    // 4) Responsividade
    let resizeTO;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTO);
        resizeTO = setTimeout(() => {
            gap = getGap(track);
            speed = getSpeed();
            // Repreenche se faltar conteúdo após mudança de layout
            ensureFilled();
        }, 150);
    });

    // ————— Helpers —————
    function getGap(el) {
        const cs = getComputedStyle(el);
        // flex-gap pode vir em 'gap', 'columnGap' dependendo do navegador
        return parseFloat(cs.gap || cs.columnGap || 0) || 0;
    }

    function getSpeed() {
        // Ajuste fino de velocidade: px/s (mais rápido no mobile se quiser)
        return window.innerWidth <= 768 ? 50 : 70;
    }

    function calcContentWidth() {
        const children = Array.from(track.children);
        if (children.length === 0) return 0;
        // soma das larguras + gaps intermediários
        let total = 0;
        for (let i = 0; i < children.length; i++) {
            total += children[i].offsetWidth;
            if (i < children.length - 1) total += gap;
        }
        return total;
    }

    function ensureFilled() {
        const viewportWidth = viewport.clientWidth || window.innerWidth;
        let contentWidth = calcContentWidth();
        let i = 0;

        // garante pelo menos 2x a largura do viewport (para loop suave)
        while (contentWidth < viewportWidth * 2 && i < 20) {
            originals.forEach(card => {
                const clone = card.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                track.appendChild(clone);
            });
            contentWidth = calcContentWidth();
            i++;
        }
    }
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
    setupCarouselAnimation();
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