/**
 * app.js
 * * Este script fecha o menu navbar (mobile) automaticamente 
 * quando um dos links de navegação é clicado.
 * * Também adiciona animações de "fade-in-up" quando os 
 * elementos entram na tela.
 */
document.addEventListener('DOMContentLoaded', () => {
  
  // --- LÓGICA DO NAVBAR (FECHAR AO CLICAR) ---

  // 1. Seleciona todos os links dentro do menu dropdown
  const navLinks = document.querySelectorAll('#nav .nav-link');
  
  // 2. Seleciona o elemento que colapsa (o menu em si)
  const navCollapseEl = document.getElementById('nav');

  // 3. Verifica se o elemento de colapso existe (boa prática)
  if (navCollapseEl) {
    
    // 4. Cria uma instância de Collapse do Bootstrap
    // Usamos { toggle: false } para apenas criar a instância, sem 
    // acionar o 'toggle' (abrir/fechar) imediatamente.
    const bsCollapse = new bootstrap.Collapse(navCollapseEl, {
      toggle: false
    });

    // 5. Adiciona um event listener de clique para CADA link do menu
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        
        // 6. Verifica se o menu está atualmente aberto (visível)
        // A classe 'show' é adicionada pelo Bootstrap quando o menu está aberto
        if (navCollapseEl.classList.contains('show')) {
          
          // 7. Se estiver aberto, usa o método .hide() para fechá-lo
          bsCollapse.hide();
        }
      });
    });
  }


  // --- LÓGICA DE ANIMAÇÃO AO ROLAR ---
  
  // 1. Seleciona todos os elementos que devem ser animados
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  // 2. Cria o observador
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Quando o elemento está 10% visível
      if (entry.isIntersecting) {
        // Adiciona a classe que dispara a animação
        entry.target.classList.add('is-visible');
        // (Opcional) Para de observar o elemento após animar
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1 // 10% do elemento precisa estar visível
  });

  // 3. Observa cada elemento
  animatedElements.forEach(el => {
    observer.observe(el);
  });
  // --- FIM DA LÓGICA DE ANIMAÇÃO ---

});