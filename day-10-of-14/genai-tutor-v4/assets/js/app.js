/**
 * app.js — Application bootstrap and initialization
 */

const App = (() => {

  const _applySettings = () => {
    const settings = State.get('settings');
    const html = document.documentElement;
    html.setAttribute('data-theme', settings.theme || 'dark');
    html.setAttribute('data-font-size', settings.fontSize || 'medium');
    if (settings.reducedMotion) html.classList.add('reduce-motion');
    if (settings.apiKey) {
      CONFIG.AI.API_KEY = settings.apiKey;
      CONFIG.AI.USE_ANTHROPIC_API = true;
    }
  };

  const _setupNav = () => {
    const navEl = document.getElementById('navContainer');
    if (navEl) Navbar.mount(navEl);
  };

  const _setupRoutes = () => {
    Router.define('/', (container) => LandingPage.mount(container));
    Router.define('/dashboard', (container) => DashboardPage.render(container));
    Router.define('/tutor', (container) => TutorPage.render(container));
    Router.define('/modules', (container) => ModulesPage.render(container));
    Router.define('/modules/:moduleId', (container, params) => ModulesPage.render(container, params));
    Router.define('/quiz', (container) => QuizPage.render(container));
    Router.define('/quiz/:quizId', (container, params) => QuizPage.render(container, params));
    Router.define('/progress', (container) => ProgressPage.render(container));
    Router.define('/settings', (container) => SettingsPage.render(container));
  };

  const _createStarField = () => {
    const canvas = document.getElementById('starCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        o: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.3 + 0.05
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 220, 255, ${s.o})`;
        ctx.fill();
        s.o += s.speed * 0.02;
        if (s.o > 0.8 || s.o < 0.1) s.speed *= -1;
      });
      if (!document.hidden) requestAnimationFrame(draw);
    };

    window.addEventListener('resize', Helpers.debounce(resize, 300));
    resize();
    draw();
  };

  const _setupStreak = () => {
    State.updateStreak();
    State.checkAchievements();
  };

  const _showWelcomeToast = () => {
    const isFirstVisit = !localStorage.getItem(CONFIG.STORAGE_KEYS.PROGRESS);
    if (isFirstVisit) {
      setTimeout(() => {
        Helpers.toast('👋 Welcome to GenAI Tutor! Start with the AI Tutor or browse Learning Modules.', 'info', 5000);
      }, 1000);
    }
  };

  const init = () => {
    // Load persisted state
    StorageService.load();

    // Apply user settings (theme, font size, etc.)
    _applySettings();

    // Set up navbar
    _setupNav();

    // Set up star field background
    _createStarField();

    // Register all routes
    _setupRoutes();

    // Start router on the main content container
    Router.init({
      container: document.getElementById('appContent')
    });

    // Daily streak tracking
    _setupStreak();

    // Welcome message
    _showWelcomeToast();

    console.log(`%c🧠 GenAI Tutor v${CONFIG.APP_VERSION} loaded`, 'color:#22d3ee;font-weight:bold;font-size:14px');
  };

  return { init };
})();

// Boot when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
