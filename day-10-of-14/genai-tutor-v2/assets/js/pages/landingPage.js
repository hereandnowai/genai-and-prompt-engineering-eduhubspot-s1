const LandingPage = {
    render() {
        const container = document.createElement('div');
        container.className = 'landing-page animate-fade-in';
        
        container.innerHTML = `
            <section class="hero">
                <div class="container" style="text-align: center;">
                    <h1 style="font-size: 4rem; margin-bottom: 20px;">Master AI with Your Personalized <span style="background: linear-gradient(to right, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Tutor</span></h1>
                    <p style="font-size: 1.25rem; color: var(--text-muted); max-width: 800px; margin: 0 auto 40px;">Learn Artificial Intelligence through interactive conversations, visual modules, and gamified quizzes. Designed specifically for beginners.</p>
                    <div class="hero-btns" style="display: flex; gap: 20px; justify-content: center;">
                        <a href="#dashboard" class="btn btn-primary" style="padding: 15px 35px; font-size: 1.1rem;">Start Learning Now</a>
                        <a href="#modules" class="btn btn-outline" style="padding: 15px 35px; font-size: 1.1rem;">Explore Topics</a>
                    </div>
                </div>
            </section>

            <section class="features">
                <div class="container">
                    <h2 style="text-align: center; margin-bottom: 50px; font-size: 2.5rem;">Why Choose GenAI Tutor?</h2>
                    <div class="grid grid-3">
                        <div class="card">
                            <div class="icon" style="font-size: 2rem; margin-bottom: 20px;">🤖</div>
                            <h3>AI Conversations</h3>
                            <p>Interact with our tutor bot that explains complex topics using simple real-world analogies.</p>
                        </div>
                        <div class="card">
                            <div class="icon" style="font-size: 2rem; margin-bottom: 20px;">🎓</div>
                            <h3>Structured Path</h3>
                            <p>Follow a step-by-step curriculum from AI basics to advanced Generative models.</p>
                        </div>
                        <div class="card">
                            <div class="icon" style="font-size: 2rem; margin-bottom: 20px;">🏆</div>
                            <h3>Gamified Experience</h3>
                            <p>Earn XP, maintain streaks, and collect badges as you master new AI concepts.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="subjects" style="background: var(--bg-white);">
                <div class="container">
                    <h2 style="text-align: center; margin-bottom: 50px;">Popular AI Topics</h2>
                    <div class="grid grid-4" id="topic-grid"></div>
                </div>
            </section>
        `;

        this.renderTopics(container);
        return container;
    },

    renderTopics(container) {
        const topics = [
            { name: 'Machine Learning', icon: '🧠', desc: 'Computers learning from data' },
            { name: 'Generative AI', icon: '🎨', desc: 'Creating art, text and music' },
            { name: 'Neural Networks', icon: '🔗', desc: 'Inspired by the human brain' },
            { name: 'AI Ethics', icon: '⚖️', desc: 'Building responsible AI' }
        ];

        const grid = container.querySelector('#topic-grid');
        topics.forEach(t => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div style="font-size: 1.5rem; margin-bottom: 10px;">${t.icon}</div>
                <h4 style="margin-bottom: 8px;">${t.name}</h4>
                <p style="font-size: 0.9rem; color: var(--text-muted);">${t.desc}</p>
            `;
            grid.appendChild(card);
        });
    }
};
