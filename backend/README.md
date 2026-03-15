# Competitive Intelligence Agent Backend

This folder contains the complete FastAPI backend for the competitive intelligence agent. It is configured to run on a local SQLite database and connect to a local Ollama instance.

## Setup Instructions on New Laptop

### 1. Prerequisites
- Install [Python 3](https://www.python.org/downloads/)
- Install [Ollama](https://ollama.com/)

### 2. Download LLM Models
Open a terminal and run the following commands to download the required lightweight AI models:
```bash
ollama pull qwen2.5:0.5b
```

### 3. Install Python Dependencies
Open a terminal in this `backend` folder and run:
```bash
# Optional: Create a virtual environment
python -m venv venv
# Windows: .\venv\Scripts\activate
# Mac/Linux: source venv/bin/activate

# Install the packages
pip install -r requirements.txt
```

### 4. Start the API Server
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```
> Note: We use `--host 0.0.0.0` so that if you run the frontend on a different laptop on the same Wi-Fi network, it can reach this backend using the laptop's local IP address (e.g., `http://192.168.1.15:8000`).

### 5. Connecting your Frontend
The API has CORS enabled for all origins (`*`).
Your frontend can make HTTP requests to:
- `POST /api/products`
- `POST /api/competitors`
- `POST /api/reviews/ingest`
- `POST /api/agent/trigger/{product_id}`
- `GET /api/insights`
