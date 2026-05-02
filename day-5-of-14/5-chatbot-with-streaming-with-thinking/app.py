import gradio as gr
from chatbot import get_streaming_response

def chat_interface(message, history):
    thinking_text =  ""
    response_text = ""

    for kind, text in get_streaming_response(message):
        if kind == "thinking":
            thinking_text += text
            display = f"<details open><summary>Thinking...</summary>\n\n{thinking_text}\n\n</details>"
            yield display
        elif kind == "response":
            response_text += text
            display = f"<details><summary>Thinking done</summary>\n\n{thinking_text}\n\n</details>\n\n{response_text}"
            yield display

demo = gr.ChatInterface(
    fn=chat_interface,
    title="Caramel AI",
    description="Caramel AI, AI Teacher at HERE AND NOW AI - Artificial Intelligence Research Institute, built by Ruthran Raghavan, Chief AI Scientist. Teaching AI to beginners in a simple way."
)

if __name__ == "__main__":
    demo.launch()
             