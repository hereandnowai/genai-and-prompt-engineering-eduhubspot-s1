# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A hands-on AI education curriculum (14-day course) from HERE AND NOW AI. Each numbered folder under `day-N-of-14/` is a standalone chatbot lab, progressively adding features: memory → system prompts → streaming → thinking blocks → RAG.

## Setup & Running

```bash
# Install dependencies (use the project's virtual environment)
pip install -r requirements.txt

# Run any project — each has its own app.py
python day-5-of-14/5-chatbot-with-streaming-with-thinking/app.py
# Opens Gradio UI at http://localhost:7860
```

**Environment:** Copy `.env` with:
- `MODEL_NAME_LOCAL` — Ollama model (e.g. `gemma3:4b`)
- `MODEL_NAME_GROQ` — Groq model identifier
- `GROQ_API_KEY` — Groq API key

**Prerequisite:** Ollama must be running locally with the target model pulled (`ollama pull gemma3:4b`).

## Architecture

Each lab follows the same three-layer pattern:

```
app.py  →  chatbot.py  →  LLM backend (Ollama or Groq)
              ↑
        system_prompt.py
```

- **`app.py`** — Gradio web UI; calls into `chatbot.py` via a `respond()` function
- **`chatbot.py`** — Builds the message list (system + conversation history), calls the LLM, returns response (or yields tokens for streaming)
- **`system_prompt.py`** — String constant defining the "Caramel AI" teacher persona: role, task, format constraints

### LLM Backends

- **Ollama (local):** Used in Day 4–5 via `langchain-ollama` (`ChatOllama`) or raw `ollama.chat()` for streaming
- **Groq (cloud):** Via `langchain-groq` (`ChatGroq`) as an alternative backend
- Streaming projects use `ollama.chat(..., stream=True)` and `yield` chunks to Gradio

### Conversation Memory

- **No memory (project 1):** Fresh LLM call each turn
- **String accumulation (project 2):** Global `context` string appended each turn
- **List-based history (projects 3–5):** `messages` list of `{"role": ..., "content": ...}` dicts; correct LangChain pattern

### Thinking Blocks (project 5)

`chatbot.py` separates `chunk["message"].get("thinking")` from `chunk["message"]["content"]`; `app.py` renders thinking in a collapsible `gr.Accordion`.

## Progression Map

| Folder | Concept Added |
|--------|--------------|
| `day-4-of-14/1-chatbot-wom/` | Stateless LLM call |
| `day-4-of-14/2-chatbot-with-memory/` | String-based memory |
| `day-5-of-14/3-chatbot-with-system-prompt/` | System prompt + list-based history |
| `day-5-of-14/4-chatbot-with-streaming/` | Token streaming via `yield` |
| `day-5-of-14/5-chatbot-with-streaming-with-thinking/` | Thinking block parsing |
| `day-6-of-14-context-for-day-6/` | RAG architecture docs (not yet implemented) |

## Day 6 RAG (Planned)

Three approaches documented in `day-6-of-14-context-for-day-6/`:
1. **Text RAG** — inject entire `.md`/`.txt` file into system prompt
2. **PDF RAG** — `PyPDFLoader` → extract pages → inject into prompt
3. **Vector RAG** — chunk PDF → embed with `embeddinggemma` → store in ChromaDB → hybrid retrieval (15 semantic + keyword) → inject only relevant chunks
