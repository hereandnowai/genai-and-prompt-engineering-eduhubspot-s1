const landingPage = {
  render() {
    return `
      <section class="hero animate-fade-in shadow-lg">
        <div style="position: relative; z-index: 10;">
          <span class="badge" style="background: rgba(255,255,255,0.2); color: white; margin-bottom: 24px; backdrop-filter: blur(4px);">The Future of Learning</span>
          <h1 style="font-size: 3.5rem; margin-bottom: 20px; max-width: 800px; font-weight: 800; line-height: 1.1;">Master AI with your personal <span style="color: var(--accent-cyan);">GenAI Tutor</span></h1>
          <p style="color: white; opacity: 0.9; font-size: 1.25rem; max-width: 600px; margin-bottom: 40px; font-weight: 500;">Interactive modules, gamified quizzes, and 24/7 AI-powered mentorship for beginners.</p>
          <div style="display: flex; gap: 20px;">
            <a href="#modules" class="btn" style="background: white; color: var(--primary); padding: 1rem 2.5rem; font-size: 1.1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1);">Resume Learning</a>
            <a href="#tutor" class="btn" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); backdrop-filter: blur(10px); padding: 1rem 2.5rem; font-size: 1.1rem;">Chat with AI</a>
          </div>
        </div>
        <div style="position: absolute; right: -50px; bottom: -50px; opacity: 0.1;">
          <svg width="400" height="400" viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" stroke="white" stroke-width="40" fill="none"/></svg>
        </div>
      </section>

      <div class="grid-auto">
        <div class="card">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: var(--purple-light); color: var(--purple); margin-bottom: 20px;" class="flex-center">
            <i data-lucide="brain"></i>
          </div>
          <h3 class="card-title">Beginner Friendly</h3>
          <p class="card-description">No math background or technical experience needed. We simplify the complex concepts of AI for you.</p>
        </div>
        <div class="card">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(34, 211, 238, 0.1); color: var(--accent-cyan); margin-bottom: 20px;" class="flex-center">
            <i data-lucide="zap"></i>
          </div>
          <h3 class="card-title">AI Mentorship</h3>
          <p class="card-description">Our tutor helps you learn through personalized analogies and instant feedback on your questions.</p>
        </div>
        <div class="card">
          <div style="width: 48px; height: 48px; border-radius: 12px; background: rgba(16, 185, 129, 0.1); color: var(--success); margin-bottom: 20px;" class="flex-center">
            <i data-lucide="award"></i>
          </div>
          <h3 class="card-title">Earn Mastery</h3>
          <p class="card-description">Track your progress and earn achievements as you build your knowledge in generative artificial intelligence.</p>
        </div>
      </div>
    `;
  },

  init() {
    if (window.lucide) window.lucide.createIcons();
  }
};

export default landingPage;
