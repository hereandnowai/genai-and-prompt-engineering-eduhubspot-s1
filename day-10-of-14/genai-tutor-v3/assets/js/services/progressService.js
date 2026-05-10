import stateManager from '../state.js';

const progressService = {
  completeModule(moduleId, xpGained) {
    const currentState = stateManager.getState();
    if (!currentState.completedModules.includes(moduleId)) {
      const newCompleted = [...currentState.completedModules, moduleId];
      const newXp = currentState.user.xp + xpGained;
      const level = Math.floor(newXp / 500) + 1;
      
      stateManager.setState({
        completedModules: newCompleted,
        user: { ...currentState.user, xp: newXp, level }
      });
    }
  },

  saveQuizScore(quizId, score) {
    const currentState = stateManager.getState();
    const newScores = { ...currentState.quizScores, [quizId]: score };
    stateManager.setState({ quizScores: newScores });
  },

  getStats() {
    const s = stateManager.getState();
    return {
      completedCount: s.completedModules.length,
      xp: s.user.xp,
      level: s.user.level,
      streak: s.user.streak,
      quizCount: Object.keys(s.quizScores).length
    };
  }
};

export default progressService;
