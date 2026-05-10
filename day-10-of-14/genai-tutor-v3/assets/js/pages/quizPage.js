import stateManager from '../state.js';
import progressService from '../services/progressService.js';

const quizPage = {
  quizzes: [],
  currentQuiz: null,
  currentQuestionIndex: 0,
  score: 0,

  async loadQuizzes() {
    const res = await fetch('assets/data/quizzes.json');
    this.quizzes = await res.json();
  },

  async render() {
    await this.loadQuizzes();
    
    if (!this.currentQuiz) {
      return this.renderQuizList();
    }
    
    return this.renderQuestion();
  },

  renderQuizList() {
    const quizCards = this.quizzes.map(q => `
      <div class="card shadow-md">
        <div style="background: var(--purple-light); width: 44px; height: 44px; border-radius: 12px; margin-bottom: 20px; color: var(--purple);" class="flex-center">
          <i data-lucide="help-circle"></i>
        </div>
        <h3 class="card-title">${q.title}</h3>
        <p class="card-description">Difficulty: <span style="color: var(--primary); font-weight: 700;">${q.difficulty}</span></p>
        <button class="btn btn-primary start-quiz" data-id="${q.id}" style="width: 100%; margin-top: 10px;">Start Quiz</button>
      </div>
    `).join('');

    return `
      <div style="margin-bottom: 40px; text-align: left;">
        <h1 style="font-size: 2.5rem; font-weight: 800; margin-bottom: 12px;">Skill Assessments</h1>
        <p style="color: var(--text-light); font-size: 1.1rem;">Test your understanding and earn bonus XP.</p>
      </div>
      <div class="grid-auto">
        ${quizCards}
      </div>
    `;
  },


  renderQuestion() {
    const q = this.currentQuiz.questions[this.currentQuestionIndex];
    const options = q.options.map((opt, idx) => `
      <button class="btn btn-outline quiz-option" data-idx="${idx}" style="width: 100%; justify-content: flex-start; text-align: left; padding: 1rem;">
        ${opt}
      </button>
    `).join('');

    return `
      <div class="container section-padding" style="max-width: 700px;">
        <div class="card">
          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
            <span class="badge badge-blue">Question ${this.currentQuestionIndex + 1}/${this.currentQuiz.questions.length}</span>
            <span style="font-size: 0.8rem; color: var(--text-light);">Score: ${this.score}</span>
          </div>
          <h2 style="margin-bottom: 30px;">${q.question}</h2>
          <div style="display: flex; flex-direction: column; gap: 15px;">
            ${options}
          </div>
          <div id="feedback" class="hidden" style="margin-top: 20px; padding: 15px; border-radius: var(--radius-md);"></div>
          <button id="next-question" class="btn btn-primary hidden" style="margin-top: 20px; width: 100%;">Next Question</button>
        </div>
      </div>
    `;
  },

  init() {
    if (window.lucide) window.lucide.createIcons();

    const quizListBtns = document.querySelectorAll('.start-quiz');
    quizListBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentQuiz = this.quizzes.find(q => q.id === btn.dataset.id);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.renderAndInit();
      });
    });

    const options = document.querySelectorAll('.quiz-option');
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        if (document.getElementById('next-question').classList.contains('hidden')) {
          this.handleAnswer(parseInt(e.currentTarget.dataset.idx));
        }
      });
    });

    const nextBtn = document.getElementById('next-question');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex >= this.currentQuiz.questions.length) {
          this.finishQuiz();
        } else {
          this.renderAndInit();
        }
      });
    }
  },

  handleAnswer(idx) {
    const q = this.currentQuiz.questions[this.currentQuestionIndex];
    const feedback = document.getElementById('feedback');
    const nextBtn = document.getElementById('next-question');
    const options = document.querySelectorAll('.quiz-option');

    feedback.classList.remove('hidden');
    nextBtn.classList.remove('hidden');

    if (idx === q.answer) {
      this.score += 100;
      feedback.style.background = 'rgba(16, 185, 129, 0.1)';
      feedback.style.color = 'var(--success)';
      feedback.innerHTML = `<strong>Correct!</strong> ${q.explanation}`;
      options[idx].style.borderColor = 'var(--success)';
      options[idx].style.background = 'rgba(16, 185, 129, 0.05)';
    } else {
      feedback.style.background = 'rgba(239, 68, 68, 0.1)';
      feedback.style.color = 'var(--error)';
      feedback.innerHTML = `<strong>Not quite.</strong> The correct answer was ${q.options[q.answer]}. ${q.explanation}`;
      options[idx].style.borderColor = 'var(--error)';
      options[q.answer].style.borderColor = 'var(--success)';
    }
  },

  finishQuiz() {
    alert(`Quiz Finished! Your Score: ${this.score}`);
    progressService.saveQuizScore(this.currentQuiz.id, this.score);
    // Add XP
    const s = stateManager.getState();
    stateManager.setState({ user: { ...s.user, xp: s.user.xp + this.score } });
    
    this.currentQuiz = null;
    window.location.hash = 'dashboard';
  },

  async renderAndInit() {
    const html = await this.render();
    document.getElementById('app').innerHTML = html;
    this.init();
  }
};

export default quizPage;
