import os
from dataclasses import dataclass
from typing import List, Optional

from dotenv import load_dotenv
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

load_dotenv()

DEFAULT_GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-pro")
DEFAULT_EMBED_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-004")
DEFAULT_STORE_DIR = os.getenv("VECTORSTORE_DIR", ".rag_store/faiss_index")


@dataclass
class RAGConfig:
    chunk_size: int = 1200
    chunk_overlap: int = 150
    k: int = 4
    gemini_model: str = DEFAULT_GEMINI_MODEL
    embedding_model: str = DEFAULT_EMBED_MODEL
    store_dir: str = DEFAULT_STORE_DIR


def load_pdfs(files: List[str]) -> List[Document]:
    docs: List[Document] = []
    for f in files:
        loader = PyPDFLoader(f)
        docs.extend(loader.load())
    return docs


def split_docs(docs: List[Document], chunk_size: int, chunk_overlap: int) -> List[Document]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, chunk_overlap=chunk_overlap, separators=["\n\n", "\n", ". ", ".", "?", "!", " "]
    )
    return splitter.split_documents(docs)


def build_embeddings(model: Optional[str] = None):
    model_name = model or DEFAULT_EMBED_MODEL
    # Uses Google AI Studio embeddings (aka text-embedding-004).
    return GoogleGenerativeAIEmbeddings(model=model_name)


def build_vectorstore(chunks: List[Document], embed_model: Optional[str] = None, store_dir: Optional[str] = None) -> FAISS:
    embeddings = build_embeddings(embed_model)
    vs = FAISS.from_documents(chunks, embeddings)
    # Persist to disk if a directory is provided
    target_dir = store_dir or DEFAULT_STORE_DIR
    os.makedirs(target_dir, exist_ok=True)
    vs.save_local(target_dir)
    return vs


def load_vectorstore(store_dir: Optional[str] = None) -> Optional[FAISS]:
    path = store_dir or DEFAULT_STORE_DIR
    if not os.path.isdir(path):
        return None
    embeddings = build_embeddings()
    return FAISS.load_local(path, embeddings, allow_dangerous_deserialization=True)


def make_retriever(vs: FAISS, k: int = 4):
    return vs.as_retriever(search_kwargs={"k": k})


def make_llm(model: Optional[str] = None) -> ChatGoogleGenerativeAI:
    name = model or DEFAULT_GEMINI_MODEL
    return ChatGoogleGenerativeAI(model=name, temperature=0.2)


RAG_PROMPT = ChatPromptTemplate.from_messages([
    ("system", (
        "You are a helpful assistant. Answer the user's question using the provided context. "
        "Cite sources with page numbers when possible using [source:page]. "
        "If the answer is not in the context, say you don't know concisely."
    )),
    ("human", (
        "Question: {question}\n\n"
        "Context:\n{context}\n\n"
        "Answer:"
    )),
])


def format_docs(docs: List[Document]) -> str:
    parts = []
    for d in docs:
        meta = d.metadata or {}
        source = meta.get("source", "")
        page = meta.get("page", "?")
        header = f"[source:{os.path.basename(source)} page:{page}]"
        parts.append(f"{header}\n{d.page_content}")
    return "\n\n".join(parts)


def build_rag_chain(vs: FAISS, cfg: Optional[RAGConfig] = None):
    cfg = cfg or RAGConfig()
    retriever = make_retriever(vs, cfg.k)
    llm = make_llm(cfg.gemini_model)

    # Compose: retrieve -> format -> prompt -> llm -> parse
    retrieve_and_format = (
        {"context": retriever | format_docs, "question": RunnablePassthrough()} \
        | RAG_PROMPT \
        | llm \
        | StrOutputParser()
    )
    return retrieve_and_format
