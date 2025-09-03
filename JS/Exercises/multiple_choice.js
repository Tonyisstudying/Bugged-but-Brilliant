import MultipleChoiceTemplate from '../Templates/multiple_choice.template.js';

export default class MultipleChoiceExercise {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.template = new MultipleChoiceTemplate();
        this.selectedAnswer = null;
    }

    async display(level = 1, stage = 1) {
        try {
            await this.loadData(level, stage);
            this.displayCurrentQuestion();
        } catch (error) {
            console.error('Error displaying multiple choice:', error);
            this.showError('Failed to display multiple choice questions');
        }
    }

    async loadData(level, stage) {
        try {
            const response = await fetch(`../Json/courses/chinese/level${level}/stages/stage${stage}/multiple_choices.json`);
            if (!response.ok) throw new Error('Failed to load multiple choice data');
            const data = await response.json();
            this.questions = data.questions || [];
        } catch (error) {
            console.error('Error loading multiple choice:', error);
            this.questions = [];
            throw error;
        }
    }

    displayCurrentQuestion() {
        if (!this.questions.length) return;

        const content = document.getElementById('lesson-content');
        if (!content) return;

        const html = this.template.render(this.questions, this.currentQuestionIndex);
        content.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        const optionBtns = document.querySelectorAll('.option-btn');
        const nextBtn = document.getElementById('nextBtn');
        const closeBtn = document.querySelector('.close-btn');

        optionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAnswer(e));
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }

    selectAnswer(event) {
        const selectedIndex = parseInt(event.target.dataset.index);
        this.selectedAnswer = selectedIndex;

        const currentQuestion = this.questions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === currentQuestion.correct;

        // Disable all options and show correct/incorrect
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
            const btnIndex = parseInt(btn.dataset.index);
            if (btnIndex === currentQuestion.correct) {
                btn.classList.add('correct');
            } else if (btnIndex === selectedIndex && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Show feedback
        this.template.showFeedback(isCorrect, currentQuestion.explanation);

        // Show next button
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.style.display = 'block';
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.selectedAnswer = null;
            this.displayCurrentQuestion();
        } else {
            this.complete();
        }
    }

    close() {
        const content = document.getElementById('lesson-content');
        if (content) {
            content.classList.add('hidden');
            const title = document.querySelector('.course-title');
            if (title) title.classList.remove('minimized');
        }
    }

    complete() {
        console.log('Multiple choice section completed');
        // You can add logic here to move to the next exercise type
    }

    showError(message) {
        const content = document.getElementById('lesson-content');
        if (content) {
            content.innerHTML = `<div style="color: red; padding: 20px;">${message}</div>`;
            content.classList.remove('hidden');
        }
    }
}
