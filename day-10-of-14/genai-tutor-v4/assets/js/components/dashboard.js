/**
 * dashboard.js — Dashboard UI component
 */

const DashboardComponent = (() => {

  const welcomeBanner = (name, streak, level) => `
    <div class="welcome-banner" role="banner">
      <div class="welcome-text">
        <h2>Welcome back, ${Helpers.sanitize(name)}! 👋</h2>
        <p>You're on a <strong>${streak} day streak</strong> — keep it up! You're a Level ${level.level} ${level.name}.</p>
      </div>
      <div class="welcome-actions">
        <a href="#/tutor" class="btn btn-primary">🤖 Chat with Tutor</a>
        <a href="#/modules" class="btn btn-secondary">📚 Continue Learning</a>
      </div>
    </div>`;

  const statsRow = (stats, level) => `
    <div class="stats-grid" role="list" aria-label="Learning statistics">
      ${Cards.statCard('⚡', 'Total XP', stats.totalXP, `Level ${level.level} ${level.name}`, 'var(--accent-cyan)')}
      ${Cards.statCard('📚', 'Modules Done', `${stats.completedModules}/10`, 'learning modules', 'var(--accent-purple)')}
      ${Cards.statCard('🎯', 'Quiz Average', `${stats.avgScore}%`, 'average score', '#10b981')}
      ${Cards.statCard('🔥', 'Day Streak', stats.streak, 'days in a row', '#f59e0b')}
    </div>`;

  const xpSection = (xp, level) => `
    <div class="card xp-card" role="region" aria-label="XP progress">
      <h3 class="card-title">⚡ Your XP Progress</h3>
      ${ProgressComponent.xpLevelBar(xp, level.level, level)}
    </div>`;

  const recentActivity = (activities) => `
    <div class="card recent-activity-card" role="region" aria-label="Recent activity">
      <h3 class="card-title">🕐 Recent Activity</h3>
      ${activities.length === 0
        ? '<p class="empty-state-text">No activity yet. Start learning to see your history!</p>'
        : `<div role="list">${activities.slice(0, 6).map(Cards.activityCard).join('')}</div>`
      }
    </div>`;

  const recommendations = (modules) => `
    <div class="card recommendations-card" role="region" aria-label="Recommended modules">
      <h3 class="card-title">🚀 Recommended for You</h3>
      ${modules.length === 0
        ? '<p class="empty-state-text">🎉 You\'ve completed all modules! Amazing work.</p>'
        : `<div role="list">${modules.slice(0, 3).map(Cards.recommendCard).join('')}</div>`
      }
      <a href="#/modules" class="btn btn-ghost btn-sm view-all-btn">View all modules →</a>
    </div>`;

  const weeklyChart = (weeklyData) => `
    <div class="card weekly-chart-card" role="region" aria-label="Weekly learning chart">
      <h3 class="card-title">📅 This Week</h3>
      ${ProgressComponent.weeklyActivity(weeklyData)}
      <p class="weekly-note">Minutes studied per day</p>
    </div>`;

  const achievementsPreview = (achievements) => {
    const earned = achievements.filter(a => a.earned);
    return `
    <div class="card achievements-preview" role="region" aria-label="Achievements">
      <h3 class="card-title">🏆 Achievements <span class="badge-count">${earned.length}/${achievements.length}</span></h3>
      <div class="achievements-grid">
        ${achievements.slice(0, 8).map(Cards.achievementCard).join('')}
      </div>
      <a href="#/progress" class="btn btn-ghost btn-sm">View all achievements →</a>
    </div>`;
  };

  return {
    welcomeBanner, statsRow, xpSection, recentActivity,
    recommendations, weeklyChart, achievementsPreview
  };
})();
