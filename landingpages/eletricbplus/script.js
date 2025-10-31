// Rolagem suave para seções
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const alvo = document.querySelector(link.getAttribute('href'));
    if (alvo) {
      window.scrollTo({ top: alvo.offsetTop - 70, behavior: 'smooth' });
    }
  });
});
