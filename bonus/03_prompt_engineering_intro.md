# Day-3: Introduction to Prompt Engineering

> **AI is Good**

## 🎯 What is Prompt Engineering?
Prompt engineering is the process of structuring an instruction (the **Prompt**) that can be interpreted and understood by a Generative AI model. It balances the model's capabilities with human intent to produce high-quality, relevant outputs.

---

### 🏛️ Core Principles of Good Prompting
1. **Clarity & Specificity**: Avoid ambiguity. Instead of "Write a blog," use "Write a 500-word blog post about the benefits of local LLMs for developers."
2. **Context**: Provide background. Tell the AI its role (e.g., "You are a Chief AI Scientist").
3. **Constraints**: Define the format, tone, and what to avoid (e.g., "Use professional tone," "Do not use technical jargon").

---

### 🧪 Advanced Prompting Techniques
- **Role Prompting**: Assigning a persona to the model to change its perspective and expertise (e.g., "Act as a Python Mentor").
- **Few-Shot Prompting**: Providing examples of input-output pairs to guide the model's behavior.
- **Chain-of-Thought (CoT)**: Encouraging the model to "think step-by-step" to improve reasoning for complex tasks.
- **Delimiters**: Using symbols like `###`, `---`, or `"""` to clearly separate different parts of the prompt (e.g., instructions vs. user data).

---

### 🛠️ Hands-on Prompting Activity
Following the concepts from **"Attention is All You Need"**, try the following prompts with your local **Gemma-2** model via Ollama:

1. **The Role Prompt**:
   > *"You are Ruthran Raghavan, Chief AI Scientist. Explain the importance of the Self-Attention mechanism to a beginner learner at EduHubSpot."*

2. **The Constraint Prompt**:
   > *"Summarize the history of GPT models in exactly 3 bullet points. Do not use the word 'OpenAI'."*

3. **Step-by-Step Prompting**:
   > *"Explain how an LLM predicts the next word. Think step-by-step and number each stage of the process."*

---
Built with ❤️ by **Ruthran Raghavan, Chief AI Scientist** for **EduHubSpot** learners.
