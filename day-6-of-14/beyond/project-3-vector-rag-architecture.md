# 🧠 Project 3: Chatbot with Vector RAG (The Smart Way!)

> **What is different from Projects 1 & 2?**
> Those projects pasted the **entire document** into every prompt — which works only for small files. Project 3 is smarter: it uses a **vector database** to find and send only the *relevant pieces* of the document for each question.

---

## Two New Concepts to Understand First

### 📐 What is an Embedding (Vector)?
An embedding turns a sentence into a **list of numbers**. The clever part: sentences with *similar meaning* end up with *similar numbers*. This lets a computer compare meaning, not just matching words.

```
"Who is Ruthran?"         →  [0.12, 0.87, 0.34, 0.56, ...]
"Tell me about Ruthran"   →  [0.11, 0.85, 0.36, 0.54, ...]
                                ↑ very similar numbers = similar meaning!

"What is the weather?"    →  [0.91, 0.02, 0.77, 0.11, ...]
                                ↑ very different numbers = different meaning
```

### 🗄️ What is a Vector Database (ChromaDB)?
A special database that stores text chunks alongside their vectors (numbers). You can ask it: *"find me the 15 text chunks whose meaning is closest to this question"* — and it answers in milliseconds.

---

## How This Project Works (Plain English)

**Phase 1 — Index (at startup, runs once):**
1. Load `mcp.pdf` and **cut it into small overlapping pieces** (chunks of 1000 characters, overlapping by 200 so no sentence is cut in half).
2. Convert every chunk into a **vector (list of numbers)** using the `embeddinggemma` model via Ollama.
3. Store each chunk + its vector in **ChromaDB** (an in-memory vector database).
4. Also keep the raw text chunks in a plain Python list (`all_chunks`) for keyword searching later.

**Phase 2 — Retrieve & Answer (every question):**
5. Convert your question into a vector too.
6. **Semantic Search**: Ask ChromaDB to find the 15 chunks most similar in *meaning* to your question.
7. **Keyword Search**: Also scan all chunks for exact word matches — catches names or specific terms that semantic search might miss.
8. Merge both results into a small **context block** — just the relevant pieces, not the whole document!
9. Send: System Prompt + Context + Your Question → AI generates a focused answer.

---

## Architecture Diagram

```mermaid
flowchart TD
    START(["👤 You open the app"])
    START --> INDEX

    subgraph INDEX ["🗂️ INDEX PHASE — Runs ONCE at startup (build_vector_store)"]
        I1["📄 mcp.pdf"]
        I1 --> I2["📖 PyPDFLoader\nReads and parses the PDF"]
        I2 --> I3["✂️ RecursiveCharacterTextSplitter\nChunk size: 1000 characters\nOverlap: 200 characters\n(overlap prevents sentences being cut in half)"]
        I3 --> I4["📦 Chunk 1, Chunk 2, Chunk 3 ... Chunk N\n(could be hundreds of chunks)"]
        I4 --> I5["🔁 For EVERY chunk — call Ollama embeddings\nModel: embeddinggemma\nConverts text → list of numbers"]
        I5 --> I6[("🗄️ ChromaDB\nIn-memory Vector Database\nStores: chunk text + its vector\nCollection name: knowledge_base")]
        I4 --> I7["📋 also saved to all_chunks list\nin Python memory\n(used for keyword search later)"]
    end

    INDEX --> RUNTIME

    subgraph RUNTIME ["💬 RUNTIME — Repeats every time you send a message"]
        R1(["👤 You type a question"])
        R1 --> R2["📐 Step 1: Embed the question\nConvert question text → vector\nusing embeddinggemma via Ollama"]

        R2 --> HYBRID

        subgraph HYBRID ["🔍 Step 2: Hybrid Retrieval (retrieve_context)"]
            direction LR
            subgraph SEM ["🎯 Semantic Search\n(finds meaning-based matches)"]
                SA["Your question vector"] --> SB["ChromaDB similarity search\nFind top 15 chunks\nwith most similar vectors"]
                SB --> SC["Semantic Hits\ne.g. chunks about MCP protocol\nbecause question was about MCP"]
            end
            subgraph KW ["🔑 Keyword Search\n(finds exact word matches)"]
                KA["Remove stopwords from question:\nwho what the and for was are..."] --> KB["Score ALL chunks in all_chunks list\nby how many keywords they contain"]
                KB --> KC["Keyword Hits\n(only chunks NOT already in semantic results)"]
            end
        end

        SC --> MRG["🔗 Step 3: Merge both result sets\nSemantic Hits + Keyword Hits\n= the Context Block\n(just the relevant pieces!)"]
        KC --> MRG
        MRG --> MSG["📝 Step 4: Build the message\nSystem Prompt\n+ Context Block\n+ Your Question\n⚠️ NO full document — only relevant chunks!"]
        MSG --> OLL["🧠 Ollama: Gemma AI model\nReads system prompt + small context + question\nGenerates a focused answer"]
        OLL --> STR{"Tokens stream back..."}
        STR -->|"💭 Thinking tokens\nAI reasoning"| TH["Collapsible\n💭 Thinking block in UI"]
        STR -->|"💬 Answer tokens"| AN["Streamed word-by-word\nin chat window"]
    end

    TH --> OUT(["👤 You see the answer\nin the Gradio web UI\n🌐 http://localhost:7860"])
    AN --> OUT
```

---

## Projects 1 & 2 vs Project 3 — The Key Difference

```mermaid
flowchart LR
    subgraph OLD ["📄📑 Projects 1 & 2 — Simple RAG"]
        direction TB
        O1["Entire document loaded\ninto system prompt at startup"]
        O1 --> O2["Every single prompt contains\nthe FULL document text"]
        O2 --> O3["⚠️ Breaks for large files\n⚠️ AI wastes time reading\nirrelevant pages"]
    end

    subgraph NEW ["🧠 Project 3 — Vector RAG"]
        direction TB
        N1["Document split into chunks\nand indexed into ChromaDB at startup"]
        N1 --> N2["Each prompt contains only\nthe RELEVANT chunks\nfor that specific question"]
        N2 --> N3["✅ Works for large files\n✅ AI only reads what matters\n✅ Faster and more accurate"]
    end
```

---

## File Map — What Each File Does

| File | What it does |
|---|---|
| `app.py` | Launches the **Gradio web UI** — handles chat display with thinking blocks |
| `chatbot.py` | **Everything**: indexing, embedding, hybrid retrieval, streaming |
| `system_prompt_simple.py` | Short instructions for the AI — the document is NOT injected here |
| `mcp.pdf` | The knowledge document — gets chunked and stored in ChromaDB at startup |

---

## The Core Idea 💡

```
INDEX:    PDF → Chunks → Vectors → ChromaDB
          (done once at startup)

RETRIEVE: Question → Vector → ChromaDB finds similar chunks
          + keyword scan of all_chunks
          → Context Block (just the relevant pieces)

GENERATE: System Prompt + Context Block + Question → Gemma AI → Answer
```

> ✅ **Why this is powerful:** A 500-page document would be split into ~2000 chunks. For any given question, only 15-25 chunks are retrieved. The AI only ever reads a tiny, highly relevant slice — making it faster, smarter, and able to handle documents of any size!
