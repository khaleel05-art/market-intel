// api.js — FastAPI integration layer
// All backend calls live here. Swap mock data for real endpoints.

// generic fetch wrapper with error handling
async function apiFetch(endpoint, options = {}) {
  const url = apiURL(endpoint);
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });

    if (!res.ok) {
      console.warn(`[API] ${endpoint} returned ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API] ${endpoint} failed — using mock data`, err.message);
    return null;
  }
}

// ---- ask the agent a question ----
async function askAgent(query) {
  const payload = {
    query,
    model: CONFIG.MODELS.strategic,
    context: {
      competitors: COMPETITORS.map(c => c.name),
      recentSignals: SIGNAL_DATA.length,
    },
  };

  const result = await apiFetch(CONFIG.ENDPOINTS.ask, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (result && result.response) {
    return result.response;
  }

  // fallback: echo a canned response so the UI stays functional
  return `[Mock] Agent received: <em>"${query}"</em> — connect FastAPI backend at <code>${CONFIG.BASE_URL}</code> to enable live responses.`;
}

// ---- refresh competitors from DB ----
async function refreshCompetitors() {
  const data = await apiFetch(CONFIG.ENDPOINTS.competitors);
  if (data && data.competitors) {
    // TODO: merge with COMPETITORS array and re-render
    console.log('[API] Competitors refreshed:', data.competitors.length);
  }
}

// ---- refresh signals ----
async function refreshSignals() {
  const data = await apiFetch(CONFIG.ENDPOINTS.signals);
  if (data && data.signals) {
    renderSignals(data.signals);
  }
}

// ---- start polling ----
function startPolling() {
  setInterval(() => {
    refreshSignals();
    refreshCompetitors();
  }, CONFIG.REFRESH_INTERVAL);
}
