// competitors.js — renders the competitor intelligence cards

const COMPETITORS = [
  {
    name:      'RivalCo A',
    threat:    'high',
    price:     '$119',
    priceColor: 'var(--red)',
    rating:    '3.2★',
    negReviews: '41%',
    negColor:   'var(--red)',
    sentiment:  32,
    insight:    '⚡ Durability complaints linked to price drop',
    insightColor: 'var(--amber)',
  },
  {
    name:      'NexaShop',
    threat:    'med',
    price:     '$49',
    priceColor: 'var(--amber)',
    rating:    '4.4★',
    negReviews: '12%',
    negColor:   'var(--green)',
    sentiment:  78,
    insight:    '↑ Raised price — sentiment improving',
    insightColor: 'var(--green)',
  },
  {
    name:      'Vortex Ltd',
    threat:    'high',
    price:     '$74',
    priceColor: 'var(--red)',
    rating:    '3.7★',
    negReviews: '28%',
    negColor:   'var(--amber)',
    sentiment:  54,
    insight:    '⚡ Material complaints spiking in reviews',
    insightColor: 'var(--amber)',
  },
];

function getThreatLabel(level) {
  const map = { high: 'High Threat', med: 'Med Threat', low: 'Low Threat' };
  return map[level] || 'Unknown';
}

function getSentimentGradient(pct) {
  // returns a colour between red and green based on sentiment %
  if (pct < 40) return 'var(--red)';
  if (pct < 60) return 'var(--amber)';
  return 'var(--green)';
}

function buildCompCard(comp) {
  return `
    <div class="comp-card" onclick="drillCompetitor('${comp.name}')">
      <div class="comp-header">
        <span class="comp-name">${comp.name}</span>
        <span class="threat-badge threat-${comp.threat}">${getThreatLabel(comp.threat)}</span>
      </div>

      <div class="comp-stat-row">
        <div class="comp-stat">
          <span class="comp-stat-val" style="color:${comp.priceColor}">${comp.price}</span>
          <span class="comp-stat-lbl">Price</span>
        </div>
        <div class="comp-stat">
          <span class="comp-stat-val">${comp.rating}</span>
          <span class="comp-stat-lbl">Rating</span>
        </div>
        <div class="comp-stat">
          <span class="comp-stat-val" style="color:${comp.negColor}">${comp.negReviews}</span>
          <span class="comp-stat-lbl">Neg Rev</span>
        </div>
      </div>

      <div class="sentiment-row">
        <span class="sentiment-label">SENT</span>
        <div class="sentiment-bar-wrap">
          <div class="sentiment-bar-fill" style="width:${comp.sentiment}%; background:${getSentimentGradient(comp.sentiment)}"></div>
        </div>
        <span class="sentiment-val">${comp.sentiment}%</span>
      </div>

      <div class="comp-insight" style="color:${comp.insightColor}">
        ${comp.insight}
      </div>
    </div>
  `;
}

function renderCompetitors() {
  const grid = document.getElementById('competitorGrid');
  if (!grid) return;
  grid.innerHTML = COMPETITORS.map(buildCompCard).join('');
}

function drillCompetitor(name) {
  // TODO: open detail drawer or navigate to competitor page
  console.log('Drilling into competitor:', name);
}

function addCompetitor() {
  alert('Add competitor — wire this to your FastAPI POST /api/competitors endpoint');
}
