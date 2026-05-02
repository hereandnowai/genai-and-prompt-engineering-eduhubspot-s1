"""
Day 3: Intro to RAG (Retreival-Augmented Generation) from a PDF File
Author: Ruthran Raghavan, Chief AI Scientist

This script demonstrates how to parse a PDF file and extract context for an LLM using LangChain.
Requirements: 'pip install pypdf'
"""

import os
from dotenv import load_dotenv
from os import getenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Environment Setup
load_dotenv()
model_name = getenv("MODEL_NAME_LOCAL", "gemma2:2b")

# 2. PDF Context Extraction
# PyPDFLoader parses PDF documents into a list of Page objects.
def load_pdf_context(pdf_path):
    if not os.path.exists(pdf_path):
        return f"Warning: {pdf_path} not found. Please provide a path to a PDF file."
    
    loader = PyPDFLoader(pdf_path)
    pages = loader.load_and_split()
    
    # We combine the content of all pages into a single string for simple RAG.
    # For larger PDFs, we would use vector databases and embeddings.
    full_text = " ".join([page.page_content for page in pages])
    return full_text

# 3. Prompt Template for PDF RAG
rag_prompt = ChatPromptTemplate.from_messages([
    ("system", """
    You are Ruthran Raghavan, Chief AI Scientist.
    You are an expert at extracting and summarizing information from PDF documents.
    Use the following pieces of PDF context to answer the user's question.
    If the context doesn't contain the answer, say "I can't find that in the PDF document."
    
    PDF Context: {context}
    """),
    ("human", "{question}")
])

# 4. Initialize LLM
llm = ChatOllama(model=model_name)
chain = rag_prompt | llm | StrOutputParser()

# 5. Core RAG Function
def query_pdf(pdf_path, question):
    print(f"📄 Loading context from {pdf_path}...")
    context = load_pdf_context(pdf_path)
    
    # We truncate context to prevent token limit issues with large PDFs in simple RAG.
    truncated_context = context[:5000] # Simple 5k character limit for the demo.
    
    # Sending extracted PDF text to the AI
    response = chain.invoke({"context": truncated_context, "question": question})
    print(f"\nRuthran's PDF Insight: \n{response}\n")

if __name__ == "__main__":
    # Path to the curriculum presentation or any local PDF
    target_pdf = "prompt-engineering-presentation.pdf"
    
    print(f"--- 📔 PDF-based RAG Demo (Assistant to {model_name}) ---")
    
    if os.path.exists(f"./day-3/{target_pdf}"):
        query_pdf(f"./day-3/{target_pdf}", "Summarize the key principles of Prompt Engineering according to this document.")
    else:
        print(f"❌ Error: {target_pdf} not found. Ensure it is in the day-3 directory.")
        print("Note: In a real scenario, we use vector stores for larger PDF data.")
