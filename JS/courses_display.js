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
            <button class="close-btn" onclick="courseDisplay.hideContent()">×</button>
            <div class="lesson-header">
                <h2>${lesson.title}</h2>
            </div>
            ${lesson.words.map(word => this.createVocabCard(word)).join('')}
            <button class="navigation-btn" onclick="courseDisplay.nextLesson()">→</button>
        `;
        this.contentArea.innerHTML = html;
    }

    createVocabCard(word) {
        return `
            <div class="vocab-card">
                <div class="hanzi">${word.hanzi}</div>
                <div class="pinyin">${word.pinyin}</div>
                <div class="english">${word.english}</div>
                <div class="example">${word.example}</div>
            </div>
        `;
    }

    nextLesson() {
        // Implement next lesson logic
        this.currentLesson++;
        this.loadLevel(this.currentLevel);
    }
}

const courseDisplay = new CourseDisplay();