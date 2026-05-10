const QuizPage = {
    currentQuiz: null,
    score: 0,
    
    quizzes: [
        {
            title: 'AI Basics',
            questions: [
                { q: "What does AI stand for?", options: ["Artificial Intelligence", "Advanced Integration", "Automated Information"], a: 0 },
                { q: "Which of these is a subset of AI?", options: ["Cryptography", "Machine Learning", "Quantum Physics"], a: 1 }
            ]
        }
    ],

    render() {
        const container = document.createElement('div');
        container.className = 'quiz-page animate-fade-in';
        container.innerHTML = `
            <div id="quiz-intro" class="card" style="max-width: 600px; margin: 40px auto; text-align: center;">
                <h2 style="font-size: 2rem; margin-bottom: 20px;">AI Proficiency Quiz</h2>
                <p style="color: var(--text-muted); margin-bottom: 30px;">Test your knowledge and earn XP! Each correct answer gives 10 XP.</p>
                <button id="start-quiz-btn" class="btn btn-primary" style="padding: 12px 40px;">Start Quiz</button>
            </div>
            
            <div id="quiz-container" class="card" style="max-width: 700px; margin: 40px auto; display: none;">
                <div id="question-header" style="display: flex; justify-content: space-between; margin-bottom: 30px;">
                    <span id="question-count">Question 1/2</span>
                    <span id="quiz-timer">⏱️ 02:00</span>
                </div>
                <h3 id="question-text" style="font-size: 1.5rem; margin-bottom: 25px;"></h3>
                <div id="options-list" style="display: flex; flex-direction: column; gap: 15px;"></div>
            </div>

            <div id="quiz-result" class="card" style="max-width: 600px; margin: 40px auto; text-align: center; display: none;">
                <h2 style="font-size: 2.5rem; margin-bottom: 15px;">Quiz Complete!</h2>
                <p id="final-score" style="font-size: 1.25rem; font-weight: 600; color: var(--primary); margin-bottom: 30px;"></p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="retry-btn" class="btn btn-outline">Try Again</button>
                    <button onclick="window.location.hash='#dashboard'" class="btn btn-primary">Back to Dashboard</button>
                </div>
            </div>
        `;

        this.initQuiz(container);
        return container;
    },

    initQuiz(container) {
        const quiz = this.quizzes[0];
        let qIdx = 0;
        
        const intro = container.querySelector('#quiz-intro');
        const main = container.querySelector('#quiz-container');
        const result = container.querySelector('#quiz-result');
        const qText = container.querySelector('#question-text');
        const qList = container.querySelector('#options-list');
        const qCount = container.querySelector('#question-count');

        const showQuestion = () => {
            const q = quiz.questions[qIdx];
            qCount.innerText = `Question ${qIdx + 1}/${quiz.questions.length}`;
            qText.innerText = q.q;
            qList.innerHTML = '';
            
            q.options.forEach((opt, i) => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-outline';
                btn.style.textAlign = 'left';
                btn.style.padding = '15px 20px';
                btn.innerText = opt;
                btn.onclick = () => handleAnswer(i);
                qList.appendChild(btn);
            });
        };

        const handleAnswer = (choice) => {
            if (choice === quiz.questions[qIdx].a) {
                this.score += 1;
                state.progress.xp += 10;
            }
            
            qIdx++;
            if (qIdx < quiz.questions.length) {
                showQuestion();
            } else {
                showResult();
            }
        };

        const showResult = () => {
            main.style.display = 'none';
            result.style.display = 'block';
            container.querySelector('#final-score').innerText = `Your Score: ${this.score}/${quiz.questions.length} | Total XP earned: ${this.score * 10}`;
            state.update({ progress: state.progress });
        };

        container.querySelector('#start-quiz-btn').onclick = () => {
            intro.style.display = 'none';
            main.style.display = 'block';
            this.score = 0;
            qIdx = 0;
            showQuestion();
        };

        container.querySelector('#retry-btn').onclick = () => {
            result.style.display = 'none';
            main.style.display = 'block';
            this.score = 0;
            qIdx = 0;
            showQuestion();
        };
    }
};
