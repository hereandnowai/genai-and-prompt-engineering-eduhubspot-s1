import CONFIG from '../config.js';

const storageService = {
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage Save Error:', e);
      return false;
    }
  },

  load: (key) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage Load Error:', e);
      return null;
    }
  },

  remove: (key) => {
    localStorage.removeItem(key);
  },

  clearAll: () => {
    Object.values(CONFIG.STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  }
};

export default storageService;
