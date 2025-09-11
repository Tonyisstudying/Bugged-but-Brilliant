export default class MultipleChoiceTemplate {
    render(questions, currentQuestionIndex = 0) {
        const question = questions[currentQuestionIndex];
        const progress = {
            current: currentQuestionIndex + 1,
            total: questions.length
        };

        return `
            <div class="course-header">
                <div class="section-title">Multiple Choice</div>
                <button class="close-btn">X</button>
            </div>

            <div class="mc-content">
                <div class="question-container">
                    <h3 class="question-text">${question.question}</h3>
                    <div class="options-container">
                        ${this.generateOptions(question.options)}
                    </div>
                    <div class="feedback" id="feedback" style="display: none;"></div>
                </div>
            </div>

            <div class="navigation">
                <div class="progress-dots">
                    ${this.generateProgressDots(progress)}
                </div>
                <button class="next-btn" id="nextBtn" style="display: none;">
                    <span class="material-symbols-outlined">arrow_right_alt</span>
                </button>
            </div>
        `;
    }

    generateOptions(options) {
        return options.map((option, index) => `
            <button class="option-btn" data-index="${index}">${option}</button>
        `).join('');
    }

    generateProgressDots(progress) {
        return Array(progress.total)
            .fill()
            .map((_, index) => `
                <span class="dot${index < progress.current ? ' active' : ''}"></span>
            `).join('');
    }

    showFeedback(isCorrect, explanation) {
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.style.display = 'block';
            feedback.innerHTML = `
                <div class="feedback-content ${isCorrect ? 'correct' : 'incorrect'}">
                    <p>${isCorrect ? 'Correct!' : 'Incorrect!'}</p>
                    <p>${explanation}</p>
                </div>
            `;
        }
    }
}
