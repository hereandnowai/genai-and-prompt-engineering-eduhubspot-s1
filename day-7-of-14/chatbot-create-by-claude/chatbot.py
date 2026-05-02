"""
chatbot.py - LangChain/LangGraph chatbot with Tavily web search via Ollama (gemma4:e2b)
Uses LangGraph's prebuilt ReAct agent (replaces the deprecated AgentExecutor).
"""

import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain_tavily import TavilySearch
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langgraph.prebuilt import create_react_agent

# ── Configuration ──────────────────────────────────────────────────────────────

load_dotenv()

MODEL_NAME = "gemma4:e2b"
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")

SYSTEM_PROMPT = (
    "You are a helpful AI assistant with access to a web search tool. "
    "Use the web_search tool whenever you need current, factual, or recent information. "
    "If you already know the answer confidently, you may respond directly. "
    "Always be concise and clear in your answers."
)


# ── Chatbot Class ──────────────────────────────────────────────────────────────

class ChatbotWithWebSearch:
    """Conversational chatbot backed by Ollama (gemma4:e2b) and Tavily search."""

    def __init__(self):
        self._validate_env()
        self.llm = self._build_llm()
        self.tools = self._build_tools()
        self.agent = create_react_agent(
            model=self.llm,
            tools=self.tools,
        )
        # Maintain conversation history manually (list of LangChain messages)
        self._history: list = [SystemMessage(content=SYSTEM_PROMPT)]

    # ── Internal builders ──────────────────────────────────────────────────────

    def _validate_env(self):
        if not TAVILY_API_KEY:
            raise EnvironmentError(
                "TAVILY_API_KEY is not set. "
                "Get a free key at https://app.tavily.com and run:\n"
                "  export TAVILY_API_KEY='tvly-...'"
            )

    def _build_llm(self) -> ChatOllama:
        return ChatOllama(
            model=MODEL_NAME,
            base_url=OLLAMA_BASE_URL,
            temperature=0.3,
        )

    def _build_tools(self) -> list:
        tool = TavilySearch(
            max_results=5,
            search_depth="advanced",
            include_answer=True,
            include_raw_content=False,
            include_images=False,
        )
        tool.name = "web_search"
        tool.description = (
            "Search the web for current or factual information. "
            "Input should be a concise search query string."
        )
        return [tool]

    # ── Public API ─────────────────────────────────────────────────────────────

    def chat(self, user_message: str) -> str:
        """Send a message and return the assistant's reply."""
        if not user_message.strip():
            return "Please enter a message."

        self._history.append(HumanMessage(content=user_message))

        try:
            result = self.agent.invoke({"messages": self._history})
            # The last message in the output is the assistant's reply
            ai_message = result["messages"][-1]
            self._history.append(ai_message)
            return ai_message.content

        except Exception as e:
            # Roll back the user message on failure
            self._history.pop()
            return f"An error occurred: {str(e)}"

    def reset(self):
        """Clear conversation history (keeps the system prompt)."""
        self._history = [SystemMessage(content=SYSTEM_PROMPT)]
        return "Conversation history cleared."

    def get_history(self) -> list[dict]:
        """Return conversation history as role/content dicts (for UI rendering)."""
        result = []
        for msg in self._history:
            if isinstance(msg, HumanMessage):
                result.append({"role": "user", "content": msg.content})
            elif isinstance(msg, AIMessage):
                result.append({"role": "assistant", "content": msg.content})
        return result


# ── CLI entry-point ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("🤖  Chatbot with Web Search  (gemma4:e2b + Tavily)")
    print("    Commands: 'quit' to exit | 'reset' to clear history\n")

    bot = ChatbotWithWebSearch()

    while True:
        try:
            user_input = input("You: ").strip()
        except (EOFError, KeyboardInterrupt):
            print("\nGoodbye!")
            break

        if not user_input:
            continue
        if user_input.lower() == "quit":
            print("Goodbye!")
            break
        if user_input.lower() == "reset":
            print(bot.reset())
            continue

        response = bot.chat(user_input)
        print(f"\nAssistant: {response}\n")