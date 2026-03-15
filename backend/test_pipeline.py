import asyncio
import httpx
import uuid

async def run_test():
    async with httpx.AsyncClient(base_url="http://localhost:8000", timeout=60.0) as client:
        # 1. Create a Product
        print("Creating Product...")
        unique_sku = f"SKU-ABC-{uuid.uuid4().hex[:6]}"
        resp = await client.post("/api/products", json={
            "sku": unique_sku,
            "name": "Eco-Friendly Water Bottle",
            "description": "A reusable, BPA-free water bottle.",
            "base_price": 25.0
        })
        print(resp.text)
        try:
            product_id = resp.json().get("id")
        except Exception:
            product_id = None

        # 2. Add a Competitor
        print("Adding Competitor...")
        resp = await client.post("/api/competitors", json={
            "product_id": product_id,
            "competitor_name": "Hydration Station",
            "competitor_sku": "HS-BTL-99",
            "current_price": 19.99, # Cheaper competitor!
            "url": "http://example.com/competitor"
        })
        print(resp.json())
        competitor_id = resp.json().get("id")

        # 3. Ingest some reviews
        print("Ingesting Reviews...")
        reviews = [
            "The bottle is okay, but the lid feels like cheap plastic and leaks.",
            "Material is very poor, broke after 2 days. Cheap plastic.",
            "Love the color, but definitely a cheap plastic feel on the cap.",
            "Arrived late and the outer coating is peeling off."
        ]
        
        for rev in reviews:
            resp = await client.post("/api/reviews/ingest", json={
                "product_id": product_id,
                "competitor_product_id": None,
                "source": "Amazon",
                "raw_text": rev
            })
            print(resp.json())
        
        print("Waiting a few seconds for background LLM ingestion...")
        await asyncio.sleep(15) # Wait for local LLMs to process reviews

        # 4. Trigger Agent Reasoning
        print("Triggering Reasoning Agent...")
        resp = await client.post(f"/api/agent/trigger/{product_id}")
        print("Agent Insight Result:")
        print(resp.json())

        # 5. Fetch all insights
        print("Fetching all compiled insights...")
        resp = await client.get("/api/insights")
        print(resp.json())

if __name__ == "__main__":
    asyncio.run(run_test())
