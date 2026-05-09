# PDF RAG Chatbot (LangChain + Gemini + Gradio)

This is a simple Retrieval-Augmented Generation (RAG) chatbot that:
- Ingests PDF files
- Splits text into chunks
- Indexes chunks into a FAISS vector store using Google AI Studio embeddings (default: `text-embedding-004`)
- Answers questions using Gemini (`gemini-1.5-pro` by default) with LangChain
- Provides a Gradio UI for uploading files and chatting

## Prerequisites
- Python 3.10+
- A Google AI Studio API key (export `GOOGLE_API_KEY`)

## Quickstart

1) Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate
```

2) Install dependencies

```bash
pip install -r requirements.txt
```

3) Configure environment

```bash
cp .env.example .env
# Then edit .env and set GOOGLE_API_KEY
```

Alternatively, export directly:

```bash
export GOOGLE_API_KEY=your_key_here
```

4) Run the app

```bash
python -m app.main
```

Then open the local URL printed by Gradio. Upload PDFs, click "Index PDFs", and ask questions.

## Configuration
- `GEMINI_MODEL` (default `gemini-1.5-pro`) — LLM for answering
- `EMBEDDING_MODEL` (default `text-embedding-004`) — Embedding model used for indexing
- `VECTORSTORE_DIR` (default `.rag_store/faiss_index`) — Where FAISS index persists

Update these in `.env` or your shell environment.

## Notes
- This project uses FAISS for simplicity. For larger datasets or concurrent access, consider Chroma or a hosted vector DB.
- If you prefer a different embedding model (e.g., local HF), swap `GoogleGenerativeAIEmbeddings` in `app/rag.py` for a `HuggingFaceEmbeddings` instance.
- The app will reuse an existing index on startup if `VECTORSTORE_DIR` exists; otherwise, upload and index PDFs first.
