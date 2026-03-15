from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional

from database import get_db
from models import Product, CompetitorProduct, ReviewSignal, MarketInsight
from agent import CompetitiveIntelligenceAgent

router = APIRouter()

# --- Pydantic Schemas ---
class ProductCreate(BaseModel):
    sku: str
    name: str
    description: str
    base_price: float

class CompetitorProductCreate(BaseModel):
    product_id: int
    competitor_name: str
    competitor_sku: str
    current_price: float
    url: str

class ReviewCreate(BaseModel):
    product_id: Optional[int] = None
    competitor_product_id: Optional[int] = None
    source: str
    raw_text: str

# --- Endpoints ---
@router.post("/products", response_model=dict)
async def create_product(product: ProductCreate, db: AsyncSession = Depends(get_db)):
    new_product = Product(**product.dict())
    db.add(new_product)
    await db.commit()
    await db.refresh(new_product)
    return {"id": new_product.id, "message": "Product created successfully"}

@router.post("/competitors", response_model=dict)
async def add_competitor(comp: CompetitorProductCreate, db: AsyncSession = Depends(get_db)):
    new_comp = CompetitorProduct(**comp.dict())
    db.add(new_comp)
    await db.commit()
    await db.refresh(new_comp)
    return {"id": new_comp.id, "message": "Competitor added successfully"}

@router.post("/reviews/ingest")
async def ingest_review(
    review: ReviewCreate, 
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    """
    Ingest a raw review and process it asynchronously with the throughput LLM.
    """
    async def process_background_review(rev_data: dict, db_session: AsyncSession):
        agent = CompetitiveIntelligenceAgent(db_session)
        await agent.ingest_review_and_analyze(
            source=rev_data['source'],
            raw_text=rev_data['raw_text'],
            product_id=rev_data['product_id'],
            competitor_id=rev_data['competitor_product_id']
        )
    
    # Run sentiment parsing and DB insertion in background task
    background_tasks.add_task(process_background_review, review.dict(), db)
    return {"message": "Review ingestion started"}

@router.post("/agent/trigger/{product_id}")
async def trigger_agent_reasoning(product_id: int, db: AsyncSession = Depends(get_db)):
    """
    Trigger the reasoning Agent (Deep Qwen) to independently synthesize the latest cross-platform signals.
    """
    agent = CompetitiveIntelligenceAgent(db)
    try:
        insight = await agent.run_market_reasoning_for_product(product_id)
        return {
            "insight_id": insight.id,
            "insight_type": insight.insight_type,
            "summary": insight.summary,
            "recommended_action": insight.recommended_action
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/insights", response_model=List[dict])
async def get_insights(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(MarketInsight).order_by(MarketInsight.created_at.desc()))
    insights = result.scalars().all()
    return [
        {
            "id": i.id,
            "product_id": i.product_id,
            "insight_type": i.insight_type,
            "summary": i.summary,
            "recommended_action": i.recommended_action,
            "reasoning_log": i.reasoning_log,
            "status": i.status
        }
        for i in insights
    ]

# --- Frontend Stub Endpoints ---
@router.get("/signals")
async def get_signals():
    # Return dummy signals or fetch from DB (for now return dummy to satiate UI)
    return {"signals": [
        {
            "color": "var(--cyan)",
            "bg": "rgba(0,229,200,0.07)",
            "icon": "⚡",
            "title": "LIVE: Competitor A dropped price by 15%",
            "desc": "Alert triggered based on automated price scraping. Product X now undercuts our current base price.",
            "source": "PRICE SCRAPING",
            "time": "just now"
        }
    ]}

@router.get("/competitors", response_model=dict)
async def get_all_competitors(db: AsyncSession = Depends(get_db)):
    # Currently frontend expects a list of competitors
    result = await db.execute(select(CompetitorProduct))
    competitors = result.scalars().all()
    return {"competitors": [{"id": c.id, "name": c.competitor_name, "product_id": c.product_id, "price": c.current_price} for c in competitors]}

class AskQuery(BaseModel):
    query: str
    model: str
    context: dict

@router.post("/ask")
async def ask_agent(query: AskQuery, db: AsyncSession = Depends(get_db)):
    agent = CompetitiveIntelligenceAgent(db)
    response = await agent.chat(query.query, query.context)
    return {"response": response}

@router.get("/trends")
async def get_trends():
    return {"trends": []}

@router.get("/prices")
async def get_prices():
    return {"prices": {}}

@router.get("/alerts")
async def get_alerts():
    return {"alerts": []}

@router.get("/stats")
async def get_stats():
    return {
        "products_tracked": 12,
        "competitors_monitored": 48,
        "signals_today": 156,
        "insights_generated": 24
    }


