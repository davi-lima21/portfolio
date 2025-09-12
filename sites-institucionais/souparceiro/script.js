// script.js (v7 — correções + filtros; sem erros se #year não existir)
(() => {
  'use strict';

  const toTop = document.getElementById('toTop');
  const filtersBar = document.getElementById('filtros-bar');
  const filtersAnchor = document.getElementById('filtros-ancora');
  const grid = document.getElementById('gridEventos');
  const searchInput = document.getElementById('searchInput');
  const citySelect = document.getElementById('citySelect');
  const chipsWrap = document.getElementById('categoryChips');
  const countBadge = document.getElementById('countBadge');
  const noResults = document.getElementById('noResults');

  // Ano no rodapé (se existir)
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Back-to-top
  const onScroll = () => {
    toTop.style.display = window.scrollY > 300 ? 'inline-flex' : 'none';
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // Sticky visual quando o bloco encostar no topo
  if (filtersAnchor && filtersBar) {
    const observer = new IntersectionObserver(
      ([e]) => filtersBar.classList.toggle('is-sticky', e.intersectionRatio < 1),
      { threshold: [1] }
    );
    observer.observe(filtersAnchor);
  }

  // --------- BUSCA + FILTROS ----------
  const cards = [...grid.querySelectorAll('.event-col')].map(col => {
    const a = col.querySelector('a');
    const img = col.querySelector('.bg-img');
    // Garante uma imagem default se não vier no inline style
    if (img && !img.style.getPropertyValue('--img')) {
      img.style.setProperty('--img', "url('https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?q=80&w=1200&auto=format&fit=crop')");
    }
    return {
      col,
      title: (a.dataset.title || '').toLowerCase(),
      category: (a.dataset.category || '').toLowerCase(),
      city: (a.dataset.city || '')
    };
  });

  // Popular cidades
  const cities = [...new Set(cards.map(c => c.city))].sort((a,b)=>a.localeCompare(b));
  cities.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    citySelect.appendChild(opt);
  });

  let activeCategory = 'all';

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const city = citySelect.value;
    let visible = 0;

    cards.forEach(c => {
      const matchTitle = !q || c.title.includes(q);
      const matchCity  = city === 'all' || c.city === city;
      const matchCat   = activeCategory === 'all' || c.category === activeCategory;

      const show = matchTitle && matchCity && matchCat;
      c.col.classList.toggle('d-none', !show);
      if (show) visible++;
    });

    countBadge.textContent = `${visible} ${visible === 1 ? 'evento' : 'eventos'}`;
    countBadge.classList.remove('d-none');
    noResults.classList.toggle('d-none', visible !== 0);
  }

  searchInput.addEventListener('input', applyFilters);
  citySelect.addEventListener('change', applyFilters);
  chipsWrap.querySelectorAll('.chip-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      chipsWrap.querySelector('.active')?.classList.remove('active');
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      applyFilters();
    });
  });

  applyFilters();
})();
