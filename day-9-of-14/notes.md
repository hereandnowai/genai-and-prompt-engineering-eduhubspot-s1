RAG in depth

RAG stands for Retrieval-Augmented Generation, a technique that combines retrieval-based methods with generative models to enhance the quality and relevance of generated content. The main idea behind RAG is to leverage external knowledge sources, such as databases or documents, to provide context and information that can improve the generation process.

chatbot -->
llm provider: groq
llm: llama-3.1-8b-instant (knowledge cutoff: 2023)
embeddings: embeddinggemma

question: what is MCP? (2024)

RAG Pipeline:

1. chunking
2. embedding
3. vector database
4. retrieval

In a RAG system, the process typically involves the following steps:

context:
context window: 4096 tokens
embeddings:


1. watch now & practice later
2. code along with the help of github
3. 


RAG:
1. keyword search
2000s - yahoo & google - keyword
what is the capital of france?

image - tags - keyword search

2. embedding
semantic search
2017
what is the capital of france?

3. hybrid search
keyword + embedding