/**
 * router.js — Hash-based SPA router
 */

const Router = (() => {
  const _routes = {};
  let _currentPath = '/';
  let _container = null;
  let _navContainer = null;
  let _beforeEach = null;

  const define = (path, handler) => { _routes[path] = handler; };

  const navigate = (path) => {
    window.location.hash = '#' + path;
  };

  const currentPath = () => _currentPath;

  const _parsePath = (hash) => {
    const raw = (hash || '#/').replace(/^#/, '') || '/';
    const [path, ...rest] = raw.split('?');
    const segments = path.split('/').filter(Boolean);
    const params = {};
    if (rest.length) {
      const sp = new URLSearchParams(rest.join('?'));
      sp.forEach((v, k) => { params[k] = v; });
    }
    return { path: '/' + segments.slice(0, 1).join('/'), segments, params };
  };

  const _resolve = (parsed) => {
    const { path, segments } = parsed;

    // Exact match
    if (_routes[path]) return { handler: _routes[path], params: parsed.params };

    // Parametric match e.g. /modules/:moduleId
    for (const routePath of Object.keys(_routes)) {
      const routeSegs = routePath.split('/').filter(Boolean);
      const pathSegs = segments;
      if (routeSegs.length !== pathSegs.length) continue;
      const params = { ...parsed.params };
      let match = true;
      for (let i = 0; i < routeSegs.length; i++) {
        if (routeSegs[i].startsWith(':')) {
          params[routeSegs[i].slice(1)] = pathSegs[i];
        } else if (routeSegs[i] !== pathSegs[i]) {
          match = false; break;
        }
      }
      if (match) return { handler: _routes[routePath], params };
    }

    // Fallback to / 
    return { handler: _routes['/'] || null, params: parsed.params };
  };

  const _render = async () => {
    const parsed = _parsePath(window.location.hash);
    _currentPath = parsed.path || '/';

    // Update page title
    const title = CONSTANTS.PAGE_TITLES[_currentPath] || 'GenAI Tutor';
    document.title = title;

    // Update nav active state
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(a => {
      const linkPath = a.dataset.path;
      const isActive = linkPath === '/'
        ? _currentPath === '/'
        : _currentPath.startsWith(linkPath);
      a.classList.toggle('active', isActive);
      a.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    if (!_container) return;

    // Page transition out
    _container.style.opacity = '0';
    _container.style.transform = 'translateY(8px)';

    const { handler, params } = _resolve(parsed);

    if (_beforeEach) {
      const proceed = await _beforeEach({ path: _currentPath, params });
      if (proceed === false) return;
    }

    await Helpers.sleep(100);
    _container.innerHTML = '';
    _container.style.transition = 'opacity 0.35s ease, transform 0.35s ease';

    if (handler) {
      try {
        await handler(_container, params);
      } catch (err) {
        console.error('Router render error:', err);
        _container.innerHTML = `
          <div class="error-page">
            <div class="error-code" aria-hidden="true">⚠️</div>
            <h2>Oops! Something went wrong.</h2>
            <p>${Helpers.sanitize(err.message || 'Unknown error')}</p>
            <a href="#/" class="btn btn-primary">← Go Home</a>
          </div>`;
      }
    } else {
      _container.innerHTML = `
        <div class="error-page">
          <div class="error-code" aria-hidden="true">404</div>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist.</p>
          <a href="#/" class="btn btn-primary">← Go Home</a>
        </div>`;
    }

    // Page transition in
    requestAnimationFrame(() => {
      _container.style.opacity = '1';
      _container.style.transform = 'translateY(0)';
    });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Emit route change
    State.emit('route', _currentPath);
  };

  const init = ({ container, navContainer, beforeEach } = {}) => {
    _container = container;
    _navContainer = navContainer;
    _beforeEach = beforeEach || null;

    window.addEventListener('hashchange', _render);
    _render(); // Initial render
  };

  const beforeEach = (fn) => { _beforeEach = fn; };

  return { define, navigate, init, currentPath, beforeEach };
})();
