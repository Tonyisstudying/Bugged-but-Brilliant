export default class MultipleChoiceTemplate {
    render(questions, currentQuestionIndex = 0) {
        const question = questions[currentQuestionIndex];
        const progress = {
            current: currentQuestionIndex + 1,
            total: questions.length
        };

        return `
            <div class="course-header">
                <div class="section-title">Quiz - Question ${progress.current} of ${progress.total}</div>
                <button class="close-btn-stages">×</button>
            </div>

            <div class="mc-content">
                <div class="question-container">
                    <div class="question-text">${question.question}</div>
                    <div class="options-container">
                        ${this.generateOptions(question.options)}
                    </div>
                    <div class="feedback" id="feedback"></div>
                </div>
                
                <div class="navigation">
                    <div class="progress-indicator">
                        Question ${progress.current} of ${progress.total}
                    </div>
                    <button class="next-btn" id="next-question" style="display: none;">
                        ${currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
                    </button>
                </div>
            </div>
        `;
    }

    generateOptions(options) {
        return options.map((option, index) => `
            <button class="option-btn" data-index="${index}">${option}</button>
        `).join('');
    }
}