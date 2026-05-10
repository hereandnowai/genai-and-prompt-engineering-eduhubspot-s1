// ================================================
// GENAI TUTOR — APP CONFIGURATION
// ================================================

const CONFIG = {
  APP_NAME: 'GenAI Tutor',
  APP_VERSION: '1.0.0',
  APP_TAGLINE: 'Learn AI from Zero to Hero',

  // Storage keys
  STORAGE_KEYS: {
    USER:          'genai_tutor_user',
    PROGRESS:      'genai_tutor_progress',
    QUIZ_SCORES:   'genai_tutor_quiz_scores',
    CONVERSATIONS: 'genai_tutor_conversations',
    SETTINGS:      'genai_tutor_settings',
    ACHIEVEMENTS:  'genai_tutor_achievements',
    STREAK:        'genai_tutor_streak',
  },

  // Routes (hash-based)
  ROUTES: {
    LANDING:   '#/',
    DASHBOARD: '#/dashboard',
    TUTOR:     '#/tutor',
    MODULES:   '#/modules',
    QUIZ:      '#/quiz',
    PROGRESS:  '#/progress',
    SETTINGS:  '#/settings',
  },

  // AI service config
  AI: {
    TYPING_SPEED_MIN: 800,
    TYPING_SPEED_MAX: 2000,
    USE_ANTHROPIC_API: false, // Set true + add API key for real AI
    API_KEY: '',              // Your Anthropic API key here
    MODEL: 'claude-sonnet-4-20250514',
    MAX_TOKENS: 600,
  },

  // Gamification
  GAMIFICATION: {
    XP_PER_MODULE:    100,
    XP_PER_QUIZ:      50,
    XP_PER_CHAT:      10,
    STREAK_BONUS:     25,
    STREAK_THRESHOLD: 1, // days
  },

  // Default settings
  DEFAULT_SETTINGS: {
    theme:       'dark',
    fontSize:    'medium',
    animations:  true,
    sounds:      false,
    autoSave:    true,
  },

  // Data paths
  DATA: {
    MODULES: './assets/data/modules.json',
    QUIZZES: './assets/data/quizzes.json',
    PROMPTS: './assets/data/prompts.json',
  },
};
