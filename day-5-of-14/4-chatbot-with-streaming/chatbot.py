from dotenv import load_dotenv
from os import getenv 
import ollama
from system_prompt_general import system_prompt

load_dotenv()
MODEL = getenv("MODEL_NAME_LOCAL", "gemma4:e2b")

messages = [{"role": "system", "content": system_prompt}]

def get_streaming_response(user_input):
    global messages
    messages.append({"role": "user", "content": user_input})

    full_response = ""
    for chunk in ollama.chat(model=MODEL, messages=messages, stream=True):
        content = chunk["message"].get("content", "")
        if content:
            full_response += content
            yield content
    
    messages.append({"role": "assistant", "content": full_response})