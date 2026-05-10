/**
 * navbar.js — Top navigation bar component
 */

const Navbar = (() => {
  let _isOpen = false;

  const _links = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/tutor', label: 'AI Tutor', icon: '🤖' },
    { path: '/modules', label: 'Modules', icon: '📚' },
    { path: '/quiz', label: 'Quizzes', icon: '🎯' },
    { path: '/progress', label: 'Progress', icon: '📈' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  const render = () => {
    const stats = State.getStats();
    const level = State.getLevel();
    const xp = State.get('progress').totalXP || 0;

    return `
    <nav class="navbar" id="navbar" role="navigation" aria-label="Main navigation">
      <div class="navbar-brand">
        <a href="#/" class="brand-link" aria-label="GenAI Tutor Home">
          <div class="brand-icon">🧠</div>
          <span class="brand-name">GenAI<span class="brand-accent">Tutor</span></span>
        </a>
      </div>

      <ul class="navbar-links" id="navLinks" role="list">
        ${_links.map(l => `
          <li>
            <a href="#${l.path}" class="nav-link" data-path="${l.path}" aria-label="${l.label}">
              <span class="nav-icon" aria-hidden="true">${l.icon}</span>
              <span class="nav-label">${l.label}</span>
            </a>
          </li>
        `).join('')}
      </ul>

      <div class="navbar-actions">
        <div class="xp-badge" title="Level ${level.level} — ${xp} XP" aria-label="Level ${level.level}, ${xp} XP">
          <span class="xp-level">Lv.${level.level}</span>
          <div class="xp-bar-mini">
            <div class="xp-fill-mini" style="width:${level.pct}%"></div>
          </div>
          <span class="xp-value">⚡${xp}</span>
        </div>
        <div class="streak-badge" title="${stats.streak} day streak" aria-label="${stats.streak} day learning streak">
          🔥 <span>${stats.streak}</span>
        </div>
        <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="mobileMenu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>

    <!-- Mobile drawer -->
    <div class="mobile-overlay" id="mobileOverlay" aria-hidden="true"></div>
    <nav class="mobile-menu" id="mobileMenu" aria-label="Mobile navigation" aria-hidden="true">
      <div class="mobile-menu-header">
        <span class="brand-name">🧠 GenAI<span class="brand-accent">Tutor</span></span>
        <button class="mobile-close" id="mobileClose" aria-label="Close menu">✕</button>
      </div>
      <div class="mobile-xp-info">
        <div class="mobile-level">Level ${level.level} — ${level.name}</div>
        <div class="xp-bar-mini wide">
          <div class="xp-fill-mini" style="width:${level.pct}%"></div>
        </div>
        <div class="mobile-xp-text">⚡ ${xp} XP · 🔥 ${stats.streak} day streak</div>
      </div>
      <ul class="mobile-nav-links" role="list">
        ${_links.map(l => `
          <li>
            <a href="#${l.path}" class="mobile-nav-link" data-path="${l.path}">
              <span aria-hidden="true">${l.icon}</span> ${l.label}
            </a>
          </li>
        `).join('')}
      </ul>
    </nav>
    `;
  };

  const mount = (container) => {
    container.innerHTML = render();
    _bindEvents(container);
    _updateActive();
  };

  const _bindEvents = (container) => {
    const hamburger = container.querySelector('#hamburger');
    const mobileClose = container.querySelector('#mobileClose');
    const overlay = container.querySelector('#mobileOverlay');

    hamburger?.addEventListener('click', () => toggleMenu(true));
    mobileClose?.addEventListener('click', () => toggleMenu(false));
    overlay?.addEventListener('click', () => toggleMenu(false));

    // Close on nav click
    container.querySelectorAll('.mobile-nav-link').forEach(a => {
      a.addEventListener('click', () => toggleMenu(false));
    });

    // Keyboard: ESC to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && _isOpen) toggleMenu(false);
    });
  };

  const toggleMenu = (open) => {
    _isOpen = open;
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileOverlay');
    const hamburger = document.getElementById('hamburger');
    if (!menu) return;
    menu.classList.toggle('open', open);
    overlay.classList.toggle('active', open);
    hamburger?.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) menu.querySelector('.mobile-close')?.focus();
  };

  const _updateActive = () => {
    const path = Router?.currentPath?.() || '/';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(a => {
      const linkPath = a.dataset.path;
      const isActive = linkPath === '/' ? path === '/' : path.startsWith(linkPath);
      a.classList.toggle('active', isActive);
      a.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
  };

  const update = () => {
    const el = document.getElementById('navbar');
    if (el) {
      el.closest('[id="navbar"]')?.parentElement && mount(el.parentElement);
    }
    _updateActive();
  };

  // Listen for route changes
  if (typeof State !== 'undefined') {
    State.subscribe('route', _updateActive);
  }

  return { render, mount, update, toggleMenu };
})();
