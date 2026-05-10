const AIService = {
    async getResponse(message, topic = 'General') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const res = this.generateMockResponse(message, topic);
        return res;
    },

    generateMockResponse(input, topic) {
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
            return "Hello! I'm your AI Tutor. What would you like to learn about today? I can help with Machine Learning, Generative AI, or even AI Ethics.";
        }

        if (lowerInput.includes('what is ai')) {
            return "Think of Artificial Intelligence (AI) like giving a computer a 'brain' so it can learn from experience, instead of just following fixed rules. Just like how you learned to recognize a cat after seeing many of them, AI does the same with data!";
        }

        if (lowerInput.includes('machine learning')) {
            return "Machine Learning is a subset of AI. Imagine teaching a dog new tricks by giving it treats—that's 'reinforcement'. ML is similar; we give algorithms 'data' instead of treats to help them improve at a task!";
        }

        return `That's a great question about ${topic}! In simple terms, this concept helps AI understand patterns. Would you like a real-world analogy for this?`;
    }
};
