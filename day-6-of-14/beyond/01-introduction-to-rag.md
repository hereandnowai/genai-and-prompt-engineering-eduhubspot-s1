# Day 6: Master Retrieval-Augmented Generation (RAG)

**Artificial Intelligence Masterclass · EduHubSpot**
**Lead Instructor: Ruthran Raghavan, Chief AI Scientist**

---

## 🎯 What is RAG?

**Retrieval-Augmented Generation (RAG)** is the process of giving an LLM (like Gemma) access to external data that wasn't in its original training.

Think of it like this:

* **Without RAG**: The AI is like a student taking a closed-book exam (it only knows what it memorized).
* **With RAG**: The AI is like a student taking an open-book exam (it can look at specific notes or textbooks to find the answer).

---

## 1. Simple Text RAG (`.txt`)

The easiest way to start is by reading a plain text file and putting its content directly into the prompt.

### How it works:

1. **Read**: Load your `my_notes.txt` or `profile.md` using Python.
2. **Inject**: Add that text to the "System" or "User" message.
3. **Prompt**: Ask the AI to "Only answer using the provided context."

**Check out the lab:** [day-6-of-14/6-chatbot-with-text-rag/chatbot_rag_text.py](day-6-of-14/6-chatbot-with-text-rag/chatbot_rag_text.py)

---

## 2. Advanced PDF RAG (`.pdf`)

Real-world data often lives in PDFs. Since LLMs can't "read" a PDF directly as a file, we use a utility to extract the text first.

### Key Tools:

* **PyPDFLoader**: A LangChain tool that breaks a PDF into pages.
* **Context Truncation**: If the PDF is too long (e.g., 100 pages), we can't fit it all in one prompt. We usually take the first few thousand characters in this simple stage.

**Check out the lab:** [day-6-of-14/7-chatbot-with-pdf-rag/chatbot_rag_pdf.py](day-6-of-14/7-chatbot-with-pdf-rag/chatbot_rag_pdf.py)

---

## 3. High-Performance Vector RAG (ChromaDB)

In professional apps, we don't just dump all text into the prompt. We use a **Vector Database** to find only the *most relevant* pieces of information.

### The 4-Step Pipeline:

1. **Load & Split**: Break large documents into small "Chunks" (e.g., 1,000 characters each).
2. **Embed**: Convert those text chunks into numbers (Vectors) using an **Embedding Model**.
3. **Store**: Save these vectors in a database like **ChromaDB**.
4. **Retrieve**: When a user asks a question, the system finds the "closest" vectors (Semantic Search) and sends only those chunks to the AI.

### Hybrid Search:

The professional standard (used in our Lab 8) combines:

* **Semantic Search**: Finds meaning (e.g., "Tell me about security" finds sections on "Authentication").
* **Keyword Search**: Finds exact words (e.g., "MCP" finds the specific acronym).

**Check out the lab:** [day-6-of-14/8-chatbot-with-vector-rag/chatbot.py](day-6-of-14/8-chatbot-with-vector-rag/chatbot.py)

---

## 🚀 Today's Mission

1. **Run Lab 6**: Teach the bot about your own handwritten notes.
2. **Run Lab 7**: Extract insights from the Chief AI Scientist's PDF profile.
3. **Build Lab 8**: Create a high-speed knowledge base using ChromaDB and vector embeddings.

**Remember: AI is Good.**
