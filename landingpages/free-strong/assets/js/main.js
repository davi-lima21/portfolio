(function(){
  const $  = (s,ctx=document)=>ctx.querySelector(s);
  const $$ = (s,ctx=document)=>Array.from(ctx.querySelectorAll(s));

  const baseCheckout = document.body.getAttribute('data-checkout') || '#';
  const whatsNumber  = document.body.getAttribute('data-whats') || '';
  const utm          = window.location.search || '';

  // Atribui UTM aos CTAs
  $$('.js-checkout').forEach(a => a.href = baseCheckout + utm);

  // WhatsApp (flutuante)
  const wa = $('#float-whats');
  if(wa && whatsNumber){
    const msg = encodeURIComponent('Olá! Quero assinar a jornada FREE & STRONG.');
    wa.href = `https://wa.me/${whatsNumber}?text=${msg}`;
  } else if(wa){
    wa.style.display = 'none';
  }

  // Navbar: transparente só no topo do hero; sólida ao rolar
  const navbar = $('#navbar');
  const setNavState = () => {
    if(window.scrollY > 10){
      navbar.classList.remove('nav-transparent');
      navbar.classList.add('nav-solid');
    } else {
      // Transparente apenas sobre o hero escuro
      navbar.classList.remove('nav-solid');
      navbar.classList.add('nav-transparent');
    }
  };
  document.addEventListener('scroll', setNavState, {passive:true});
  setNavState();

  // Scroll suave em âncoras
  $$('a[href^="#"]').forEach(link=>{
    link.addEventListener('click', e=>{
      const id = link.getAttribute('href');
      if(id.length>1 && $(id)){
        e.preventDefault();
        $(id).scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Ano no rodapé
  const yearEl = $('#year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Navbar: sólido no mobile; alterna no desktop
const nav = document.getElementById('navbar');
function updateNav(){
  if(!nav) return;
  const desktop = window.innerWidth >= 992;

  if(desktop){
    if(window.scrollY > 10){
      nav.classList.add('nav-solid');
      nav.classList.remove('nav-transparent');
    }else{
      nav.classList.add('nav-transparent');
      nav.classList.remove('nav-solid');
    }
  }else{
    // MOBILE: sempre sólido
    nav.classList.add('nav-solid');
    nav.classList.remove('nav-transparent');
  }
}
window.addEventListener('scroll', updateNav, {passive:true});
window.addEventListener('resize', updateNav);
updateNav();


})();
