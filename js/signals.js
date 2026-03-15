// signals.js — live signal feed

const SIGNAL_DATA = [
  {
    color:  'var(--red)',
    bg:     'rgba(255,77,94,0.1)',
    icon:   '📉',
    title:  "RivalCo A drops Premium Bundle 20% — 2,341 negative reviews on material quality",
    desc:   "Agent synthesised: price cut <em>directly follows</em> 18% spike in \"cheap plastic\" complaints across Amazon. Opportunity window: 72h.",
    source: 'PRICE + REVIEW SYNTHESIS',
    time:   '8 min ago',
  },
  {
    color:  'var(--amber)',
    bg:     'rgba(245,166,35,0.08)',
    icon:   '🔍',
    title:  "Vortex Ltd review cluster: \"stitching falls apart after 3 weeks\" — 841 mentions",
    desc:   "DeepSeek-R1 flagged cross-platform pattern: identical complaint on Walmart (4.2k rev), eBay (901 rev). Manufacturing defect probability: 87%.",
    source: 'MULTI-PLATFORM REVIEW',
    time:   '24 min ago',
  },
  {
    color:  'var(--green)',
    bg:     'rgba(0,200,150,0.08)',
    icon:   '📈',
    title:  "NexaShop raised entry price 26% — sentiment score improved from 61% → 78%",
    desc:   "Qwen-2.5 insight: premium positioning perception increased post-raise. Counter-signal: opportunity to reinforce value narrative at $55–65 bracket.",
    source: 'PRICING STRATEGY',
    time:   '1h ago',
  },
  {
    color:  'var(--cyan)',
    bg:     'rgba(0,229,200,0.07)',
    icon:   '⚡',
    title:  "ApexGear running flash sale — returns spiked 31% week-over-week",
    desc:   "Correlated signal: Google Trends shows -14% search interest for ApexGear brand. Agent suggests: capture search traffic with targeted content campaign.",
    source: 'TREND + RETURNS CORRELATION',
    time:   '2h ago',
  },
];

function buildSignalItem(sig, index) {
  return `
    <div
      class="signal-item"
      style="--sig-color:${sig.color}; --sig-bg:${sig.bg}"
      onclick="expandSignal(${index})"
    >
      <div class="signal-icon">${sig.icon}</div>
      <div class="signal-body">
        <div class="signal-title">${sig.title}</div>
        <div class="signal-desc">${sig.desc}</div>
        <div class="signal-meta">
          <span class="signal-source">${sig.source}</span>
          <div class="signal-dot"></div>
          <span class="signal-time">${sig.time}</span>
        </div>
      </div>
    </div>
  `;
}

function renderSignals(data) {
  const feed = document.getElementById('signalFeed');
  if (!feed) return;
  const list = data || SIGNAL_DATA;
  feed.innerHTML = list.map((s, i) => buildSignalItem(s, i)).join('');
}

function expandSignal(index) {
  const sig = SIGNAL_DATA[index];
  // TODO: open a detail modal / side drawer
  console.log('Signal detail:', sig.title);
}

let filterActive = false;
function toggleFilter() {
  filterActive = !filterActive;
  const btn = document.getElementById('filterBtn');
  if (filterActive) {
    btn.textContent = 'Clear filter ✕';
    // show only high-priority (first two)
    renderSignals(SIGNAL_DATA.slice(0, 2));
  } else {
    btn.textContent = 'Filter ↗';
    renderSignals(SIGNAL_DATA);
  }
}

// simulate a new signal arriving every ~20s
function startLiveSignals() {
  setTimeout(() => {
    const feed = document.getElementById('signalFeed');
    if (!feed) return;

    const newSig = {
      color:  'var(--blue)',
      bg:     'rgba(74,158,255,0.07)',
      icon:   '🎯',
      title:  "LIVE: Brand-X slashed shipping fees — checkout funnel spike detected",
      desc:   "Agent detected +23% add-to-cart rate on Brand-X in last 15 minutes. Cross-platform velocity signal: act before window closes.",
      source: 'FUNNEL INTELLIGENCE',
      time:   'just now',
    };

    const el = document.createElement('div');
    el.innerHTML = buildSignalItem(newSig, 99);
    const item = el.firstElementChild;
    item.classList.add('new');  // triggers flash animation
    feed.insertBefore(item, feed.firstChild);

    // update badge
    const badge = document.querySelector('[data-page="signals"] .nav-badge');
    if (badge) badge.textContent = parseInt(badge.textContent) + 1;
  }, 20_000);
}
