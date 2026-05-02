# Prompt Engineering: Unlock Your LLM's Full Potential

**Date:** 2026-04-12
**Created by: Ruthran Raghavan, Chief AI Scientist, HERE AND NOW AI**

---

## 1. Hook & Intro

**Side-by-side: Bad prompt vs. great prompt**

* **Bad prompt:**

  > Write something about our product.
  >

  * **Result:** Generic marketing fluff, wrong tone, wrong length, no clear CTA.
* **Good prompt:**

> You are a senior B2B copywriter. Write a 2-sentence LinkedIn ad for our project-management SaaS (Asana alternative). Audience: ops managers at mid-size companies. Tone: confident but not salesy. End with a clear CTA to start a free trial. No emojis.

* **Result:** On-brand, scoped, actionable, and easy to drop into an ad.

> "Most people are leaving 80% of an LLM's capability on the table."

---

# 2. What Is Prompt Engineering & Why It Matters

**Programming in natural language**

* You’re giving instructions in plain language instead of code.
* The model has no built-in “task list”—you define the task, role, format, and constraints in the prompt.
* The same model can seem brilliant or useless depending on clarity, context, and structure.

**Example:**

* **Vague:** “Help with my essay.” → Model doesn’t know subject, length, or style.
* **Specific:** “You are a tutor. Help me improve the thesis and first paragraph of this 500-word history essay on the causes of WWI. Keep my voice; suggest edits inline.” → Model can actually help.

  **Example essay to pass to the LLM:**

> **The Causes of World War I**
>
> World War I was caused by a combination of nationalism, militarism, and the entangling alliances that made a small regional conflict explode into a global war. While the assassination of Archduke Franz Ferdinand in Sarajevo in June 1914 is often cited as the trigger, the underlying forces that had been building across Europe for decades were the true causes of the war.
>
> Nationalism was perhaps the most powerful force destabilizing Europe in the early twentieth century. Across the continent, ethnic groups sought self-determination and independence from empires that had ruled them for generations. In the Balkans, Slavic nationalism threatened the Austro-Hungarian Empire, which feared that rising Serbian influence would encourage its own Slavic minorities to revolt. Germany, newly unified in 1871, had developed an aggressive form of nationalism that demanded overseas colonies and a powerful military to match its growing industrial strength. This competitive nationalism made diplomacy increasingly difficult, as governments faced domestic pressure to appear strong and unwilling to back down from confrontations with rival powers.
>
> Militarism reinforced these nationalist tensions by turning arms buildups into a source of national pride. Between 1870 and 1914, the major European powers dramatically increased their military spending. Germany doubled the size of its army and invested heavily in its navy, directly challenging British naval supremacy. Britain responded with its own shipbuilding program. France, still bitter over its defeat in the Franco-Prussian War of 1870, rebuilt its military with an eye toward eventual revenge. Military planners developed detailed war plans—most famously Germany's Schlieffen Plan—that required rapid mobilization on tight timetables, leaving little room for diplomatic solutions once a crisis began. War came to seem not just possible but almost inevitable, and some leaders even believed it would be beneficial, clearing away old tensions and forging national unity.
>
> The alliance system transformed these bilateral tensions into a mechanism for continental war. The Triple Alliance linked Germany, Austria-Hungary, and Italy, while the Triple Entente bound France, Russia, and Britain together. These alliances were designed as deterrents, but they had the opposite effect: any conflict between two powers risked pulling in all six. When Austria-Hungary declared war on Serbia following the assassination, Russia mobilized to defend its Slavic ally, Germany declared war on Russia and then France, and Britain entered the war when Germany violated Belgian neutrality. Within six weeks of the assassination, a local Balkan dispute had become a world war involving every major European power.
>
> In conclusion, the assassination of Franz Ferdinand was the spark, but nationalism, militarism, and the alliance system were the powder keg. Without these deeply rooted structural forces, the murder of an archduke would likely have remained a tragic but contained event rather than the starting point of a war that would kill seventeen million people and redraw the map of the world.
>
> **Who benefits:**

* **Developers:** code generation, debugging, docs, refactors.
* **Marketers:** copy, ads, emails, social, A/B ideas.
* **Researchers:** summarization, lit review, brainstorming.
* **Everyday users:** writing, planning, learning, decision-making.

---

## 3. Foundation: How LLMs "Think"

**Next-token prediction (intuition only)**

* The model predicts the next token (word or sub-word) given everything so far in the prompt and conversation.
* It has no memory of past chats unless you include that information in the current context.
* **So:** context, specificity, and structure in your prompt directly shape what it says next.

**Steering vs. commanding**

* **Commanding:** “Summarize this.” → Model chooses length, style, and focus.
* **Steering:** “You are an executive assistant. Summarize this meeting transcript in 4 numbered points. Focus on decisions and action items. No filler.” → You steer length, focus, and format.

  **Meeting transcript to pass to the LLM:**

> **Q2 Product Roadmap Sync — Meeting Transcript**
> **Date:** April 18, 2026 · **Duration:** 45 minutes
> **Attendees:** Sarah Chen (Head of Product), Marcus Webb (Engineering Lead), Priya Nair (Design Lead), Tom Okafor (Marketing), Lisa Park (Head of Customer Success)
>
> ---
>
> **Sarah:** Alright, let's get started. We've got a lot to cover before end of quarter. First up — the mobile app redesign. Marcus, where are we?
>
> **Marcus:** We finished the backend API work last Friday. The new endpoints are live in staging. Front-end implementation is about 60% done — we're on track to hand off to QA by April 25th.
>
> **Sarah:** Good. Priya, are the final design specs locked?
>
> **Priya:** Almost. I need sign-off on the navigation pattern by end of day today. I've sent the updated Figma link to Sarah and Marcus. If I don't hear back by 5pm, I'm treating it as approved and moving forward.
>
> **Sarah:** Fair. I'll review it before lunch. Marcus, consider that approved on my end if Priya sends it over.
>
> **Marcus:** Got it.
>
> **Tom:** Quick question — are we still targeting May 12th for the public launch? I need to lock the campaign timeline this week.
>
> **Sarah:** Yes, May 12th is confirmed. That date does not move.
>
> **Tom:** Perfect. I'll finalize the campaign brief by April 22nd and share it with the group for a 48-hour feedback window.
>
> **Lisa:** Before we lock launch date — can we discuss the onboarding flow? We've had three enterprise clients flag that the current setup wizard is confusing. If we launch without fixing it, customer success is going to get hammered.
>
> **Sarah:** What specifically is broken?
>
> **Lisa:** Step 3 — connecting integrations. The instructions reference the old UI. Priya, can we get an updated tooltip or help text there?
>
> **Priya:** Yes, that's a small copy change. I can have it done by Monday if someone writes the updated text.
>
> **Lisa:** I'll write the text and send it to Priya by tomorrow morning.
>
> **Sarah:** Great. That's a blocker resolved. Let's also make sure QA specifically tests the onboarding flow end-to-end. Marcus, can you add that to the QA checklist?
>
> **Marcus:** Already on it. I'll add a dedicated onboarding regression suite.
>
> **Sarah:** One more thing — the analytics dashboard. We originally planned to include it in this release but given the timeline I'm proposing we cut it to a v2 feature. Thoughts?
>
> **Marcus:** Agreed. It's at least two more sprints of work. Cutting it is the right call.
>
> **Tom:** From a marketing standpoint the dashboard was a headline feature in some of our pre-launch materials. I'll need to update the copy. Not ideal but manageable.
>
> **Sarah:** Tom, let's sync offline on the messaging. Can we grab 20 minutes tomorrow?
>
> **Tom:** Yes, 10am works.
>
> **Sarah:** Perfect. Alright — to summarise: May 12th launch is confirmed, mobile redesign handoff to QA on April 25th, onboarding flow fix assigned to Lisa and Priya, analytics dashboard moved to v2, Tom and Sarah syncing tomorrow on messaging. Any blockers I've missed?
>
> **Marcus:** None from engineering.
>
> **Priya:** I just need that design approval today.
>
> **Lisa:** All good on my end.
>
> **Sarah:** Done. Thanks everyone.

---

## 4. Core Techniques: Hands-On Demo

### 4.1. Be Specific & Set the Scene

**The Setup:** Instead of a vague request, provide a full "Context Bundle" including Role, Audience, Tone, and Format.

* **Vague Prompt:** "Write a product description for a standing desk."
* **High-Context Prompt:**
  > "You are a **Senior E-commerce Copywriter** (Role). Write a product description for our 'Apex Pro' standing desk targeting **WFH professionals with back pain** (Audience). The tone should be **persuasive and health-conscious** (Tone).
  >
  > **Format:**
  >
  > 1. Headline: A catchy benefit-driven title.
  > 2. Body: 3 bullet points focusing on ergonomics, motor speed, and weight capacity.
  > 3. CTA: A strong 'Shop Now' closing."
  >

### 4.2. Few-Shot Prompting (with examples) vs Zero-Shot Prompting (without example)

**The Setup:** Show, don't just tell. Give 2-3 examples of the pattern you want the LLM to follow.

* **Prompt with Examples:**
  > "Convert the following raw meeting notes into a standardized format.
  >
  > **Example 1:**
  > Note: 'Met with John. He wants a refund for order 123 because it was late.'
  > Output: `[REFUND] | Order: 123 | Reason: Shipping Delay`
  >
  > **Example 2:**
  > Note: 'Sarah called. The app crashed when she clicked 'Checkout'.'
  > Output: `[BUG] | Action: Checkout | Impact: Crash`
  >
  > **Task:**
  > Note: 'Marcus reported that his account is locked after 3 wrong password attempts.'
  > Output:"
  >

### 4.3. Chain-of-Thought (CoT)

**The Setup:** Force the model to "show its work." This is the best way to fix math or logic errors.

* **Standard Prompt:** "Which is cheaper: 12 oranges for $4.80 or 15 oranges for $5.85?" (Model might guess wrong).
* **CoT Prompt:**

  > "Determine which is the better value. **Think step by step:**
  >
  > 1. Calculate the price per orange for the first pack.
  > 2. Calculate the price per orange for the second pack.
  > 3. Compare the two and state the final cheaper option."
  >

  ### SYSTEM PROMPT (LEGACY STYLE - FOR EDUCATIONAL PURPOSES ONLY)

  You are a helpful math tutor.

  When solving problems:


  * Think step by step before answering
  * Explain your reasoning clearly in a logical sequence
  * Show intermediate calculations
  * Then provide the final answer

  ---

  ### USER PROMPT

  Solve the following problem:

  The store sells pens for $2 and notebooks for $5.
  Sarah buys 3 pens and 2 notebooks.
  She has a 10% off coupon.

  Think step by step and explain your reasoning before giving the final answer.

  Finally, clearly state the final amount Sarah has to pay.

### 4.4. Structured Output

**The Setup:** Use templates to get data that humans (or other apps) can actually use without cleaning it up.

* **Table Prompt:**
  > "Compare ChatGPT, Claude, and Gemini across 'Best for Writing', 'Coding Ability', and 'Free Tier Availability'. Present the result in a **Markdown Table**."
  >
* **JSON Prompt:**
  > "Extract names and emails from this list: 'John Doe (john@example.com), Jane Smith (jane@work.com)'. Respond with **Valid JSON only** in this shape: `{"users": [{"name": "string", "email": "string"}]}`"
  >

### 4.5. Constraints & Negative Instructions

**The Setup:** Use "Negative Guardrails" to stop the model from doing things you hate (like adding filler or emojis).

* **Prompt with Constraints:**
  > "Summarize the news article below.
  > **Constraints:**
  >
  > - Maximum 50 words.
  > - Use professional language only.
  > - **DO NOT use emojis.**
  > - **DO NOT include an introductory sentence** (e.g., 'Here is your summary...')."
  >

### 4.6. Iterative Refinement

**The Setup:** Treat the output as a first draft. Use follow-up prompts to polish it.

* **Turn 1:** "Write a short blog post about AI in 2024."
* **Turn 2 (Refinement):** "Great, now make the tone more technical and add a section about 'Small Language Models'."
* **Turn 3 (Refinement):** "Now shorten the whole thing to fit in a LinkedIn post and use 2 relevant hashtags."

### 4.7. Interview-style Prompting

**The Setup:** Don't guess what the model needs. Let it ask you.

* **The 'Expert' Prompt:**
  > "I want you to help me design a 10-week AI training course. Before you start, **ask me 5 specific questions** about my audience, their technical level, and my primary goals. Ask one question at a time and wait for my response."
  >

---

## 5. Advanced Strategies

* **System vs. User Prompts:** Use System prompts for "**always-on**" rules (identity, safety) and User prompts for the specific task.
* **Prompt Chaining:** Break complex tasks into steps. Use output of Step 1 as input for Step 2.
* **Self-Evaluation:** Ask the model: "Rate this summary 1–5 for clarity. Suggest one improvement."
* **Temperature:** Low (0.2) for facts/code; High (0.8) for brainstorming.

---

## 6. Common Mistakes & How to Fix Them

| Mistake                   | What goes wrong           | Fix                                 |
| :------------------------ | :------------------------ | :---------------------------------- |
| **Too vague**       | Generic/irrelevant output | Add role, audience, tone, format    |
| **Too many tasks**  | Model drops tasks         | Split into steps (chaining)         |
| **No context**      | Wrong style               | Add background or few-shot examples |
| **Ignoring format** | Hard to reuse             | Request JSON/Tables                 |
| **Assuming memory** | Model "forgets"           | Summarize key facts in current turn |

---

## 7. Real-World Use Case Walkthroughs

* **Writing:** Blogs, emails, ad copy.
* **Code:** Debugging, refactoring, adding tests.
* **Data:** Summarization, trend analysis in tables.
* **Research:** Brainstorming names or pros/cons.

---

## 8. Toolkit & Resources

* **Libraries:** PromptBase, FlowGPT, OpenAI/Anthropic examples.
* **Journaling:** Save prompts that work! Note what you changed when they failed.
* **Awesome copilot**: https://github.com/github/awesome-copilot/

---

## Wrap-up

Prompt engineering is **programming in natural language**. Small changes in how you ask can unlock 80% more value from the model.

**Next step:** Pick one technique (like "Be Specific" or "Few-Shot") and apply it to a task you do every week. Save the result!
