## 📄 Project 1: Chatbot with Text RAG

> **What is RAG?**
> RAG stands for **Retrieval-Augmented Generation**. Instead of relying only on what the AI was trained on, we *give* the AI extra knowledge by including a document inside the question we send it. Think of it like giving someone a cheat sheet before an exam!

---

## How This Project Works (Plain English)

1. When the app starts, it **reads a Markdown (.md) text file** — a profile document about Ruthran Raghavan.
2. It **glues that document's text** onto the beginning of the system prompt (the AI's instructions).
3. Every time you ask a question, the AI **already has the full document in memory** — it was loaded just once at startup.
4. The AI answers using **only what is in that document** and says "I can't find that" if the answer is not there.
5. The **full conversation is remembered** in a list, so you can ask follow-up questions naturally.Architecture Diagram

```mermaid
flowchart TD
    START(["👤 You open the app"])
    START --> STARTUP

    subgraph STARTUP ["🚀 STARTUP — Runs ONCE when the app launches"]
        S1["📂 Step 1: Read the .md file\n📄 profile-of-ruthran-raghavan.md\nUsing Python's built-in open() function"]
        S1 --> S2["📝 Step 2: Build the full System Prompt\n= AI Instructions\n+ the entire document text\ncombined into one big string"]
        S2 --> S3["🗂️ Step 3: Create Conversation History\nmessages = a Python list\nFirst entry: the system prompt above"]
    end

    STARTUP --> RUNTIME

    subgraph RUNTIME ["💬 RUNTIME — Repeats every time you send a message"]
        R1(["👤 You type a question\nin the Gradio chat box"])
        R1 --> R2["➕ Step 4: Add your question\nto the messages list"]
        R2 --> R3["📤 Step 5: Send the FULL messages list\nto Ollama running on your computer\nModel: Gemma 3"]
        R3 --> R4["🧠 Gemma reads:\n- The system prompt\n- The full document\n- Your question\n- All previous messages\n...and generates a reply"]
        R4 --> R5{"Tokens stream back\none piece at a time..."}
        R5 -->|"💭 Thinking tokens\nAI reasoning out loud"| R6["Shown in a\n💭 collapsible Thinking block\nin the UI"]
        R5 -->|"💬 Answer tokens\nthe actual reply"| R7["Streamed word-by-word\nin the chat window"]
        R7 --> R8["💾 Step 6: Save the AI reply\nback into messages list\nso the next question has full history"]
    end

    R6 --> OUT(["👤 You see the answer\nin the Gradio web UI\n🌐 http://localhost:7860"])
    R8 --> OUT
```

---

## File Map — What Each File Does

| File                                  | What it does                                                                              |
| ------------------------------------- | ----------------------------------------------------------------------------------------- |
| `app.py`                            | Launches the**Gradio web UI** — the chat window you open in your browser           |
| `chatbot.py`                        | The**brain** — reads the document, manages conversation history, calls Ollama      |
| `system_prompt_simple.py`           | Short**instructions** that tell the AI how to behave (e.g. "only use the document") |
| `profile-of-ruthran-raghavan-...md` | The**knowledge file** — its text is injected into the AI's memory at startup       |

---

## The Core Idea 💡

```
Document Text + System Instructions  →  System Prompt
System Prompt + Your Question        →  Sent to AI
AI                                   →  Answer based on the document
```

> ⚠️ **Limitation to know about:** AI models can only read a certain amount of text at once — this is called the **context window**. If the document is very long (e.g. a 200-page book), pasting the whole thing into the prompt would fail. Projects 2 and 3 tackle this same idea with progressively better approaches!
