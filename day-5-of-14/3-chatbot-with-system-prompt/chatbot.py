from dotenv import load_dotenv
from os import getenv 
from langchain_ollama import ChatOllama # running local model
from system_prompt import system_prompt

load_dotenv()
llm = ChatOllama(
    model=getenv("MODEL_NAME_LOCAL", "gemma4:e2b"),
    num_ctx=4096,
    temperature=0.0)

context = f"System: {system_prompt}"

def get_response(user_input):
    global context
    context += f"User: {user_input}\n"
    response = llm.invoke(context)
    context += f"Assistant: {response.content}\n"
    return response.content