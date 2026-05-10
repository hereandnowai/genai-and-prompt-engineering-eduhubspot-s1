/**
 * constants.js — App-wide constants
 */

const CONSTANTS = {
  DIFFICULTY: {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced'
  },

  DIFFICULTY_COLORS: {
    beginner: '#10b981',
    intermediate: '#f59e0b',
    advanced: '#ef4444'
  },

  DIFFICULTY_LABELS: {
    beginner: '🌱 Beginner',
    intermediate: '🔥 Intermediate',
    advanced: '🚀 Advanced'
  },

  XP_THRESHOLDS: [0, 500, 1200, 2200, 3500, 5000, 7000, 9500, 12500, 16000, 20000],

  LEVEL_NAMES: [
    'Novice', 'Explorer', 'Learner', 'Student', 'Scholar',
    'Practitioner', 'Expert', 'Master', 'Sage', 'Legend', 'Grand Master'
  ],

  GRADE_THRESHOLDS: {
    A: 90,
    B: 75,
    C: 60,
    D: 45
  },

  TOPICS: [
    'ai-basics', 'machine-learning', 'deep-learning', 'neural-networks',
    'generative-ai', 'llms', 'prompt-engineering', 'ai-ethics', 'nlp', 'computer-vision'
  ],

  TOPIC_ICONS: {
    'ai-basics': '🤖',
    'machine-learning': '📊',
    'deep-learning': '🧠',
    'neural-networks': '🕸️',
    'generative-ai': '✨',
    'llms': '💬',
    'prompt-engineering': '⚡',
    'ai-ethics': '⚖️',
    'nlp': '🗣️',
    'computer-vision': '👁️'
  },

  ANIMATION_DURATION: {
    SHORT: 200,
    MEDIUM: 400,
    LONG: 600
  },

  TOAST_DURATION: 3500,

  TYPING_DELAY: { MIN: 800, MAX: 2200 },

  CHAT_MAX_HISTORY: 50,

  PAGE_TITLES: {
    '/': 'GenAI Tutor — Learn AI From Scratch',
    '/dashboard': 'Dashboard — GenAI Tutor',
    '/tutor': 'AI Tutor Chat — GenAI Tutor',
    '/modules': 'Learning Modules — GenAI Tutor',
    '/quiz': 'Quizzes — GenAI Tutor',
    '/progress': 'My Progress — GenAI Tutor',
    '/settings': 'Settings — GenAI Tutor'
  },

  EMOJIS: {
    CORRECT: '✅',
    INCORRECT: '❌',
    STAR: '⭐',
    FIRE: '🔥',
    TROPHY: '🏆',
    BRAIN: '🧠',
    ROCKET: '🚀',
    SPARKLE: '✨',
    LOCK: '🔒',
    CHECK: '✓',
    XP: '⚡'
  }
};
