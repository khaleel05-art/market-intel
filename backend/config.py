import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "sqlite+aiosqlite:///./compintel.db"
    ollama_host: str = "http://localhost:11434"
    deep_reasoning_model: str = "deepseek-r1:1.5b"
    throughput_model: str = "deepseek-r1:1.5b"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
