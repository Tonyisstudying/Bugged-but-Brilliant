export default class VocabularyTemplate {
    render(words) {
        return `
            <div class="course-header">
                <div class="section-title">Vocabulary</div>
                <button class="close-btn">X</button>
            </div>
            
            <div class="vocab-content">
                <div class="vocab-headers">
                    <div class="header">Hanzi</div>
                    <div class="header">Transcription</div>
                    <div class="header">Translation</div>
                    <div class="header">Examples</div>
                </div>
                ${this.generateWordList(words)}
            </div>

            <div class="navigation">
                <div class="progress-indicator">
                    ${words.length} words loaded
                </div>
                <button class="next-btn">
                    <span class="material-symbols-outlined">arrow_right_alt</span>
                </button>
            </div>
        `;  
    }

    generateWordList(words) {
        return words.map(word => `
            <div class="vocab-row">
                <div class="vocab-cell">${word.hanzi}</div>
                <div class="vocab-cell">${word.pinyin}</div>
                <div class="vocab-cell">${word.translation}</div>
                <div class="vocab-cell">${word.example}</div>
            </div>
        `).join('');
    }

    generateProgressDots(progress) {
        return Array(progress.total)
            .fill()
            .map((_, index) => `
                <span class="dot${index < progress.current ? ' active' : ''}"></span>
            `).join('');
    }
}