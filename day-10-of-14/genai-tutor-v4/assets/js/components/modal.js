/**
 * modal.js — Accessible modal dialog component
 */

const Modal = (() => {
  let _activeModal = null;

  const _createEl = () => {
    const el = document.createElement('div');
    el.className = 'modal-overlay';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('tabindex', '-1');
    return el;
  };

  const open = ({ title = '', content = '', actions = [], size = 'md', onClose = null } = {}) => {
    close(); // Close any existing modal

    const overlay = _createEl();
    overlay.setAttribute('aria-label', title);

    const sizeClass = { sm: 'modal-sm', md: '', lg: 'modal-lg', xl: 'modal-xl' }[size] || '';

    overlay.innerHTML = `
      <div class="modal-box ${sizeClass}" role="document">
        <div class="modal-header">
          <h2 class="modal-title">${Helpers.sanitize(title)}</h2>
          <button class="modal-close-btn" aria-label="Close dialog">✕</button>
        </div>
        <div class="modal-body">${content}</div>
        ${actions.length ? `
          <div class="modal-footer">
            ${actions.map(a => `
              <button class="btn ${a.class || 'btn-secondary'}" data-action="${a.id || ''}">${Helpers.sanitize(a.label)}</button>
            `).join('')}
          </div>` : ''}
      </div>`;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
    _activeModal = overlay;

    // Animate in
    requestAnimationFrame(() => overlay.classList.add('active'));

    // Events
    overlay.querySelector('.modal-close-btn').addEventListener('click', () => {
      close();
      onClose?.();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) { close(); onClose?.(); }
    });

    // Action buttons
    actions.forEach(action => {
      const btn = overlay.querySelector(`[data-action="${action.id}"]`);
      btn?.addEventListener('click', () => {
        if (action.onClick) action.onClick();
        if (action.closeOnClick !== false) close();
      });
    });

    // Keyboard
    const handleKey = (e) => {
      if (e.key === 'Escape') { close(); onClose?.(); }
      if (e.key === 'Tab') _trapFocus(e, overlay);
    };
    overlay._keyHandler = handleKey;
    document.addEventListener('keydown', handleKey);

    // Focus first focusable
    setTimeout(() => {
      const focusable = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      focusable?.focus();
    }, 100);

    return overlay;
  };

  const close = () => {
    if (!_activeModal) return;
    if (_activeModal._keyHandler) {
      document.removeEventListener('keydown', _activeModal._keyHandler);
    }
    _activeModal.classList.remove('active');
    setTimeout(() => {
      _activeModal?.remove();
      _activeModal = null;
    }, 300);
    document.body.style.overflow = '';
  };

  const _trapFocus = (e, container) => {
    const focusable = [...container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.disabled);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  // Convenience: confirm dialog
  const confirm = ({ title = 'Confirm', message = '', onConfirm = null, danger = false } = {}) => {
    open({
      title,
      content: `<p class="modal-message">${Helpers.sanitize(message)}</p>`,
      actions: [
        { id: 'cancel', label: 'Cancel', class: 'btn-secondary' },
        { id: 'confirm', label: danger ? '⚠️ Confirm' : 'Confirm', class: danger ? 'btn-danger' : 'btn-primary', onClick: onConfirm, closeOnClick: true }
      ]
    });
  };

  // Convenience: info/alert dialog
  const alert = ({ title = 'Info', message = '', icon = 'ℹ️' } = {}) => {
    open({
      title,
      content: `<div class="modal-alert"><span class="modal-alert-icon" aria-hidden="true">${icon}</span><p>${Helpers.sanitize(message)}</p></div>`,
      actions: [{ id: 'ok', label: 'OK', class: 'btn-primary' }]
    });
  };

  // Module detail modal
  const moduleDetail = (mod) => {
    const sections = mod.sections?.map(s => `
      <div class="module-section">
        <h4>${Helpers.sanitize(s.title)}</h4>
        <p>${Helpers.sanitize(s.content)}</p>
      </div>`).join('') || '';

    const concepts = mod.keyConcepts?.map(c => `
      <span class="concept-chip">${Helpers.sanitize(c)}</span>`).join('') || '';

    const examples = mod.realWorldExamples?.map(e => `
      <li>🌍 ${Helpers.sanitize(e)}</li>`).join('') || '';

    open({
      title: `${mod.icon} ${mod.title}`,
      size: 'lg',
      content: `
        <div class="module-detail-modal">
          <div class="analogy-box">
            <strong>💡 Think of it this way:</strong>
            <p>${Helpers.sanitize(mod.analogy)}</p>
          </div>
          <p class="module-overview">${Helpers.sanitize(mod.overview)}</p>
          ${sections ? `<div class="module-sections">${sections}</div>` : ''}
          ${concepts ? `<div class="concepts-wrap"><h4>Key Concepts</h4><div class="concept-chips">${concepts}</div></div>` : ''}
          ${examples ? `<div class="examples-wrap"><h4>Real World Examples</h4><ul>${examples}</ul></div>` : ''}
        </div>`,
      actions: [
        { id: 'quiz', label: '🎯 Take Quiz', class: 'btn-primary', onClick: () => Router.navigate(`/quiz/${mod.id}`) },
        { id: 'tutor', label: '🤖 Ask Tutor', class: 'btn-secondary', onClick: () => Router.navigate('/tutor') }
      ]
    });
  };

  return { open, close, confirm, alert, moduleDetail };
})();
