"""
app.py - Gradio UI for the LangChain + Tavily chatbot
"""

import gradio as gr
from chatbot import ChatbotWithWebSearch

# ── Singleton bot instance ─────────────────────────────────────────────────────

bot = ChatbotWithWebSearch()


# ── Gradio handler functions ───────────────────────────────────────────────────

def respond(user_message: str, chat_history: list) -> tuple[str, list]:
    if not user_message.strip():
        return "", chat_history

    assistant_reply = bot.chat(user_message)
    chat_history.append({"role": "user", "content": user_message})
    chat_history.append({"role": "assistant", "content": assistant_reply})
    return "", chat_history


def reset_conversation() -> tuple[list, str]:
    """Clear bot memory and wipe the UI chat window."""
    bot.reset()
    return [], "✅ Conversation cleared."


# ── UI Layout ──────────────────────────────────────────────────────────────────

with gr.Blocks(
    title="Chatbot with Web Search",
) as demo:

    # ── Header ─────────────────────────────────────────────────────────────────
    gr.Markdown(
        """
        # 🤖 Chatbot with Web Search
        **Model:** `gemma4:e2b` via Ollama &nbsp;|&nbsp;
        **Search:** Tavily &nbsp;|&nbsp;
        **Framework:** LangChain ReAct Agent
        ---
        """
    )

    # ── Chat area ──────────────────────────────────────────────────────────────
    chatbot = gr.Chatbot(
        elem_id="chatbot",
        label="Conversation",
        avatar_images=(None, "https://api.dicebear.com/7.x/bottts/svg?seed=gemma"),
    )

    # ── Input row ──────────────────────────────────────────────────────────────
    with gr.Row():
        user_input = gr.Textbox(
            placeholder="Ask me anything — I can search the web for you!",
            label="",
            scale=9,
            show_label=False,
            lines=1,
            max_lines=4,
            autofocus=True,
        )
        send_btn = gr.Button("Send", variant="primary", scale=1, min_width=80)

    # ── Control row ────────────────────────────────────────────────────────────
    with gr.Row():
        clear_btn = gr.Button("🗑️ Clear History", variant="secondary", size="sm")
        status_box = gr.Textbox(
            value="",
            label="",
            elem_id="status-box",
            interactive=False,
            show_label=False,
            scale=4,
        )

    # ── Example prompts ────────────────────────────────────────────────────────
    gr.Examples(
        examples=[
            ["What are the latest AI news today?"],
            ["What is the current price of Bitcoin?"],
            ["Summarize the top headlines from India right now."],
            ["Who won the most recent Formula 1 race?"],
            ["What is LangChain and how does it work?"],
        ],
        inputs=user_input,
        label="💡 Try an example",
    )

    # ── Event wiring ───────────────────────────────────────────────────────────

    send_btn.click(
        fn=respond,
        inputs=[user_input, chatbot],
        outputs=[user_input, chatbot],
        queue=True,
    )

    user_input.submit(
        fn=respond,
        inputs=[user_input, chatbot],
        outputs=[user_input, chatbot],
        queue=True,
    )

    clear_btn.click(
        fn=reset_conversation,
        inputs=[],
        outputs=[chatbot, status_box],
        queue=False,
    )


# ── Launch ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    demo.launch(
        theme=gr.themes.Soft(),
        css="""
            #chatbot { height: 520px; overflow-y: auto; }
            #status-box { font-size: 0.85rem; color: #6b7280; }
            footer { display: none !important; }
        """,
        server_name="0.0.0.0",
        server_port=7860,
        share=False,
        show_error=True,
    )