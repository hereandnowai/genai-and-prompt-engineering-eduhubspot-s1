# 📑 Project 2: Chatbot with PDF RAG

> **What is different vs Project 1?**
> Project 1 read a plain `.md` text file. This project reads a **PDF file** — which is more complex because PDFs have pages, formatting, headers, etc. We use a library called **LangChain** with `PyPDFLoader` to handle that complexity for us automatically.

---

## How This Project Works (Plain English)

1. When the app starts, it **opens the PDF file** using LangChain's `PyPDFLoader`.
2. The loader **extracts the text from every page** and joins it all into one long string.
3. That extracted text is **combined with the system prompt**, exactly like Project 1.
4. The combined prompt becomes the **first entry** in the conversation history list.
5. Every question you ask is answered using **only what was in the PDF**.
6. The conversation history is remembered so you can ask follow-up questions.

---

## Architecture Diagram

```mermaid
flowchart TD
    START(["👤 You open the app"])
    START --> STARTUP

    subgraph STARTUP ["🚀 STARTUP — Runs ONCE when the app launches"]
        S1["📄 Step 1: Locate the PDF file\nprofile-of-ruthran-raghavan.pdf\nPath is built using __file__ so it always works"]
        S1 --> S2["📖 Step 2: LangChain PyPDFLoader\nOpens and parses the PDF\nHandles pages, formatting, etc. automatically"]
        S2 --> S3["🔗 Step 3: Join all pages together\npage1_text + page2_text + page3_text ...\n= one long string of extracted text"]
        S3 --> S4["📝 Step 4: Build the full System Prompt\n= AI Instructions\n+ Extracted PDF text\ncombined into one big string"]
        S4 --> S5["🗂️ Step 5: Create Conversation History\nmessages = Python list\nFirst entry: the system prompt above"]
    end

    STARTUP --> RUNTIME

    subgraph RUNTIME ["💬 RUNTIME — Repeats every time you send a message"]
        R1(["👤 You type a question\nin the Gradio chat box"])
        R1 --> R2["➕ Step 6: Add your question\nto the messages list"]
        R2 --> R3["📤 Step 7: Send the FULL messages list\nto Ollama running on your computer\nModel: Gemma 3"]
        R3 --> R4["🧠 Gemma reads:\n- The system prompt\n- The full PDF content\n- Your question\n- All previous messages\n...and generates a reply"]
        R4 --> R5{"Tokens stream back\none piece at a time..."}
        R5 -->|"💭 Thinking tokens"| R6["Shown in a\n💭 collapsible Thinking block"]
        R5 -->|"💬 Answer tokens"| R7["Streamed word-by-word\nin the chat window"]
        R7 --> R8["💾 Step 8: Save AI reply\nback into messages list"]
    end

    R6 --> OUT(["👤 You see the answer\nin the Gradio web UI\n🌐 http://localhost:7860"])
    R8 --> OUT
```

---

## How is This Different from Project 1?

```mermaid
flowchart LR
    subgraph P1 ["📄 Project 1 — Plain Text File"]
        A1["open('profile.md')\nPython built-in"] --> B1["Returns plain text string\ninstantly"]
    end

    subgraph P2 ["📑 Project 2 — PDF File"]
        A2["PyPDFLoader('profile.pdf')\nLangChain library"] --> B2["Parses PDF structure\nExtracts text per page\nJoins pages together"]
        B2 --> C2["Returns a text string"]
    end

    B1 --> SAME["Both end up as a text string\npasted into the system prompt\nThe rest is identical!"]
    C2 --> SAME
```

> The only real difference is **how we get the text out of the file**. Once we have the text, everything else — conversation history, Ollama, Gradio streaming — works exactly the same as Project 1.

---

## File Map — What Each File Does

| File | What it does |
|---|---|
| `app.py` | Launches the **Gradio web UI** — the chat window in your browser |
| `chatbot.py` | Loads the **PDF**, manages conversation history, calls Ollama |
| `system_prompt_simple.py` | Short instructions telling the AI how to behave |
| `profile-of-ruthran-raghavan-...pdf` | The **knowledge document** as a PDF this time! |

---

## The Core Idea 💡

```
PDF File  →  PyPDFLoader  →  Extracted Text  →  System Prompt  →  AI has the knowledge
```

> ⚠️ **Same limitation as Project 1:** The entire PDF content is still pasted into every prompt. For large documents this would overflow the AI's **context window** (its reading limit). Project 3 solves this with a smarter approach called a **vector database**!
