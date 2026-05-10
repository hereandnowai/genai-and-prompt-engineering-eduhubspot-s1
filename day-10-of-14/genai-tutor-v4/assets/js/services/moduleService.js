// ================================================
// GENAI TUTOR — MODULE SERVICE
// ================================================

const ModuleService = (() => {
  let _modules = null;

  const loadModules = async () => {
    if (_modules) return _modules;
    try {
      const r = await fetch(CONFIG.DATA.MODULES);
      _modules = await r.json();
    } catch (e) {
      console.error('Failed to load modules:', e);
      _modules = [];
    }
    return _modules;
  };

  const getAll = async () => {
    const modules = await loadModules();
    return modules.map(m => ({
      ...m,
      completed: State.isModuleComplete(m.id),
    }));
  };

  const getById = async (id) => {
    const modules = await loadModules();
    const module  = modules.find(m => m.id === id);
    if (!module) return null;
    return { ...module, completed: State.isModuleComplete(module.id) };
  };

  const getByDifficulty = async (difficulty) => {
    const all = await getAll();
    return all.filter(m => m.difficulty === difficulty);
  };

  const getRecommended = async () => {
    const all       = await getAll();
    const completed = all.filter(m => m.completed);
    const pending   = all.filter(m => !m.completed);
    // Return first 3 pending modules
    return pending.slice(0, 3);
  };

  const getStats = async () => {
    const all       = await getAll();
    const completed = all.filter(m => m.completed);
    return {
      total:     all.length,
      completed: completed.length,
      remaining: all.length - completed.length,
      percentage: Math.round((completed.length / all.length) * 100),
    };
  };

  return { loadModules, getAll, getById, getByDifficulty, getRecommended, getStats };
})();


// ================================================
// GENAI TUTOR — QUIZ SERVICE
// ================================================

const QuizService = (() => {
  let _quizzes = null;

  const loadQuizzes = async () => {
    if (_quizzes) return _quizzes;
    try {
      const r = await fetch(CONFIG.DATA.QUIZZES);
      _quizzes = await r.json();
    } catch (e) {
      console.error('Failed to load quizzes:', e);
      _quizzes = {};
    }
    return _quizzes;
  };

  const getById = async (id) => {
    const quizzes = await loadQuizzes();
    return quizzes[id] || null;
  };

  const getByModuleId = async (moduleId) => {
    const modules = await ModuleService.loadModules();
    const module  = modules.find(m => m.id === moduleId);
    if (!module?.quiz) return null;
    return getById(module.quiz);
  };

  const getAll = async () => {
    const quizzes = await loadQuizzes();
    return Object.values(quizzes).map(q => ({
      ...q,
      bestScore: State.getQuizScore(q.id),
    }));
  };

  const calculateResult = (quiz, answers) => {
    let correct = 0;
    const details = quiz.questions.map((q, i) => {
      const userAnswer    = answers[i];
      const isCorrect     = userAnswer === q.correct;
      if (isCorrect) correct++;
      return { question: q, userAnswer, isCorrect };
    });

    const percentage = Math.round((correct / quiz.questions.length) * 100);
    const xpEarned   = Math.round((percentage / 100) * quiz.xpReward);
    const grade = percentage >= 90 ? 'excellent' : percentage >= 70 ? 'good' : 'needs-work';
    const gradeLabel = percentage >= 90 ? 'Excellent! 🎉' : percentage >= 70 ? 'Good job! 👏' : 'Keep practicing! 💪';

    return {
      correct,
      total:   quiz.questions.length,
      percentage,
      xpEarned,
      grade,
      gradeLabel,
      details,
    };
  };

  const submitQuiz = (quiz, answers) => {
    const result = calculateResult(quiz, answers);
    State.saveQuizScore(quiz.id, result.correct, result.total, result.xpEarned);
    return result;
  };

  return { loadQuizzes, getById, getByModuleId, getAll, calculateResult, submitQuiz };
})();


// ================================================
// GENAI TUTOR — PROGRESS SERVICE
// ================================================

const ProgressService = (() => {
  const getOverallProgress = async () => {
    const moduleStats = await ModuleService.getStats();
    const quizzes     = await QuizService.getAll();
    const userStats   = State.getStats();

    const quizScores    = State._state.quizScores;
    const topicMastery  = await buildTopicMastery();

    return {
      modules:   moduleStats,
      quizzes: {
        total:   quizzes.length,
        taken:   quizScores.length,
        avgScore: userStats.avgQuizScore,
        perfect:  quizScores.filter(q => q.percentage === 100).length,
      },
      xp:       userStats.totalXP,
      level:    userStats.level,
      streak:   userStats.streak,
      achievements: State.getAllAchievements().filter(a => a.unlocked),
      topicMastery,
    };
  };

  const buildTopicMastery = async () => {
    const modules = await ModuleService.getAll();
    return modules.map(m => {
      const quizScore  = State.getQuizScore(m.quiz);
      const completed  = State.isModuleComplete(m.id);
      const quizPct    = quizScore?.percentage || 0;
      const mastery    = completed ? (50 + quizPct * 0.5) : (quizPct * 0.5);
      return {
        moduleId: m.id,
        title:    m.title,
        icon:     m.icon,
        color:    m.color,
        completed,
        quizPct,
        mastery:  Math.round(mastery),
      };
    });
  };

  const getWeeklyActivity = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    return days.map((day, i) => ({
      day,
      active: i === today || (i === today - 1 && State._state.currentUser.streak > 1),
      value:  i === today ? Helpers.randomInt(30, 100) : Helpers.randomInt(0, 60),
    }));
  };

  const getRecentActivity = () => {
    const activities = [];

    State._state.completedModules.forEach(id => {
      const prog = State._state.progress[id];
      if (prog) {
        activities.push({
          type: 'module',
          id,
          timestamp: prog.completedAt,
          label: `Completed module`,
        });
      }
    });

    State._state.quizScores.forEach(q => {
      activities.push({
        type: 'quiz',
        id:   q.quizId,
        timestamp: q.completedAt,
        label: `Scored ${q.percentage}% on quiz`,
      });
    });

    State._state.conversations.slice(0, 5).forEach(c => {
      activities.push({
        type: 'chat',
        id:   c.id,
        timestamp: c.createdAt,
        label: 'AI Tutor conversation',
      });
    });

    return activities
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  };

  return { getOverallProgress, buildTopicMastery, getWeeklyActivity, getRecentActivity };
})();
