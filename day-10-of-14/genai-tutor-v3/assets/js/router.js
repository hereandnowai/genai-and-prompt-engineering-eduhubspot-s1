/**
 * Simple hash-based router
 */
const router = {
  routes: {},
  
  init(routes) {
    this.routes = routes;
    window.addEventListener('hashchange', () => this.handleRoute());
    // Initial load
    this.handleRoute();
  },

  handleRoute() {
    const hash = window.location.hash.slice(1) || 'home';
    const route = this.routes[hash] || this.routes['404'];
    
    // Update UI active state
    document.querySelectorAll('[data-route]').forEach(el => el.classList.remove('active'));
    
    const targetEl = document.getElementById(`page-${hash}`) || document.getElementById('page-landing');
    if (targetEl) targetEl.classList.add('active');

    // Run route component logic
    if (route) {
      console.log(`Navigating to ${hash}`);
      route();
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
  },

  navigate(hash) {
    window.location.hash = hash;
  }
};

export default router;
