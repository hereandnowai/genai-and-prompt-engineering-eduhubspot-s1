# /Users/hnai/Desktop/ehs-new-20260419/day-7-of-14/chatbot-with-web-search/app.py

import gradio as gr
from chatbot import bot

def predict(message, history):
    """
    Gradio wrapper for the chatbot logic.
    message: current user input
    history: list of previous interactions
    """
    # Call the ask method from our chatbot instance
    response = bot.ask(message, history)
    return response

# Create the Gradio Chat Interface
demo = gr.ChatInterface(
    fn=predict,
    title="Gemma Web-Search Bot",
    description="I am a chatbot powered by Gemma 4 (via Ollama) and Tavily Web Search. Ask me anything about current events!",
    examples=["What is the current stock price of Nvidia?", "Who won the latest Formula 1 race?", "What's the weather in Tokyo?"],
    theme="soft"
)

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)