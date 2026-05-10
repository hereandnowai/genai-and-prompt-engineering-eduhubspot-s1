const Navbar = {
    render() {
        const nav = document.createElement('nav');
        nav.className = 'nav-wrap';
        nav.innerHTML = `
            <a href="#landing" class="logo">GenAI Tutor</a>
            <ul class="nav-links">
                <li><a href="#dashboard" data-link="#dashboard">Dashboard</a></li>
                <li><a href="#modules" data-link="#modules">Modules</a></li>
                <li><a href="#tutor" data-link="#tutor">AI Tutor</a></li>
                <li><a href="#quiz" data-link="#quiz">Quizzes</a></li>
                <li><a href="#settings" data-link="#settings">Settings</a></li>
            </ul>
            <div class="nav-actions" style="display: flex; gap: 15px; align-items: center;">
                <span id="user-xp" style="font-weight: 600; color: var(--primary);">XP: ${state.progress.xp}</span>
                <button id="theme-toggle" class="btn btn-outline" style="padding: 8px; border-radius: 50%;">🌙</button>
            </div>
        `;

        this.initEvents(nav);
        return nav;
    },

    initEvents(nav) {
        const themeBtn = nav.querySelector('#theme-toggle');
        themeBtn.onclick = () => {
            state.settings.darkMode = !state.settings.darkMode;
            document.body.classList.toggle('dark-mode');
            themeBtn.innerText = state.settings.darkMode ? '☀️' : '🌙';
            StorageService.save(APP_CONFIG.STORAGE_KEYS.SETTINGS, state.settings);
        };
    },

    updateActiveLink(hash) {
        const links = document.querySelectorAll('.nav-links a');
        links.forEach(l => {
            if (l.getAttribute('href') === hash) {
                l.style.color = 'var(--primary)';
                l.style.borderBottom = '2px solid var(--primary)';
            } else {
                l.style.color = '';
                l.style.borderBottom = '';
            }
        });
    }
};
