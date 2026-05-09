import os
from typing import List, Optional

# Allow running this file directly: `/path/.../python app/main.py`
if __package__ is None and __name__ == "__main__":
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))

import gradio as gr
from dotenv import load_dotenv

from app.rag import (
    RAGConfig,
    load_pdfs,
    split_docs,
    build_vectorstore,
    load_vectorstore,
    build_rag_chain,
)

load_dotenv()

store_dir = os.getenv("VECTORSTORE_DIR", ".rag_store/faiss_index")

# Shared state
vs_cache = {"vs": None, "chain": None, "cfg": RAGConfig()}


def ingest_pdfs(pdf_files: List[str], chunk_size: int, chunk_overlap: int):
    docs = load_pdfs(pdf_files)
    chunks = split_docs(docs, chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    vs = build_vectorstore(chunks, store_dir=store_dir)
    chain = build_rag_chain(vs, vs_cache["cfg"])
    vs_cache.update({"vs": vs, "chain": chain})
    return f"Indexed {len(chunks)} chunks from {len(pdf_files)} PDF(s)."


def ensure_chain_available():
    if vs_cache["chain"] is None:
        vs = load_vectorstore(store_dir)
        if vs is None:
            return None, "No existing index. Please upload PDFs to index first."
        chain = build_rag_chain(vs, vs_cache["cfg"])
        vs_cache.update({"vs": vs, "chain": chain})
    return vs_cache["chain"], None


def ask_question(message: str, history: Optional[List[dict]] = None):
    history = history or []
    chain, err = ensure_chain_available()
    if err:
        return history + [{"role": "user", "content": message}, {"role": "assistant", "content": err}]
    answer = chain.invoke(message)
    return history + [{"role": "user", "content": message}, {"role": "assistant", "content": answer}]


def build_ui():
    with gr.Blocks(title="PDF RAG Chatbot (Gemini + LangChain)") as demo:
        gr.Markdown("# PDF RAG Chatbot — Gemini + LangChain + Gradio")
        with gr.Row():
            with gr.Column(scale=1):
                file_uploader = gr.File(
                    file_count="multiple",
                    file_types=[".pdf"],
                    label="Upload PDF files",
                )
                chunk_size = gr.Slider(300, 2000, value=vs_cache["cfg"].chunk_size, step=50, label="Chunk size")
                chunk_overlap = gr.Slider(0, 400, value=vs_cache["cfg"].chunk_overlap, step=10, label="Chunk overlap")
                index_btn = gr.Button("Index PDFs")
                index_status = gr.Markdown("")

            with gr.Column(scale=2):
                chatbot = gr.Chatbot(label="Chat with your PDFs")
                question = gr.Textbox(placeholder="Ask a question about your PDFs…", lines=1)
                send_btn = gr.Button("Ask")

        def on_index(files: List[gr.File], cs: int, co: int):
            # Convert temp file objects to paths
            paths = [f.name for f in files] if files else []
            if not paths:
                return "Please upload at least one PDF."
            vs_cache["cfg"].chunk_size = int(cs)
            vs_cache["cfg"].chunk_overlap = int(co)
            return ingest_pdfs(paths, vs_cache["cfg"].chunk_size, vs_cache["cfg"].chunk_overlap)

        def on_ask(msg: str, hist: List[dict]):
            return ask_question(msg, hist)

        index_btn.click(fn=on_index, inputs=[file_uploader, chunk_size, chunk_overlap], outputs=index_status)
        send_btn.click(fn=on_ask, inputs=[question, chatbot], outputs=chatbot)
        question.submit(fn=on_ask, inputs=[question, chatbot], outputs=chatbot)

    return demo


if __name__ == "__main__":
    demo = build_ui()
    demo.launch()  # You can pass share=True to create a public link
