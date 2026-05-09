from dotenv import load_dotenv
from os import getenv
import os
import re
import ollama
import chromadb
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_groq import ChatGroq
from system_prompt import SYSTEM_PROMPT

load_dotenv()
MODEL = getenv("MODEL_NAME")
EMBED_MODEL = getenv("EMBED_MODEL")
GROQ_API_KEY = getenv("GROQ_API_KEY")
DOCUMENT_PATH = os.path.join(os.path.dirname(__file__), "mcp.pdf")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set in the environment variables.")

llm = ChatGroq(model=MODEL, temperature=0)

collection = chromadb.Client().create_collection(name="knowledge_base")
all_chunks: list[str] = []

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
    stop = {"who", "what", "when", "where", "why", "how", "is", "are", "do", "does", "did", "can", "could", "would", "should"}
    # what is mcp?
    return [token for token in re.findall(r"[a-z0-9]+", text.lower()) if token not in stop]

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

def retrieve_context(question, top_k=15):
    retrieval_query = _prepare_retrieval_query(question)

    # semantic search
    results = collection.query(query_embeddings=[get_embedding(retrieval_query)], n_results=top_k)
    semantic = (results["documents"] or [[]])[0]
    semantic_set = set(semantic)

    # keyword search
    keywords = _keyword_tokens(retrieval_query)
    scored = sorted(all_chunks, key=lambda c: sum(1 for kw in keywords if kw in c.lower()), reverse=True)
    keyword_hit = [c for c in scored[:10] if c not in semantic_set and any(kw in c.lower() for kw in keywords)]

    return "\n\n".join(semantic + keyword_hit)

def get_streaming_response(user_input):
    context = retrieve_context(user_input)
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        HumanMessage(content=f"Context:\n{context}\n\nQuestion: {user_input}")
    ]
    yield ("thinking", f"Retrieved relevant document chunk. Asking {MODEL}...\n")
    for chunk in llm.stream(messages):
        text = _chunk_to_text(chunk.content)
        if text:
            yield ("response", text)

build_vector_store()

if __name__ == "__main__":
    print(f"RAG Chatbot using {MODEL} is ready. Ask your questions!")
    while True:
        user_input = input("User: ")
        if user_input.lower() == "exit":
            break
        for kind, text in get_streaming_response(user_input):
            print(text, end="", flush=True)
        print("\n")
