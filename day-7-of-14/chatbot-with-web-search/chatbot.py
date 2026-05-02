from dotenv import load_dotenv
from os import getenv
from langchain_ollama import ChatOllama
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langchain_core.prompts import ChatPromptTemplate
import json

load_dotenv()

# Configuration
MODEL_NAME = getenv("MODEL_NAME_LOCAL", "gemma3:4b") # Note: gemma3:4b used as reference, user mentioned gemma4:e2b
TAVILY_API_KEY = getenv("TAVILY_API_KEY")

# Initialize LLM and Search Tool
llm = ChatOllama(model=MODEL_NAME)
search_tool = TavilySearchResults(k=3)
tools = [search_tool]
llm_with_tools = llm.bind_tools(tools)

# Chat History
messages = [
    SystemMessage(content="You are a helpful assistant with real-time web search capabilities using Tavily. Always use search when you need up-to-date information.")
]

def get_streaming_response(user_input):
    global messages
    messages.append(HumanMessage(content=user_input))
    
    # Initial LLM call to decide if it needs tools
    response = llm_with_tools.invoke(messages)
    
    # Process tool calls if any
    if response.tool_calls:
        messages.append(response)
        yield ("thinking", "Searching the web for information...")
        
        for tool_call in response.tool_calls:
            # Execute search
            search_results = search_tool.invoke(tool_call["args"])
            # Format and add tool output to history
            messages.append(
                ToolMessage(
                    tool_call_id=tool_call["id"],
                    content=json.dumps(search_results)
                )
            )
        
        # Final LLM call with search results
        final_response = ""
        for chunk in llm.stream(messages):
            if chunk.content:
                final_response += chunk.content
                yield ("response", chunk.content)
        
        # Store the assistant's final text in history
        messages.append(HumanMessage(content=final_response))
    else:
        # No tool call needed, just stream direct response
        full_text = ""
        for chunk in llm.stream(messages):
            if chunk.content:
                full_text += chunk.content
                yield ("response", chunk.content)
        
        # Store assistant response in history
        messages.append(HumanMessage(content=full_text))
