import progressService from '../services/progressService.js';
import stateManager from '../state.js';

const modulesPage = {
  modules: [],

  async loadModules() {
    try {
      const response = await fetch('assets/data/modules.json');
      this.modules = await response.json();
    } catch (e) {
      console.error('Error loading modules:', e);
    }
  },

  async render() {
    await this.loadModules();
    const completed = stateManager.getState().completedModules;

    const moduleCards = this.modules.map(mod => `
      <div class="card shadow-md">
        ${completed.includes(mod.id) ? '<div style="position: absolute; top: 20px; right: 20px; background: var(--success); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;"><i data-lucide="check" style="width: 14px;"></i></div>' : ''}
        <div style="background: var(--background); width: 56px; height: 56px; border-radius: 16px; margin-bottom: 20px; color: var(--primary);" class="flex-center">
          <i data-lucide="${mod.icon || 'book'}" style="width: 28px; height: 28px;"></i>
        </div>
        <h3 class="card-title">${mod.title}</h3>
        <p class="card-description" style="margin-bottom: 24px;">${mod.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border);">
          <span style="font-size: 0.75rem; font-weight: 700; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px;">
            <i data-lucide="clock" style="width: 14px; margin-right: 4px; vertical-align: middle;"></i> ${mod.estimate}
          </span>
          <button class="btn btn-primary start-module" data-id="${mod.id}" style="padding: 0.6rem 1.2rem; border-radius: var(--radius-lg);">
            ${completed.includes(mod.id) ? 'Review' : 'Unlock Module'}
          </button>
        </div>
      </div>
    `).join('');

    return `
      <div style="margin-bottom: 40px; text-align: left;">
        <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 12px;">Learning Modules</h1>
        <p style="color: var(--text-light); font-size: 1.1rem;">Master these key concepts to become proficient in Generative AI.</p>
      </div>
      <div class="grid-auto">
        ${moduleCards}
      </div>
    `;
  },

  init() {
    if (window.lucide) window.lucide.createIcons();
    
    document.querySelectorAll('.start-module').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        // In a real app we'd navigate to a detail view
        alert(`Starting module: ${id}. \n\nIn this prototype, we'll mark it as completed to show progress logic!`);
        progressService.completeModule(id, 100);
        window.location.hash = 'dashboard';
      });
    });
  }
};

export default modulesPage;
