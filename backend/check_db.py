import asyncio
from database import engine, AsyncSessionLocal, Base
from models import Product

async def check():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with AsyncSessionLocal() as session:
        new_product = Product(sku="TEST-SKU", name="Name", description="Desc", base_price=10.0)
        session.add(new_product)
        await session.commit()
        await session.refresh(new_product)
        print(f"Created product ID: {new_product.id}")

asyncio.run(check())
