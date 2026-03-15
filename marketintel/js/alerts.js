// alerts.js — alert configuration panel

const ALERT_CONFIG = [
  {
    name: 'Price drop > 10%',
    meta: 'Monitors: 6 competitors · All platforms',
    on:   true,
  },
  {
    name: 'Sentiment drop > 5%',
    meta: 'Threshold: 500+ reviews · 7-day window',
    on:   true,
  },
  {
    name: 'New review cluster',
    meta: 'Min cluster size: 200 matching reviews',
    on:   false,
  },
  {
    name: 'Weekly strategy digest',
    meta: 'AI-generated · Every Monday 08:00',
    on:   true,
  },
];

function buildAlertCard(alert, index) {
  return `
    <div class="alert-card">
      <div class="alert-row">
        <span class="alert-name">${alert.name}</span>
        <label class="toggle-wrap" aria-label="Toggle ${alert.name}">
          <input type="checkbox" ${alert.on ? 'checked' : ''} onchange="toggleAlert(${index}, this.checked)" />
          <div class="toggle-track ${alert.on ? 'on' : ''}" id="toggleTrack${index}">
            <div class="toggle-thumb"></div>
          </div>
        </label>
      </div>
      <div class="alert-meta">${alert.meta}</div>
    </div>
  `;
}

function renderAlerts() {
  const list = document.getElementById('alertsList');
  if (!list) return;
  list.innerHTML = ALERT_CONFIG.map((a, i) => buildAlertCard(a, i)).join('');
}

function toggleAlert(index, checked) {
  ALERT_CONFIG[index].on = checked;
  const track = document.getElementById(`toggleTrack${index}`);
  if (track) track.classList.toggle('on', checked);

  // TODO: PATCH /api/alerts/:id  with { enabled: checked }
  console.log(`Alert "${ALERT_CONFIG[index].name}" set to:`, checked);
}
