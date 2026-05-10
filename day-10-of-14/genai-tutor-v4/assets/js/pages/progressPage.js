/**
 * progressPage.js — Progress tracker page controller
 */

const ProgressPage = (() => {

  const render = async (container) => {
    container.innerHTML = `
      <div class="page-content">
        <div class="page-header">
          <h1>📈 My Progress</h1>
          <p>Track your AI learning journey</p>
        </div>
        <div id="progressBody">${Cards.skeletonGrid(3, 3)}</div>
      </div>`;

    await _loadData(container);
  };

  const _loadData = async (container) => {
    await ModuleService.loadModules();
    await QuizService.loadQuizzes();

    const stats = State.getStats();
    const level = State.getLevel();
    const xp = State.get('progress').totalXP || 0;
    const overall = ProgressService.getOverallProgress();
    const mastery = ProgressService.buildTopicMastery();
    const weekly = ProgressService.getWeeklyActivity();
    const recent = ProgressService.getRecentActivity();
    const achievements = State.getAllAchievements();

    const body = document.getElementById('progressBody');
    body.innerHTML = `

      <!-- XP & Level -->
      <div class="card progress-xp-card">
        <h3 class="card-title">⚡ XP & Level Progress</h3>
        ${ProgressComponent.xpLevelBar(xp, level.level, level)}
      </div>

      <!-- Overview stats -->
      <div class="stats-grid" role="list" aria-label="Overall progress stats">
        ${Cards.statCard('✅', 'Modules Completed', `${stats.completedModules}/10`, '', '#10b981')}
        ${Cards.statCard('🎯', 'Quizzes Taken', stats.quizzesCompleted, '', 'var(--accent-cyan)')}
        ${Cards.statCard('📊', 'Avg Quiz Score', `${stats.avgScore}%`, '', 'var(--accent-purple)')}
        ${Cards.statCard('🔥', 'Day Streak', stats.streak, 'current streak', '#f59e0b')}
      </div>

      <!-- Overall progress ring -->
      <div class="card progress-overview-card">
        <h3 class="card-title">🗺️ Overall Completion</h3>
        <div class="overview-ring-row">
          <div class="overview-ring-wrap">
            ${ProgressComponent.ring(overall.percentage, 120, 'var(--accent-cyan)', `${overall.percentage}% done`)}
            <p class="overview-ring-label">${overall.completedModules}/${overall.totalModules} modules</p>
          </div>
          <div class="overview-bar-list" role="list">
            ${ProgressComponent.bar(overall.percentage, 'var(--accent-cyan)', true, 'Modules')}
            ${ProgressComponent.bar(Math.round(stats.avgScore), '#10b981', true, 'Quiz Average')}
            ${ProgressComponent.bar(Math.min(stats.streak * 10, 100), '#f59e0b', true, 'Streak Score')}
          </div>
        </div>
      </div>

      <!-- Topic Mastery -->
      <div class="card mastery-card">
        <h3 class="card-title">🧠 Topic Mastery</h3>
        <div class="mastery-list" role="list">
          ${mastery.map(t => ProgressComponent.masteryRow(t.name, t.percentage, t.icon)).join('')}
        </div>
      </div>

      <!-- Weekly activity -->
      <div class="card weekly-card">
        <h3 class="card-title">📅 Weekly Activity</h3>
        ${ProgressComponent.weeklyActivity(weekly)}
        <p class="weekly-note">Minutes of learning per day</p>
      </div>

      <!-- Recent activity -->
      <div class="card recent-card">
        <h3 class="card-title">🕐 Recent Activity</h3>
        ${recent.length === 0
          ? '<p class="empty-state-text">No activity yet. Start a module or quiz to begin!</p>'
          : `<div role="list">${recent.map(Cards.activityCard).join('')}</div>`
        }
      </div>

      <!-- Achievements -->
      <div class="card achievements-full-card">
        <h3 class="card-title">🏆 Achievements <span class="badge-count">${achievements.filter(a=>a.earned).length}/${achievements.length}</span></h3>
        <div class="achievements-grid full" role="list">
          ${achievements.map(Cards.achievementCard).join('')}
        </div>
      </div>

    `;

    // Animate numbers
    body.querySelectorAll('[data-animate-number]').forEach(el => {
      Helpers.animateNumber(el, 0, parseInt(el.dataset.animateNumber) || 0, 1000);
    });

    setTimeout(() => ProgressComponent.animateAll(body), 200);
  };

  return { render };
})();
