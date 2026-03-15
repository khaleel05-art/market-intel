import asyncio
import httpx

async def seed():
    async with httpx.AsyncClient() as client:
        # Create a product
        resp = await client.post("http://localhost:8000/api/products", json={
            "sku": f"AGENT-PRO-{int(time.time())}",
            "name": "MarketIntel Agentic Hub",
            "description": "Premium competitive intelligence dashboard with agentic reasoning.",
            "base_price": 250.0
        })
        print(f"Product creation: {resp.status_code}, {resp.text}")

if __name__ == "__main__":
    # Wait a bit for server to start
    import time
    time.sleep(5)
    asyncio.run(seed())
