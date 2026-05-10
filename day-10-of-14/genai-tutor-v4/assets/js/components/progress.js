/**
 * progress.js — Progress visualization components
 */

const ProgressComponent = (() => {

  // Circular progress ring (SVG)
  const ring = (percentage, size = 80, color = 'var(--accent-cyan)', label = '') => {
    const r = (size / 2) - 8;
    const circ = 2 * Math.PI * r;
    const offset = circ * (1 - Math.min(percentage, 100) / 100);
    return `
    <div class="progress-ring-wrap" style="width:${size}px;height:${size}px" 
         role="img" aria-label="${label || percentage + '%'}">
      <svg viewBox="0 0 ${size} ${size}" class="progress-ring-svg" aria-hidden="true">
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" 
                stroke="var(--glass-border)" stroke-width="6"/>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none"
                stroke="${color}" stroke-width="6"
                stroke-linecap="round"
                stroke-dasharray="${circ}"
                stroke-dashoffset="${offset}"
                transform="rotate(-90 ${size/2} ${size/2})"
                class="ring-fill"
                data-target-offset="${offset}"
                data-circumference="${circ}"/>
      </svg>
      <div class="ring-center-text">
        <span class="ring-pct">${percentage}%</span>
        ${label ? `<span class="ring-label">${Helpers.sanitize(label)}</span>` : ''}
      </div>
    </div>`;
  };

  // Horizontal progress bar
  const bar = (percentage, color = 'var(--accent-cyan)', animated = true, label = '') => `
    <div class="progress-bar-wrap" role="progressbar" 
         aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"
         aria-label="${label || 'Progress: ' + percentage + '%'}">
      <div class="progress-bar-track">
        <div class="progress-bar-fill ${animated ? 'animated' : ''}" 
             style="width:0%;background:${color}"
             data-target-width="${percentage}%"></div>
      </div>
      ${label ? `<span class="progress-bar-label">${Helpers.sanitize(label)}</span>` : ''}
      <span class="progress-bar-pct">${percentage}%</span>
    </div>`;

  // Topic mastery row
  const masteryRow = (topic, pct, icon = '📖') => {
    const color = pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : 'var(--accent-cyan)';
    return `
    <div class="mastery-row" role="listitem">
      <span class="mastery-icon" aria-hidden="true">${icon}</span>
      <div class="mastery-info">
        <span class="mastery-topic">${Helpers.sanitize(topic)}</span>
        <div class="mastery-bar-track" aria-hidden="true">
          <div class="mastery-bar-fill" style="width:0%;background:${color}" data-target-width="${pct}%"></div>
        </div>
      </div>
      <span class="mastery-pct" style="color:${color}">${pct}%</span>
    </div>`;
  };

  // Weekly activity heatmap (7 bars)
  const weeklyActivity = (data = []) => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const max = Math.max(...data.map(d => d.minutes || 0), 1);
    return `
    <div class="weekly-activity" role="img" aria-label="Weekly learning activity">
      ${days.map((day, i) => {
        const item = data[i] || { minutes: 0, xp: 0 };
        const height = Math.round((item.minutes / max) * 100);
        return `
        <div class="activity-col" title="${day}: ${item.minutes} min">
          <div class="activity-bar-wrap">
            <div class="activity-bar" style="height:${height}%;min-height:${item.minutes > 0 ? '4px' : '0'}"
                 aria-label="${day}: ${item.minutes} minutes studied"></div>
          </div>
          <span class="activity-day">${day}</span>
        </div>`;
      }).join('')}
    </div>`;
  };

  // XP level bar
  const xpLevelBar = (xp, level, levelInfo) => `
    <div class="xp-level-bar" role="region" aria-label="XP and Level">
      <div class="xp-level-header">
        <span class="xp-level-badge">Level ${level}</span>
        <span class="xp-level-name">${levelInfo.name}</span>
        <span class="xp-total">⚡ ${xp} XP</span>
      </div>
      <div class="xp-bar-track" role="progressbar" 
           aria-valuenow="${levelInfo.pct}" aria-valuemin="0" aria-valuemax="100"
           aria-label="Level progress: ${levelInfo.pct}%">
        <div class="xp-bar-fill" style="width:${levelInfo.pct}%"></div>
      </div>
      <div class="xp-bar-footer">
        <span>${levelInfo.current} XP</span>
        <span>${levelInfo.pct}% to Level ${level + 1}</span>
        <span>${levelInfo.next} XP</span>
      </div>
    </div>`;

  // Animate all progress bars and rings in a container
  const animateAll = (container = document) => {
    // Bars
    container.querySelectorAll('.progress-bar-fill[data-target-width], .mastery-bar-fill[data-target-width]').forEach(el => {
      setTimeout(() => { el.style.width = el.dataset.targetWidth; }, 100);
    });
    // Rings
    container.querySelectorAll('.ring-fill[data-target-offset]').forEach(el => {
      setTimeout(() => { el.style.strokeDashoffset = el.dataset.targetOffset; }, 100);
    });
    // XP fill
    container.querySelectorAll('.xp-bar-fill').forEach(el => {
      const w = el.style.width;
      el.style.width = '0%';
      setTimeout(() => { el.style.width = w; }, 100);
    });
  };

  return { ring, bar, masteryRow, weeklyActivity, xpLevelBar, animateAll };
})();
