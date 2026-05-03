from dotenv import load_dotenv
from os import getenv
import os
import re
import ollama
import chromadb
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from system_prompt_simple import system_prompt

load_dotenv()
MODEL = getenv("GROQ_MODEL", getenv("MODEL_NAME_GROQ", "llama-3.1-8b-instant"))
EMBED_MODEL = getenv("EMBED_MODEL", "embeddinggemma:latest")
GROQ_API_KEY = getenv("GROQ_API_KEY")
DOCUMENT_PATH = os.path.join(os.path.dirname(__file__), "mcp.pdf")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY not found. Add it to your .env file before running this chatbot.")

llm = ChatGroq(model=MODEL, temperature=0)

# --- Step 1: Set up ChromaDB vector store ---
collection = chromadb.Client().create_collection(name="knowledge_base")
all_chunks: list[str] = []  # kept in memory for keyword search

def get_embedding(text):
    return ollama.embeddings(model=EMBED_MODEL, prompt=text)["embedding"]


def _chunk_to_text(content):
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for item in content:
            if isinstance(item, dict):
                parts.append(item.get("text", ""))
            else:
                parts.append(str(item))
        return "".join(parts)
    return str(content)


def _prepare_retrieval_query(user_input):
    for line in user_input.splitlines():
        line = line.strip()
        if line:
            return line
    return user_input.strip()


def _keyword_tokens(text):
    stop = {"who", "what", "when", "where", "how", "did", "does", "the", "and", "for", "was", "are", "with", "into", "that"}
    return [token for token in re.findall(r"[a-z0-9]+", text.lower()) if token not in stop]

# --- Step 2: Load PDF, split into chunks, embed and store ---
def build_vector_store():
    print(f"Indexing: {DOCUMENT_PATH}...")
    docs = PyPDFLoader(DOCUMENT_PATH).load()
    chunks = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200).split_documents(docs)
    for i, chunk in enumerate(chunks):
        all_chunks.append(chunk.page_content)
        collection.add(
            ids=[f"chunk_{i}"],
            embeddings=[get_embedding(chunk.page_content)],
            documents=[chunk.page_content]
        )
    print(f"Indexed {len(chunks)} chunks.")

# --- Step 3: Retrieve relevant chunks (semantic + keyword) ---
def retrieve_context(question, top_k=15):
    retrieval_query = _prepare_retrieval_query(question)

    # Semantic search via ChromaDB
    results = collection.query(query_embeddings=[get_embedding(retrieval_query)], n_results=top_k)
    semantic = (results["documents"] or [[]])[0]
    semantic_set = set(semantic)

    # Keyword search — score every chunk by how many question words it contains
    keywords = _keyword_tokens(retrieval_query)
    scored = sorted(all_chunks, key=lambda c: sum(1 for kw in keywords if kw in c.lower()), reverse=True)
    keyword_hits = [c for c in scored[:10] if c not in semantic_set and any(kw in c.lower() for kw in keywords)]

    return "\n\n".join(semantic + keyword_hits)

# --- Step 4: Stream a response using retrieved context ---
def get_streaming_response(user_input):
    context = retrieve_context(user_input)
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=f"Context:\n{context}\n\nQuestion: {user_input}"),
    ]
    yield ("thinking", f"Retrieved relevant document chunks. Asking Groq model {MODEL}...\n")
    for chunk in llm.stream(messages):
        text = _chunk_to_text(chunk.content)
        if text:
            yield ("response", text)

build_vector_store()

if __name__ == "__main__":
    print(f"Vector RAG Chatbot ({MODEL}) ready! Type 'quit' to exit.\n")
    while True:
        user_input = input("You: ")
        if user_input.lower() == "quit":
            break
        for kind, text in get_streaming_response(user_input):
            print(text, end="", flush=True)
        print("\n")
