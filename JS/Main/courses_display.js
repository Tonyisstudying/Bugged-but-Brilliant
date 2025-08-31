class CourseDisplay {
    constructor() {
        this.currentLevel = 1;
        this.currentLesson = 0;
        this.contentArea = document.getElementById('lesson-content');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.querySelectorAll('.level').forEach(level => {
            level.addEventListener('click', (e) => {
                this.loadLevel(e.target.dataset.level);
            });
        });
    }

    loadLevel(level) {
        this.currentLevel = level;
        this.showContent();
        fetch(`../Data/Json/courses/chinese/level${level}/vocabulary.json`)
            .then(response => response.json())
            .then(data => this.displayVocabulary(data));
    }

    showContent() {
        const content = this.contentArea;
        content.classList.remove('hidden');
        document.querySelector('.course-title').classList.add('minimized');
    }

    hideContent() {
        this.contentArea.classList.add('hidden');
        document.querySelector('.course-title').classList.remove('minimized');
    }
// Vocabulary Display
    displayVocabulary(data) {
        const lesson = data.lessons[this.currentLesson];
        const html = `
            <div class="course-header">
                <div class="excercises-title">Chinese</div>
                <div class="lesson-type">Vocabulary</div>
                <button class="close-btn" onclick="courseDisplay.hideContent()">X</button>
            </div>
            <div class="lesson-content">
                <div class="vocab-section">
                    <div class="vocab-header">Hanzi</div>
                    <div class="vocab-header">Transcription</div>
                    <div class="vocab-header">Translation</div>
                    <div class="vocab-header">Examples</div>
                    ${this.createVocabContent(lesson.words)}
                </div>
                <div class="navigation-controls">
                    <div class="progress-dots">
                        ${this.createProgressDots(data.lessons.length)}
                    </div>
                    <button class="navigation-btn" onclick="courseDisplay.nextLesson()">→</button>
                </div>
            </div>
        `;
        this.contentArea.innerHTML = html;
    }

    createVocabContent(words) {
        return words.map(word => `
            <div class="vocab-content">${word.hanzi}</div>
            <div class="vocab-content">${word.pinyin}</div>
            <div class="vocab-content">${word.english}</div>
            <div class="vocab-content">${word.example}</div>
        `).join('');
    }
// Fill in the blank
    getFillBlankTemplate(data) {
        return `
            <div class="course-header">
                <div class="course-title">Chinese</div>
                <div class="lesson-type">Fill in the Blank</div>
                <button class="close-btn" onclick="courseDisplay.hideContent()">X</button>
            </div>
            <div class="lesson-content">
                <div class="fillblank-section">
                    <div class="question">${data.question}</div>
                    <input type="text" class="answer-input" placeholder="Type your answer">
                    <button class="check-btn">Check Answer</button>
                </div>
            </div>
        `;
    }
// Arranging
    getArrangingTemplate(data) {
        return `
            <div class="course-header">
                <div class="course-title">Chinese</div>
                <div class="lesson-type">Arranging</div>
                <button class="close-btn" onclick="courseDisplay.hideContent()">X</button>
            </div>
            <div class="lesson-content">
                <div class="arranging-section">
                    <div class="question">${data.question}</div>
                    <div class="characters-container">
                        ${data.characters.map(char => `
                            <div class="character" draggable="true">${char}</div>
                        `).join('')}
                    </div>
                    <div class="answer-box"></div>
                </div>
            </div>
        `;
    }
    // Display method that uses templates
    displayExercise(data) {
        let template;
        switch(data.type) {
            case 'vocabulary':
                template = this.getVocabularyTemplate(data);
                break;
            case 'arranging':
                template = this.getArrangingTemplate(data);
                break;
            case 'fillBlank':
                template = this.getFillBlankTemplate(data);
                break;
        }

        // Add navigation controls to all templates
        template += `
            <div class="navigation-controls">
                <div class="progress-dots">
                    ${this.createProgressDots(data.totalParts)}
                </div>
                <button class="navigation-btn" onclick="courseDisplay.nextPart()">→</button>
            </div>
        `;

        this.contentArea.innerHTML = template;
        this.initializeExerciseHandlers(data.type);
    }
        // Initialize exercise-specific handlers
    initializeExerciseHandlers(type) {
        switch(type) {
            case 'arranging':
                this.initDragAndDrop();
                break;
            case 'fillBlank':
                this.initFillBlankHandlers();
                break;
        }
    }


    createProgressDots(total) {
        return Array(total).fill(0).map((_, index) => `
            <div class="dot ${index === this.currentLesson ? 'active' : ''}"></div>
        `).join('');
    }

    nextLesson() {
        fetch(`../Data/Json/courses/chinese/level${this.currentLevel}/vocabulary.json`)
            .then(response => response.json())
            .then(data => {
                // Check if there's a next lesson
                if (this.currentLesson < data.lessons.length - 1) {
                    this.currentLesson++;
                    this.displayVocabulary(data);
                } else {
                    // If we're at the last lesson, try to move to next level
                    if (this.currentLevel < 3) {
                        this.currentLevel++;
                        this.currentLesson = 0;
                        this.loadLevel(this.currentLevel);
                    } else {
                        alert('Congratulations! You have completed all lessons!');
                    }
                }
            })
            .catch(error => {
                console.error('Error loading lesson:', error);
                alert('Error loading the next lesson. Please try again.');
            });
    }
    loadExercise(level, exerciseIndex) {
    fetch(`../Data/Json/courses/chinese/level${level}/content.json`)
        .then(response => response.json())
        .then(data => {
            const exercise = data.exercises[exerciseIndex];
            this.displayExercise(exercise);
        });
    }
}

const courseDisplay = new CourseDisplay();