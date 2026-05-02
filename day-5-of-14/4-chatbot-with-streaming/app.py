import gradio as gr
from chatbot import get_streaming_response

def chatbot_interface(message, history):
    partial_message = ""
    for chunk in get_streaming_response(message):
        partial_message += chunk
        yield partial_message

demo = gr.ChatInterface(
    fn=chatbot_interface,
    title="Caramel AI",
    description="Caramel AI, AI Teacher at HERE AND NOW AI - Artificial Intelligence Research Institute, built by Ruthran Raghavan, Chief AI Scientist. Teaching AI to beginners in a simple way."
)

if __name__ == "__main__":
    demo.launch()