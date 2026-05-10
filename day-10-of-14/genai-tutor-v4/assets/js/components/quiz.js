/**
 * quiz.js — Quiz UI component
 */

const QuizComponent = (() => {

  // Question card
  const questionCard = (question, index, total, selectedAnswer = null, showResult = false) => {
    const isAnswered = selectedAnswer !== null;
    return `
    <div class="quiz-question-card" role="region" aria-label="Question ${index + 1} of ${total}">
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" style="width:${((index) / total) * 100}%" aria-hidden="true"></div>
      </div>
      <div class="quiz-header">
        <span class="quiz-counter" aria-label="Question ${index + 1} of ${total}">Q${index + 1}/${total}</span>
        <span class="quiz-topic">${Helpers.sanitize(question.topic || '')}</span>
      </div>
      <h3 class="quiz-question" id="question-${index}">${Helpers.sanitize(question.question)}</h3>
      <div class="quiz-options" role="radiogroup" aria-labelledby="question-${index}">
        ${question.options.map((opt, i) => {
          let cls = 'quiz-option';
          if (isAnswered && showResult) {
            if (opt === question.correctAnswer) cls += ' correct';
            else if (opt === selectedAnswer && opt !== question.correctAnswer) cls += ' incorrect';
          } else if (opt === selectedAnswer) {
            cls += ' selected';
          }
          const letter = String.fromCharCode(65 + i);
          return `
          <button class="${cls}" 
                  data-answer="${Helpers.sanitize(opt)}"
                  ${isAnswered ? 'disabled' : ''}
                  role="radio"
                  aria-checked="${opt === selectedAnswer}"
                  aria-label="Option ${letter}: ${opt}">
            <span class="option-letter" aria-hidden="true">${letter}</span>
            <span class="option-text">${Helpers.sanitize(opt)}</span>
            ${isAnswered && showResult && opt === question.correctAnswer ? '<span class="option-check" aria-hidden="true">✓</span>' : ''}
            ${isAnswered && showResult && opt === selectedAnswer && opt !== question.correctAnswer ? '<span class="option-x" aria-hidden="true">✗</span>' : ''}
          </button>`;
        }).join('')}
      </div>
      ${isAnswered && showResult ? `
        <div class="quiz-explanation ${selectedAnswer === question.correctAnswer ? 'correct-exp' : 'incorrect-exp'}" role="alert">
          <strong>${selectedAnswer === question.correctAnswer ? '✅ Correct!' : '❌ Incorrect'}</strong>
          <p>${Helpers.sanitize(question.explanation)}</p>
        </div>` : ''}
    </div>`;
  };

  // Quiz selector card (for choosing a quiz)
  const quizSelectorCard = (quiz, isCompleted = false, score = null) => {
    const mod = ModuleService.getById(quiz.moduleId);
    return `
    <article class="card quiz-selector-card ${isCompleted ? 'completed' : ''}"
             role="article"
             tabindex="0"
             aria-label="${quiz.title} quiz">
      <div class="quiz-selector-icon" aria-hidden="true">${mod?.icon || '🎯'}</div>
      <div class="quiz-selector-info">
        <h3>${Helpers.sanitize(quiz.title)}</h3>
        <p>${quiz.questions?.length || 0} questions · ${CONSTANTS.DIFFICULTY_LABELS[quiz.difficulty] || quiz.difficulty}</p>
        ${isCompleted && score !== null ? `<div class="quiz-score-badge">Best: ${score}%</div>` : ''}
      </div>
      <button class="btn btn-primary btn-sm start-quiz-btn" data-quiz-id="${quiz.id}">
        ${isCompleted ? '🔁 Retry' : '▶ Start'}
      </button>
    </article>`;
  };

  // Quiz result summary
  const resultSummary = (result, questions, answers) => {
    const breakdown = questions.map((q, i) => {
      const correct = answers[i] === q.correctAnswer;
      return `
      <div class="result-breakdown-item ${correct ? 'correct' : 'incorrect'}">
        <span class="breakdown-num">${i + 1}</span>
        <div class="breakdown-info">
          <p class="breakdown-q">${Helpers.sanitize(Helpers.truncate(q.question, 80))}</p>
          <p class="breakdown-a">
            <span class="${correct ? 'text-success' : 'text-danger'}">${correct ? '✓' : '✗'}</span>
            Your answer: <em>${Helpers.sanitize(answers[i] || 'No answer')}</em>
            ${!correct ? ` · Correct: <em>${Helpers.sanitize(q.correctAnswer)}</em>` : ''}
          </p>
        </div>
      </div>`;
    }).join('');

    const emoji = result.percentage >= 80 ? '🏆' : result.percentage >= 60 ? '😊' : '📚';
    const message = result.percentage >= 80
      ? 'Excellent work! You really know your stuff!'
      : result.percentage >= 60
      ? 'Good job! A little more practice and you\'ll ace it!'
      : 'Keep learning! Every expert was once a beginner.';

    return `
    <div class="quiz-result" role="main" aria-label="Quiz results">
      <div class="result-hero">
        <div class="result-emoji" aria-hidden="true">${emoji}</div>
        <div class="result-score-ring">
          <svg viewBox="0 0 100 100" class="score-ring-svg" aria-hidden="true">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--glass-border)" stroke-width="8"/>
            <circle cx="50" cy="50" r="40" fill="none" 
                    stroke="${result.percentage >= 80 ? '#10b981' : result.percentage >= 60 ? '#f59e0b' : '#ef4444'}" 
                    stroke-width="8" stroke-linecap="round"
                    stroke-dasharray="${2 * Math.PI * 40}"
                    stroke-dashoffset="${2 * Math.PI * 40 * (1 - result.percentage / 100)}"
                    transform="rotate(-90 50 50)"/>
          </svg>
          <div class="score-ring-text">
            <span class="score-pct">${result.percentage}%</span>
            <span class="score-grade">${result.grade}</span>
          </div>
        </div>
        <p class="result-message">${Helpers.sanitize(message)}</p>
        <div class="result-stats">
          <div class="result-stat">
            <span class="result-stat-val">${result.correct}</span>
            <span class="result-stat-lbl">Correct</span>
          </div>
          <div class="result-stat">
            <span class="result-stat-val">${result.total - result.correct}</span>
            <span class="result-stat-lbl">Incorrect</span>
          </div>
          <div class="result-stat">
            <span class="result-stat-val">+${result.xpEarned}</span>
            <span class="result-stat-lbl">XP Earned</span>
          </div>
        </div>
        <div class="result-actions">
          <button class="btn btn-primary" id="retryQuizBtn">🔁 Try Again</button>
          <button class="btn btn-secondary" id="backToQuizzesBtn">← All Quizzes</button>
        </div>
      </div>
      <div class="result-breakdown">
        <h3>Question Breakdown</h3>
        ${breakdown}
      </div>
    </div>`;
  };

  // Progress bar during quiz
  const progressBar = (current, total) => `
    <div class="quiz-nav-bar" role="navigation" aria-label="Quiz progress">
      ${Array(total).fill('').map((_, i) => `
        <div class="quiz-dot ${i < current ? 'done' : i === current ? 'current' : ''}" 
             aria-label="Question ${i + 1}: ${i < current ? 'answered' : i === current ? 'current' : 'upcoming'}"
             aria-current="${i === current ? 'step' : 'false'}"></div>
      `).join('')}
    </div>`;

  return { questionCard, quizSelectorCard, resultSummary, progressBar };
})();
