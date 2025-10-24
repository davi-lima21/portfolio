// js/script.js

document.addEventListener('DOMContentLoaded', function () {
    // Inicializa a biblioteca Animate On Scroll (AOS)
    AOS.init({
        duration: 800, // Duração da animação em ms
        once: true,    // Animação acontece apenas uma vez
        offset: 50,    // Ativa a animação um pouco antes do elemento aparecer
    });

    // Adiciona classe 'scrolled' à navbar ao rolar a página
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});