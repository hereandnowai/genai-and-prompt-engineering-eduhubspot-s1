<div align="center">

# 🤖 AI Personal Assistant Chatbot

### *Powered by HERE AND NOW AI*

**"AI is Good"**

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?style=for-the-badge&logo=python)](https://python.org)
[![LangChain](https://img.shields.io/badge/LangChain-1.x-green?style=for-the-badge)](https://langchain.com)
[![Groq](https://img.shields.io/badge/Groq-LLM-orange?style=for-the-badge)](https://groq.com)
[![Gradio](https://img.shields.io/badge/Gradio-6.x-yellow?style=for-the-badge)](https://gradio.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

---

**Website**: [hereandnowai.com](https://hereandnowai.com)

</div>

---

## 📖 Overview

An **AI-powered personal assistant chatbot** that answers questions about **Navin Jaganathan** — a Senior Linux Engineer with 19+ years of experience. The chatbot uses Navin's resume/CV as its knowledge base and responds to user queries about his professional background, skills, certifications, and career history.

Built with a **Retrieval-Augmented Generation (RAG)** pipeline, the assistant retrieves the most relevant sections of the resume before answering, ensuring accurate and grounded responses.

---

## ✨ Features

- 🔍 **RAG Pipeline** — Retrieves relevant resume chunks before generating answers
- 💬 **Multi-turn Conversations** — Full chat history context preserved across turns
- 🧠 **Groq LLM** — Fast inference with `openai/gpt-oss-120b` model
- 📄 **PDF Ingestion** — Automatic parsing and chunking of the resume PDF
- 🗂️ **FAISS Vector Store** — In-memory semantic search over resume content
- 🎯 **Persona-locked** — Only answers questions about Navin; politely declines off-topic queries
- 🚀 **HuggingFace Spaces Ready** — `app.py` is the entry point

---

## 🏗️ Tech Stack

| Component | Technology |
|---|---|
| Language | Python 3.10+ |
| LLM Framework | LangChain 1.x |
| LLM Inference | Groq (`openai/gpt-oss-120b`) |
| UI | Gradio 6.x |
| Document Loader | LangChain PDF Loader (PyPDF) |
| Vector Store | FAISS (in-memory) |
| Embeddings | HuggingFace `sentence-transformers/all-MiniLM-L6-v2` |

---

## 📂 Project Structure

```
project/
├── app.py                          # Main application (HuggingFace Spaces entry point)
├── NAVIN_JAGANATHAN_Resume_0.pdf   # Resume PDF (knowledge base)
├── requirements.txt                # Python dependencies
├── .env                            # GROQ_API_KEY (local dev only)
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- A [Groq API key](https://console.groq.com)

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/hereandnowai/personal-assistant-chatbot.git
cd personal-assistant-chatbot

# 2. Create and activate a virtual environment
python3 -m venv .venv
source .venv/bin/activate  # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Add your Groq API key
echo "GROQ_API_KEY=your_key_here" > .env

# 5. Place the resume PDF in the project root
# File: NAVIN_JAGANATHAN_Resume_0.pdf

# 6. Run the app
python app.py
```

The app will be available at **http://127.0.0.1:7860**

---

## ☁️ HuggingFace Spaces Deployment

1. Create a new **Gradio** Space at [huggingface.co/spaces](https://huggingface.co/spaces)
2. Upload all project files
3. Add `GROQ_API_KEY` as a **Space Secret** (Settings → Variables and Secrets)
4. The Space will automatically launch `app.py`

---

## 💬 Example Questions

- *"What are Navin's AWS skills?"*
- *"How many years of experience does he have?"*
- *"What Linux certifications does Navin hold?"*
- *"Which companies has Navin worked for?"*
- *"What is Navin's most recent role?"*
- *"Tell me about Navin's education background."*

---

## 🔐 Security

- The Groq API key is **never hardcoded** — always loaded from environment variables
- The `.env` file is listed in `.gitignore` and must never be committed
- For production, use HuggingFace Space Secrets or a secrets manager

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**HERE AND NOW AI** — *"AI is Good"*

[hereandnowai.com](https://hereandnowai.com)

</div>
