/**
 * GenAI Tutor - Core Application Logic
 * Responsible for initializing the app, loading resources, and mounting shared components.
 */

const App = {
    init() {
        console.log(`${APP_CONFIG.NAME} version ${APP_CONFIG.VERSION} initializing...`);
        
        // Load data from Storage
        StorageService.init();
        
        // Mount Persistent UI Components
        this.mountHeader();
        this.mountFooter();
        
        // Start routing
        router.init();

        // Global Event Listeners
        this.initEventListeners();
    },

    mountHeader() {
        const header = document.getElementById('navbar-container');
        header.appendChild(Navbar.render());
    },

    mountFooter() {
        const footer = document.getElementById('footer-container');
        footer.innerHTML = `
            <div class="container text-center">
                <p>&copy; 2026 ${APP_CONFIG.NAME}. Built with ❤️ for AI Beginners.</p>
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 15px; font-size: 0.9rem; color: var(--text-muted);">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                    <a href="#">Github</a>
                </div>
            </div>
        `;
    },

    initEventListeners() {
        window.addEventListener('stateChanged', (e) => {
            console.log('State updated:', e.detail);
            this.updateHeaderUI();
        });
    },

    updateHeaderUI() {
        const xpEl = document.getElementById('user-xp');
        if (xpEl) {
            xpEl.innerText = `XP: ${state.progress.xp}`;
        }
    }
};

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
