import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(Text)
    base_price = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CompetitorProduct(Base):
    __tablename__ = "competitor_products"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    competitor_name = Column(String)
    competitor_sku = Column(String)
    current_price = Column(Float)
    url = Column(String)
    last_checked = Column(DateTime, default=datetime.datetime.utcnow)
    
    product = relationship("Product")

class ReviewSignal(Base):
    __tablename__ = "review_signals"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=True)
    competitor_product_id = Column(Integer, ForeignKey("competitor_products.id"), nullable=True)
    source = Column(String) # e.g., Amazon, Shopify
    raw_text = Column(Text)
    extracted_sentiment = Column(String, nullable=True) # Positive, Neutral, Negative
    extracted_complaints = Column(JSON, nullable=True) # E.g., ["material defect", "late shipping"]
    extracted_features = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class MarketInsight(Base):
    __tablename__ = "market_insights"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"))
    insight_type = Column(String) # E.g., "PRICE_DROP_CORRELATION", "MATERIAL_COMPLAINT_OPPORTUNITY"
    summary = Column(Text)
    recommended_action = Column(Text) # "Drop price by 5%", "Highlight superior material in ads"
    reasoning_log = Column(Text) # The LLM's step-by-step thinking
    status = Column(String, default="NEW") # NEW, ACTED_UPON, DISMISSED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
