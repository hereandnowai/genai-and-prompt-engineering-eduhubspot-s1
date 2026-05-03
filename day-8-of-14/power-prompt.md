# MASTER PROMPT

## ROLE

You are an expert AI software engineer and system architect. Your task is to build a **production-ready RAG (Retrieval-Augmented Generation) chatbot application** using Python.

You will act as a coding agent working inside GitHub Copilot (Claude Sonnet 4.6). You must generate clean, modular, scalable, and well-documented code.

---

## OBJECTIVE

Build a chatbot system that:

1. Accepts PDF documents as input
2. Processes and indexes the content
3. Allows users to ask questions
4. Answers strictly based on uploaded documents

---

## TECH STACK (MANDATORY)

* Language: Python3.11
* Framework: LangChain version that supports python3.11
* LLM: gemma-4-31b
* Embeddings: gemini-embedding-2
* UI: Gradio version that supports python3.11
* Vector Store: FAISS (default) or Chroma (optional)
* Environment: .env for API key management

---

## CORE FEATURES

### 1. DOCUMENT INGESTION

* Upload one or multiple PDF files
* Extract text using a robust parser (PyPDFLoader or similar)
* Handle large PDFs efficiently

### 2. TEXT PROCESSING

* Chunk text using RecursiveCharacterTextSplitter
* Maintain optimal chunk size (500–1000 tokens)
* Add overlap for better context (50–150 tokens)

### 3. EMBEDDING PIPELINE

* Use Google Embedding API
* Convert chunks into vector embeddings
* Store embeddings in vector database

### 4. VECTOR DATABASE

* Use FAISS or Chroma
* Enable similarity search
* Support top-k retrieval

### 5. RETRIEVAL SYSTEM

* Retrieve relevant chunks based on user query
* Use similarity search with configurable k value

### 6. GENERATION (LLM)

* Use Gemini model via API key
* Ensure responses are grounded in retrieved context
* Prevent hallucination

### 7. PROMPT ENGINEERING (IMPORTANT)

* Always include retrieved context
* Strict instruction:
  * If answer not in context, say "I don't know based on the provided documents"

Example system prompt:
"You are a helpful assistant. Answer ONLY using the provided context. Do not use external knowledge. If the answer is not present, say you do not know."

### 8. USER INTERFACE (GRADIO)

* File upload component
* Chat interface
* Display chat history
* Clean and simple UI

---

## PROJECT STRUCTURE

Create clean modular structure:

* app.py (main entry)
* ingestion.py (PDF loading + chunking)
* embeddings.py (embedding logic)
* vectorstore.py (vector DB handling)
* retriever.py (retrieval logic)
* llm.py (Gemini integration)
* ui.py (Gradio interface)
* utils.py (helper functions)
* .env (API keys)
* requirements.txt

---

## IMPLEMENTATION STEPS

1. Setup environment and install dependencies
2. Load API keys securely from .env
3. Build PDF ingestion pipeline
4. Implement chunking strategy
5. Integrate Google embeddings
6. Store embeddings in FAISS/Chroma
7. Build retrieval pipeline
8. Integrate Gemini LLM
9. Construct RAG chain using LangChain
10. Build Gradio UI
11. Connect backend with UI
12. Test end-to-end flow

---

## QUALITY REQUIREMENTS

* Clean, readable, and modular code
* Proper error handling
* Logging support
* Comments for every module
* Scalable design

---

## BONUS (IF POSSIBLE)

* Add caching for embeddings
* Add document re-upload handling
* Add streaming responses
* Add multi-file context merging
* Add conversation memory

---

## OUTPUT EXPECTATION

You must generate:

1. Complete working code
2. Step-by-step setup instructions
3. requirements.txt
4. Sample .env format
5. How to run the app locally

---

## FINAL INSTRUCTION

Do not skip steps.
Do not give partial code.
Build this like a real production-grade system suitable for deployment.

Think step-by-step and implement systematically.
