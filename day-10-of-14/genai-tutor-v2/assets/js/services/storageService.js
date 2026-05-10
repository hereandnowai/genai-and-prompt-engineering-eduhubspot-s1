const StorageService = {
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    load(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    saveAll() {
        this.save(APP_CONFIG.STORAGE_KEYS.USER_DATA, state.currentUser);
        this.save(APP_CONFIG.STORAGE_KEYS.PROGRESS, state.progress);
        this.save(APP_CONFIG.STORAGE_KEYS.SETTINGS, state.settings);
        this.save(APP_CONFIG.STORAGE_KEYS.CONVERSATIONS, state.conversations);
    },

    init() {
        const savedSettings = this.load(APP_CONFIG.STORAGE_KEYS.SETTINGS);
        if (savedSettings) state.settings = savedSettings;

        const savedProgress = this.load(APP_CONFIG.STORAGE_KEYS.PROGRESS);
        if (savedProgress) state.progress = savedProgress;

        // Apply dark mode immediately if set
        if (state.settings.darkMode) {
            document.body.classList.add('dark-mode');
        }
    }
};
