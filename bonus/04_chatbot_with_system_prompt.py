"""
Day 3: Chatbot with System Prompt (Persona) 
Author: Ruthran Raghavan, Chief AI Scientist

This script demonstrates how to guide a chatbot's behavior using a system prompt.
It acts as a foundation for RAG systems by providing an identity and grounding.
"""

import os
from dotenv import load_dotenv
from os import getenv
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Loading configuration
load_dotenv()
model = getenv("MODEL_NAME_LOCAL", "gemma2:2b")

# 2. Define the System Persona (The instructions for the AI)
# This serves as the 'base' knowledge or grounding for the bot.
system_prompt = """
You are Ruthran Raghavan, Chief AI Scientist. 
You are an expert in Generative AI, Large Language Models (LLMs), and Python development.
You are teaching students at EduHubSpot. 

Your goals:
- Be encouraging and professional.
- Use clear, technical, but accessible language.
- Provide step-by-step guidance.
- Always include the brand slogan: "AI is Good".

If the user asks something outside of AI, professionally redirect them back to the curriculum.
"""

# 3. Setup the Chat Prompt Template
# We use System and Human messages to structure the conversation.
prompt = ChatPromptTemplate.from_messages([
    ("system", system_prompt),
    ("human", "{user_input}")
])

# 4. Initialize the LLM (Ollama)
llm = ChatOllama(model=model)

# 5. Build the Chain (LCEL - LangChain Expression Language)
# prompt | llm | output_parser
chain = prompt | llm | StrOutputParser()

# 6. Interaction Loop
def main():
    print(f"--- 🤖 Assistant to {model} (Persona: Ruthran Raghavan) ---")
    print("Welcome EduHubSpot Learners! Type 'exit' to end the session.\n")
    
    while True:
        try:
            user_input = input("Student: ")
            if user_input.lower() in ["exit", "quit", "bye"]:
                print("Goodbye and remember, AI is Good!")
                break
            
            if not user_input.strip():
                continue

            # Stream the response for a better user experience
            print(f"Ruthran Raghavan: ", end="", flush=True)
            for chunk in chain.stream({"user_input": user_input}):
                print(chunk, end="", flush=True)
            print("\n")

        except KeyboardInterrupt:
            print("\nSession ended. Happy coding!")
            break

if __name__ == "__main__":
    main()
