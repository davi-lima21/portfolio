document.addEventListener('DOMContentLoaded', function() {

    // Initialize AOS (Animate on Scroll)
    // This function adds 'fade' animations to elements as you scroll down.
    AOS.init({
        duration: 1000,      // Animation duration in milliseconds
        easing: 'ease-in-out', // Type of easing
        once: true,          // Whether animation should happen only once
        mirror: false,       // Whether elements should animate out while scrolling past them
        anchorPlacement: 'top-bottom', // Defines which position of the element regarding to window should trigger the animation
    });

    // Handle header style change on scroll
    const header = document.getElementById('header');
    
    // This function checks the scroll position. If the user has scrolled down
    // more than 50 pixels, it adds the 'scrolled' class to the header.
    // This class makes the header smaller and gives it a semi-transparent background.
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Add an event listener to the window to call handleScroll whenever the user scrolls.
    window.addEventListener('scroll', handleScroll);

      const navLinks = document.querySelectorAll('#navbarNav .nav-link');
    
    // 2. Seleciona o elemento do menu em si
    const menuCollapseElement = document.getElementById('navbarNav');
    
    // 3. Cria uma instância do componente "Collapse" do Bootstrap para podermos controlá-lo
    //    A opção { toggle: false } previne que ele abra ou feche na inicialização do script.
    const bsCollapse = new bootstrap.Collapse(menuCollapseElement, {
      toggle: false
    });
    
    // 4. Adiciona um "escutador de eventos" para cada link do menu
    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        // 5. Verifica se o menu está visível (aberto) antes de tentar fechar
        //    Isso evita rodar o código desnecessariamente em telas de desktop
        if (menuCollapseElement.classList.contains('show')) {
            // 6. Chama o método .hide() da API do Bootstrap para fechar o menu
            bsCollapse.hide();
        }
      });
    });

});
