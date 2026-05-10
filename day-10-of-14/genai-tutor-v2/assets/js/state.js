const state = {
    currentUser: null,
    activeModule: null,
    completedModules: [],
    quizScores: [],
    conversations: [],
    settings: {
        darkMode: false,
        fontSize: 'medium'
    },
    progress: {
        xp: 0,
        streak: 0,
        lastActive: null
    },
    
    // State sync method
    update(newState) {
        Object.assign(this, newState);
        StorageService.saveAll();
        // Dispatch custom event for UI updates
        window.dispatchEvent(new CustomEvent('stateChanged', { detail: this }));
    }
};
