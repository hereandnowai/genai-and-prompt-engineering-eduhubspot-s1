// ================================================
// GENAI TUTOR — UTILITIES / HELPERS
// ================================================

const Helpers = {
  // ── String utilities ──
  sanitize(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  truncate(str, len = 100) {
    if (!str) return '';
    return str.length <= len ? str : str.slice(0, len).trim() + '…';
  },

  capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
  },

  slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  },

  /** Convert markdown-like text to HTML safely */
  parseMarkdown(text) {
    if (!text) return '';
    let html = Helpers.sanitize(text);
    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Code: `text`
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    // Newlines to <br>
    html = html.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    // Bullet lists: lines starting with -
    html = html.replace(/^- (.+)/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    // Headers
    html = html.replace(/^### (.+)/gm, '<h4>$1</h4>');
    html = html.replace(/^## (.+)/gm,  '<h3>$1</h3>');
    html = html.replace(/^# (.+)/gm,   '<h2>$1</h2>');
    // Numbers (1. text)
    html = html.replace(/^\d+\. (.+)/gm, '<li>$1</li>');
    // Wrap in paragraph if not already
    if (!html.startsWith('<')) html = '<p>' + html + '</p>';
    return html;
  },

  // ── Time utilities ──
  formatTime(date) {
    return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);
  },

  formatDate(date) {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  },

  formatRelative(date) {
    const now  = Date.now();
    const diff = now - new Date(date).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 1)   return 'Just now';
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7)   return `${days}d ago`;
    return Helpers.formatDate(new Date(date));
  },

  sleep(ms) { return new Promise(r => setTimeout(r, ms)); },

  // ── DOM utilities ──
  el(selector) { return document.querySelector(selector); },
  els(selector) { return [...document.querySelectorAll(selector)]; },

  show(el, display = 'flex') {
    if (typeof el === 'string') el = Helpers.el(el);
    if (el) el.style.display = display;
  },
  hide(el) {
    if (typeof el === 'string') el = Helpers.el(el);
    if (el) el.style.display = 'none';
  },
  toggle(el) {
    if (typeof el === 'string') el = Helpers.el(el);
    if (!el) return;
    el.style.display = el.style.display === 'none' ? '' : 'none';
  },

  /** Animate a number counting up */
  animateNumber(el, from, to, duration = 1000, suffix = '') {
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(from + (to - from) * ease) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  },

  /** Stagger animate child elements */
  staggerIn(parent, childSelector, delay = 60) {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(16px)';
      setTimeout(() => {
        child.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, i * delay);
    });
  },

  // ── Number utilities ──
  clamp(val, min, max) { return Math.min(Math.max(val, min), max); },
  randomInt(min, max)  { return Math.floor(Math.random() * (max - min + 1)) + min; },
  randomFrom(arr)      { return arr[Math.floor(Math.random() * arr.length)]; },

  // ── Array utilities ──
  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },
  unique(arr, key) {
    if (!key) return [...new Set(arr)];
    const seen = new Set();
    return arr.filter(item => {
      const k = item[key];
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  },

  // ── Color utilities ──
  hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `${r}, ${g}, ${b}`;
  },

  // ── Event utilities ──
  debounce(fn, delay) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },
  throttle(fn, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) { fn(...args); inThrottle = true; setTimeout(() => inThrottle = false, limit); }
    };
  },

  /** Show XP gain popup at position */
  showXPGain(amount, x, y) {
    const el = document.createElement('div');
    el.className = 'xp-gain-popup';
    el.textContent = `+${amount} XP`;
    el.style.cssText = `left:${x}px; top:${y}px;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  },

  /** Create confetti celebration */
  celebrate() {
    const colors = ['#00d4ff', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'];
    for (let i = 0; i < 60; i++) {
      const el = document.createElement('div');
      el.className = 'confetti-piece';
      el.style.cssText = `
        left: ${Helpers.randomInt(0, 100)}vw;
        top: -10px;
        background: ${colors[i % colors.length]};
        --dur: ${Helpers.randomInt(2, 4)}s;
        --delay: ${Helpers.randomInt(0, 1500)}ms;
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        width: ${Helpers.randomInt(6, 12)}px;
        height: ${Helpers.randomInt(6, 12)}px;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    }
  },

  /** Show toast notification */
  toast(message, type = 'info', duration = 3000) {
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
    const container = Helpers.el('.toast-container') || (() => {
      const c = document.createElement('div');
      c.className = 'toast-container';
      document.body.appendChild(c);
      return c;
    })();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type]}</span><span>${Helpers.sanitize(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  /** Create star field background */
  createStars(container, count = 80) {
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      const size = Math.random() * 2 + 0.5;
      star.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        width: ${size}px;
        height: ${size}px;
        --opacity: ${Math.random() * 0.5 + 0.1};
        --dur: ${Math.random() * 4 + 2}s;
        --delay: ${Math.random() * 4}s;
      `;
      container.appendChild(star);
    }
  },

  /** Generate unique ID */
  uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); },

  /** Copy to clipboard */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  },

  /** Check if mobile */
  isMobile() { return window.innerWidth < 640; },
  isTablet()  { return window.innerWidth >= 640 && window.innerWidth < 1024; },
};
