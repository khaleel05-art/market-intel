import json
from datetime import datetime
import ollama
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models import Product, CompetitorProduct, ReviewSignal, MarketInsight
from config import settings

class CompetitiveIntelligenceAgent:
    def __init__(self, db: AsyncSession):
        self.db = db
        # Initialize ollama client with host and long timeout
        self.client = ollama.AsyncClient(host=settings.ollama_host, timeout=300)
        self.reasoning_model = settings.deep_reasoning_model
        self.throughput_model = settings.throughput_model

    async def ingest_review_and_analyze(self, source: str, raw_text: str, product_id: int = None, competitor_id: int = None) -> ReviewSignal:
        """
        Uses the high-throughput DeepSeek model to extract sentiment, features, and complaints.
        """
        prompt = f"""
You are a highly analytical e-commerce review extraction algorithm.
Analyze the following review and extract:
1. sentiment (Positive, Neutral, Negative)
2. complaints (List of specific material or service complaints, e.g., ["cheap plastic", "arrived broken"]. Empty list if none.)
3. features_praised (List of specific features praised. Empty list if none.)

Output ONLY valid JSON with keys: "sentiment", "complaints", "features". Do not add any conversational text.

Review:
{raw_text}
"""
        
        response = await self.client.generate(
            model=self.throughput_model,
            prompt=prompt,
            format="json"
        )
        
        try:
            structured_data = json.loads(response['response'])
        except json.JSONDecodeError:
            # Fallback if model fails to output clean JSON
            structured_data = {"sentiment": "Unknown", "complaints": [], "features": []}

        new_signal = ReviewSignal(
            source=source,
            raw_text=raw_text,
            product_id=product_id,
            competitor_product_id=competitor_id,
            extracted_sentiment=structured_data.get("sentiment", "Unknown"),
            extracted_complaints=structured_data.get("complaints", []),
            extracted_features=structured_data.get("features", [])
        )
        self.db.add(new_signal)
        await self.db.commit()
        await self.db.refresh(new_signal)
        return new_signal

    async def chat(self, query: str, context: dict) -> str:
        """
        General chatbot endpoint for strategic questions.
        """
        prompt = f"""
You are a strategic assistant for MarketIntel, a competitive intelligence platform.
Your goal is to provide professional, concise, and highly strategic responses to the user's questions.

Context from UI:
{json.dumps(context, indent=2)}

User Question:
{query}

Strategic Response:
"""
        response = await self.client.generate(
            model=self.reasoning_model,
            prompt=prompt
        )
        return response['response']

    async def run_market_reasoning_for_product(self, product_id: int) -> MarketInsight:
        """
        Uses the deep-reasoning Qwen model to cross-reference our product reviews with competitor price/tactics.
        """
        # Gather context
        product_result = await self.db.execute(select(Product).where(Product.id == product_id))
        product = product_result.scalar_one_or_none()
        
        if not product:
            raise ValueError("Product not found")

        # Get our recent negative/neutral reviews
        our_signals_result = await self.db.execute(
            select(ReviewSignal).where(ReviewSignal.product_id == product_id, ReviewSignal.extracted_sentiment.in_(["Negative", "Neutral"]))
        )
        our_signals = our_signals_result.scalars().all()
        
        # Get competitor data
        competitors_result = await self.db.execute(
            select(CompetitorProduct).where(CompetitorProduct.product_id == product_id)
        )
        competitors = competitors_result.scalars().all()

        complaints_list = []
        for sig in our_signals:
            if sig.extracted_complaints:
                complaints_list.extend(sig.extracted_complaints)
        
        comp_price_info = [
            f"{c.competitor_name} priced at ${c.current_price} (Our price: ${product.base_price})" for c in competitors
        ]

        prompt = f"""
You are an advanced strategic competitive intelligence agent for an e-commerce seller.
Your task is to independently synthesize cross-platform pricing shifts and review sentiments, and proactively suggest pivot strategies.

Context:
Our Product: {product.name}
Our Current Price: ${product.base_price}
Recent customer complaints regarding our product: {', '.join(set(complaints_list)) if complaints_list else 'None detected recently.'}
Competitor Information: {'; '.join(comp_price_info)}

Based on this limited disparate data, connect the signals:
1. Is there a strategic vulnerability we have due to material complaints combined with competitor pricing?
2. What is the recommended actionable strategy pivot (e.g., lower price, change ad copy to address the specific complaint, highlight different features)?

Provide your response in JSON format with keys:
"insight_type": (String, e.g., "PRICE_VS_QUALITY_THREAT", "OPPORTUNITY_TO_PIVOT")
"summary": (String, Brief summary of your finding)
"recommended_action": (String, Highly actionable recommendation)
"reasoning_log": (String, Your step-by-step reasoning connecting the disparate signals)
"""
        response = await self.client.generate(
            model=self.reasoning_model,
            prompt=prompt,
            format="json"
        )
        
        try:
            structured_data = json.loads(response['response'])
        except json.JSONDecodeError:
            structured_data = {
                "insight_type": "ERROR",
                "summary": "Failed to generate structured reasoning.",
                "recommended_action": "Manual review required.",
                "reasoning_log": response['response']
            }

        insight = MarketInsight(
            product_id=product_id,
            insight_type=structured_data.get("insight_type"),
            summary=structured_data.get("summary"),
            recommended_action=structured_data.get("recommended_action"),
            reasoning_log=structured_data.get("reasoning_log"),
            status="NEW"
        )
        self.db.add(insight)
        await self.db.commit()
        await self.db.refresh(insight)
        return insight
