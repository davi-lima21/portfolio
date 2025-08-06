document.addEventListener('DOMContentLoaded', function() {

    // Initialize AOS (Animate on Scroll)
    AOS.init({
        duration: 500,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom',
    });

    // Handle header style change on scroll
    const header = document.getElementById('header');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Add an event listener to the window to call handleScroll whenever the user scrolls.
    window.addEventListener('scroll', handleScroll);

    // =======================================================================
    // A CORREÇÃO ESTÁ AQUI 👇
    // Chame a função uma vez no carregamento para definir o estado inicial
    handleScroll();
    // =======================================================================

    // --- CÓDIGO PARA FECHAR O NAVBAR AO CLICAR EM UM LINK ---
    const navLinks = document.querySelectorAll('#navbarNav .nav-link');
    const menuCollapseElement = document.getElementById('navbarNav');
    const bsCollapse = new bootstrap.Collapse(menuCollapseElement, {
      toggle: false
    });
    
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (menuCollapseElement.classList.contains('show')) {
            bsCollapse.hide();
        }
      });
    });

});