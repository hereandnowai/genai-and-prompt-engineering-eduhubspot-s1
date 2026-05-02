# Day 6: Master Retrieval-Augmented Generation (RAG)

**Artificial Intelligence Masterclass · EduHubSpot**
**Lead Instructor: Ruthran Raghavan, Chief AI Scientist**

---

## 🎯 What is RAG?
**Retrieval-Augmented Generation (RAG)** is the process of giving an LLM (like Gemma or GPT-4) access to external data that wasn't in its original training. 

Think of it like this:
*   **Without RAG**: The AI is like a student taking a closed-book exam (it only knows what it memorized).
*   **With RAG**: The AI is like a student taking an open-book exam (it can look at specific notes or textbooks to find the answer).

---

## 1. Simple Text RAG (`.txt`)
The easiest way to start is by reading a plain text file and putting its content directly into the prompt.

### How it works:
1.  **Read**: Load your `my_notes.txt` or `profile.md` using Python.
2.  **Inject**: Add that text to the "System" or "User" message.
3.  **Prompt**: Ask the AI to "Only answer using the provided context."

---

## 2. Advanced PDF RAG (`.pdf`)
Real-world data often lives in PDFs. Since LLMs can't "read" a PDF directly as a file, we use a utility to extract the text first.

---

## 3. High-Performance Vector RAG (ChromaDB)
In professional apps, we don't just dump all text into the prompt. We use a **Vector Database** to find only the *most relevant* pieces of information.

### The 4-Step Pipeline:
1.  **Load & Split**: Break large documents into small "Chunks" (e.g., 1,000 characters each).
2.  **Embed**: Convert those text chunks into numbers (Vectors) using an **Embedding Model**.
3.  **Store**: Save these vectors in a database like **ChromaDB**.
4.  **Retrieve**: When a user asks a question, the system finds the "closest" vectors (Semantic Search) and sends only those chunks to the AI.

---

## 🚀 Today's Mission
1.  **Learn Text RAG**: Teach the bot about your own handwritten notes.
2.  **Learn PDF RAG**: Extract insights from technical documentation.
3.  **Build Vector RAG**: Create a high-speed knowledge base using ChromaDB and vector embeddings.

**Remember: AI is Good.**
