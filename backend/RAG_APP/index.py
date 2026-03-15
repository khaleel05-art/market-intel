import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_ollama import OllamaEmbeddings
from langchain_text_splitters import CharacterTextSplitter

# Directory for storing FAISS indices
DB_DIR = "RAG_Document_Store"
if not os.path.exists(DB_DIR):
    os.makedirs(DB_DIR)

def get_embeddings():
    # Using the local Ollama embeddings
    return OllamaEmbeddings(model="deepseek-r1:1.5b")

def register_file(file_path: str, file_id: str):
    """Load PDF, split into chunks, embed, and save to FAISS index."""
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    docs = text_splitter.split_documents(documents)
    
    embeddings = get_embeddings()
    vectorstore = FAISS.from_documents(docs, embeddings)
    vectorstore.save_local(os.path.join(DB_DIR, file_id))

def aceess_file(file_id: str):
    """Load FAISS index and return it as a retriever."""
    embeddings = get_embeddings()
    vectorstore = FAISS.load_local(
        os.path.join(DB_DIR, file_id), 
        embeddings, 
        allow_dangerous_deserialization=True
    )
    return vectorstore.as_retriever()

def file_exists(file_id: str) -> bool:
    """Check if the FAISS index for the given file_id exists."""
    return os.path.exists(os.path.join(DB_DIR, file_id))
