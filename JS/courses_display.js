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

    displayVocabulary(data) {
        const lesson = data.lessons[this.currentLesson];
        const html = `
            <div class="course-header">
                <div class="course-title">Chinese</div>
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
}

const courseDisplay = new CourseDisplay();