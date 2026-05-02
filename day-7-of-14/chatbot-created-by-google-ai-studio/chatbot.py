# /Users/hnai/Desktop/ehs-new-20260419/day-7-of-14/chatbot-created-by-google-ai-studio/chatbot.py

import os
from langchain_ollama import ChatOllama
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import create_react_agent

# Set your Tavily API Key here or via environment variable
os.environ["TAVILY_API_KEY"] = "tvly-YOUR_API_KEY_HERE"

class WebSearchChatbot:
    def __init__(self):
        # 1. Initialize the LLM using the modern langchain-ollama package
        self.llm = ChatOllama(model="gemma4:e2b", temperature=0)

        # 2. Define the Search Tool
        # Note: newer versions use max_results instead of k
        self.search_tool = TavilySearchResults(max_results=3)
        self.tools = [self.search_tool]

        # 3. Create the Agent using LangGraph (Replaces AgentExecutor)
        self.agent = create_react_agent(self.llm, self.tools)

    def ask(self, query: str, history: list):
        """
        Processes the user query and returns the response.
        Incorporates Gradio's chat history so the bot remembers context!
        """
        try:
            # Convert Gradio's history format into LangChain message tuples
            messages = []
            for user_msg, ai_msg in history:
                messages.append(("user", user_msg))
                messages.append(("assistant", ai_msg))
            
            # Add the current user query
            messages.append(("user", query))
            
            # Invoke the LangGraph agent
            response = self.agent.invoke({"messages": messages})
            
            # The final answer is the content of the last message in the list
            return response["messages"][-1].content
            
        except Exception as e:
            return f"Error: {str(e)}"

# Instantiate the bot
bot = WebSearchChatbot()