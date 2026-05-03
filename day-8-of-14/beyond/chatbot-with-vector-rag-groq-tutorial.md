# Chatbot with Vector RAG (Groq) — Tutorial

Goal: understand and run the RAG chatbot in `day-8-of-14/chatbot-with-vector-rag-groq` (`app.py`, `chatbot.py`, `system_prompt_simple.py`) and know the concepts behind it.

What you’ll build
- A Gradio chat app that retrieves relevant chunks from your documents (vector store) and answers with an LLM (Groq or alternatives).
- Optional memory: keep short conversation context.

Prereqs (quick)
- See Day 8 prerequisites: `day-8-of-14/0-prerequisites.md` (Python 3.11, venv, VS Code).
- Python packages: gradio, langchain, langchain-community, tiktoken, python-dotenv, chromadb, groq (and/or langchain-groq). Optionally: faiss-cpu, sentence-transformers.

Install
```bash
python3.11 -m venv .venv
source .venv/bin/activate  # Windows: . .venv\Scripts\Activate.ps1
pip install -U pip
pip install gradio langchain langchain-community tiktoken python-dotenv chromadb groq langchain-groq
# Optional vector backend
# pip install faiss-cpu sentence-transformers
```

Environment variables (.env at repo root)
```dotenv
# LLM providers (pick one or more you use)
GROQ_API_KEY=...
OPENAI_API_KEY=sk-...
OPENROUTER_API_KEY=or-...
OPENAI_BASE_URL=https://openrouter.ai/api/v1
ANTHROPIC_API_KEY=sk-ant-...
```
Note: Copilot keys set in VS Code Insiders (Model Picker) are for Copilot usage, not for your Python app. Keep app keys in `.env`.

Project layout
- `app.py`: launches the Gradio UI and wires the chatbot function.
- `chatbot.py`: core RAG pipeline (load/split/embedding/store/retriever + LLM call).
- `system_prompt_simple.py`: a concise system prompt template to ground the assistant.

RAG concepts (fast tour)
1) Chunking: split docs into overlapping chunks (e.g., 700–1200 tokens, 10–15% overlap). Larger for code; smaller for FAQs.
2) Embeddings: map text → vectors. Consistent model at index & query time. Examples:
   - OpenAI: text-embedding-3-large/small
   - Google AI Studio: text-embedding-004 (see links below)
   - SentenceTransformers: all-MiniLM-L6-v2 (local)
3) Vector store: persist embeddings for fast similarity search.
   - Easiest: ChromaDB (local lightweight)
   - Alternative: FAISS (local, fast), cloud vector DBs (Pinecone, Weaviate, Qdrant)
4) Retrieval: select top-k chunks (often 3–8). Consider mmr/diversity, filter by metadata.
5) Prompting: system prompt + instructions + retrieved context + user query; keep inputs under model’s context window.
6) Generation: LLM produces the answer citing retrieved info; optionally include source refs.

Minimal RAG flow (LangChain-style pseudocode)
```python
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq

# 1) Load raw docs (adapt loaders to your data)
loader = DirectoryLoader("data", glob="**/*.txt", loader_cls=TextLoader)
docs = loader.load()

# 2) Split into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
chunks = splitter.split_documents(docs)

# 3) Embed & store (choose embeddings backend)
emb = OpenAIEmbeddings()  # or other embeddings
vectordb = Chroma.from_documents(chunks, emb, collection_name="rag")
retriever = vectordb.as_retriever(search_kwargs={"k": 5})

# 4) LLM via Groq (choose a model, e.g., llama3-70b-8192)
llm = ChatGroq(model_name="llama3-70b-8192")

# 5) Answer a question
context_docs = retriever.get_relevant_documents("What is X?")
context = "\n\n".join(d.page_content for d in context_docs)
prompt = f"""
You are a helpful assistant. Use the provided context to answer.
If unsure, say you don’t know.

Context:
{context}

User question: {{question}}
""".strip()
result = llm.invoke(prompt.replace("{{question}}", "What is X?"))
print(result.content)
```

Gradio wiring (typical `app.py`)
```python
import gradio as gr
from chatbot import chat_once  # your function that takes (message, history) and returns a reply

def respond(message, history):
    return chat_once(message, history)

demo = gr.ChatInterface(fn=respond, title="RAG Chatbot (Groq)")

demo.launch()
```

System prompt
- See `system_prompt_simple.py`. Keep it short, include behavior, citation style, and refusal policy. Example lines:
  - "If the answer isn’t in the retrieved context, admit you don’t know."
  - "Cite sources by filename or URL when possible."

How to run
```bash
cd day-8-of-14/chatbot-with-vector-rag-groq
python app.py
```
- Gradio prints a local URL; open it in your browser.

Quality tips
- Chunk size/overlap: start 800/120; tune by doc type.
- top_k: 4–6 is a good default. Try MMR: `search_type="mmr"` with `lambda_mult`.
- Prompt: instruct the model to only use provided context. Add a brief style guide.
- Hallucinations: tighten prompts, increase context quality, add citations.
- Latency: pre-index, choose smaller embedding models, reduce k, cache results.

Troubleshooting
- No results? Verify the data folder path, ensure embeddings created, and the same embedding model is used at query time.
- Token limits: if large context, reduce chunk size/k or use a model with a bigger context window.
- Keys: ensure `.env` is loaded (python-dotenv) or export vars in your shell.

References and learning materials
- RAG fundamentals
  - LangChain RAG: https://python.langchain.com/docs/use_cases/retrieval/
  - Chroma docs: https://docs.trychroma.com/
  - FAISS intro: https://faiss.ai/
- LLM providers & keys
  - Groq API: https://console.groq.com/keys (Python SDK: https://github.com/groq/groq-python)
  - OpenRouter keys: https://openrouter.ai/workspaces/default/keys
  - OpenAI API: https://platform.openai.com/docs/overview
  - Anthropic: https://docs.anthropic.com/claude/docs
  - Google API keys: https://aistudio.google.com/api-keys (Embeddings: see below)
- Embeddings & tokenization
  - OpenAI Tokenizer: https://platform.openai.com/tokenizer
  - Google Embedding 2 announcement: https://x.com/GoogleAI/status/2049903687016063456?s=20
  - TensorFlow Projector (embeddings visualizer): https://projector.tensorflow.org/
- Papers & explainers
  - Attention Is All You Need: https://arxiv.org/pdf/1706.03762
  - Transformer Explainer: https://poloclub.github.io/transformer-explainer/
- Gradio
  - Gradio docs: https://www.gradio.app/guides

Next steps
- Add your documents under `day-8-of-14/chatbot-with-vector-rag-groq/data/` and re-run indexing.
- If you share your exact `chatbot.py` interfaces, I can tailor the snippets above to your functions and options.
