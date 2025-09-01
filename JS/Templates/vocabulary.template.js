export default class VocabularyTemplate {
    render(data) {
        const { hanzi, pinyin, translation, example, progress } = data;
        
        return `
            <div class="course-header">
                <h1>Chinese</h1>
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
                
                <div class="vocab-row">
                    <div class="vocab-cell">${data.hanzi}</div>
                    <div class="vocab-cell">${data.pinyin}</div>
                    <div class="vocab-cell">${data.translation}</div>
                    <div class="vocab-cell">${data.example}</div>
                </div>
            </div>

            <div class="navigation">
                <div class="progress-dots">
                    ${this.generateProgressDots(progress)}
                </div>
                <button class="next-btn">→</button>
            </div>
        `;
    }

    generateProgressDots(progress) {
        return Array(progress.total)
            .fill()
            .map((_, index) => `
                <span class="dot${index < progress.current ? ' active' : ''}"></span>
            `).join('');
    }
}