/* DLR Web Studio — Interações e utilidades (estáveis e leves) */

// ScrollReveal (safe defaults)
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    distance: "24px",
    duration: 700,
    easing: "cubic-bezier(0.18,0.89,0.32,1.28)",
    interval: 80,
    cleanup: true
  });
  sr.reveal("[data-sr]");
}

// Botão flutuante: aparece após scroll e se esconde no #contato/rodapé
(function(){
  const floater = document.querySelector(".botao-flutuante");
  if (!floater) return;

  let forceHidden = false;

  const update = () => {
    if (forceHidden) {
      floater.classList.remove("is-visible");
      return;
    }
    floater.classList.toggle("is-visible", window.scrollY > 380);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });

  // Observa #contato e footer; se qualquer um estiver visível, esconde o botão
  const targets = [document.querySelector("#contato"), document.querySelector("footer")].filter(Boolean);
  if (targets.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      forceHidden = entries.some(e => e.isIntersecting);
      update();
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0 });
    targets.forEach(t => io.observe(t));
  }
})();


// Suaviza âncoras da navbar
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener("click", e=>{
    const id = a.getAttribute("href");
    const el = document.querySelector(id);
    if(el){
      e.preventDefault();
      const offset = 72; // altura da navbar
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({top:y, behavior:"smooth"});
    }
  });
});
