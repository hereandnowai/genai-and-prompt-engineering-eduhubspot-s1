// ================================================
// GENAI TUTOR — AI SERVICE LAYER
// Supports: Mock responses + Real Anthropic API
// ================================================

const AIService = (() => {
  let _promptsData = null;

  // ── Load prompts data ──
  const loadPrompts = async () => {
    if (_promptsData) return _promptsData;
    try {
      const r = await fetch(CONFIG.DATA.PROMPTS);
      _promptsData = await r.json();
    } catch {
      _promptsData = { suggestedPrompts: [], tutorResponses: {} };
    }
    return _promptsData;
  };

  // ── Match user message to a canned response ──
  const matchResponse = (message, responses) => {
    const lower = message.toLowerCase();
    const keys  = Object.keys(responses);

    // Direct keyword match
    for (const key of keys) {
      if (key === 'default') continue;
      if (lower.includes(key)) return responses[key];
    }

    // Broader fallback matching
    const topics = {
      'neural': 'neural network',
      'llm': 'large language model',
      'gpt': 'large language model',
      'claude': 'large language model',
      'chatgpt': 'large language model',
      'deep': 'deep learning',
      'cnn': 'deep learning',
      'transformer': 'large language model',
      'gen ai': 'generative ai',
      'dall': 'generative ai',
      'midjourney': 'generative ai',
      'image gen': 'generative ai',
      'prompt': 'prompt engineering',
      'bias': 'ai ethics',
      'safety': 'ai ethics',
      'fairness': 'ai ethics',
      'nlp': 'natural language processing',
      'computer vision': 'computer vision',
    };

    for (const [keyword, topic] of Object.entries(topics)) {
      if (lower.includes(keyword) && responses[topic]) {
        return responses[topic];
      }
    }

    return responses['default'];
  };

  // ── Generate mock response ──
  const getMockResponse = async (message) => {
    const data = await loadPrompts();
    const matched = matchResponse(message, data.tutorResponses);

    // Add typing delay for realism
    const delay = Helpers.randomInt(
      CONFIG.AI.TYPING_SPEED_MIN,
      CONFIG.AI.TYPING_SPEED_MAX
    );
    await Helpers.sleep(delay);

    return {
      response:   matched.response,
      followUps:  matched.followUps || [],
      timestamp:  new Date().toISOString(),
      source:     'mock',
    };
  };

  // ── Real Anthropic API call ──
  const getRealResponse = async (messages, systemPrompt) => {
    const formatted = messages.map(m => ({
      role:    m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         CONFIG.AI.API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      CONFIG.AI.MODEL,
        max_tokens: CONFIG.AI.MAX_TOKENS,
        system:     systemPrompt || AI_SYSTEM_PROMPT,
        messages:   formatted,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'API request failed');
    }

    const data = await response.json();
    return {
      response:  data.content[0].text,
      followUps: [],
      timestamp: new Date().toISOString(),
      source:    'api',
    };
  };

  // ── System prompt for real AI ──
  const AI_SYSTEM_PROMPT = `You are GenAI Tutor, an expert AI education assistant specialized in teaching artificial intelligence concepts to complete beginners.

Your personality:
- Warm, encouraging, and patient
- Use simple language and avoid jargon
- Always use real-world analogies to explain concepts
- Break complex topics into digestible chunks
- Be enthusiastic about AI learning
- Use emojis occasionally to make responses friendly

Teaching principles:
- Start with the simplest explanation first
- Use the "explain like I'm 10" approach when needed  
- Connect every concept to real-world examples the student already knows
- Celebrate curiosity and encourage questions
- Never make the student feel dumb for not knowing something

Response format:
- Use **bold** for key terms
- Use bullet points and numbered lists for clarity
- Keep responses focused and under 400 words unless the topic truly requires more depth
- End with a follow-up question or suggestion to keep learning going

Topics you excel at: What is AI, Machine Learning, Deep Learning, Neural Networks, Generative AI, Large Language Models, Prompt Engineering, AI Ethics, Natural Language Processing, Computer Vision`;

  // ── Main chat function ──
  const chat = async (message, conversationHistory = []) => {
    try {
      if (CONFIG.AI.USE_ANTHROPIC_API && CONFIG.AI.API_KEY) {
        const history = [
          ...conversationHistory,
          { role: 'user', content: message },
        ];
        return await getRealResponse(history, AI_SYSTEM_PROMPT);
      } else {
        return await getMockResponse(message);
      }
    } catch (error) {
      console.error('AI Service error:', error);
      // Fallback to mock on error
      return await getMockResponse(message);
    }
  };

  // ── Generate quiz explanation ──
  const explainAnswer = async (question, correctAnswer, userAnswer) => {
    if (CONFIG.AI.USE_ANTHROPIC_API && CONFIG.AI.API_KEY) {
      try {
        const prompt = `Question: "${question}"\nCorrect answer: "${correctAnswer}"\nStudent answered: "${userAnswer}"\n\nProvide a brief, encouraging 2-sentence explanation of why the correct answer is right, in beginner-friendly language.`;
        const result = await getRealResponse([{ role: 'user', content: prompt }]);
        return result.response;
      } catch {
        return null;
      }
    }
    return null;
  };

  // ── Get suggested prompts ──
  const getSuggestedPrompts = async (category = null) => {
    const data = await loadPrompts();
    const prompts = data.suggestedPrompts || [];
    return category
      ? prompts.filter(p => p.category === category)
      : prompts;
  };

  // ── Generate module summary ──
  const summarizeModule = async (module) => {
    return `${module.title} covers ${module.overview?.slice(0, 100)}... Key concepts include ${module.keyConcepts?.slice(0,3).map(c => c.term).join(', ')}.`;
  };

  return {
    chat,
    explainAnswer,
    getSuggestedPrompts,
    summarizeModule,
    loadPrompts,
  };
})();
