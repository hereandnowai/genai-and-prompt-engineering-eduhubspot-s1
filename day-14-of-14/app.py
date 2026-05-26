import os
import sys

from dotenv import load_dotenv
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate, ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
import gradio as gr

load_dotenv()

RESUME_PATH = "NAVIN_JAGANATHAN_Resume_0.pdf"
GROQ_MODEL = "openai/gpt-oss-120b"

SYSTEM_PROMPT = """You are a professional personal assistant for Navin Jaganathan, a Senior Linux Engineer with over 19 years of experience in Linux/Unix administration, AWS Cloud, and IT infrastructure management.

Your sole purpose is to answer questions about Navin Jaganathan based on the provided resume/CV document. This includes his work history, skills, certifications, education, accomplishments, and contact information.

Rules:
- Only answer questions related to Navin Jaganathan.
- Base all answers on the provided resume document context.
- If the answer is not found in the document, say so honestly — do not fabricate.
- If asked about unrelated topics, politely decline and redirect the user to ask about Navin.
- Keep answers professional, concise, and recruiter-friendly in tone.
- When listing skills or experience, format them clearly.

Context from resume:
{context}
"""

# Global chain instance — built once at startup
qa_chain = None


def load_pdf_and_build_chain() -> ConversationalRetrievalChain:
    """Load the resume PDF, build the FAISS vector store, and return a ConversationalRetrievalChain."""
    if not os.path.exists(RESUME_PATH):
        print(
            f"[ERROR] Resume PDF not found at '{RESUME_PATH}'. "
            "Please place 'Navin_Jaganathan_Resume.pdf' in the project root directory."
        )
        sys.exit(1)

    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        print(
            "[ERROR] GROQ_API_KEY environment variable is not set. "
            "Add it to your .env file (local) or as a HuggingFace Space secret (production)."
        )
        sys.exit(1)

    print("[INFO] Loading resume PDF...")
    loader = PyPDFLoader(RESUME_PATH)
    documents = loader.load()

    print(f"[INFO] Loaded {len(documents)} page(s). Splitting into chunks...")
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(documents)
    print(f"[INFO] Created {len(chunks)} chunks.")

    print("[INFO] Building embeddings and FAISS vector store (this may take a moment)...")
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
    vector_store = FAISS.from_documents(chunks, embeddings)
    retriever = vector_store.as_retriever(search_kwargs={"k": 5})

    print("[INFO] Initialising Groq LLM...")
    llm = ChatGroq(
        model=GROQ_MODEL,
        api_key=api_key,
        temperature=0.2,
    )

    # Build a custom system prompt that injects the persona
    condense_question_prompt = PromptTemplate.from_template(
        "Given the following conversation and a follow-up question, "
        "rephrase the follow-up question to be a standalone question.\n\n"
        "Chat History:\n{chat_history}\n\n"
        "Follow-up question: {question}\n\n"
        "Standalone question:"
    )

    qa_prompt = ChatPromptTemplate.from_messages([
        SystemMessagePromptTemplate.from_template(SYSTEM_PROMPT),
        HumanMessagePromptTemplate.from_template("{question}"),
    ])

    chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        condense_question_prompt=condense_question_prompt,
        combine_docs_chain_kwargs={"prompt": qa_prompt},
        return_source_documents=False,
        verbose=False,
    )

    print("[INFO] Chain ready.")
    return chain


def respond(message: str, history: list[list[str]]) -> str:
    """Gradio chat callback — passes message + history to the ConversationalRetrievalChain."""
    global qa_chain

    # Convert Gradio history format [[user, bot], ...] → LangChain tuples [(user, bot), ...]
    lc_history = [(h[0], h[1]) for h in history if len(h) == 2]

    result = qa_chain({"question": message, "chat_history": lc_history})
    return result.get("answer", "I'm sorry, I couldn't find an answer. Please try rephrasing your question.")


# ── Build the chain once at import time (Spaces restarts = fresh build) ─────
qa_chain = load_pdf_and_build_chain()

# ── Gradio UI ────────────────────────────────────────────────────────────────
TITLE = "🤖 Ask me about Navin Jaganathan"
DESCRIPTION = (
    "**Navin Jaganathan** is a Senior Linux Engineer with 19+ years of experience "
    "in Linux/Unix administration, AWS Cloud, and enterprise IT infrastructure. "
    "Ask anything about his professional background, skills, certifications, or work history."
)

EXAMPLES = [
    "What are Navin's AWS skills?",
    "How many years of experience does he have?",
    "What Linux certifications does Navin hold?",
    "Which companies has Navin worked for?",
    "What are Navin's key technical skills?",
    "Tell me about Navin's education background.",
    "What is Navin's most recent role?",
    "Does Navin have experience with cloud infrastructure?",
]

demo = gr.Blocks(title=TITLE)

with demo:
    gr.Markdown(f"# {TITLE}")
    gr.Markdown(DESCRIPTION)
    gr.ChatInterface(
        fn=respond,
        examples=EXAMPLES,
        chatbot=gr.Chatbot(height=480),
        textbox=gr.Textbox(
            placeholder="Ask something about Navin Jaganathan...",
            container=False,
            scale=7,
        ),
    )

if __name__ == "__main__":
    demo.launch(theme=gr.themes.Soft())
