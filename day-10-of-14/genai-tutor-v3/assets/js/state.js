const INITIAL_STATE = {
  user: {
    name: 'Learner',
    xp: 0,
    streak: 0,
    level: 1
  },
  activeModule: null,
  completedModules: [], // Array of module IDs
  quizScores: {}, // { quizId: score }
  activeConversation: [],
  settings: {
    darkMode: false,
    fontSize: 'medium',
    highContrast: false
  },
  lastVisited: Date.now()
};

let state = { ...INITIAL_STATE };

const stateManager = {
  getState: () => ({ ...state }),
  
  setState: (newState) => {
    state = { ...state, ...newState };
    // Trigger local storage save via service or here
    window.dispatchEvent(new CustomEvent('statechange', { detail: state }));
  },

  resetState: () => {
    state = { ...INITIAL_STATE };
    window.dispatchEvent(new CustomEvent('statechange', { detail: state }));
  }
};

export default stateManager;
