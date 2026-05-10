import router from './router.js';
import navbar from './components/navbar.js';
import landingPage from './pages/landingPage.js';
import dashboardPage from './pages/dashboardPage.js';
import tutorPage from './pages/tutorPage.js';
import modulesPage from './pages/modulesPage.js';
import quizPage from './pages/quizPage.js';
import settingsPage from './pages/settingsPage.js';
import stateManager from './state.js';
import storageService from './services/storageService.js';
import CONFIG from './config.js';

class App {
  constructor() {
    this.appElement = document.getElementById('app');
    this.navElement = document.getElementById('nav-container');
  }

  async init() {
    console.log('Initializing GenAI Tutor App...');
    
    // 1. Load persisted state
    const savedState = storageService.load(CONFIG.STORAGE_KEYS.STATE);
    if (savedState) {
      stateManager.setState(savedState);
    }

    // 2. Subscribe to state changes for auto-save
    window.addEventListener('statechange', (e) => {
      storageService.save(CONFIG.STORAGE_KEYS.STATE, e.detail);
    });

    // 3. Render Static Shell
    this.navElement.innerHTML = navbar.render();
    const headerElement = document.getElementById('header-container');
    if (headerElement) headerElement.innerHTML = navbar.renderHeader();

    // 4. Initialize Router
    router.init({
      'home': () => this.renderPage(landingPage),
      'dashboard': () => this.renderPage(dashboardPage),
      'tutor': () => this.renderPage(tutorPage),
      'modules': () => this.renderPage(modulesPage),
      'quiz': () => this.renderPage(quizPage),
      'settings': () => this.renderPage(settingsPage),
      '404': () => { this.appElement.innerHTML = '<h1>Page Not Found</h1>'; }
    });

    // Handle hash change for sidebar active state
    window.addEventListener('hashchange', () => {
      this.navElement.innerHTML = navbar.render();
      if (window.lucide) window.lucide.createIcons();
    });

    // 5. Global Lucide init
    if (window.lucide) window.lucide.createIcons();
  }

  async renderPage(pageComponent) {
    const html = await pageComponent.render();
    this.appElement.innerHTML = html;
    
    if (pageComponent.init) {
      pageComponent.init();
    }
  }
}

const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
