"""
Day 3: Intro to RAG (Retreival-Augmented Generation) from a Text File
Author: Ruthran Raghavan, Chief AI Scientist

This script shows how to inject external knowledge (a .txt file) into an LLM's prompt.
"""

import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Setup the environment
load_dotenv()
model_name = os.getenv("MODEL_NAME_LOCAL", "gemma2:2b")

# 2. Local Knowledge Extraction (RAG Context)
# In this simple example, we read context directly from a text file.
def load_text_context(file_path):
    if not os.path.exists(file_path):
        return f"Warning: {file_path} not found. Proceeding with general knowledge."
    with open(file_path, 'r', encoding='utf-8') as f:
        return f.read()

# 3. Prompt Template for RAG
# Instead of just user_input, we also provide 'context' at the top.
# This 'grounds' the AI's response in the provided document.
rag_prompt = ChatPromptTemplate.from_messages([
    ("system", """
    You are Ruthran Raghavan, Chief AI Scientist.
    Use the following pieces of context to answer the user's question.
    If the context doesn't contain the answer, say "I can't find that in the local database."
    Do not make up information.
    
    Context: {context}
    """),
    ("human", "{question}")
])

# 4. Initialize LLM
llm = ChatOllama(model=model_name)
chain = rag_prompt | llm | StrOutputParser()

# 5. Interaction Method
def ask_ai_with_context(question):
    # Load our specific knowledge base
    context_text = load_text_context("my_notes.txt")
    
    # Send both context and the question to the model
    response = chain.invoke({"context": context_text, "question": question})
    print(f"Ruthran RAG Boss: {response}\n")

if __name__ == "__main__":
    # Create a sample text file for the demo
    with open("my_notes.txt", "w", encoding="utf-8") as f:
        f.write("Project: EduHubSpot Python Masterclass.\n")
        f.write("Lead Instructor: Ruthran Raghavan.\n")
        f.write("Key Goal: Teaching GenAI for real-world impact.\n")
        f.write("Current Session: Introduction to RAG (Text).\n")

    print(f"--- 📚 Simple Text-based RAG (Assistant to {model_name}) ---")
    print("Asking the AI about 'who is the lead instructor' based on 'my_notes.txt'...\n")
    
    ask_ai_with_context("Who is the lead instructor for the EduHubSpot Python class?")
    
    print("Example 2: Asking something not in the notes...")
    ask_ai_with_context("What is the capital of France?")
