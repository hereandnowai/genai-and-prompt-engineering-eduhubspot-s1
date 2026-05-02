from dotenv import load_dotenv
from os import getenv 
import os
import ollama
from system_prompt_general import system_prompt

load_dotenv()
MODEL = getenv("MODEL_NAME_LOCAL", "gemma4:e2b")

DOCUMENT_PATH = os.path.join(os.path.dirname(__file__), "profile-rr.md")

def load_text_context(file_path):
    if not os.path.exists(file_path):
        return f"Warning: {file_path} not fount. Proceeding without document context."
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()
    
document_context = load_text_context(DOCUMENT_PATH)
full_system_prompt = f"{system_prompt}\n\nContext from document:\n{document_context}"

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
