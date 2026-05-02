from dotenv import load_dotenv
from os import getenv 
import os
import ollama
from langchain_community.document_loaders import PyPDFLoader
from system_prompt_general import system_prompt

load_dotenv()
MODEL = getenv("MODEL_NAME_LOCAL", "gemma4:e2b")

PDF_PATH = os.path.join(os.path.dirname(__file__), "profile-rr.pdf")

def load_pdf_context(pdf_path):
    if not os.path.exists(pdf_path):
        return f"Warning: {pdf_path} not found. Proceeding without document context."
    loader = PyPDFLoader(pdf_path)
    pages = loader.load_and_split()
    return "\n\n".join([page.page_content for page in pages])

pdf_context = load_pdf_context(PDF_PATH)
full_system_prompt = f"{system_prompt}\n\nContext from PDF document:\n{pdf_context}"

messages = [{"role": "system", "content": full_system_prompt}]

def get_streaming_response(user_input):
    global messages
    messages.append({"role": "user", "content": user_input})
    
    full_response = ""
    for chunk in ollama.chat(model=MODEL, messages=messages, stream=True):
        thinking = chunk["message"].get("thinking", "")
        content = chunk["message"].get("content", "")
        if thinking:
            yield ("thinking", thinking)
        if content:
            full_response += content
            yield ("response", content)
   
    messages.append({"role": "assistant", "content": full_response})


    