//handling the logic for vocab page and importing logic from vocabulary.template.js
import VocabularyTemplate from '../Templates/vocabulary.template.js';

export default class VocabularyExercise {
    constructor() {
        this.words = [];
        this.template = new VocabularyTemplate();
        this.currentLevel = 1;
        this.currentStage = 1;
    }

    async display(level = 1, stage = 1) {
        this.currentLevel = level;
        this.currentStage = stage;
        try {
            await this.loadData(level, stage);
            this.displayWords();
        } catch (error) {
            console.error('Error displaying vocabulary:', error);
            this.showError('Failed to display vocabulary');
        }
    }

    async loadData(level, stage) {
        try {
            const response = await fetch(`../../../Json/courses/chinese/level${level}/stages/stage${stage}/vocab.json`);
            if (!response.ok) throw new Error('Failed to load vocabulary data');
            const data = await response.json();
            this.words = data.words;
        } catch (error) {
            console.error('Error loading vocabulary:', error);
            this.words = [];
            throw error; //re-throw to hanle ni display
        }
    }

    displayWords() {
        if (!this.words.length) return;
        
        const content = document.getElementById('lesson-content');
        if (!content) return;
        const html = this.template.render(this.words);
        content.innerHTML = html;
        this.attachEventListeners();
    }

    attachEventListeners() {
        const nextBtn = document.querySelector('.next-btn');
        const closeBtn = document.querySelector('.close-btn');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextExercise());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    }

    nextExercise() {
        // Move to multiple choice exercise via CourseDisplay
        if (window.courseDisplay) {
            window.courseDisplay.nextExercise();
        } else {
            console.error('CourseDisplay not available');
        }
    }

    close() {
        const content = document.getElementById('lesson-content');
        content.classList.add('hidden');
        document.querySelector('.course-title').classList.remove('minimized');
    }

    complete() {
        // Handle completion - can be customized based on needs
        console.log('Vocabulary section completed');
    }

    showError(message) {
        const content = document.getElementById('lesson-content');
        if (content) {
            content.innerHTML = `<div style="color: red; padding: 20px;">${message}</div>`;
            content.classList.remove('hidden');
        }
    }
}