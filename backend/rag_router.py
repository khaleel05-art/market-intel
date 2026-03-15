from fastapi import APIRouter, UploadFile, File, Form
from RAG_APP.index import register_file, aceess_file, file_exists
from langchain_core.prompts import PromptTemplate
import tempfile
from langchain_ollama import OllamaLLM
import hashlib
import os
import redis
import time
from dotenv import load_dotenv

load_dotenv()

prompt_template = """
You are answering questions strictly from the provided document context.

RULES (MANDATORY):
- Use ONLY words and phrases that appear in the context.
- DO NOT add new information.
- DO NOT paraphrase or summarize.
- DO NOT replace technical terms.
- Prefer copying full sentences verbatim from the context.
- You MAY stitch multiple sentences from the context if needed.
- Do NOT add introductory or concluding sentences.
- If the context contains NO relevant information at all, reply exactly:
  "Answer not found in the document."
- If He Talk Friendly then you talk Friendly

Context:
{context}

Question:
{question}

Answer:
"""

def get_redis_client():
    """Get Redis client from environment variables or return None if failed"""
    try:
        redis_host = os.getenv("REDIS_HOST", "localhost")
        redis_port = int(os.getenv("REDIS_PORT", "6379"))
        redis_db = int(os.getenv("REDIS_DB", "0"))
        client = redis.Redis(host=redis_host, port=redis_port, db=redis_db, decode_responses=False, socket_timeout=2)
        client.ping() # Verify connection
        return client
    except Exception:
        return None

# Initialize Ollama LLM with environment variables
ollama_base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
ollama_model = os.getenv("OLLAMA_MODEL", "deepseek-r1:1.5b")
ollama_temperature = float(os.getenv("OLLAMA_TEMPERATURE", "0.5"))

llm = OllamaLLM(
    model=ollama_model,
    temperature=ollama_temperature,
    base_url=ollama_base_url
)

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), query: str = Form(...)):
    try:
        start = time.time()
        content = await file.read()
        file_id = hashlib.sha256(content).hexdigest()
        cache_key = f"{file_id}:{query}"
        
        redis_client = get_redis_client()
        
        # 1. Check Cache
        if file_exists(file_id):
            if redis_client and redis_client.exists(cache_key):
                cached_answer = redis_client.get(cache_key)
                if cached_answer:
                    return {"answer": cached_answer.decode('utf-8'), "cached": True}

        # 2. Register File if not exists
        if not file_exists(file_id):
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
                temp_file.write(content)
                temp_file_path = temp_file.name
            
            try:
                register_file(temp_file_path, file_id)
            finally:
                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)

        # 3. Retrieve and Generate
        retriever = aceess_file(file_id)
        docs = retriever.invoke(query)
        context = " ".join([doc.page_content for doc in docs])
        
        PROMPT = PromptTemplate(template=prompt_template, input_variables=["context", "question"])
        prompt_with_context = PROMPT.format(context=context, question=query)
        
        rag_chain_response = llm.invoke(prompt_with_context)
        
        # 4. Cache response
        if redis_client:
            redis_client.setex(cache_key, 3600, value=rag_chain_response)
        
        end = time.time()
        return {"answer": rag_chain_response, "execution_time": end - start, "cached": False}
        
    except Exception as e:
        return {"error": str(e)}
