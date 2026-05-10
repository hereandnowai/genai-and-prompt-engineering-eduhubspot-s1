import stateManager from '../state.js';

const navbar = {
  render() {
    const s = stateManager.getState();
    return `
      <div class="p-6 flex items-center space-x-3" style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 32px; height: 32px; background: var(--accent-cyan); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--sidebar-bg);">
          <i data-lucide="graduation-cap" style="width: 20px;"></i>
        </div>
        <span style="font-size: 1.25rem; font-weight: 800; color: white;">GenAI Tutor</span>
      </div>

      <nav class="nav-links">
        <a href="#dashboard" class="nav-link ${window.location.hash === '#dashboard' ? 'active' : ''}">
          <i data-lucide="layout-dashboard"></i>
          <span>Dashboard</span>
        </a>
        <a href="#tutor" class="nav-link ${window.location.hash === '#tutor' ? 'active' : ''}">
          <i data-lucide="message-square"></i>
          <span>AI Tutor Chat</span>
        </a>
        <a href="#modules" class="nav-link ${window.location.hash === '#modules' || window.location.hash === '#home' ? 'active' : ''}">
          <i data-lucide="book-open"></i>
          <span>Modules</span>
        </a>
        <a href="#quiz" class="nav-link ${window.location.hash === '#quiz' ? 'active' : ''}">
          <i data-lucide="pen-tool"></i>
          <span>Quizzes</span>
        </a>
        <a href="#settings" class="nav-link ${window.location.hash === '#settings' ? 'active' : ''}">
          <i data-lucide="settings"></i>
          <span>Settings</span>
        </a>
      </nav>

      <div style="margin-top: auto; padding: var(--space-lg);">
        <div style="background: rgba(255,255,255,0.05); border-radius: var(--radius-xl); padding: var(--space-md); border: 1px solid rgba(255,255,255,0.1);">
          <p style="font-size: 0.7rem; text-transform: uppercase; font-weight: 700; color: var(--accent-cyan); letter-spacing: 1px; margin-bottom: 10px;">Daily Streak</p>
          <div style="height: 6px; background: rgba(0,0,0,0.3); border-radius: 3px; margin-bottom: 8px;">
            <div style="height: 100%; width: 70%; background: var(--accent-cyan); border-radius: 3px;"></div>
          </div>
          <p style="font-size: 0.75rem; color: var(--sidebar-text); opacity: 0.7;">🔥 ${s.user.streak || 0} Day Streak</p>
        </div>
      </div>
    `;
  },

  renderHeader() {
    const s = stateManager.getState();
    return `
      <div style="flex: 1; max-width: 400px; position: relative;">
        <i data-lucide="search" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; color: var(--text-light);"></i>
        <input type="text" placeholder="Search modules..." style="width: 100%; padding: 0.75rem 1rem 0.75rem 2.5rem; background: var(--background); border: 1px solid var(--border); border-radius: var(--radius-xl); font-size: 0.85rem; outline: none;">
      </div>
      <div style="display: flex; align-items: center; gap: 20px;">
        <div style="background: var(--purple-light); color: var(--purple); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700; border: 1px solid rgba(147, 51, 234, 0.1);">
          ⚡ 450 XP Today
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="text-align: right;">
            <p style="font-size: 0.85rem; font-weight: 700;">${s.user.name}</p>
            <p style="font-size: 0.7rem; color: var(--text-light);">Lvl ${Math.floor(s.user.xp / 500) + 1} Explorer</p>
          </div>
          <div style="width: 40px; height: 40px; background: var(--primary); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; border: 2px solid var(--sidebar-item-bg);">
            ${s.user.name.substring(0, 2).toUpperCase()}
          </div>
        </div>
      </div>
    `;
  }
};

export default navbar;

