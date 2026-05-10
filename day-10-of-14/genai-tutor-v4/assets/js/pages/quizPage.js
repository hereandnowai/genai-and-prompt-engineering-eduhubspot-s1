/**
 * quizPage.js — Quiz page controller
 */

const QuizPage = (() => {
  let _quiz = null;
  let _currentIndex = 0;
  let _answers = [];
  let _showResult = false;

  const render = async (container, params = {}) => {
    const quizId = params.quizId || null;

    container.innerHTML = `
      <div class="page-content">
        <div class="page-header">
          <h1>🎯 Quizzes</h1>
          <p>Test your AI knowledge and earn XP</p>
        </div>
        <div id="quizBody">${Cards.skeletonGrid(4, 2)}</div>
      </div>`;

    await QuizService.loadQuizzes();

    if (quizId) {
      const quiz = QuizService.getById(quizId);
      if (quiz) { _startQuiz(quiz, container); return; }
    }

    _renderSelector(container);
  };

  const _renderSelector = (container) => {
    const quizzes = QuizService.getAll();
    const body = document.getElementById('quizBody');

    body.innerHTML = `
      <div class="quiz-selector-grid" role="list">
        ${quizzes.map(q => {
          const score = State.getQuizScore(q.id);
          return QuizComponent.quizSelectorCard(q, score !== null, score);
        }).join('')}
      </div>`;

    body.querySelectorAll('.start-quiz-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const quiz = QuizService.getById(btn.dataset.quizId);
        if (quiz) _startQuiz(quiz, container);
      });
    });
  };

  const _startQuiz = (quiz, container) => {
    _quiz = quiz;
    _currentIndex = 0;
    _answers = [];
    _showResult = false;
    _renderQuestion(container);
  };

  const _renderQuestion = (container) => {
    const body = document.getElementById('quizBody') || container;
    const q = _quiz.questions[_currentIndex];

    body.innerHTML = `
      <div class="quiz-active-wrap">
        <div class="quiz-title-bar">
          <button class="btn btn-ghost btn-sm" id="quitQuizBtn">← Quit</button>
          <h2>${Helpers.sanitize(_quiz.title)}</h2>
          <span class="quiz-xp-badge">⚡ ${_quiz.xpReward} XP</span>
        </div>
        ${QuizComponent.progressBar(_currentIndex, _quiz.questions.length)}
        <div id="questionWrap">
          ${QuizComponent.questionCard(q, _currentIndex, _quiz.questions.length, _answers[_currentIndex] || null, false)}
        </div>
        <div class="quiz-nav" id="quizNav">
          ${_currentIndex > 0 ? '<button class="btn btn-secondary" id="prevBtn">← Previous</button>' : '<div></div>'}
          <button class="btn btn-primary" id="nextBtn" disabled>${_currentIndex < _quiz.questions.length - 1 ? 'Next →' : 'Finish'}</button>
        </div>
      </div>`;

    _bindQuizEvents(container);
  };

  const _bindQuizEvents = (container) => {
    const body = document.getElementById('quizBody') || container;

    body.querySelector('#quitQuizBtn')?.addEventListener('click', () => {
      Modal.confirm({
        title: 'Quit Quiz',
        message: 'Are you sure you want to quit? Your progress will be lost.',
        danger: true,
        onConfirm: () => _renderSelector(container)
      });
    });

    body.querySelector('#prevBtn')?.addEventListener('click', () => {
      if (_currentIndex > 0) { _currentIndex--; _renderQuestion(container); }
    });

    body.querySelector('#nextBtn')?.addEventListener('click', () => {
      if (_currentIndex < _quiz.questions.length - 1) {
        _currentIndex++;
        _renderQuestion(container);
      } else {
        _finishQuiz(container);
      }
    });

    // Option selection
    body.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => _selectAnswer(btn.dataset.answer, container));
    });
  };

  const _selectAnswer = (answer, container) => {
    _answers[_currentIndex] = answer;
    const q = _quiz.questions[_currentIndex];
    const wrap = document.getElementById('questionWrap');
    if (wrap) {
      wrap.innerHTML = QuizComponent.questionCard(q, _currentIndex, _quiz.questions.length, answer, true);
    }

    // Enable next
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) nextBtn.disabled = false;

    // Re-bind options (now disabled)
    const body = document.getElementById('quizBody') || container;
    body.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {});
    });
  };

  const _finishQuiz = (container) => {
    const result = QuizService.calculateResult(_quiz, _answers);
    State.saveQuizScore(_quiz.id, result.percentage);
    State.addXP(result.xpEarned);

    const body = document.getElementById('quizBody') || container;
    body.innerHTML = QuizComponent.resultSummary(result, _quiz.questions, _answers);

    Helpers.showXPGain(result.xpEarned);
    if (result.percentage >= 80) Helpers.celebrate();

    body.querySelector('#retryQuizBtn')?.addEventListener('click', () => _startQuiz(_quiz, container));
    body.querySelector('#backToQuizzesBtn')?.addEventListener('click', () => _renderSelector(container));

    // Animate rings
    setTimeout(() => ProgressComponent.animateAll(body), 200);
  };

  return { render };
})();
