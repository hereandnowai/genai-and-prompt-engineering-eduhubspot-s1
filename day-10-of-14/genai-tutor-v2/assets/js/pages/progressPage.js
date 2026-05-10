const ProgressPage = {
    render() {
        const container = document.createElement('div');
        container.className = 'progress-page animate-fade-in';
        container.innerHTML = `
            <div style="margin-bottom: 40px;">
                <h1>Learning Statistics</h1>
                <p style="color: var(--text-muted);">A deep dive into your AI mastery journey.</p>
            </div>

            <div class="grid grid-2" style="margin-bottom: 40px;">
                <div class="card">
                    <h3>Topic Mastery</h3>
                    <div style="margin-top: 20px;">
                        ${this.renderProgressBar('AI Fundamentals', 80)}
                        ${this.renderProgressBar('Machine Learning', 45)}
                        ${this.renderProgressBar('Generative AI', 15)}
                        ${this.renderProgressBar('Ethics in AI', 0)}
                    </div>
                </div>
                
                <div class="card">
                    <h3>Achievements</h3>
                    <div class="grid grid-3" style="margin-top: 20px; gap: 15px;">
                        <div style="text-align: center; opacity: 1;">
                            <div style="font-size: 2rem; margin-bottom: 10px;">🥇</div>
                            <p style="font-size: 0.75rem; font-weight: 600;">Fast Learner</p>
                        </div>
                        <div style="text-align: center; opacity: 0.4;">
                            <div style="font-size: 2rem; margin-bottom: 10px;">🔥</div>
                            <p style="font-size: 0.75rem; font-weight: 600;">7 Day Streak</p>
                        </div>
                        <div style="text-align: center; opacity: 1;">
                            <div style="font-size: 2rem; margin-bottom: 10px;">🤖</div>
                            <p style="font-size: 0.75rem; font-weight: 600;">Chatty Pupil</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return container;
    },

    renderProgressBar(label, percent) {
        return `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-size: 0.9rem; font-weight: 500;">${label}</span>
                    <span style="font-size: 0.9rem; color: var(--text-muted);">${percent}%</span>
                </div>
                <div style="height: 8px; background: var(--bg-light); border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; width: ${percent}%; background: linear-gradient(to right, var(--primary), var(--secondary)); border-radius: 4px;"></div>
                </div>
            </div>
        `;
    }
};
