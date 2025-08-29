
// ======= TABELA DE PREÇOS =======
const priceBody = document.getElementById('priceBody');
const btnAdd = document.getElementById('btnAddLinha');
const btnSug = document.getElementById('btnSugestoes');
const categoriaSel = document.getElementById('categoria');

// helpers
let rowId = 0;
const currencySanitize = (v)=> (v || '').toString().replace(/[R$\s.]/g,'').replace(',', '.');
const toBRL = (v)=>{
  const n = Number(currencySanitize(v));
  if (isNaN(n)) return '';
  return n.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
};

// cria uma linha
function addLinha(preset = {}){
  const tr = document.createElement('tr');
  const id = ++rowId;
  tr.innerHTML = `
    <td>
      <input type="text" class="control" name="precos[${id}][servico]" placeholder="Ex.: Instalação de luminária" value="${preset.servico||''}" required>
    </td>
    <td>
      <input type="text" class="control" name="precos[${id}][desc]" placeholder="Detalhes (material, tamanho, etc.)" value="${preset.desc||''}">
    </td>
    <td>
      <input type="text" inputmode="decimal" class="control brl" name="precos[${id}][fixo]" placeholder="Ex.: 150,00" value="${preset.fixo||''}">
    </td>
    <td>
      <input type="text" inputmode="decimal" class="control brl" name="precos[${id}][hora]" placeholder="Ex.: 120,00" value="${preset.hora||''}">
    </td>
    <td>
      <input type="number" class="control" name="precos[${id}][urgencia]" placeholder="Ex.: 30" min="0" max="200" step="1" value="${preset.urgencia||''}">
    </td>
    <td class="text-end">
      <button type="button" class="btn-icon" aria-label="Duplicar"><i class="fa fa-copy"></i></button>
      <button type="button" class="btn-icon" aria-label="Remover"><i class="fa fa-trash"></i></button>
    </td>
  `;
  priceBody.appendChild(tr);

  // ações linha
  const [btnDup, btnDel] = tr.querySelectorAll('.btn-icon');
  btnDup.addEventListener('click', ()=> addLinha({
    servico: tr.querySelector(`[name="precos[${id}][servico]"]`).value,
    desc:    tr.querySelector(`[name="precos[${id}][desc]"]`).value,
    fixo:    tr.querySelector(`[name="precos[${id}][fixo]"]`).value,
    hora:    tr.querySelector(`[name="precos[${id}][hora]"]`).value,
    urgencia:tr.querySelector(`[name="precos[${id}][urgencia]"]`).value,
  }));
  btnDel.addEventListener('click', ()=> tr.remove());

  // máscara/format BRL (formata ao sair do campo)
  tr.querySelectorAll('.brl').forEach(inp=>{
    inp.addEventListener('blur', ()=> {
      const val = currencySanitize(inp.value);
      inp.value = val ? toBRL(val) : '';
    });
    // ao focar, tira R$
    inp.addEventListener('focus', ()=>{
      inp.value = currencySanitize(inp.value).replace('.', ',');
    });
  });
}

// presets por categoria
const SUGESTOES = {
  'Eletricista': [
    {servico:'Troca de tomada/interruptor', fixo:'60,00'},
    {servico:'Instalação de luminária simples', fixo:'120,00'},
    {servico:'Instalação de disjuntor', fixo:'160,00'},
    {servico:'Padrão/hora', hora:'120,00'}
  ],
  'Encanador': [
    {servico:'Desentupimento simples', fixo:'150,00'},
    {servico:'Conserto de vazamento (padrão)', fixo:'180,00'},
    {servico:'Instalação de torneira/misturador', fixo:'120,00'},
    {servico:'Padrão/hora', hora:'120,00'}
  ],
  'Pintura': [
    {servico:'Parede até 10m² (mão única)', fixo:'200,00'},
    {servico:'Porta com batente', fixo:'150,00'},
    {servico:'Retoque com massa + lixamento', hora:'120,00'},
  ],
  'Pedreiro e Reforma': [
    {servico:'Assentamento de porcelanato (m²)', fixo:'65,00', desc:'Mão de obra'},
    {servico:'Drywall (m²)', fixo:'80,00', desc:'Estrutura + placa (mão de obra)'},
    {servico:'Pequenos reparos', hora:'120,00'}
  ],
  'Montagem de Móveis': [
    {servico:'Guarda-roupa 2 portas', fixo:'180,00'},
    {servico:'Cama box', fixo:'90,00'},
    {servico:'Hora adicional', hora:'110,00'}
  ],
  'Lavagem de Telhado': [
    {servico:'Lavagem (m²)', fixo:'12,00', desc:'Hidrojato, sem impermeabilização'},
    {servico:'Impermeabilização (m²)', fixo:'18,00'},
  ],
  'Energia Solar': [
    {servico:'Manutenção preventiva', fixo:'300,00'},
    {servico:'Inspeção técnica', fixo:'220,00'},
  ],
  'Diarista': [
    {servico:'Residência até 70m²', fixo:'160,00'},
    {servico:'Residência 70–120m²', fixo:'220,00'},
    {servico:'Hora adicional', hora:'60,00'}
  ],
};

// botões
btnAdd?.addEventListener('click', ()=> addLinha());
btnSug?.addEventListener('click', ()=>{
  const cat = categoriaSel?.value || '';
  if(!cat || !SUGESTOES[cat]){ addLinha(); return; }
  // limpa atuais e insere sugestões
  priceBody.innerHTML = '';
  SUGESTOES[cat].forEach(s=> addLinha(s));
});

// ao trocar a categoria, oferecer sugestões se a tabela estiver vazia
categoriaSel?.addEventListener('change', ()=>{
  if(priceBody.children.length === 0 && SUGESTOES[categoriaSel.value]){
    SUGESTOES[categoriaSel.value].forEach(s=> addLinha(s));
  }
});

// inicia com uma linha vazia
if(priceBody.children.length === 0) addLinha();

