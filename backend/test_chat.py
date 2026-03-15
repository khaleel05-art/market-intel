import asyncio
import json
from agent import CompetitiveIntelligenceAgent
from database import engine, Base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

async def test_chat():
    # Setup a mock DB session (not used for chat but required for init)
    async_engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async_session = sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        agent = CompetitiveIntelligenceAgent(session)
        print("Testing chat...")
        try:
            response = await agent.chat("What is the best pricing strategy?", {"competitors": []})
            print(f"Agent Response: {response}")
        except Exception as e:
            print(f"Error during chat: {e}")

if __name__ == "__main__":
    asyncio.run(test_chat())
