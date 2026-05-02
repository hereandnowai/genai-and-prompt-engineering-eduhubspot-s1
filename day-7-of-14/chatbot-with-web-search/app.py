import gradio as gr
from chatbot import get_streaming_response

def chat_interface(message, history):
    thinking_text = ""
    response_text = ""

    for kind, text in get_streaming_response(message):
        if kind == "thinking":
            # Display current search status/thinking
            thinking_text += text + "\n"
            display = f"<details open><summary>Thinking...</summary>\n\n{thinking_text}\n\n</details>"
            yield display
        elif kind == "response":
            # Show completed thinking and stream the actual text
            response_text += text
            summary = "Thinking done" if thinking_text else "Direct response"
            display = f"<details><summary>{summary}</summary>\n\n{thinking_text or 'No search needed.'}\n\n</details>\n\n{response_text}"
            yield display

demo = gr.ChatInterface(
    fn=chat_interface,
    title="Caramel AI (Day 7: Web Search)",
    description="I am an AI Teacher with web search capabilities. I can find the latest information for you using Tavily!"
)

if __name__ == "__main__":
    demo.launch()
