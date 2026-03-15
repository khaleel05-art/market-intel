// advisor.js — AI pivot suggestions panel

const PIVOT_SUGGESTIONS = [
  {
    num:   '01',
    title: 'Hold price + amplify quality',
    body:  'Competitors cutting on quality complaints — position durability as core value prop. Launch "Built to Last" content targeting their review keywords.',
  },
  {
    num:   '02',
    title: 'Capture NexaShop mid-bracket',
    body:  'Gap exists at $55–65. NexaShop at $49, rivals at $74+. Bundle a warranty/guarantee to justify $59 positioning.',
  },
  {
    num:   '03',
    title: 'Target ApexGear defectors',
    body:  '31% return spike = 31% dissatisfied buyers actively searching. Run retargeting on ApexGear brand search terms now.',
  },
  {
    num:   '04',
    title: 'Review counter-offensive',
    body:  "Vortex's stitching defect is an 841-mention cluster. Generate FAQ and comparison content addressing it before they do.",
  },
];

function renderPivots() {
  const list = document.getElementById('pivotList');
  if (!list) return;

  list.innerHTML = PIVOT_SUGGESTIONS.map(p => `
    <div class="pivot-item" onclick="executePivot('${p.num}')">
      <span class="pivot-num">${p.num}</span>
      <div class="pivot-text">
        <strong>${p.title}</strong>
        ${p.body}
      </div>
    </div>
  `).join('');
}

function executePivot(num) {
  console.log('Pivot selected:', num);
  // TODO: POST to /api/pivot-action with pivot ID, let backend create task
}

// append an AI response message to the chat panel
function appendAIResponse(text, model) {
  const chat = document.getElementById('aiChat');
  if (!chat) return;

  const msg = document.createElement('div');
  msg.className = 'ai-message';
  msg.innerHTML = `
    <div class="ai-tag">Agent · ${model}</div>
    <div class="ai-text">${text}</div>
  `;

  // insert before the pivot message block (2nd child)
  chat.appendChild(msg);
  msg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
