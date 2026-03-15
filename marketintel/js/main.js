// main.js — app entry point, wires everything together

// ---- clock ----
function updateClock() {
  const el = document.getElementById('clock');
  if (el) {
    el.textContent = new Date().toLocaleTimeString('en-US', { hour12: false });
  }
}

// ---- nav ----
function navClick(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  // TODO: swap main content section based on el.dataset.page
}

// ---- panel tabs ----
function switchTab(el, tabId) {
  // update tab buttons
  document.querySelectorAll('.panel-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });
  el.classList.add('active');
  el.setAttribute('aria-selected', 'true');

  // hide all panels, show target
  const panels = ['ai', 'trends', 'alerts'];
  panels.forEach(id => {
    const panel = document.getElementById('tab-' + id);
    if (panel) panel.classList.toggle('hidden', id !== tabId);
  });
}

// ---- query box ----
function handleQueryKey(e) {
  if (e.key === 'Enter') submitQuery();
}

async function submitQuery() {
  const input = document.getElementById('queryInput');
  const query = input ? input.value.trim() : '';
  if (!query) return;

  input.value = '';
  input.disabled = true;
  input.placeholder = 'Agent thinking…';

  // show user message
  appendUserMessage(query);

  // hit the API (or mock)
  const response = await askAgent(query);

  appendAIResponse(response, CONFIG.MODELS.reasoning);

  input.disabled = false;
  input.placeholder = 'Ask agent: why did rival drop prices?';
  input.focus();
}

function appendUserMessage(text) {
  const chat = document.getElementById('aiChat');
  if (!chat) return;

  const msg = document.createElement('div');
  msg.className = 'ai-message';
  msg.style.background = 'var(--card2)';
  msg.innerHTML = `
    <div class="ai-tag" style="color:var(--amber)">You</div>
    <div class="ai-text">${escapeHtml(text)}</div>
  `;
  chat.appendChild(msg);
  msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

// ---- boot sequence ----
document.addEventListener('DOMContentLoaded', () => {
  // render all components
  renderTicker();
  renderPriceTable();
  renderCompetitors();
  renderSignals();
  renderPivots();
  renderTrends();
  renderAlerts();

  // clock
  updateClock();
  setInterval(updateClock, 1000);

  // live KPI animations
  initKPIAnimations();
  startLiveKPIs();

  // live signal injection
  startLiveSignals();

  // start polling backend (silent if backend not up)
  startPolling();

  console.log('MarketIntel loaded. Backend expected at:', CONFIG.BASE_URL);
});
