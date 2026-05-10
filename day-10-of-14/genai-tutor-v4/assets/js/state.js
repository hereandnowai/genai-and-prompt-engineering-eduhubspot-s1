// ================================================
// GENAI TUTOR — STATE MANAGEMENT
// ================================================

const State = (() => {
  // ── Private state ──
  const _state = {
    currentUser: {
      name:       'Learner',
      xp:         0,
      level:      1,
      streak:     0,
      lastActive: null,
      joinDate:   new Date().toISOString(),
    },
    activeModule:      null,
    activeQuiz:        null,
    completedModules:  [],
    quizScores:        [],
    conversations:     [],
    settings:          { ...CONFIG.DEFAULT_SETTINGS },
    progress:          {},
    achievements:      [],
    ui: {
      currentRoute: CONFIG.ROUTES.LANDING,
      sidebarOpen:  false,
      mobileNavOpen: false,
    },
  };

  // ── Subscribers ──
  const _subscribers = {};

  const subscribe = (event, callback) => {
    if (!_subscribers[event]) _subscribers[event] = [];
    _subscribers[event].push(callback);
    return () => {
      _subscribers[event] = _subscribers[event].filter(cb => cb !== callback);
    };
  };

  const _emit = (event, data) => {
    if (_subscribers[event]) {
      _subscribers[event].forEach(cb => cb(data));
    }
  };

  // ── State getters ──
  const get = (path) => {
    if (!path) return { ..._state };
    return path.split('.').reduce((obj, key) => obj?.[key], _state);
  };

  // ── State setters ──
  const set = (path, value) => {
    const keys = path.split('.');
    let obj = _state;
    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]];
    }
    const lastKey = keys[keys.length - 1];
    const oldValue = obj[lastKey];
    obj[lastKey] = value;
    _emit('change', { path, value, oldValue });
    _emit(`change:${path}`, { value, oldValue });
    return value;
  };

  const merge = (path, updates) => {
    const current = get(path) || {};
    return set(path, { ...current, ...updates });
  };

  // ── Module progress ──
  const markModuleComplete = (moduleId) => {
    if (!_state.completedModules.includes(moduleId)) {
      _state.completedModules.push(moduleId);
      _state.progress[moduleId] = {
        completed: true,
        completedAt: new Date().toISOString(),
      };
      addXP(CONFIG.GAMIFICATION.XP_PER_MODULE);
      _emit('moduleCompleted', { moduleId });
      checkAchievements();
      StorageService.save();
    }
  };

  const isModuleComplete = (moduleId) => _state.completedModules.includes(moduleId);

  // ── Quiz scores ──
  const saveQuizScore = (quizId, score, total, xp) => {
    const existing = _state.quizScores.findIndex(q => q.quizId === quizId);
    const entry = {
      quizId,
      score,
      total,
      percentage: Math.round((score / total) * 100),
      xp,
      completedAt: new Date().toISOString(),
    };
    if (existing >= 0) {
      if (score >= _state.quizScores[existing].score) {
        _state.quizScores[existing] = entry;
        addXP(xp);
      }
    } else {
      _state.quizScores.push(entry);
      addXP(xp);
    }
    _emit('quizCompleted', entry);
    checkAchievements();
    StorageService.save();
    return entry;
  };

  const getQuizScore = (quizId) => _state.quizScores.find(q => q.quizId === quizId) || null;

  // ── XP & Leveling ──
  const addXP = (amount) => {
    _state.currentUser.xp += amount;
    const level = Math.floor(_state.currentUser.xp / 500) + 1;
    if (level !== _state.currentUser.level) {
      _state.currentUser.level = level;
      _emit('levelUp', { level });
    }
    _emit('xpChange', { xp: _state.currentUser.xp, amount });
  };

  const getLevel = () => {
    const xp = _state.currentUser.xp;
    return {
      level: Math.floor(xp / 500) + 1,
      xpInLevel: xp % 500,
      xpToNext: 500,
      progress: ((xp % 500) / 500) * 100,
    };
  };

  // ── Streak management ──
  const updateStreak = () => {
    const today     = new Date().toDateString();
    const lastActive = _state.currentUser.lastActive;
    const yesterday  = new Date(Date.now() - 86400000).toDateString();

    if (lastActive === today) return;
    if (lastActive === yesterday) {
      _state.currentUser.streak++;
      addXP(CONFIG.GAMIFICATION.STREAK_BONUS);
    } else if (lastActive !== today) {
      _state.currentUser.streak = 1;
    }
    _state.currentUser.lastActive = today;
    StorageService.save();
  };

  // ── Conversations ──
  const saveConversation = (messages) => {
    const id = Helpers.uid();
    const conv = {
      id,
      messages,
      createdAt: new Date().toISOString(),
      title: messages[0]?.content?.slice(0, 40) + '…' || 'New conversation',
    };
    _state.conversations.unshift(conv);
    if (_state.conversations.length > 20) _state.conversations.pop();
    StorageService.save();
    return conv;
  };

  const getConversations = () => [..._state.conversations];

  // ── Achievements system ──
  const ACHIEVEMENT_DEFS = [
    { id: 'first_step',     name: 'First Step',       desc: 'Complete your first module',     icon: '🚀', condition: s => s.completedModules.length >= 1 },
    { id: 'quiz_ace',       name: 'Quiz Ace',          desc: 'Score 100% on any quiz',         icon: '🎯', condition: s => s.quizScores.some(q => q.percentage === 100) },
    { id: 'curious_mind',   name: 'Curious Mind',      desc: 'Complete 3 modules',             icon: '🔍', condition: s => s.completedModules.length >= 3 },
    { id: 'ai_explorer',    name: 'AI Explorer',       desc: 'Complete 5 modules',             icon: '🌍', condition: s => s.completedModules.length >= 5 },
    { id: 'master_learner', name: 'Master Learner',    desc: 'Complete all 10 modules',        icon: '🏆', condition: s => s.completedModules.length >= 10 },
    { id: 'quiz_enthusiast',name: 'Quiz Enthusiast',   desc: 'Complete 5 quizzes',             icon: '📝', condition: s => s.quizScores.length >= 5 },
    { id: 'xp_100',         name: 'XP Collector',      desc: 'Earn 100 XP',                    icon: '⭐', condition: s => s.currentUser.xp >= 100 },
    { id: 'xp_1000',        name: 'XP Champion',       desc: 'Earn 1000 XP',                   icon: '💫', condition: s => s.currentUser.xp >= 1000 },
    { id: 'streak_3',       name: 'On a Roll',         desc: '3-day learning streak',          icon: '🔥', condition: s => s.currentUser.streak >= 3 },
    { id: 'streak_7',       name: 'Week Warrior',      desc: '7-day learning streak',          icon: '⚡', condition: s => s.currentUser.streak >= 7 },
    { id: 'chatter',        name: 'Chatterbox',        desc: 'Have 5 conversations with tutor',icon: '💬', condition: s => s.conversations.length >= 5 },
    { id: 'settings_explorer', name: 'Customizer',     desc: 'Visit settings page',            icon: '⚙️', condition: s => s.achievements.includes('settings_explorer') },
  ];

  const checkAchievements = () => {
    ACHIEVEMENT_DEFS.forEach(def => {
      if (!_state.achievements.includes(def.id) && def.condition(_state)) {
        _state.achievements.push(def.id);
        _emit('achievementUnlocked', def);
        Helpers.toast(`🏆 Achievement unlocked: ${def.name}!`, 'success', 4000);
      }
    });
  };

  const getAllAchievements = () => ACHIEVEMENT_DEFS.map(def => ({
    ...def,
    unlocked: _state.achievements.includes(def.id),
  }));

  // ── Getters / Stats ──
  const getStats = () => ({
    totalXP:          _state.currentUser.xp,
    level:            getLevel(),
    streak:           _state.currentUser.streak,
    modulesCompleted: _state.completedModules.length,
    quizzesTaken:     _state.quizScores.length,
    avgQuizScore:     _state.quizScores.length
      ? Math.round(_state.quizScores.reduce((a, q) => a + q.percentage, 0) / _state.quizScores.length)
      : 0,
    achievements:     _state.achievements.length,
    conversationCount: _state.conversations.length,
  });

  return {
    get, set, merge,
    subscribe,
    markModuleComplete, isModuleComplete,
    saveQuizScore, getQuizScore,
    addXP, getLevel,
    updateStreak,
    saveConversation, getConversations,
    checkAchievements, getAllAchievements,
    getStats,
    // Expose state for serialization
    _state,
  };
})();


// ================================================
// GENAI TUTOR — STORAGE SERVICE
// ================================================

const StorageService = (() => {
  const prefix = 'genai_tutor_';

  const save = () => {
    try {
      const data = {
        user:          State._state.currentUser,
        completedModules: State._state.completedModules,
        quizScores:    State._state.quizScores,
        conversations: State._state.conversations,
        settings:      State._state.settings,
        achievements:  State._state.achievements,
        progress:      State._state.progress,
      };
      localStorage.setItem(prefix + 'data', JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      return false;
    }
  };

  const load = () => {
    try {
      const raw = localStorage.getItem(prefix + 'data');
      if (!raw) return false;
      const data = JSON.parse(raw);

      // Restore state
      if (data.user)          State.set('currentUser', { ...State.get('currentUser'), ...data.user });
      if (data.completedModules) State.set('completedModules', data.completedModules);
      if (data.quizScores)    State.set('quizScores', data.quizScores);
      if (data.conversations) State.set('conversations', data.conversations);
      if (data.settings)      State.set('settings', { ...CONFIG.DEFAULT_SETTINGS, ...data.settings });
      if (data.achievements)  State.set('achievements', data.achievements);
      if (data.progress)      State.set('progress', data.progress);
      return true;
    } catch (e) {
      console.error('Load failed:', e);
      return false;
    }
  };

  const clear = () => {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(prefix)) localStorage.removeItem(k);
      });
      return true;
    } catch { return false; }
  };

  const exportData = () => {
    const raw = localStorage.getItem(prefix + 'data');
    if (!raw) return null;
    const blob = new Blob([raw], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `genai-tutor-progress-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return true;
  };

  const importData = (jsonStr) => {
    try {
      JSON.parse(jsonStr); // validate
      localStorage.setItem(prefix + 'data', jsonStr);
      load();
      return true;
    } catch { return false; }
  };

  return { save, load, clear, exportData, importData };
})();
