// config.js — point this at your FastAPI backend
// Change BASE_URL when deploying

const CONFIG = {
  BASE_URL: 'http://localhost:8000',   // FastAPI server

  ENDPOINTS: {
    signals:     '/api/signals',
    competitors: '/api/competitors',
    prices:      '/api/prices',
    ask:         '/api/ask',
    trends:      '/api/trends',
    alerts:      '/api/alerts',
  },

  // which ollama models to route to
  MODELS: {
    strategic: 'deepseek-r1:1.5b',
    reasoning: 'deepseek-r1:1.5b',
  },

  // how often to refresh live data (ms)
  REFRESH_INTERVAL: 30_000,

  // max signals shown in feed
  MAX_SIGNALS: 20,
};

// helper — build full URL
function apiURL(path) {
  return CONFIG.BASE_URL + path;
}
