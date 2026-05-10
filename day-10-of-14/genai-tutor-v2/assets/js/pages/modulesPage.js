const ModulesPage = {
    modules: [
        { id: 1, title: 'What is AI?', icon: '🤖', time: '10 min', level: 'Beginner', desc: 'The basics of how machines mimic human intelligence.' },
        { id: 2, title: 'Machine Learning', icon: '🧠', time: '15 min', level: 'Beginner', desc: 'Teaching computers to learn from data without explicit programming.' },
        { id: 3, title: 'Neural Networks', icon: '🔗', time: '20 min', level: 'Intermediate', desc: 'Architectures inspired by the human brain.' },
        { id: 4, title: 'Generative AI', icon: '🎨', time: '15 min', level: 'Beginner', desc: 'Creating new content like images, text, and code.' },
        { id: 5, title: 'AI Ethics', icon: '⚖️', time: '12 min', level: 'All', desc: 'Bias, safety, and the social impact of AI.' }
    ],

    render() {
        const container = document.createElement('div');
        container.className = 'modules-page animate-fade-in';
        container.innerHTML = `
            <div style="margin-bottom: 40px;">
                <h1>Learning Modules</h1>
                <p style="color: var(--text-muted);">Structured curriculum to take you from AI novice to expert.</p>
            </div>
            
            <div class="grid grid-3" id="modules-list"></div>
        `;

        this.renderModules(container);
        return container;
    },

    renderModules(container) {
        const list = container.querySelector('#modules-list');
        this.modules.forEach(m => {
            const card = document.createElement('div');
            card.className = 'card module-card';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <span style="font-size: 2rem;">${m.icon}</span>
                    <span style="background: var(--bg-light); padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: 600;">${m.level}</span>
                </div>
                <h3>${m.title}</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin: 10px 0 20px;">${m.desc}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); pt: 15px; margin-top: auto;">
                    <span style="font-size: 0.8rem; color: var(--text-muted);">⏱️ ${m.time}</span>
                    <button class="btn btn-primary btn-sm" onclick="window.location.hash='#tutor'">Start Module</button>
                </div>
            `;
            list.appendChild(card);
        });
    }
};
