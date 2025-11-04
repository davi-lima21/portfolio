// Aguarda o documento carregar completamente
document.addEventListener('DOMContentLoaded', () => {

  // Manipulador de envio do formulário
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      // Impede o envio real do formulário
      event.preventDefault(); 

      // Mensagem de feedback para o usuário
      alert('Cadastro enviado com sucesso! (Esta é uma demonstração, o formulário não está conectado a um servidor.)');

      // Opcional: Limpa o formulário após o "envio"
      // contactForm.reset();
    });
  }

  // Bônus: Ativa o link da navbar correspondente à seção visível
  const sections = document.querySelectorAll('section[id]');
  const navLi = document.querySelectorAll('.navbar-nav .nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 100) { // 100px offset
        current = section.getAttribute('id');
      }
    });

    navLi.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });

    // Caso especial para o topo (Hero)
    if (window.scrollY < 400) {
       document.querySelector('.navbar-nav .nav-link[href="#inicio"]').classList.add('active');
    }
  });

});