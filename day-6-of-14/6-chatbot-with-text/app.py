import gradio as gr
from chatbot import get_streaming_response, DOCUMENT_PATH

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
    title="Caramel AI - Text Document RAG",
    description=f"Ask questions about the content of the loaded document: **{DOCUMENT_PATH}**"
)

if __name__ == "__main__":
    demo.launch()
             