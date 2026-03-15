# MarketIntel — Competitive Intelligence Frontend

A war-room style dashboard for real-time competitor monitoring, review mining, and AI-driven pivot strategy.

## Stack
- **Frontend**: Vanilla HTML/CSS/JS (no build step needed)
- **Backend expected**: FastAPI on `http://localhost:8000`
- **AI Models**: Qwen2.5:14b (strategic) + DeepSeek-R1:8b (reasoning) via Ollama
- **DB**: PostgreSQL

---

## Quick Start

1. Open `index.html` in a browser — works fully with mock data even without the backend.
2. Start your FastAPI backend:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
3. Edit `js/config.js` to point `BASE_URL` at your server if needed.

---

## File Structure

```
marketintel/
├── index.html              ← main entry point
├── css/
│   ├── reset.css           ← minimal reset
│   ├── variables.css       ← design tokens (colours, spacing, fonts)
│   ├── layout.css          ← page skeleton (topbar, sidebar, panels)
│   ├── components.css      ← all UI components
│   └── animations.css      ← keyframes and transitions
└── js/
    ├── config.js           ← API base URL + endpoint map
    ├── data.js             ← price table seed data + CSV export
    ├── competitors.js      ← competitor cards rendering
    ├── signals.js          ← signal feed rendering + live injection
    ├── advisor.js          ← AI pivot suggestions + chat helpers
    ├── trends.js           ← search volume trend mini-charts
    ├── alerts.js           ← alert toggle cards
    ├── ticker.js           ← price ticker bar
    ├── charts.js           ← KPI counter animations
    ├── api.js              ← all FastAPI calls (with mock fallbacks)
    └── main.js             ← app bootstrap, event handlers
```

---

## Backend API Endpoints Expected

| Method | Path | Description |
|--------|------|-------------|
| GET    | `/api/signals`     | Returns latest signals array |
| GET    | `/api/competitors` | Returns competitor data |
| GET    | `/api/prices`      | Returns price shift table |
| POST   | `/api/ask`         | Sends query to Ollama agent |
| GET    | `/api/trends`      | Search volume trend data |
| GET    | `/api/alerts`      | Alert configs |
| PATCH  | `/api/alerts/:id`  | Toggle alert on/off |

### POST /api/ask payload
```json
{
  "query": "why did rival drop prices?",
  "model": "qwen2.5:14b",
  "context": { "competitors": ["RivalCo A"], "recentSignals": 4 }
}
```

### Expected response
```json
{ "response": "Agent analysis text here..." }
```

---

## Customisation

- **Colours**: edit `css/variables.css` — all colours are CSS custom properties
- **Mock data**: edit the `const` arrays at the top of each `js/*.js` file
- **Refresh rate**: change `REFRESH_INTERVAL` in `js/config.js`
- **Models**: change `MODELS.strategic` / `MODELS.reasoning` in `js/config.js`
