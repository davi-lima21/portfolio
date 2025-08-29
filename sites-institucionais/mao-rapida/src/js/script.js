/******************************
 * Navbar shrink + active link
 ******************************/
window.addEventListener('scroll', () => {
  const nav = document.querySelector('.nav-elevate');
  if (nav) {
    if (window.scrollY > 50) nav.classList.add('navbar-scrolled');
    else nav.classList.remove('navbar-scrolled');
  }
  highlightNav();
});

/******************************
 * Smooth scroll + close offcanvas
 ******************************/
document.querySelectorAll('[data-scroll]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // fecha o offcanvas se estiver aberto
      const off = document.getElementById('navMenu');
      if (off?.classList.contains('show')) {
        const oc = bootstrap.Offcanvas.getInstance(off) || new bootstrap.Offcanvas(off);
        oc.hide();
      }
    }
  });
});

/******************************
 * Destaque do link ativo
 ******************************/
function highlightNav() {
  const sections = ['#servicos', '#como-funciona', '#orcamento', '#pro', '#faq'];
  let current = null;
  const limiar = window.innerHeight * 0.25;

  sections.forEach(id => {
    const el = document.querySelector(id);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - limiar && rect.top > -(el.offsetHeight - limiar)) {
      current = id;
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
  if (current) {
    const link = document.querySelector(`.nav-link[href="${current}"]`);
    if (link) link.classList.add('active');
  }
}

/******************************
 * Reveal on scroll
 ******************************/
const revEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: .12 });
revEls.forEach(el => io.observe(el));

/******************************
 * Footer year
 ******************************/
const ano = document.getElementById('ano');
if (ano) ano.textContent = new Date().getFullYear();

/******************************
 * HERO fallback (se img falhar)
 ******************************/
(function ensureHeroBg() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  // Se a imagem não carregar, o gradiente/cor sólida do CSS já cobre.
  // Mantido como checagem leve.
  getComputedStyle(hero, '::before').backgroundImage;
})();

/******************************
 * ORÇAMENTO — versão CLEAN (novo)
 * Abre WhatsApp com a mensagem
 ******************************/
(function () {
  const form = document.getElementById('formOrcamentoSimple');
  if (!form) return fallbackLegacyForm(); // se o form novo não existe, usa o antigo abaixo

  const WA_NUMBER = '559999999999'; // <-- troque pelo seu número (com DDI/DDD)
  const phone   = document.getElementById('whatsapp');
  const msg     = document.getElementById('mensagem');
  const countEl = document.getElementById('count');
  const MAX = 300;

  // contador de caracteres
  const updateCount = () => {
    const len = (msg?.value || '').trim().length;
    if (countEl) countEl.textContent = Math.min(len, MAX);
    if (msg && len > MAX) msg.value = msg.value.slice(0, MAX);
  };
  msg?.addEventListener('input', updateCount);
  updateCount();

  // máscara simples de WhatsApp
  phone?.addEventListener('input', () => {
    let v = phone.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) phone.value = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) phone.value = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) phone.value = `(${v}`;
  });

  // helpers de validação
  function setInvalid(el, bad) {
    const wrap = el.closest('.field') || el.parentElement;
    if (!wrap) return;
    wrap.classList.toggle('is-invalid', !!bad);
  }
  form.querySelectorAll('input,select,textarea').forEach(el => {
    el.addEventListener('input', () => setInvalid(el, false));
    el.addEventListener('change', () => setInvalid(el, false));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;

    const requiredIds = ['servico', 'nome', 'whatsapp', 'local', 'urgencia', 'consent'];
    requiredIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const valid = el.type === 'checkbox' ? el.checked : !!el.value.trim();
      setInvalid(el, !valid);
      if (!valid) ok = false;
    });

    // valida número (mín. 10 dígitos)
    const digits = (phone?.value || '').replace(/\D/g, '');
    if (digits.length < 10) { setInvalid(phone, true); ok = false; }

    if (!ok) {
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // monta texto para WhatsApp
    const texto = [
      `Novo pedido de orçamento:`,
      `• Serviço: ${document.getElementById('servico').value}`,
      `• Nome: ${document.getElementById('nome').value}`,
      `• WhatsApp: ${phone.value}`,
      `• Local: ${document.getElementById('local').value}`,
      `• Urgência: ${document.getElementById('urgencia').value}`,
      `• Detalhes: ${(msg?.value || '—').trim()}`,
      `(Seleção do profissional pela equipe Mão Rápida)`
    ].join('\n');

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank'); // abre o WhatsApp

    // modal com link de backup
    const link = document.getElementById('waBackup');
    if (link) link.href = url;
    const okModal = new bootstrap.Modal('#pedidoOkModal');
    okModal.show();

    // limpa
    form.reset();
    updateCount();
    form.querySelectorAll('.is-invalid').forEach(n => n.classList.remove('is-invalid'));
  });

  // Se quiser: preenche serviço automaticamente ao vir de botões "Pedir orçamento"
  document.querySelectorAll('[data-service]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-service');
      const select = document.getElementById('servico');
      if (select && val) {
        select.value = val;
        setInvalid(select, false);
      }
    });
  });
})();

/******************************
 * Fallback: form legado (#formOrcamento)
 * Mantém seu comportamento antigo
 ******************************/
function fallbackLegacyForm() {
  const form = document.getElementById('formOrcamento');
  if (!form) return;

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const nome = document.getElementById('nome')?.value.trim() || '';
    const whatsapp = document.getElementById('whatsapp')?.value.trim() || '';
    const servico = document.getElementById('servico')?.value || '';
    const urgencia = document.getElementById('urgencia')?.value || '';
    const local = document.getElementById('local')?.value.trim() || '';
    const refs = document.getElementById('referencias')?.value.trim() || '';
    const mensagem = document.getElementById('mensagem')?.value.trim() || '';

    // Integração pode ser ligada aqui (WhatsApp/API)
    // const texto = `Pedido:
    // Nome: ${nome} | WhatsApp: ${whatsapp}
    // Serviço: ${servico} | Urgência: ${urgencia}
    // Local: ${local} | Refs: ${refs}
    // Desc: ${mensagem}`;
    // window.open(`https://wa.me/559999999999?text=${encodeURIComponent(texto)}`, '_blank');

    const okModal = new bootstrap.Modal('#pedidoOkModal');
    okModal.show();
    form.reset();
    form.classList.remove('was-validated');
  });
}
