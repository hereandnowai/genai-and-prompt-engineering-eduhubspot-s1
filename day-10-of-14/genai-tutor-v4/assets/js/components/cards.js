/**
 * cards.js — Reusable card components
 */

const Cards = (() => {

  // Module card for the modules listing page
  const moduleCard = (mod, isCompleted = false) => {
    const diff = CONSTANTS.DIFFICULTY_LABELS[mod.difficulty] || mod.difficulty;
    return `
    <article class="card module-card ${isCompleted ? 'completed' : ''}" 
             data-module-id="${mod.id}"
             role="article"
             tabindex="0"
             aria-label="${mod.title} module">
      <div class="module-card-header" style="background: ${mod.color}22; border-bottom: 2px solid ${mod.color}44">
        <span class="module-icon" aria-hidden="true">${mod.icon}</span>
        ${isCompleted ? '<span class="completed-badge" aria-label="Completed">✓ Done</span>' : ''}
      </div>
      <div class="module-card-body">
        <h3 class="module-card-title">${Helpers.sanitize(mod.title)}</h3>
        <p class="module-card-desc">${Helpers.sanitize(mod.description)}</p>
        <div class="module-card-meta">
          <span class="difficulty-badge" style="color:${CONSTANTS.DIFFICULTY_COLORS[mod.difficulty]}">${diff}</span>
          <span class="time-badge">⏱ ${mod.estimatedTime}</span>
          <span class="xp-badge-small">⚡ ${mod.xp} XP</span>
        </div>
      </div>
      <div class="module-card-footer">
        <button class="btn btn-primary btn-sm start-module-btn" data-module-id="${mod.id}">
          ${isCompleted ? '🔁 Review' : '▶ Start'}
        </button>
      </div>
    </article>`;
  };

  // Stat card for dashboard
  const statCard = (icon, label, value, subtitle = '', color = 'var(--accent-cyan)') => `
    <div class="card stat-card" role="region" aria-label="${label}: ${value}">
      <div class="stat-icon" style="color:${color}" aria-hidden="true">${icon}</div>
      <div class="stat-value" data-animate-number="${value}">${value}</div>
      <div class="stat-label">${Helpers.sanitize(label)}</div>
      ${subtitle ? `<div class="stat-subtitle">${Helpers.sanitize(subtitle)}</div>` : ''}
    </div>`;

  // Achievement badge card
  const achievementCard = (ach) => {
    const earned = ach.earned;
    return `
    <div class="card achievement-card ${earned ? 'earned' : 'locked'}" 
         title="${earned ? ach.description : '???'}"
         aria-label="${ach.name}: ${earned ? ach.description : 'Locked'}">
      <div class="ach-icon" aria-hidden="true">${earned ? ach.icon : '🔒'}</div>
      <div class="ach-name">${earned ? Helpers.sanitize(ach.name) : '???'}</div>
      ${earned ? `<div class="ach-desc">${Helpers.sanitize(ach.description)}</div>` : ''}
    </div>`;
  };

  // Key concept card
  const conceptCard = (concept) => `
    <div class="card concept-card" role="listitem">
      <div class="concept-icon" aria-hidden="true">💡</div>
      <h4 class="concept-title">${Helpers.sanitize(concept.title || concept)}</h4>
      ${concept.description ? `<p class="concept-desc">${Helpers.sanitize(concept.description)}</p>` : ''}
    </div>`;

  // Recent activity card
  const activityCard = (item) => `
    <div class="card activity-card" role="listitem">
      <span class="activity-icon" aria-hidden="true">${item.icon || '📖'}</span>
      <div class="activity-info">
        <span class="activity-title">${Helpers.sanitize(item.title)}</span>
        <span class="activity-time">${Helpers.formatRelative(item.date)}</span>
      </div>
      <span class="activity-xp">+${item.xp || 0} XP</span>
    </div>`;

  // Recommended module card (compact)
  const recommendCard = (mod) => `
    <a href="#/modules/${mod.id}" class="card recommend-card" aria-label="Start ${mod.title}">
      <span class="recommend-icon" aria-hidden="true">${mod.icon}</span>
      <div class="recommend-info">
        <span class="recommend-title">${Helpers.sanitize(mod.title)}</span>
        <span class="recommend-meta">⏱ ${mod.estimatedTime} · ⚡ ${mod.xp} XP</span>
      </div>
      <span class="recommend-arrow" aria-hidden="true">→</span>
    </a>`;

  // Quiz result card
  const quizResultCard = (result) => {
    const emoji = result.percentage >= 80 ? '🏆' : result.percentage >= 60 ? '👍' : '📚';
    return `
    <div class="card quiz-result-card" role="region" aria-label="Quiz result">
      <div class="result-emoji" aria-hidden="true">${emoji}</div>
      <h3 class="result-score">${result.percentage}%</h3>
      <div class="result-grade grade-${result.grade.toLowerCase()}">${result.grade}</div>
      <p class="result-detail">${result.correct} / ${result.total} correct</p>
      <p class="result-xp">+${result.xpEarned} XP earned!</p>
      <div class="result-actions">
        <button class="btn btn-primary" id="retryQuizBtn">🔁 Try Again</button>
        <button class="btn btn-secondary" id="quizBackBtn">← Back to Quizzes</button>
      </div>
    </div>`;
  };

  // Skeleton loading card
  const skeletonCard = (lines = 3) => `
    <div class="card skeleton-card" aria-hidden="true" aria-busy="true">
      <div class="skeleton skeleton-title"></div>
      ${Array(lines).fill('<div class="skeleton skeleton-line"></div>').join('')}
      <div class="skeleton skeleton-btn"></div>
    </div>`;

  const skeletonGrid = (count = 6, lines = 3) =>
    Array(count).fill('').map(() => skeletonCard(lines)).join('');

  return {
    moduleCard, statCard, achievementCard, conceptCard,
    activityCard, recommendCard, quizResultCard,
    skeletonCard, skeletonGrid
  };
})();
