import MultipleChoiceTemplate from '../Templates/multiple_choice.template.js';

export default class MultipleChoiceExercise {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;
        this.template = new MultipleChoiceTemplate();
        this.progress = {};
        this.loadProgress();
    }

    async display(level = 1, stage = 1) {
        try {
            console.log(`Loading quiz for HSK${level} Stage ${stage}`);
            this.hskLevel = level; // Store the HSK level for later use
            this.stage = stage; // Store the stage for later use
            await this.loadData(level, stage);
            
            // Show the lesson content container
            this.showLessonContent();
            this.displayCurrentQuestion();
        } catch (error) {
            console.error('Error displaying multiple choice:', error);
            this.showError('Failed to load quiz data');
        }
    }


    async loadData(level, stage) {
        try {
            const response = await fetch(`../Json/HSK${level}/multiple_choices.json`);
            if (!response.ok) throw new Error('Failed to load quiz data');
            const data = await response.json();
            
            // Extract stage number if it's a string like "stage1"
            const stageNum = typeof stage === 'string' ? stage.replace('stage', '') : stage;
            this.stageKey = `stage${stageNum}`;
            this.questions = data.stages[this.stageKey] || [];
            
            console.log(`Loaded ${this.questions.length} questions for HSK${level} Stage ${stageNum}`);
            
            // Check if we have saved progress for this quiz
            const savedProgress = this.getSavedProgress(level, this.stageKey);
            if (savedProgress) {
                this.currentQuestionIndex = savedProgress.currentQuestion || 0;
                this.score = savedProgress.score || 0;
                console.log(`Loaded saved progress: Question ${this.currentQuestionIndex + 1}, Score: ${this.score}`);
            } else {
                this.currentQuestionIndex = 0;
                this.score = 0;
            }
            
            if (this.questions.length === 0) {
                throw new Error(`No questions found for stage${stageNum}`);
            }
        } catch (error) {
            console.error('Error loading quiz:', error);
            this.questions = [];
            throw error;
        }
    }

        async displayWithData(exerciseData, hskLevel = 1) {
        try {
            console.log(`Loading exercise: ${exerciseData.title}`);
            console.log('Exercise data:', exerciseData);
            
            this.questions = exerciseData.questions || [];
            this.exerciseTitle = exerciseData.title;
            this.hskLevel = hskLevel;
            this.currentQuestionIndex = 0;
            this.score = 0;
            
            console.log('Questions loaded:', this.questions.length);
            
            if (this.questions.length === 0) {
                throw new Error('No questions found in exercise data');
            }
            
            // Show the lesson content container
            this.showLessonContent();
            this.displayCurrentQuestion();
        } catch (error) {
            console.error('Error displaying exercise:', error);
            this.showError('Failed to load exercise data: ' + error.message);
        }
    }

    showLessonContent() {
        const title = document.querySelector('.course-title');
        const content = document.getElementById('lesson-content');
        const overlay = document.getElementById('overlay');
        
        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.classList.add('visible');
        }
        if (title) title.classList.add('minimized');
        if (content) {
            content.classList.remove('hidden');
            setTimeout(() => {
                content.classList.add('visible');
            }, 50);
        }
    }

    displayCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const content = document.getElementById('lesson-content');
        if (!content) return;

        const html = this.template.render(this.questions, this.currentQuestionIndex);
        content.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        console.log('Attaching event listeners...');
        
        // Option buttons
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectAnswer(e));
        });

        // Next button
        const nextBtn = document.getElementById('next-question');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        // Close button
        const closeBtnStages = document.querySelector('.close-btn-stages');
        const closeBtn = document.querySelector('.close-btn');
        console.log('Close button found:', closeBtn);
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                this.backToStages();
            });
        }
        if (closeBtnStages){
            closeBtnStages.addEventListener('click', (e) => {
                this.backToStages();
            })
        }

        // Back to stages button (on results page)
        const backBtn = document.querySelector('.back-to-stages-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToStages());
        }
    }

    selectAnswer(event) {
        if (this.selectedAnswer !== null) return;

        this.selectedAnswer = parseInt(event.target.dataset.index);
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = this.selectedAnswer === question.correct;

        document.querySelectorAll('.option-btn').forEach((btn, index) => {
            btn.disabled = true;
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
        });

        // Show feedback
        const feedback = document.getElementById('feedback');
        if (feedback) {
            feedback.innerHTML = `
                <div class="feedback-content ${isCorrect ? 'correct' : 'incorrect'}">
                    ${isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                    <br>
                    ${question.explanation || ''}
                </div>
            `;
        }

        if (isCorrect) {
            this.score++;
        }

        document.getElementById('next-question').style.display = 'block';
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.selectedAnswer = null;
            this.saveProgress();
            this.displayCurrentQuestion();
        } else {
            this.showResults();
        }
    }

    showResults() {
        if (this.hskLevel && this.stageKey) {
            this.saveProgress();
        }
        const content = document.getElementById('lesson-content');
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        content.innerHTML = `
            <div class="course-header">
                <div class="section-title">Quiz Results</div>
                <button class="close-btn-stages">×</button>
            </div>
            
            <div class="mc-content">
                <div class="question-container" style="text-align: center;">
                    <h2>Quiz Complete!</h2>
                    <div style="font-size: 3em; margin: 20px 0;">
                        ${percentage >= 80 ? '🎉' : percentage >= 60 ? '😊' : '😅'}
                    </div>
                    <p style="font-size: 1.5em; margin-bottom: 10px;">
                        Score: ${this.score} / ${this.questions.length}
                    </p>
                    <p style="font-size: 1.2em; margin-bottom: 20px;">
                        ${percentage}%
                    </p>
                    <p style="color: #666; margin-bottom: 30px;">
                        ${percentage >= 80 ? 'Excellent work!' : 
                        percentage >= 60 ? 'Good job! Keep practicing.' : 
                        'Keep studying and try again!'}
                    </p>
                    <button class="back-to-stages-btn" style="background-color: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 20px; cursor: pointer; font-size: 16px; margin: 10px;">
                        Back to Quiz Stages
                    </button>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    backToStages() {
        console.log('backToStages called, hskLevel:', this.hskLevel);
        console.log('courseDisplay available:', window.courseDisplay);
        console.log('showQuizStages method:', window.courseDisplay ? window.courseDisplay.showQuizStages : 'N/A');
        
        if (this.hskLevel && this.stageKey) {
            this.saveProgress();
        }
        
        const content = document.getElementById('lesson-content');
        const overlay = document.getElementById('overlay');
        
        if (content) {
            content.classList.remove('visible');
            if (overlay) {
                overlay.classList.remove('visible');
            }
            setTimeout(() => {
                content.classList.add('hidden');
                if (overlay) overlay.classList.add('hidden');
                document.querySelector('.course-title')?.classList.remove('minimized');
                
                if (window.courseDisplay && window.courseDisplay.showQuizStages && this.hskLevel) {
                    console.log('Calling showQuizStages with level:', this.hskLevel);
                    window.courseDisplay.showQuizStages(this.hskLevel);
                } else {
                    console.error('Cannot show quiz stages - missing dependencies');
                }
            }, 500);
        } else {
            if (window.courseDisplay && window.courseDisplay.showQuizStages && this.hskLevel) {
                console.log('Fallback: Calling showQuizStages with level:', this.hskLevel);
                window.courseDisplay.showQuizStages(this.hskLevel);
            } else {
                console.error('Fallback failed - missing dependencies');
            }
        }
    }

    close() {
        // Use the courseDisplay's closeContent method if available
        if (window.courseDisplay && window.courseDisplay.closeContent) {
            window.courseDisplay.closeContent();
        } else {
            // Fallback
            const content = document.getElementById('lesson-content');
            const overlay = document.getElementById('overlay');
            
            if (content) {
                content.classList.remove('visible');
                if (overlay) {
                    overlay.classList.remove('visible');
                }
                setTimeout(() => {
                    content.classList.add('hidden');
                    if (overlay) overlay.classList.add('hidden');
                    document.querySelector('.course-title')?.classList.remove('minimized');
                }, 500);
            }
        }
    }

    showError(message) {
        const content = document.getElementById('lesson-content');
        if (content) {
            this.showLessonContent();
            content.innerHTML = `
                <div class="course-header">
                    <div class="section-title">Error</div>
                    <button class="close-btn">×</button>
                </div>
                <div class="mc-content">
                    <div class="question-container" style="text-align: center;">
                        <h2>Error Loading Quiz</h2>
                        <p style="color: #666; margin: 20px 0;">${message}</p>
                        <p style="color: #999;">Please try again later.</p>
                    </div>
                </div>
            `;
            this.attachEventListeners();
        }
    }

    // Save the current progress to localStorage
    saveProgress() {
        if (!this.hskLevel || !this.stageKey) {
            console.log('Cannot save progress: HSK level or stage not set');
            return;
        }
        
        const progressKey = `quiz_progress_hsk${this.hskLevel}_${this.stageKey}`;
        const progressData = {
            currentQuestion: this.currentQuestionIndex,
            score: this.score,
            timestamp: Date.now(),
            completed: this.currentQuestionIndex >= this.questions.length - 1
        };
        
        localStorage.setItem(progressKey, JSON.stringify(progressData));
        console.log(`Progress saved for HSK${this.hskLevel} ${this.stageKey}:`, progressData);
        
        // Update the progress object
        if (!this.progress) this.progress = {};
        this.progress[`hsk${this.hskLevel}_${this.stageKey}`] = progressData;
    }
    
    // load saved progress from localStorage
    loadProgress() {
        try {
            this.progress = {};
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('quiz_progress_')) {
                    try {
                        const data = JSON.parse(localStorage.getItem(key));
                        const keyParts = key.replace('quiz_progress_', '');
                        this.progress[keyParts] = data;
                    } catch (error) {
                        console.warn(`Could not parse progress data for key ${key}:`, error);
                    }
                }
            }
            console.log('Loaded progress data:', this.progress);
        } catch (error) {
            console.error('Error loading progress:', error);
            this.progress = {};
        }
    }
    
    // Get saved progress 
    getSavedProgress(level, stage) {
        const progressKey = `hsk${level}_${stage}`;
        return this.progress ? this.progress[progressKey] : null;
    }
}