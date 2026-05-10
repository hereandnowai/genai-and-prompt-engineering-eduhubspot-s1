/**
 * validators.js — Input validation and sanitization helpers
 */

const Validators = (() => {
  const isString = (v) => typeof v === 'string';
  const isNumber = (v) => typeof v === 'number' && !isNaN(v);
  const isArray = (v) => Array.isArray(v);
  const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);
  const isEmpty = (v) => {
    if (!v) return true;
    if (isString(v)) return v.trim().length === 0;
    if (isArray(v)) return v.length === 0;
    if (isObject(v)) return Object.keys(v).length === 0;
    return false;
  };

  // Chat message validation
  const validateChatMessage = (msg) => {
    if (!isString(msg)) return { valid: false, error: 'Message must be text.' };
    const trimmed = msg.trim();
    if (isEmpty(trimmed)) return { valid: false, error: 'Message cannot be empty.' };
    if (trimmed.length > 2000) return { valid: false, error: 'Message too long (max 2000 chars).' };
    return { valid: true, value: trimmed };
  };

  // Quiz answer validation
  const validateQuizAnswer = (answer, options) => {
    if (!isString(answer)) return { valid: false, error: 'Invalid answer.' };
    if (!isArray(options)) return { valid: false, error: 'Invalid options.' };
    if (!options.includes(answer)) return { valid: false, error: 'Answer not in options.' };
    return { valid: true, value: answer };
  };

  // Settings validation
  const validateSettings = (settings) => {
    const defaults = {
      theme: 'dark',
      fontSize: 'medium',
      reducedMotion: false,
      soundEnabled: false,
      autoSaveConversations: true,
      showHints: true,
      language: 'en'
    };
    if (!isObject(settings)) return { valid: true, value: defaults };
    const valid = {};
    const allowedThemes = ['dark', 'light'];
    const allowedFontSizes = ['small', 'medium', 'large'];
    valid.theme = allowedThemes.includes(settings.theme) ? settings.theme : defaults.theme;
    valid.fontSize = allowedFontSizes.includes(settings.fontSize) ? settings.fontSize : defaults.fontSize;
    valid.reducedMotion = typeof settings.reducedMotion === 'boolean' ? settings.reducedMotion : defaults.reducedMotion;
    valid.soundEnabled = typeof settings.soundEnabled === 'boolean' ? settings.soundEnabled : defaults.soundEnabled;
    valid.autoSaveConversations = typeof settings.autoSaveConversations === 'boolean' ? settings.autoSaveConversations : defaults.autoSaveConversations;
    valid.showHints = typeof settings.showHints === 'boolean' ? settings.showHints : defaults.showHints;
    valid.language = isString(settings.language) ? settings.language : defaults.language;
    return { valid: true, value: valid };
  };

  // Import data validation
  const validateImportData = (data) => {
    try {
      const parsed = isString(data) ? JSON.parse(data) : data;
      if (!isObject(parsed)) return { valid: false, error: 'Invalid data format.' };
      const required = ['completedModules', 'quizScores', 'settings'];
      for (const key of required) {
        if (!(key in parsed)) return { valid: false, error: `Missing field: ${key}` };
      }
      return { valid: true, value: parsed };
    } catch {
      return { valid: false, error: 'Could not parse data. Make sure it is valid JSON.' };
    }
  };

  // XSS-safe text check (extra layer on top of helpers.sanitize)
  const isSafeText = (str) => {
    if (!isString(str)) return false;
    const dangerous = /<script|javascript:|on\w+\s*=|<iframe|<object|<embed/i;
    return !dangerous.test(str);
  };

  const sanitizeUsername = (name) => {
    if (!isString(name)) return 'Learner';
    return name.replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 30) || 'Learner';
  };

  return {
    isString, isNumber, isArray, isObject, isEmpty,
    validateChatMessage, validateQuizAnswer, validateSettings,
    validateImportData, isSafeText, sanitizeUsername
  };
})();
