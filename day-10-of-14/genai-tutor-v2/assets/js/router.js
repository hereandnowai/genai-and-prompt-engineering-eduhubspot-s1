const router = {
    routes: {
        '#landing': LandingPage,
        '#dashboard': DashboardPage,
        '#tutor': TutorPage,
        '#modules': ModulesPage,
        '#quiz': QuizPage,
        '#progress': ProgressPage,
        '#settings': SettingsPage
    },

    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        // Default route
        if (!window.location.hash) {
            window.location.hash = '#landing';
        } else {
            this.handleRoute();
        }
    },

    handleRoute() {
        const hash = window.location.hash || '#landing';
        const page = this.routes[hash] || LandingPage;
        
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = '';
        mainContent.appendChild(page.render());
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Update active nav link
        Navbar.updateActiveLink(hash);
    }
};
