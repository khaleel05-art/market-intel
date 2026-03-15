from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from database import engine, Base
import models
from routers import router as api_router
from rag_router import router as rag_router
import os

from mangum import Mangum

app = FastAPI(title="Competitive Intelligence Agent")

# Allow connections from any frontend (local or network)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(rag_router, prefix="/api/rag")

# Serve frontend static files (only if running locally)
if os.getenv("VERCEL") is None:
    frontend_dir = os.path.dirname(os.path.dirname(__file__))
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="static")

handler = Mangum(app)

@app.on_event("startup")
async def startup():
    # Only for demonstration/dev: auto-create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
def read_root():
    return {"message": "Competitive Intelligence Agent is running. Monitor, Analyze, Pivot."}
