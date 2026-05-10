/**
 * settingsPage.js — Settings page controller
 */

const SettingsPage = (() => {

  const render = (container) => {
    const settings = State.get('settings');
    const stats = State.getStats();

    container.innerHTML = `
      <div class="page-content narrow">
        <div class="page-header">
          <h1>⚙️ Settings</h1>
          <p>Customize your learning experience</p>
        </div>

        <!-- Appearance -->
        <section class="settings-section card" aria-labelledby="appearance-heading">
          <h2 id="appearance-heading" class="settings-section-title">🎨 Appearance</h2>

          <div class="setting-row">
            <div class="setting-info">
              <label class="setting-label" for="themeToggle">Dark Mode</label>
              <span class="setting-desc">Switch between dark and light theme</span>
            </div>
            <label class="toggle-switch" aria-label="Toggle dark mode">
              <input type="checkbox" id="themeToggle" ${settings.theme === 'dark' ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <label class="setting-label" for="fontSizeSelect">Font Size</label>
              <span class="setting-desc">Adjust text size for readability</span>
            </div>
            <select class="setting-select" id="fontSizeSelect" aria-label="Font size">
              <option value="small" ${settings.fontSize === 'small' ? 'selected' : ''}>Small</option>
              <option value="medium" ${settings.fontSize === 'medium' ? 'selected' : ''}>Medium</option>
              <option value="large" ${settings.fontSize === 'large' ? 'selected' : ''}>Large</option>
            </select>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <label class="setting-label" for="motionToggle">Reduce Motion</label>
              <span class="setting-desc">Minimize animations (accessibility)</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="motionToggle" ${settings.reducedMotion ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </section>

        <!-- Learning -->
        <section class="settings-section card" aria-labelledby="learning-heading">
          <h2 id="learning-heading" class="settings-section-title">📚 Learning</h2>

          <div class="setting-row">
            <div class="setting-info">
              <label class="setting-label" for="autoSaveToggle">Auto-Save Conversations</label>
              <span class="setting-desc">Automatically save chat sessions</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="autoSaveToggle" ${settings.autoSaveConversations ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-row">
            <div class="setting-info">
              <label class="setting-label" for="hintsToggle">Show Hints</label>
              <span class="setting-desc">Show helpful tips while learning</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="hintsToggle" ${settings.showHints ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </section>

        <!-- AI Tutor -->
        <section class="settings-section card" aria-labelledby="ai-heading">
          <h2 id="ai-heading" class="settings-section-title">🤖 AI Tutor</h2>
          <div class="setting-row">
            <div class="setting-info">
              <label class="setting-label" for="apiKeyInput">Anthropic API Key</label>
              <span class="setting-desc">Connect your own Claude API key for real AI responses</span>
            </div>
            <div class="api-key-wrap">
              <input type="password" id="apiKeyInput" class="setting-input" 
                     placeholder="sk-ant-..." 
                     value="${settings.apiKey || ''}"
                     aria-label="Anthropic API key"/>
              <button class="btn btn-sm btn-secondary" id="saveApiKeyBtn">Save</button>
            </div>
          </div>
          <p class="settings-note">ℹ️ Without an API key, the tutor uses pre-built educational responses. Your key is stored locally only.</p>
        </section>

        <!-- Data -->
        <section class="settings-section card" aria-labelledby="data-heading">
          <h2 id="data-heading" class="settings-section-title">💾 Data & Storage</h2>

          <div class="data-stats">
            <div class="data-stat">
              <span class="data-stat-label">Modules Completed</span>
              <span class="data-stat-val">${stats.completedModules}</span>
            </div>
            <div class="data-stat">
              <span class="data-stat-label">Total XP</span>
              <span class="data-stat-val">⚡ ${stats.totalXP}</span>
            </div>
            <div class="data-stat">
              <span class="data-stat-label">Saved Conversations</span>
              <span class="data-stat-val">${State.getConversations().length}</span>
            </div>
          </div>

          <div class="data-actions">
            <button class="btn btn-secondary" id="exportBtn">📤 Export Progress</button>
            <label class="btn btn-secondary import-label" tabindex="0">
              📥 Import Progress
              <input type="file" id="importFile" accept=".json" class="sr-only" aria-label="Import progress file"/>
            </label>
            <button class="btn btn-danger" id="resetBtn">🗑️ Reset All Progress</button>
          </div>
        </section>

        <!-- About -->
        <section class="settings-section card" aria-labelledby="about-heading">
          <h2 id="about-heading" class="settings-section-title">ℹ️ About</h2>
          <div class="about-info">
            <p><strong>GenAI Tutor</strong> v1.0.0</p>
            <p>A free, open-source AI education platform built with Vanilla HTML, CSS & JavaScript.</p>
            <p>Built with ❤️ for learners everywhere.</p>
          </div>
        </section>

      </div>`;

    _bindEvents(container);
  };

  const _bindEvents = (container) => {
    const _save = (key, val) => {
      const s = State.get('settings');
      State.merge('settings', { ...s, [key]: val });
      StorageService.save();
    };

    container.querySelector('#themeToggle')?.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      _save('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      Helpers.toast(`${e.target.checked ? '🌙 Dark' : '☀️ Light'} mode enabled`, 'success');
    });

    container.querySelector('#fontSizeSelect')?.addEventListener('change', (e) => {
      _save('fontSize', e.target.value);
      document.documentElement.setAttribute('data-font-size', e.target.value);
      Helpers.toast('Font size updated', 'success');
    });

    container.querySelector('#motionToggle')?.addEventListener('change', (e) => {
      _save('reducedMotion', e.target.checked);
      document.documentElement.classList.toggle('reduce-motion', e.target.checked);
      Helpers.toast('Motion preference saved', 'success');
    });

    container.querySelector('#autoSaveToggle')?.addEventListener('change', (e) => {
      _save('autoSaveConversations', e.target.checked);
    });

    container.querySelector('#hintsToggle')?.addEventListener('change', (e) => {
      _save('showHints', e.target.checked);
    });

    container.querySelector('#saveApiKeyBtn')?.addEventListener('click', () => {
      const key = container.querySelector('#apiKeyInput')?.value?.trim();
      _save('apiKey', key);
      if (key) {
        CONFIG.AI.API_KEY = key;
        CONFIG.AI.USE_ANTHROPIC_API = true;
      } else {
        CONFIG.AI.USE_ANTHROPIC_API = false;
      }
      Helpers.toast('API key saved', 'success');
    });

    container.querySelector('#exportBtn')?.addEventListener('click', () => {
      const data = StorageService.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'genai-tutor-progress.json';
      a.click();
      URL.revokeObjectURL(url);
      Helpers.toast('📤 Progress exported!', 'success');
    });

    container.querySelector('#importFile')?.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const validation = Validators.validateImportData(text);
        if (!validation.valid) { Helpers.toast('❌ ' + validation.error, 'error'); return; }
        StorageService.importData(text);
        Helpers.toast('📥 Progress imported! Reloading...', 'success');
        setTimeout(() => window.location.reload(), 1500);
      } catch { Helpers.toast('❌ Failed to import file', 'error'); }
    });

    container.querySelector('#resetBtn')?.addEventListener('click', () => {
      Modal.confirm({
        title: '⚠️ Reset All Progress',
        message: 'This will permanently delete all your progress, XP, and saved conversations. This cannot be undone.',
        danger: true,
        onConfirm: () => {
          StorageService.clear();
          Helpers.toast('🗑️ Progress reset. Reloading...', 'info');
          setTimeout(() => window.location.reload(), 1500);
        }
      });
    });
  };

  return { render };
})();
