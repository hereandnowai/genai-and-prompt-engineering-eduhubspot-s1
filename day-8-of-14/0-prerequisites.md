# Day 8 — Prerequisites

Minimal setup for these labs (Python 3.11, Gradio UI, LangChain).

What you need
- VS Code Insiders (or Stable) + extensions: Python, Jupyter; GitHub Copilot/Chat optional
- Git (latest)
- Python 3.11 + pip + venv

Create a virtual env
```bash
python3.11 -m venv .venv
source .venv/bin/activate  # Windows: . .venv\Scripts\Activate.ps1
python -m pip install -U pip
```

Install Python deps
```bash
pip install openai langchain langchain-community tiktoken python-dotenv chromadb gradio
# Optional: jupyter, faiss-cpu, sentence-transformers (instead of chromadb)
```

API keys (.env at repo root; don’t commit)
```dotenv
OPENAI_API_KEY=sk-...
OPENROUTER_API_KEY=or-...
OPENAI_BASE_URL=https://openrouter.ai/api/v1
ANTHROPIC_API_KEY=sk-ant-...
```

Add keys to GitHub Copilot (VS Code Insiders)
1) In Copilot Chat, click model name → Other Models.
2) Click Add Models → choose OpenAI, OpenRouter, or Anthropic.
3) Paste your API key when prompted; enable models via the eyeball icon.
Note: Copilot keys are separate from your app’s .env. Enterprise may require BYO-LM policy.

Run the labs (Gradio)
```bash
python app.py
```

Tips
- Use chromadb for local vector storage. If FAISS wheels fail, stick to chromadb.
- If Ollama is running locally, it may appear in Copilot “Other Models” without a key.
