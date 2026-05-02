from dotenv import load_dotenv
from os import getenv
from langchain_ollama import ChatOllama # running local model
# from langchain_groq import ChatGroq # running cloud model

load_dotenv()
llm = ChatOllama(model=getenv("MODEL_NAME_LOCAL", "gemma3:1b"))
# llm = ChatGroq(model=getenv("MODEL_NAME_GROQ", "openai/gpt-oss-120b"), api_key=getenv("GROQ_API_KEY"))

context = ""

def get_response(user_input):
    global context
    context += f"User: {user_input}\n"
    response = llm.invoke(context)
    context += f"Assistant: {response.content}\n"
    return response.content