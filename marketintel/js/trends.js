// trends.js — search volume trend mini-charts

const TREND_DATA = [
  {
    label:  'Your Brand',
    delta:  '↑ 12%',
    deltaClass: 'delta-up',
    values: [42,45,48,51,47,53,58,61,55,60,64,68,72,74],
    color:  'rgba(0,200,150,',
  },
  {
    label:  'RivalCo A',
    delta:  '↓ 8%',
    deltaClass: 'delta-down',
    values: [80,78,75,77,72,68,64,61,63,58,55,52,48,44],
    color:  'rgba(255,77,94,',
  },
  {
    label:  'ApexGear',
    delta:  '↓ 14%',
    deltaClass: 'delta-down',
    values: [70,68,65,62,64,60,55,52,50,47,44,40,38,36],
    color:  'rgba(255,77,94,',
  },
];

function buildMiniChart(values, color) {
  const max = Math.max(...values);
  return values.map(v => {
    const h = Math.round((v / max) * 56);
    return `<div class="mini-bar" style="height:${h}px;background:${color}0.4);--bar-color:${color}0.4)" title="${v}"></div>`;
  }).join('');
}

function renderTrends() {
  const list = document.getElementById('trendsList');
  if (!list) return;

  list.innerHTML = TREND_DATA.map(t => `
    <div>
      <div class="trend-row-label">
        <span>${t.label}</span>
        <span class="${t.deltaClass}" style="font-family:var(--font-mono)">${t.delta}</span>
      </div>
      <div class="mini-chart">
        ${buildMiniChart(t.values, t.color)}
      </div>
    </div>
  `).join('');
}
