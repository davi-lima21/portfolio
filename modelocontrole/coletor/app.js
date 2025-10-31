/** ============================
 * Simulador Coletor Solar — vBootstrap
 * - CORRIGIDO: Tempo Real (contínuo com setInterval/tick)
 * - CORRIGIDO: Tempo Simulado (execução rápida em lote)
 * - ADICIONADO: Linha de Referência no gráfico de Temp.
 * - ADICIONADO: Controle de Modal do Bootstrap
 * ============================ */

class ColetorSolarJS {
  constructor(opts) {
    const {
      irradiacao_solar, temperaturaAmbiente, porcentagem_vazao, referencia,
      consts, pid
    } = opts;

    // Entradas/estados
    this.irradiacao_solar = irradiacao_solar;        // I [W/m²]
    this.TEMPERATURA_AMBIENTE = temperaturaAmbiente; // Ta [°C]
    this.vazaoNominal = consts.vazaoNominal;         // [kg/s]
    this.vazao = (porcentagem_vazao / 100.0) * this.vazaoNominal;
    this.REFERENCIA = referencia;

    // Parâmetros físicos
    this.Ac = consts.Ac;
    this.U = consts.U;
    this.tauAlpha = consts.tauAlpha;
    this.rho = 1000.0;      // [kg/m³]
    this.cp  = 4186.0;      // [J/(kg·K)]

    this.NSEG = consts.NSEG;
    this.V_col = consts.V_col;      // [m³]
    this.Vseg = this.V_col / this.NSEG;
    this.mp = consts.mp;            // [kg]
    this.cpp = consts.cpp;          // [J/(kg·K)]
    this.hA_total = consts.hA_total; // [W/K]
    this.hA_seg = this.hA_total / this.NSEG;

    this.UA_tubos_total = consts.UA_tubos_total; // [W/K]
    this.UA_tubos_seg   = this.UA_tubos_total / this.NSEG;

    this.V_loop = consts.V_loop; // [m³]
    this.UA_loop = consts.UA_loop; // [W/K]

    // PID
    this.Kp = pid.kp;
    this.Ki = pid.ki;
    this.Kd = pid.kd;
    this.acaoIntegral = 0.0; this.erroAnterior = 0.0;
    this._lastMeas = null; // Para derivada na medição

    this.DELTA_T = consts.DELTA_T; // s

    // Estados iniciais
    this.TEMPERATURA_ENTRADA = this.TEMPERATURA_AMBIENTE - 5.0;
    this.Tp = this.TEMPERATURA_ENTRADA;
    this.Tseg = new Array(this.NSEG).fill(this.TEMPERATURA_ENTRADA);
    this._lastMeas = temperaturaAmbiente; // Inicia derivada
  }

  // Capacidades térmicas
  Cplaca() { return this.mp * this.cpp; }
  Cseg()   { return this.rho * this.Vseg * this.cp; }
  UA_loss(){ return this.U * this.Ac; }
  Cloop()  { return this.rho * this.V_loop * this.cp; }

  getPorcentagemVazao() { return (this.vazao / this.vazaoNominal) * 100.0; }
  setPorcentagemVazao(pct) { this.vazao = (pct / 100.0) * this.vazaoNominal; }

  setGains({kp,ki,kd}) { if(kp!==undefined)this.Kp=kp; if(ki!==undefined)this.Ki=ki; if(kd!==undefined)this.Kd=kd; }
  setReferencia(r)     { this.REFERENCIA = r; }
  setIrradiacao(I)     { this.irradiacao_solar = I; }
  setTa(Ta)            { this.TEMPERATURA_AMBIENTE = Ta; }

// ===== PID com direção correta (aumenta vazão quando Tout > Ref) =====
controleVazao(temperaturaSaida) {
  // Definições
  const uMin = 10;   // % mín para não travar a bomba
  const uMax = 100;  // % máx
  const prev = this.getPorcentagemVazao();

  // ERRO definido como PV - Ref (ação "direta" na vazão)
  // Se Tout > Ref  => erro_pv > 0 => u sobe (mais vazão)
  const erro_pv = temperaturaSaida - this.REFERENCIA;

  // Derivada NA MEDIÇÃO (evita derivative kick)
  const dMeas = (temperaturaSaida - this._lastMeas) / this.DELTA_T;
  this._lastMeas = temperaturaSaida;

  // Integração condicional (anti-windup simples)
  // Só integra se não estiver saturado OU se a integral ajuda a sair da saturação
  const uTesteSemInt = (this.Kp * erro_pv) + (-this.Kd * dMeas); // posicional, sem I
  const uPrevSemInt  = uTesteSemInt + this.acaoIntegral;
  const saturadoPrev = (uPrevSemInt >= uMax) || (uPrevSemInt <= uMin);

  const iCandidate = this.acaoIntegral + (this.Ki * erro_pv * this.DELTA_T);
  let uPos = (this.Kp * erro_pv) + iCandidate + (-this.Kd * dMeas);

  // Saturação dura (posicional)
  let saturated = false;
  if (uPos > uMax) { uPos = uMax; saturated = true; }
  if (uPos < uMin) { uPos = uMin; saturated = true; }

  // Anti-windup por back-calculation leve quando satura
  if (saturated) {
    const kaw = 0.3 * this.Ki; // ganho anti-windup
    // erro de saturação (quanto "sobrou" do controle)
    const uSemI = (this.Kp * erro_pv) + (-this.Kd * dMeas) + this.acaoIntegral;
    const eSat = uSemI - uPos;
    this.acaoIntegral -= kaw * eSat * this.DELTA_T;
  } else {
    // Se não está saturado, aceita o candidato
    // (ou, se estava saturado, só aceita se a integral empurra para dentro)
    const integralAjudaSair =
      (uPrevSemInt >= uMax && erro_pv < 0) ||
      (uPrevSemInt <= uMin && erro_pv > 0);
    if (!saturadoPrev || integralAjudaSair) {
      this.acaoIntegral = iCandidate;
    }
  }

  // Recalcula uPos com integral atualizada (estável)
  uPos = (this.Kp * erro_pv) + this.acaoIntegral + (-this.Kd * dMeas);
  if (uPos > uMax) uPos = uMax;
  if (uPos < uMin) uPos = uMin;

  // Limitador de rampa (slew-rate) para mudança de vazão em %/s
  const maxStepPctPerSec = 12; // máx. 12% por segundo
  const maxDelta = maxStepPctPerSec * this.DELTA_T;
  let uPct = Math.max(prev - maxDelta, Math.min(prev + maxDelta, uPos));

  // Aplicar
  this.setPorcentagemVazao(uPct);
  this.erroAnterior = erro_pv;
  return erro_pv; // agora retornamos erro_pv (PV-Ref)
}

  stepOnce() {
    const mdot = Math.max(this.vazao, 1e-6);
    const Ta = this.TEMPERATURA_AMBIENTE;
    const Tin = this.TEMPERATURA_ENTRADA;

    // 1) Placa
    const Qsol  = this.irradiacao_solar * this.Ac * this.tauAlpha;
    const Qloss = this.UA_loss() * (this.Tp - Ta);
    let Qpf = 0.0;
    for (let i=0;i<this.NSEG;i++) Qpf += this.hA_seg * (this.Tp - this.Tseg[i]);
    const dTp = (Qsol - Qloss - Qpf) / this.Cplaca();

    // 2) Segmentos
    const dT = new Array(this.NSEG).fill(0);
    for (let i=0;i<this.NSEG;i++){
      const Tprev = (i===0 ? Tin : this.Tseg[i-1]);
      const conv  = mdot * this.cp * (Tprev - this.Tseg[i]);
      const exch  = this.hA_seg * (this.Tp - this.Tseg[i]);
      const loss  = - this.UA_tubos_seg * (this.Tseg[i] - Ta);
      dT[i] = (exch + conv + loss) / this.Cseg();
    }

    // 3) Integração
    this.Tp += dTp * this.DELTA_T;
    for (let i=0;i<this.NSEG;i++) this.Tseg[i] += dT[i] * this.DELTA_T;

    const Tout = this.Tseg[this.NSEG - 1];

    // 4) Nó de loop (Tin)
    const dTin = (mdot * this.cp * (Tout - Tin) + this.UA_loop * (Ta - Tin)) / this.Cloop();
    this.TEMPERATURA_ENTRADA += dTin * this.DELTA_T;

    // Métricas
    const ganhoFluido = mdot * this.cp * (Tout - Tin); // W
    const eta = (this.irradiacao_solar * this.Ac) > 1e-9
      ? Math.max(0, Math.min(1, ganhoFluido / (this.irradiacao_solar * this.Ac)))
      : 0;

    return {
      Tin: this.TEMPERATURA_ENTRADA,
      Tout, Tp: this.Tp,
      vazaoPct: this.getPorcentagemVazao(),
      Qsol, Qloss, Qpf,
      eta,
      mdot,
      dT: (Tout - Tin),
      erro: this.REFERENCIA - Tout // retorna o erro também
    };
  }
}

/* ======= Utilidades de tempo e CSV ======= */
function parseTimeToMinutes(s) {
  const parts = s.trim().split(':').map(Number);
  if (parts.length < 2) return NaN;
  const h = parts[0]||0, m = parts[1]||0, sec = parts[2]||0;
  return h*60 + m + sec/60;
}
function minutesToHHMM(mins) {
  mins = Math.max(0, mins);
  const h = Math.floor(mins/60);
  const m = Math.floor(mins%60);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
function parseCSV(text) {
  const lines = text.split(/\r?\n/);
  const data = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const parts = line.split(',').map(x => x.trim());
    if (parts.length < 3) continue;
    const tmin = parseTimeToMinutes(parts[0]);
    const irr = Number(parts[1].replace(',','.'));
    const ta  = Number(parts[2].replace(',','.'));
    if (Number.isFinite(tmin) && Number.isFinite(irr) && Number.isFinite(ta)) {
      data.push({ tmin, irr, ta });
    }
  }
  data.sort((a,b)=>a.tmin-b.tmin);
  return data;
}
function interpolateProfile(table, tmin) {
  if (!table || table.length === 0) return null;
  if (tmin <= table[0].tmin) return { irr: table[0].irr, ta: table[0].ta };
  if (tmin >= table[table.length-1].tmin) return { irr: table[table.length-1].irr, ta: table[table.length-1].ta };
  let i = 1;
  while (i < table.length && table[i].tmin < tmin) i++;
  const a = table[i-1], b = table[i];
  const alpha = (tmin - a.tmin) / (b.tmin - a.tmin);
  return {
    irr: a.irr + alpha*(b.irr - a.irr),
    ta : a.ta  + alpha*(b.ta  - a.ta)
  };
}
function defaultSolarProfile(tmin, startMin, endMin) {
  const mid = (startMin + endMin)/2;
  const span = Math.max(1, (endMin - startMin)/2);
  const x = Math.max(-1, Math.min(1, (tmin - mid)/span));
  const baseIrr = 900 * Math.max(0, 1 - x*x); // parabólico
  const Ta = 20 + 7 * Math.max(0, 1 - Math.abs(x)); // 20–27 °C
  return { irr: baseIrr, ta: Ta };
}

/* ======= DOM ======= */
const els = {
  // Tempo
  tmReal : document.querySelector('#tmReal'),
  tmSim  : document.querySelector('input[name="timeMode"][value="sim"]'),
  simBlock: document.querySelector('#simulatedBlock'),
  simStart: document.querySelector('#simStart'),
  simEnd  : document.querySelector('#simEnd'),
  simStep : document.querySelector('#simStep'),
  fastRun : document.querySelector('#fastRun'),
  status  : document.querySelector('#statusMsg'),
  clockNow: document.querySelector('#clockNow'),

  // Entradas
  irr: q('#irr'), irrVal: q('#irr_val'),
  ta: q('#ta'), taVal: q('#ta_val'),
  ref: q('#ref'), refVal: q('#ref_val'),
  vaz: q('#vaz'), vazVal: q('#vaz_val'),
  kp: q('#kp'), kpVal: q('#kp_val'),
  ki: q('#ki'), kiVal: q('#ki_val'),
  kd: q('#kd'), kdVal: q('#kd_val'),

  // Ações
  start: q('#startBtn'), reset: q('#resetBtn'),

  // KPIs
  Tin: q('#Tin'), Tout: q('#Tout'), Tp: q('#Tp'), vazaoPct: q('#vazao_pct'),
  eta: q('#eta'), dT: q('#dT'), mdot: q('#mdot'), refNow: q('#refNow'),

  // CSV
  csvFile: q('#csvFile'), csvCount: q('#csvCount'), csvSpan: q('#csvSpan'),

  // Charts
  chartTemp: q('#chartTemp'),
  chartVazao: q('#chartVazao'),
  chartPower: q('#chartPower'),
  chartErro: q('#chartErro'),
  chartIrrTa: q('#chartIrrTa'),

  // Modal constantes
  constBtn: q('#constBtn'),
  constModal: q('#constModal'),
  closeConst: q('#closeConst'),
  cancelConst: q('#cancelConst'),
  applyConst: q('#applyConst'),

  // toast
  toast: q('#toast')
};
function q(s){ return document.querySelector(s); }
function fmt(x, d=2){ return Number(x).toFixed(d); }

/* ======= Estado ======= */
let charts = {};
let csvTable = [];
let csvStart=null, csvEnd=null;

// Constantes do coletor (editáveis no modal)
let C = {
  Ac: 2.0,
  U: 4.0,
  tauAlpha: 0.70,
  NSEG: 5,
  V_col: 0.002,
  mp: 6.0,
  cpp: 900.0,
  hA_total: 160.0,
  UA_tubos_total: 12.0,
  V_loop: 0.008,
  UA_loop: 6.0,
  DELTA_T: 1.5,
  vazaoNominal: 0.02
};

let timeMode = 'real'; // 'real' | 'sim'
let timer = null; // ID do setInterval (para tempo real)
let sim = null;   // Instância do simulador (para tempo real)
const MAX_POINTS_REALTIME = 300; // Pontos no gráfico de tempo real
let constModalInstance = null; // Instância do Modal Bootstrap

/* ======= UI ======= */
function updateLabels(){
  els.irrVal.textContent = Number(els.irr.value).toFixed(0);
  els.taVal.textContent  = Number(els.ta.value).toFixed(1);
  els.refVal.textContent = Number(els.ref.value).toFixed(1);
  els.vazVal.textContent = `${Number(els.vaz.value).toFixed(0)}%`;
  els.kpVal.textContent  = Number(els.kp.value).toFixed(2);
  els.kiVal.textContent  = Number(els.ki.value).toFixed(2);
  els.kdVal.textContent  = Number(els.kd.value).toFixed(3);
  els.refNow.textContent = els.refVal.textContent + ' °C';
}
['input','change'].forEach(evt=>{
  [els.irr,els.ta,els.ref,els.vaz,els.kp,els.ki,els.kd].forEach(el=> el.addEventListener(evt, updateLabels));
});

[els.tmReal, els.tmSim].forEach(r=>{
  r.addEventListener('change', ()=>{
    if (timer) stopRealtime(); // Para a simulação real se estiver rodando
    
    timeMode = els.tmReal.checked ? 'real' : 'sim';
    els.simBlock.classList.toggle('hidden', timeMode!=='sim');
    updateClock();
    uiRunning(false); // Reseta o estado da UI
    initCharts(); // Recria gráficos com o label do eixo X correto
  });
});

els.csvFile.addEventListener('change', async (e)=>{
  const file = e.target.files?.[0];
  if(!file){ csvTable=[]; els.csvCount.textContent='0'; els.csvSpan.textContent='—'; return; }
  const text = await file.text();
  csvTable = parseCSV(text);
  els.csvCount.textContent = String(csvTable.length);
  if (csvTable.length>0){
    csvStart = csvTable[0].tmin;
    csvEnd   = csvTable[csvTable.length-1].tmin;
    els.csvSpan.textContent = `${minutesToHHMM(csvStart)} → ${minutesToHHMM(csvEnd)}`;
  } else {
    els.csvSpan.textContent = '—';
    csvStart = csvEnd = null;
  }
});

// UI State Manager
function uiRunning(running) {
  // Botão de Iniciar/Parar
  els.start.disabled = (running && timeMode === 'sim'); // Desabilita só no batch run
  
  // Botão de Reset
  els.reset.disabled = running; // Desabilita reset enquanto qualquer simulação roda
  
  // Controles
  els.constBtn.disabled = running;
  [els.tmReal, els.tmSim, els.csvFile, els.simStart, els.simEnd, els.simStep].forEach(el => el.disabled = running);
  
  // Sliders: desabilitados APENAS se for simulação em lote
  const simControlsDisabled = (running && timeMode === 'sim');
  [els.irr, els.ta, els.ref, els.vaz, els.kp, els.ki, els.kd].forEach(el => el.disabled = simControlsDisabled);
  
  // Texto do botão
  if (timeMode === 'real') {
    els.start.textContent = running ? 'Parar (Tempo Real)' : 'Iniciar (Tempo Real)';
    els.start.classList.toggle('btn-danger', running); // Botão fica vermelho
    els.start.classList.toggle('btn-primary', !running);
  } else {
    els.start.textContent = 'Iniciar Simulação';
    els.start.classList.remove('btn-danger');
    els.start.classList.add('btn-primary');
  }
}


/* ======= Charts ======= */
function newChart(canvas, yLabel, labels, xLabel){
  return new Chart(canvas.getContext('2d'), {
    type: 'line',
    data: { labels: [], datasets: labels.map(l=>({
      label:l, data:[], borderWidth:2, tension:0.22, pointRadius:0, pointHoverRadius:3,
      borderDash: (l === 'Referência' ? [5, 5] : []) // Linha tracejada
    })) },
    options: {
      animation:false, responsive:true,
      scales:{ 
        x:{ title:{display:true,text: xLabel }}, // Usa o label passado
        y:{ title:{display:true,text:yLabel}}
      },
      plugins:{ legend:{ position:'bottom' }, tooltip:{ mode:'nearest', intersect:false } }
    }
  });
}

function initCharts(){
  Object.values(charts).forEach(c=> c?.destroy?.());
  
  // Define o label do eixo X baseado no modo
  const xLabel = (timeMode === 'real') ? 'Passos (Tempo Real)' : 'Hora (HH:MM)';

  charts.temp   = newChart(els.chartTemp,  'Temperatura (°C)',      ['Tin','Tout','Tp', 'Referência'], xLabel);
  charts.vazao  = newChart(els.chartVazao, 'Vazão (% nominal)',     ['Vazão %'], xLabel);
  charts.power  = newChart(els.chartPower, 'Potência (W)',          ['Qsol','Qloss','Qpf'], xLabel);
  charts.erro   = newChart(els.chartErro,  'Erro (°C)',             ['Erro (Ref−Tout)'], xLabel); // Erro é Ref - Tout

  // Irr & Ta (dois eixos)
  const ctx = els.chartIrrTa.getContext('2d');
  charts.irrta = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        { label: '☀️ Irradiação (W/m²)', data: [], yAxisID: 'y', borderWidth:2, tension:0.22, pointRadius:0 },
        { label: 'Ta (°C)', data: [], yAxisID: 'y1', borderWidth:2, tension:0.22, pointRadius:0 }
      ]
    },
    options: {
      responsive:true, animation:false,
      scales: {
        x: { title:{display:true,text: xLabel} }, // Label dinâmico
        y: { position:'left', title:{display:true, text:'Irr (W/m²)'} },
        y1:{ position:'right', grid:{ drawOnChartArea:false }, title:{display:true, text:'Ta (°C)'} }
      },
      plugins:{ legend:{ position:'bottom' } }
    }
  });
}

// Para plotar TUDO de uma vez (Modo Simulado)
function renderAllCharts(series){
  // series: { labels, Tin, Tout, Tp, vazPct, Qsol, Qloss, Qpf, erro, Irr, Ta, Ref }
  const set = (chart, arrs) => {
    chart.data.labels = series.labels;
    chart.data.datasets.forEach((ds, i)=> ds.data = arrs[i]);
    chart.update('none'); // 'none' para evitar animação
  };
  set(charts.temp,  [series.Tin, series.Tout, series.Tp, series.Ref]);
  set(charts.vazao, [series.vazPct]);
  set(charts.power, [series.Qsol, series.Qloss, series.Qpf]);
  set(charts.erro,  [series.erro]); // Erro já vem calculado

  charts.irrta.data.labels = series.labels;
  charts.irrta.data.datasets[0].data = series.Irr;
  charts.irrta.data.datasets[1].data = series.Ta;
  charts.irrta.update('none');
}

// Para plotar UM PONTO (Modo Real)
function pushPoint(chart, label, arrs) {
    const lbls = chart.data.labels;
    lbls.push(label);
    chart.data.datasets.forEach((ds, i) => ds.data.push(arrs[i]));
    
    // Mantém o gráfico "andando"
    while (lbls.length > MAX_POINTS_REALTIME) {
      lbls.shift();
      chart.data.datasets.forEach(ds => ds.data.shift());
    }
    chart.update('quiet'); // 'quiet' para uma animação sutil
}

// Atualiza os KPIs
function updateKPIs(s) {
  els.Tin.textContent = fmt(s.Tin, 2);
  els.Tout.textContent = fmt(s.Tout, 2);
  els.Tp.textContent = fmt(s.Tp, 2);
  els.vazaoPct.textContent = fmt(s.vazaoPct, 1) + ' %';
  els.eta.textContent = fmt(s.eta * 100, 1) + ' %'; // Usa s.eta
  els.dT.textContent = fmt(s.dT, 2) + ' °C';       // Usa s.dT
  els.mdot.textContent = fmt(s.mdot, 4);       // Usa s.mdot
  els.refNow.textContent = fmt(Number(els.ref.value), 1) + ' °C';
}

/* ======= Relógio ======= */
function updateClock(){
  if (timeMode==='real'){
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = String(now.getSeconds()).padStart(2,'0');
    els.clockNow.textContent = `${hh}:${mm}:${ss} (real)`;
  } else {
    els.clockNow.textContent = `${els.simStart.value||'—'} → ${els.simEnd.value||'—'} (simulado)`;
  }
}

/* ======= Criação da Instância ======= */
function createSimulatorInstance() {
  return new ColetorSolarJS({
    irradiacao_solar: Number(els.irr.value),
    temperaturaAmbiente: Number(els.ta.value),
    porcentagem_vazao: Number(els.vaz.value),
    referencia: Number(els.ref.value),
    pid: {
      kp: Number(els.kp.value),
      ki: Number(els.ki.value),
      kd: Number(els.kd.value)
    },
    consts: { ...C }
  });
}

/* ======= Lógica de Simulação (Batch e Real-Time) ======= */

// MODO SIMULADO (BATCH RUN)
function runSweep() {
  els.status.textContent = '▶️ Executando varredura...';
  updateClock();
  initCharts(); // Prepara gráficos com o label HH:MM

  const sim = createSimulatorInstance(); // Cria instância com valores dos sliders

  // buffers
  const labels = [];
  const Tin=[], Tout=[], Tp=[], Ref=[];
  const vazPct=[], Qsol=[], Qloss=[], Qpf=[];
  const erro=[], Irr=[], Ta=[];
  
  let s; // Para guardar o último estado

  const startMin = parseTimeToMinutes(els.simStart.value) || 8*60;
  const endMin   = parseTimeToMinutes(els.simEnd.value)   || 18*60;
  const minuteStep = Math.max(0.5, Number(els.simStep.value) || 1);
  const stepsOuter = Math.max(1, Math.floor((endMin - startMin)/minuteStep));
  let tmin = startMin;

  for (let k=0;k<=stepsOuter;k++){
    // 1. Obter perfil (CSV ou Padrão)
    let prof = null;
    if (csvTable.length>0){
      prof = interpolateProfile(csvTable, tmin);
    } else {
      prof = defaultSolarProfile(tmin, startMin, endMin);
    }
    sim.setIrradiacao(prof.irr);
    sim.setTa(prof.ta);

    // 2. Rodar subpassos internos
    const seconds = minuteStep * 60.0;
    const subSteps = Math.max(1, Math.floor(seconds / sim.DELTA_T));

    for (let j=0;j<subSteps;j++){
      s = sim.stepOnce(); // `s` é atualizado a cada subpasso
      sim.controleVazao(s.Tout);
    }

    // 3. Coletar o último ponto (s)
    labels.push(minutesToHHMM(tmin));
    Tin.push(s.Tin); Tout.push(s.Tout); Tp.push(s.Tp); Ref.push(sim.REFERENCIA);
    vazPct.push(s.vazaoPct);
    Qsol.push(s.Qsol); Qloss.push(s.Qloss); Qpf.push(s.Qpf);
    erro.push(s.erro); // Usa o erro calculado pelo 's'
    Irr.push(sim.irradiacao_solar);
    Ta.push(sim.TEMPERATURA_AMBIENTE);
    
    tmin += minuteStep;
  }

  // 4. Atualizar KPIs com o último estado (s)
  if (s) updateKPIs(s);

  // 5. Renderizar tudo de uma vez
  renderAllCharts({
    labels, Tin, Tout, Tp, vazPct, Qsol, Qloss, Qpf, erro, Irr, Ta, Ref
  });

  els.status.textContent = '✅ Varredura concluída';
  uiRunning(false); // Libera a UI
}

// MODO TEMPO REAL (CONTÍNUO)
function startRealtime() {
  if (timer) stopRealtime(); // Garante que não haja timers duplicados
  
  els.status.textContent = '▶️ Executando em tempo real...';
  updateClock();
  initCharts(); // Prepara gráficos com o label "Passos"
  
  sim = createSimulatorInstance(); // Cria instância global
  
  uiRunning(true); // Bloqueia a UI
  
  // Inicia o loop
  timer = setInterval(tick, sim.DELTA_T * 1000);
}

// Parada do Tempo Real
function stopRealtime() {
  if (timer) clearInterval(timer);
  timer = null;
  sim = null; // Descarta a instância
  uiRunning(false); // Libera a UI
  els.status.textContent = '⏹️ Parado.';
}

// O "coração" do Tempo Real
function tick() {
  if (!sim) return; // Segurança
  
  // 1. Atualiza o simulador com os valores ATUAIS dos sliders
  sim.setIrradiacao(Number(els.irr.value));
  sim.setTa(Number(els.ta.value));
  sim.setReferencia(Number(els.ref.value));
  sim.setGains({
    kp: Number(els.kp.value),
    ki: Number(els.ki.value),
    kd: Number(els.kd.value)
  });
  
  // 2. Roda um passo
  const s = sim.stepOnce();
  sim.controleVazao(s.Tout);
  
  // 3. Adiciona o ponto aos gráficos
  const label = charts.temp.data.labels.length;
  pushPoint(charts.temp,  label, [s.Tin, s.Tout, s.Tp, sim.REFERENCIA]);
  pushPoint(charts.vazao, label, [s.vazaoPct]);
  pushPoint(charts.power, label, [s.Qsol, s.Qloss, s.Qpf]);
  pushPoint(charts.erro,  label, [s.erro]);
  pushPoint(charts.irrta, label, [sim.irradiacao_solar, sim.TEMPERATURA_AMBIENTE]);

  // 4. Atualiza KPIs e relógio
  updateKPIs(s);
  updateClock();
}


/* ======= Ações ======= */
function startSimulation() {
  if (timeMode === 'sim') {
    uiRunning(true); // Bloqueia UI
    
    // Roda em um timeout para dar tempo da UI atualizar (mostrar "Executando...")
    setTimeout(() => {
        runSweep(); // Roda a simulação em lote
    }, 10);

  } else {
    // Modo Real: o botão vira um "toggle"
    if (timer) {
      stopRealtime();
    } else {
      startRealtime();
    }
  }
}
els.start.addEventListener('click', startSimulation);


els.reset.addEventListener('click', ()=>{
  if (timer) stopRealtime(); // Para a simulação real
  
  initCharts();
  updateLabels();
  updateClock();
  // limpa KPIs
  ['Tin','Tout','Tp','vazao_pct','eta','dT','mdot'].forEach(id=> els[id].textContent='—');
  els.status.textContent = 'Pronto';
  uiRunning(false); // Garante que a UI está liberada
});

/* ======= Modal Constantes ======= */
// Funções 'num' e 'clampInt'
function num(sel, fallback){ const v = Number(q(sel).value); return Number.isFinite(v) ? v : fallback; }
function clampInt(v, lo, hi){ v = Math.round(v); return Math.min(hi, Math.max(lo, v)); }

function loadConstsToModal() {
  q('#c_Ac').value = C.Ac;
  q('#c_U').value = C.U;
  q('#c_tau').value = C.tauAlpha;
  q('#c_Nseg').value = C.NSEG;
  q('#c_Vcol').value = C.V_col;
  q('#c_mp').value = C.mp;
  q('#c_cpp').value = C.cpp;
  q('#c_hA').value = C.hA_total;
  q('#c_UAt').value = C.UA_tubos_total;
  q('#c_Vloop').value = C.V_loop;
  q('#c_UAl').value = C.UA_loop;
  q('#c_dt').value = C.DELTA_T;
  q('#c_vazN').value = C.vazaoNominal;
}

function saveConstsFromModal() {
  C.Ac = num('#c_Ac', C.Ac);
  C.U = num('#c_U', C.U);
  C.tauAlpha = num('#c_tau', C.tauAlpha);
  C.NSEG = clampInt(num('#c_Nseg', C.NSEG), 1, 200);
  C.V_col = num('#c_Vcol', C.V_col);
  C.mp = num('#c_mp', C.mp);
  C.cpp = num('#c_cpp', C.cpp);
  C.hA_total = num('#c_hA', C.hA_total);
  C.UA_tubos_total = num('#c_UAt', C.UA_tubos_total);
  C.V_loop = num('#c_Vloop', C.V_loop);
  C.UA_loop = num('#c_UAl', C.UA_loop);
  C.DELTA_T = Math.max(0.1, num('#c_dt', C.DELTA_T));
  C.vazaoNominal = Math.max(1e-5, num('#c_vazN', C.vazaoNominal));
  
  constModalInstance.hide(); // Oculta o modal do Bootstrap
  els.status.textContent = '🔧 Constantes aplicadas. Pressione “Iniciar simulação”.';
  initCharts();
}

// Event Listeners do Modal
els.constBtn.addEventListener('click', () => {
  loadConstsToModal(); // Carrega dados
  constModalInstance.show(); // Mostra o modal
});
els.closeConst.addEventListener('click', () => constModalInstance.hide());
els.cancelConst.addEventListener('click', () => constModalInstance.hide());
els.applyConst.addEventListener('click', saveConstsFromModal);


/* ======= Menus “Em breve...” ======= */
document.querySelectorAll('[data-coming-soon]').forEach(el=>{
  el.addEventListener('click', (e)=>{
    e.preventDefault();
    toast('Em breve…');
  });
});
function toast(msg){
  els.toast.textContent = msg;
  els.toast.classList.remove('hidden');
  setTimeout(()=> els.toast.classList.add('hidden'), 1600);
}

/* ======= Boot ======= */
function boot(){
  updateLabels();
  updateClock();
  initCharts();

  // Inicializa a instância do Modal do Bootstrap
  if (els.constModal) {
    constModalInstance = new bootstrap.Modal(els.constModal);
  }

  // O código do dropdown do Bootstrap é automático e não precisa de JS customizado
}
boot();