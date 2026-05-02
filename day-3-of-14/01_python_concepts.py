"""
Day 3: Python Basics for AI Developers
Author: Ruthran Raghavan, Chief AI Scientist

This script introduces the fundamental Python concepts used in building AI applications.
"""

# 1. Importing Libraries
# 'os' is a built-in library, 'dotenv' is an external one.
import os
from dotenv import load_dotenv

# 2. Variables & Constants
# Variables store data. In AI, we often store model names or API keys.
MODEL_NAME = "gemma2:2b"
DEVELOPER_NAME = "Ruthran Raghavan"

# 3. Print Function
# Used to display information to the console.
print(f"Loading environment for {DEVELOPER_NAME}...")

# 4. Environment Variables
# load_dotenv() reads the .env file. getenv() retrieves a specific value.
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

if api_key:
    # 5. If Statements (Conditional Logic)
    print("✅ Configuration successful!")
else:
    print("⚠️ API Key not found. Please check your .env file.")

# 6. Infinite Loops & User Input
# while True creates a loop that runs until explicitly stopped.
# input() pauses the program to wait for user text.

print("\n--- Interaction Loop Demo (Type 'stop' to exit) ---")
while True:
    message = input("Enter something: ")
    
    # 7. String Methods
    # .lower() converts text to lowercase for easier comparison.
    if message.lower() == "stop":
        print("Stopping loop...")
        break # Exits the loop
    
    print(f"You entered: {message}")

print("Demo finished.")

# --- Summary of Setup Concepts ---
# 1. External Packages: Installed via 'pip install langchain-ollama python-dotenv'
# 2. Virtual Environment: Created via 'python -m venv .venv'
# 3. requirements.txt: List of dependencies to ensure project reproducibility.
