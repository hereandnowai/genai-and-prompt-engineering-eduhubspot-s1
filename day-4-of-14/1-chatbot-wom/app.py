import gradio as gr
from chatbot_wom import get_response

def chat_interface(message, history):
    return get_response(message)

demo = gr.ChatInterface(
    fn=chat_interface,
    title="Caramel AI - Your Friendly AI Teacher",
    description="Ask anything about AI!")

if __name__ == "__main__":
    demo.launch()