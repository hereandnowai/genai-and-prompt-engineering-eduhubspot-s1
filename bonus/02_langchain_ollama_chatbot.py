# --- Line-by-Line Explanation of an AI Chatbot ---
# Teacher: Ruthran Raghavan, Chief AI Scientist

# 1. Import necessary libraries
# 'load_dotenv' helps load configuration secrets from a local '.env' file.
from dotenv import load_dotenv

# 'getenv' is used to retrieve values (like model names or API keys) from the environment.
from os import getenv

# 'ChatOllama' is a class from LangChain that lets us talk to locally running LLMs (via Ollama).
from langchain_ollama import ChatOllama

# 2. Setup the environment
# Calling load_dotenv() initializes the connection to the '.env' file.
load_dotenv()

# 3. Initialize the Language Model (LLM)
# We create an instance of ChatOllama. 
# It looks for 'MODEL_NAME_LOCAL' (e.g., 'gemma2:2b') in your .env file.
llm = ChatOllama(model=getenv("MODEL_NAME_LOCAL", "gemma3:270m"))

# 4. Starting the User Interface
# Print a welcome message to indicate the chatbot is active.
print("Chatbot ready! Type 'quit' to exit.\n")

# 5. The Interactive Loop
# This loop runs indefinitely, making the chatbot stay 'awake' for multiple questions.
while True:
    # Get user input from the terminal.
    user_input = input("You: ")
    
    # 6. Check for Exit Condition
    # If the user types 'quit' (regardless of case), we 'break' out of the loop and end the program.
    if user_input.lower() == "quit":
        print("Goodbye!")
        break
    
    # 7. Invoke the Model
    # We call 'invoke' on our llm object with the user's message.
    # This sends the text to Ollama, which generates a response.
    response = llm.invoke(user_input)
    
    # 8. Display the Response
    # The 'response' object has a 'content' attribute containing the AI's answer.
    # We use f-string formatting to print it neatly.
    print(f"Bot: {response.content}\n")
