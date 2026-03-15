// data.js — seed data for price monitor table
// Replace fetchPriceData() with real API call once backend is ready

const PRICE_DATA = [
  {
    competitor: 'RivalCo A',
    category:   'Premium Bundle',
    prevPrice:  149,
    currPrice:  119,
    source:     'Amazon · 2,341 rev',
    sentimentNote: 'Durability complaints ↑18%',
    sentimentClass: 'sentiment-link-warn',
  },
  {
    competitor: 'NexaShop',
    category:   'Entry Tier',
    prevPrice:  39,
    currPrice:  49,
    source:     'Shopify · 891 rev',
    sentimentNote: 'Quality score ↑ post-raise',
    sentimentClass: 'sentiment-link-ok',
  },
  {
    competitor: 'Vortex Ltd',
    category:   'Mid-Range',
    prevPrice:  89,
    currPrice:  74,
    source:     'Walmart · 4,210 rev',
    sentimentNote: 'Material complaint surge',
    sentimentClass: 'sentiment-link-warn',
  },
  {
    competitor: 'ApexGear',
    category:   'Pro Series',
    prevPrice:  199,
    currPrice:  165,
    source:     'eBay · 788 rev',
    sentimentNote: 'Returns ↑ 31% this week',
    sentimentClass: 'sentiment-link-danger',
  },
];

function getPctChange(prev, curr) {
  return Math.round(((curr - prev) / prev) * 100);
}

function renderPriceTable() {
  const tbody = document.getElementById('priceTableBody');
  if (!tbody) return;

  tbody.innerHTML = PRICE_DATA.map(row => {
    const pct   = getPctChange(row.prevPrice, row.currPrice);
    const isUp  = pct > 0;
    const priceClass = isUp ? 'price-rise' : 'price-drop';
    const chipClass  = isUp ? 'change-up'  : 'change-down';
    const arrow      = isUp ? '↑'          : '↓';

    return `
      <tr>
        <td><strong style="color:var(--heading)">${row.competitor}</strong></td>
        <td><span class="comp-name-small">${row.category}</span></td>
        <td><span class="price-tag price-old">$${row.prevPrice}</span></td>
        <td><span class="price-tag ${priceClass}">$${row.currPrice}</span></td>
        <td><span class="change-chip ${chipClass}">${arrow} ${Math.abs(pct)}%</span></td>
        <td><span class="source-tag">${row.source}</span></td>
        <td><span class="${row.sentimentClass}">${row.sentimentNote}</span></td>
      </tr>
    `;
  }).join('');
}

// stub for future API integration
async function fetchPriceData() {
  try {
    const res  = await fetch(apiURL(CONFIG.ENDPOINTS.prices));
    const json = await res.json();
    return json.data || PRICE_DATA;
  } catch (_err) {
    // backend not up yet — use seed data
    return PRICE_DATA;
  }
}

function exportCSV() {
  const headers = ['Competitor','Category','Prev Price','Current','Change %','Source','Sentiment'];
  const rows    = PRICE_DATA.map(r => [
    r.competitor,
    r.category,
    r.prevPrice,
    r.currPrice,
    getPctChange(r.prevPrice, r.currPrice) + '%',
    r.source,
    r.sentimentNote,
  ]);

  const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);

  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'marketintel_prices.csv';
  a.click();
  URL.revokeObjectURL(url);
}
