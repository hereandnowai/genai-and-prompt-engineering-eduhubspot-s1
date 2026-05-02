import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate

# Load environment variables from .env file
load_dotenv()

# Get API Key from environment variables
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    print("❌ Error: GROQ_API_KEY not found in .env file.")
    exit(1)

# Define the Persona
ai_teacher_persona = "You are an ai_teacher, assistant to Ruthran Raghavan, Chief AI Scientist"

# Initialize the LLM with Groq
llm = ChatGroq(
    model="openai/gpt-oss-120b", 
    temperature=0.7, 
    api_key=GROQ_API_KEY  # type: ignore
)

# Create the Chat Prompt Template
prompt = ChatPromptTemplate.from_messages([
    ("system", ai_teacher_persona),
    ("human", "{user_input}")
])

# Create the LCEL Chain
chain = prompt | llm

def main():
    print("--- 🤖 LangChain Chatbot (Assistant to Ruthran Raghavan) ---")
    print("AI Teacher: Hello! I am here to help. Type 'exit' to quit.\n")
    
    while True:
        try:
            user_input = input("You: ")
            if user_input.lower() in ["exit", "quit", "bye"]:
                print("Goodbye!")
                break
            
            if not user_input.strip():
                continue

            # Invoke the chain
            response = chain.invoke({"user_input": user_input})
            print(f"AI Teacher: {response.content}\n")
            
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
