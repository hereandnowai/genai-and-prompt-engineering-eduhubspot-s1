/**
 * landingPage.js — Hero landing page
 */

const LandingPage = (() => {

  const features = [
    { icon: '🤖', title: 'AI Tutor Chat', desc: 'Ask any AI question and get beginner-friendly answers in seconds.' },
    { icon: '📚', title: '10 Learning Modules', desc: 'Structured lessons from AI basics to cutting-edge generative AI.' },
    { icon: '🎯', title: 'Interactive Quizzes', desc: 'Test your knowledge with topic-based quizzes and instant feedback.' },
    { icon: '⚡', title: 'XP & Achievements', desc: 'Earn XP, level up, and unlock badges as you learn.' },
    { icon: '📊', title: 'Progress Tracking', desc: 'Track your learning journey with detailed analytics and insights.' },
    { icon: '💾', title: 'Save & Resume', desc: 'Your progress is auto-saved so you can learn at your own pace.' }
  ];

  const topics = [
    { icon: '🤖', label: 'AI Basics', path: '/modules/ai-basics' },
    { icon: '📊', label: 'Machine Learning', path: '/modules/machine-learning' },
    { icon: '🧠', label: 'Deep Learning', path: '/modules/deep-learning' },
    { icon: '🕸️', label: 'Neural Networks', path: '/modules/neural-networks' },
    { icon: '✨', label: 'Generative AI', path: '/modules/generative-ai' },
    { icon: '💬', label: 'Large Language Models', path: '/modules/llms' },
    { icon: '⚡', label: 'Prompt Engineering', path: '/modules/prompt-engineering' },
    { icon: '⚖️', label: 'AI Ethics', path: '/modules/ai-ethics' },
    { icon: '🗣️', label: 'NLP', path: '/modules/nlp' },
    { icon: '👁️', label: 'Computer Vision', path: '/modules/computer-vision' }
  ];

  const testimonials = [
    { name: 'Priya S.', role: 'College Student', text: 'GenAI Tutor made AI feel approachable for the first time. The chat tutor is incredible!', avatar: '👩‍🎓' },
    { name: 'Marcus T.', role: 'Product Manager', text: 'I finally understand LLMs and prompt engineering. This app is a game changer.', avatar: '👨‍💼' },
    { name: 'Aisha K.', role: 'Graphic Designer', text: 'The analogies and visual explanations are perfect for creative thinkers like me.', avatar: '👩‍🎨' }
  ];

  const render = () => `
    <main class="landing-page" id="main-content">

      <!-- Hero -->
      <section class="hero" aria-label="Hero section">
        <div class="hero-content">
          <div class="hero-badge">🚀 Free AI Education Platform</div>
          <h1 class="hero-title">
            Learn <span class="gradient-text">Artificial Intelligence</span><br>
            The Fun Way
          </h1>
          <p class="hero-subtitle">
            Chat with your personal AI tutor, explore interactive modules, take quizzes, 
            and track your progress — all for free, no signup required.
          </p>
          <div class="hero-ctas">
            <a href="#/tutor" class="btn btn-primary btn-lg">🤖 Start Chatting Now</a>
            <a href="#/modules" class="btn btn-secondary btn-lg">📚 Browse Modules</a>
          </div>
          <div class="hero-stats" role="list" aria-label="Platform statistics">
            <div class="hero-stat" role="listitem"><strong>10</strong> <span>Modules</span></div>
            <div class="hero-stat" role="listitem"><strong>50+</strong> <span>Quiz Questions</span></div>
            <div class="hero-stat" role="listitem"><strong>100%</strong> <span>Free</span></div>
          </div>
        </div>
        <div class="hero-visual" aria-hidden="true">
          <div class="hero-card-float">
            <div class="float-card card-1">
              <span>🧠</span><p>What is Machine Learning?</p>
            </div>
            <div class="float-card card-2">
              <span>💬</span><p>Explain LLMs to me simply</p>
            </div>
            <div class="float-card card-3">
              <span>✨</span><p>How does ChatGPT work?</p>
            </div>
            <div class="ai-tutor-bubble">
              <div class="ai-dot"></div>
              <p>Hi! I'm your AI Tutor 🤖<br>Ask me anything!</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="section features-section" aria-label="Features">
        <div class="section-header">
          <h2>Everything you need to <span class="gradient-text">learn AI</span></h2>
          <p>A complete learning experience built for beginners</p>
        </div>
        <div class="grid grid-3 features-grid" role="list">
          ${features.map(f => `
            <div class="card feature-card" role="listitem">
              <div class="feature-icon" aria-hidden="true">${f.icon}</div>
              <h3>${Helpers.sanitize(f.title)}</h3>
              <p>${Helpers.sanitize(f.desc)}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Topics -->
      <section class="section topics-section" aria-label="AI Topics">
        <div class="section-header">
          <h2>Explore <span class="gradient-text">10 AI Topics</span></h2>
          <p>From absolute basics to advanced generative AI</p>
        </div>
        <div class="topics-grid" role="list">
          ${topics.map(t => `
            <a href="#${t.path}" class="topic-chip" role="listitem" aria-label="Explore ${t.label}">
              <span aria-hidden="true">${t.icon}</span> ${t.label}
            </a>
          `).join('')}
        </div>
      </section>

      <!-- How it works -->
      <section class="section how-section" aria-label="How it works">
        <div class="section-header">
          <h2>How it <span class="gradient-text">works</span></h2>
        </div>
        <div class="grid grid-3 how-grid">
          <div class="how-step card">
            <div class="step-num" aria-hidden="true">1</div>
            <div class="step-icon" aria-hidden="true">📚</div>
            <h3>Pick a Topic</h3>
            <p>Choose from 10 AI topics, from basics to advanced concepts.</p>
          </div>
          <div class="how-step card">
            <div class="step-num" aria-hidden="true">2</div>
            <div class="step-icon" aria-hidden="true">🤖</div>
            <h3>Learn & Ask</h3>
            <p>Read the module, then chat with your AI tutor for deeper explanations.</p>
          </div>
          <div class="how-step card">
            <div class="step-num" aria-hidden="true">3</div>
            <div class="step-icon" aria-hidden="true">🎯</div>
            <h3>Test & Level Up</h3>
            <p>Take a quiz, earn XP, and track your mastery over time.</p>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="section testimonials-section" aria-label="Testimonials">
        <div class="section-header">
          <h2>Loved by <span class="gradient-text">learners</span></h2>
        </div>
        <div class="grid grid-3 testimonials-grid" role="list">
          ${testimonials.map(t => `
            <blockquote class="card testimonial-card" role="listitem">
              <p class="testimonial-text">"${Helpers.sanitize(t.text)}"</p>
              <footer class="testimonial-author">
                <span class="testimonial-avatar" aria-hidden="true">${t.avatar}</span>
                <div>
                  <strong>${Helpers.sanitize(t.name)}</strong>
                  <span>${Helpers.sanitize(t.role)}</span>
                </div>
              </footer>
            </blockquote>
          `).join('')}
        </div>
      </section>

      <!-- CTA -->
      <section class="section cta-section" aria-label="Call to action">
        <div class="cta-box card">
          <h2>Ready to start your <span class="gradient-text">AI journey?</span></h2>
          <p>No signup needed. Jump in and start learning right now.</p>
          <div class="cta-actions">
            <a href="#/tutor" class="btn btn-primary btn-lg">🤖 Chat with AI Tutor</a>
            <a href="#/dashboard" class="btn btn-secondary btn-lg">📊 View Dashboard</a>
          </div>
        </div>
      </section>

    </main>`;

  const mount = (container) => {
    container.innerHTML = render();
    Helpers.staggerIn(container.querySelectorAll('.feature-card, .how-step, .testimonial-card'), 80);
  };

  return { render, mount };
})();
