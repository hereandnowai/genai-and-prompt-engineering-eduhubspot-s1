const DashboardPage = {
    render() {
        const container = document.createElement('div');
        container.className = 'dashboard-page animate-fade-in';
        
        container.innerHTML = `
            <div style="margin-bottom: 40px;">
                <h1>Welcome Back, Explorer! 👋</h1>
                <p style="color: var(--text-muted);">Track your progress and continue your AI journey.</p>
            </div>

            <div class="grid grid-4" style="margin-bottom: 40px;">
                <div class="card" style="text-align: center;">
                    <span style="font-size: 0.8rem; color: var(--text-muted);">TOTAL XP</span>
                    <h2 id="dash-xp" style="font-size: 2rem; color: var(--primary);">${state.progress.xp}</h2>
                </div>
                <div class="card" style="text-align: center;">
                    <span style="font-size: 0.8rem; color: var(--text-muted);">STREAK</span>
                    <h2 style="font-size: 2rem; color: #f59e0b;">🔥 ${state.progress.streak}</h2>
                </div>
                <div class="card" style="text-align: center;">
                    <span style="font-size: 0.8rem; color: var(--text-muted);">COURSES</span>
                    <h2 style="font-size: 2rem; color: var(--secondary);">3/12</h2>
                </div>
                <div class="card" style="text-align: center;">
                    <span style="font-size: 0.8rem; color: var(--text-muted);">QUIZZES</span>
                    <h2 style="font-size: 2rem; color: var(--accent);">5</h2>
                </div>
            </div>

            <div class="grid grid-2">
                <div class="card">
                    <h3>Recent Activity</h3>
                    <div style="margin-top: 20px;">
                        <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 15px;">
                            <div style="width: 40px; height: 40px; background: #e0f2fe; display: flex; align-items: center; justify-content: center; border-radius: 50%;">🤖</div>
                            <div>
                                <h4 style="font-size: 0.95rem;">Completed: What is AI?</h4>
                                <span style="font-size: 0.8rem; color: var(--text-muted);">Today at 10:30 AM</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 15px; align-items: center;">
                            <div style="width: 40px; height: 40px; background: #fef3c7; display: flex; align-items: center; justify-content: center; border-radius: 50%;">📝</div>
                            <div>
                                <h4 style="font-size: 0.95rem;">Quiz: ML Fundamentals</h4>
                                <span style="font-size: 0.8rem; color: var(--text-muted);">Yesterday</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <h3>Recommended Next</h3>
                    <div style="margin-top: 20px; background: var(--bg-light); border-radius: 12px; padding: 20px;">
                        <h4>Generative AI Basics</h4>
                        <p style="font-size: 0.9rem; color: var(--text-muted); margin: 5px 0 15px;">Unlock the secrets of LLMs and Diffusion models.</p>
                        <button class="btn btn-primary" style="width: 100%;">Resume Learning</button>
                    </div>
                </div>
            </div>
        `;
        
        return container;
    }
};
