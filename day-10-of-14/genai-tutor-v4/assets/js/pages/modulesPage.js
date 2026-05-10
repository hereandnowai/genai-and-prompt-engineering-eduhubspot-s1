/**
 * modulesPage.js — Learning modules page controller
 */

const ModulesPage = (() => {

  let _modules = [];
  let _filter = 'all';
  let _activeModuleId = null;

  const render = async (container, params = {}) => {
    _activeModuleId = params.moduleId || null;

    container.innerHTML = `
      <div class="page-content">
        <div class="page-header">
          <h1>📚 Learning Modules</h1>
          <p>Explore AI topics from beginner to advanced</p>
        </div>
        <div class="modules-filters" role="group" aria-label="Filter modules">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="beginner">🌱 Beginner</button>
          <button class="filter-btn" data-filter="intermediate">🔥 Intermediate</button>
          <button class="filter-btn" data-filter="advanced">🚀 Advanced</button>
          <button class="filter-btn" data-filter="completed">✓ Completed</button>
        </div>
        <div class="modules-grid grid grid-auto-md" id="modulesGrid" role="list">
          ${Cards.skeletonGrid(6)}
        </div>
      </div>`;

    await _loadModules(container);

    if (_activeModuleId) {
      const mod = ModuleService.getById(_activeModuleId);
      if (mod) setTimeout(() => Modal.moduleDetail(mod), 300);
    }
  };

  const _loadModules = async (container) => {
    _modules = await ModuleService.getAll();
    _render();
    _bindEvents(container);
  };

  const _render = () => {
    const grid = document.getElementById('modulesGrid');
    if (!grid) return;
    const filtered = _filter === 'all'
      ? _modules
      : _filter === 'completed'
      ? _modules.filter(m => m.completed)
      : _modules.filter(m => m.difficulty === _filter);

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-icon" aria-hidden="true">🔍</div>
          <h3>No modules found</h3>
          <p>Try a different filter</p>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(m => Cards.moduleCard(m, m.completed)).join('');
    Helpers.staggerIn(grid.querySelectorAll('.module-card'), 60);
  };

  const _bindEvents = (container) => {
    // Filter buttons
    container.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _filter = btn.dataset.filter;
        _render();
      });
    });

    // Module cards — click or keyboard
    container.querySelector('#modulesGrid')?.addEventListener('click', (e) => {
      const card = e.target.closest('.module-card');
      const startBtn = e.target.closest('.start-module-btn');
      if (startBtn) {
        e.stopPropagation();
        _startModule(startBtn.dataset.moduleId);
        return;
      }
      if (card) {
        _openModuleDetail(card.dataset.moduleId);
      }
    });

    container.querySelector('#modulesGrid')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const card = e.target.closest('.module-card');
        if (card) { e.preventDefault(); _openModuleDetail(card.dataset.moduleId); }
      }
    });
  };

  const _openModuleDetail = (moduleId) => {
    const mod = ModuleService.getById(moduleId);
    if (mod) Modal.moduleDetail(mod);
  };

  const _startModule = (moduleId) => {
    const mod = ModuleService.getById(moduleId);
    if (!mod) return;

    // Mark as complete and award XP
    if (!State.isModuleComplete(moduleId)) {
      State.markModuleComplete(moduleId);
      State.addXP(mod.xp || CONFIG.GAMIFICATION.XP_PER_MODULE);
      Helpers.showXPGain(mod.xp || CONFIG.GAMIFICATION.XP_PER_MODULE);
      Helpers.celebrate();
      Helpers.toast(`🎉 "${mod.title}" completed! +${mod.xp} XP`, 'success');
    }

    // Refresh the grid
    _modules = ModuleService.getAll();
    // Re-fetch sync version
    const allMods = _modules;
    if (Array.isArray(allMods)) {
      _modules = allMods.map(m => ({ ...m, completed: State.isModuleComplete(m.id) }));
    }
    _render();

    // Open detail modal
    Modal.moduleDetail(mod);
  };

  return { render };
})();
