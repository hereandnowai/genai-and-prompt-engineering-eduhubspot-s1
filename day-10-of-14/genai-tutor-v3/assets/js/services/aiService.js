import stateManager from '../state.js';

const aiService = {
  async getTutorResponse(message, topicId = null) {
    // Simulated delay for "thinking"
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simple keyword-based mock logic
    const input = message.toLowerCase();
    let response = "That's a great question! As your AI Tutor, I'm here to help. ";

    if (input.includes('hello') || input.includes('hi')) {
      response = "Hello there! I'm your GenAI Tutor. What would you like to learn about today? We can talk about Machine Learning, Large Language Models, or prompt engineering!";
    } else if (input.includes('llm') || input.includes('large language model')) {
      response = "LLMs are like extremely well-read librarians. They have seen billions of sentences and learned the statistical patterns of human language to predict the next most likely word in a sequence.";
    } else if (input.includes('machine learning') || input.includes('ml')) {
      response = "Machine Learning is a way of teaching computers to recognize patterns in data without being given explicit rules for every scenario.";
    } else if (input.includes('prompt')) {
      response = "Prompt engineering is the art of talking to AI. It's about being clear, providing context, and specifying the format you want. Think of it like giving clear directions to a very talented but literal-minded intern.";
    } else {
      response += "AI can seem complex, but think of it as a set of tools that help computers 'see' patterns in data just like we do. Would you like me to explain this with an analogy?";
    }

    return {
      text: response,
      timestamp: Date.now(),
      sender: 'ai'
    };
  },

  generateAnalogy(concept) {
    const analogies = {
      'neural-networks': 'Like a massive relay race where each runner decides how important the baton is before passing it on.',
      'data-labels': 'Like a teacher grading homework so the student knows what a correct answer looks like.',
      'overfitting': 'Like a student who memorizes the practice exam perfectly but fails the actual test because the questions changed slightly.'
    };
    return analogies[concept] || "It's like learning a new language by listening to native speakers instead of reading a grammar book.";
  }
};

export default aiService;
