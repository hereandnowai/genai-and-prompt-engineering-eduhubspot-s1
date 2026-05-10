/**
 * dashboardPage.js — Dashboard page controller
 */

const DashboardPage = (() => {

  const render = async (container) => {
    container.innerHTML = `
      <div class="page-content">
        <div class="page-header">
          <h1>📊 Dashboard</h1>
          <p>Your learning overview at a glance</p>
        </div>
        <div id="dashboardBody">${Cards.skeletonGrid(4, 2)}</div>
      </div>`;

    try {
      await _loadData(container);
    } catch (e) {
      console.error('Dashboard load error:', e);
      document.getElementById('dashboardBody').innerHTML =
        '<p class="error-msg">⚠️ Could not load dashboard. Please refresh.</p>';
    }
  };

  const _loadData = async (container) => {
    // Ensure modules are loaded
    await ModuleService.loadModules();

    const stats = State.getStats();
    const level = State.getLevel();
    const xp = State.get('progress').totalXP || 0;
    const progress = ProgressService.getOverallProgress();
    const weekly = ProgressService.getWeeklyActivity();
    const recent = ProgressService.getRecentActivity();
    const recommended = ModuleService.getRecommended();
    const achievements = State.getAllAchievements();
    const name = State.get('currentUser')?.name || 'Learner';

    const body = document.getElementById('dashboardBody');
    body.innerHTML = `
      ${DashboardComponent.welcomeBanner(name, stats.streak, level)}
      ${DashboardComponent.statsRow(stats, level)}
      
      <div class="dashboard-grid-2">
        ${DashboardComponent.xpSection(xp, level)}
        ${DashboardComponent.weeklyChart(weekly)}
      </div>

      <div class="dashboard-grid-2">
        ${DashboardComponent.recentActivity(recent)}
        ${DashboardComponent.recommendations(recommended)}
      </div>

      ${DashboardComponent.achievementsPreview(achievements)}
    `;

    // Animate numbers
    body.querySelectorAll('[data-animate-number]').forEach(el => {
      Helpers.animateNumber(el, 0, parseInt(el.dataset.animateNumber) || 0, 1000);
    });

    // Animate progress
    setTimeout(() => ProgressComponent.animateAll(body), 200);
  };

  return { render };
})();
