// ticker.js — top price ticker bar

const TICKER_ITEMS = [
  { name: 'RIVAL-A', price: '$119', dir: 'dn', pct: '–20%' },
  { name: 'NEXA',    price: '$49',  dir: 'up', pct: '+26%' },
  { name: 'VORTEX',  price: '$74',  dir: 'dn', pct: '–17%' },
  { name: 'APEX',    price: '$165', dir: 'dn', pct: '–17%' },
  { name: 'BRAND-X', price: '$89',  dir: 'up', pct: '+5%'  },
  { name: 'ZENCO',   price: '$55',  dir: 'dn', pct: '–8%'  },
];

function buildTickerItem(item) {
  const arrowClass = item.dir === 'up' ? 'ticker-up' : 'ticker-dn';
  const arrow      = item.dir === 'up' ? '↑' : '↓';
  return `
    <span class="ticker-item">
      <span class="ticker-name">${item.name}</span>
      <span class="ticker-price">${item.price}</span>
      <span class="${arrowClass}">${arrow} ${item.pct}</span>
    </span>
  `;
}

function renderTicker() {
  const el = document.getElementById('tickerInner');
  if (!el) return;

  // duplicate for seamless loop
  const html = [...TICKER_ITEMS, ...TICKER_ITEMS].map(buildTickerItem).join('');
  el.innerHTML = html;
}
