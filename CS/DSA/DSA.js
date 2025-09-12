// Show Content Sections
function showContent(contentType) {
    document.querySelector('.choice-section').style.display = 'none';
    document.querySelectorAll('.content-section').forEach(section => { section.style.display = 'none'; });
    document.getElementById(contentType + '-content').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Back to Main Choice
function showChoiceSection() {
    document.querySelectorAll('.content-section').forEach(section => { section.style.display = 'none'; });
    document.querySelectorAll('.detail-content').forEach(detail => { detail.style.display = 'none'; });
    document.querySelector('.choice-section').style.display = 'block';
    document.querySelector('.choice-section').scrollIntoView({ behavior: 'smooth' });
}

// Toggle Detail Sections
function toggleDetail(detailId) {
    document.querySelectorAll('.detail-content').forEach(detail => {
        if (detail.id !== detailId) detail.style.display = 'none';
    });
    const detailContent = document.getElementById(detailId);
    detailContent.style.display = (detailContent.style.display === 'block') ? 'none' : 'block';
    if(detailContent.style.display === 'block'){
        detailContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Quiz Data
const questions = [
    {question:"Which data structure uses LIFO principle?", options:["Queue","Stack","Array","Graph"], answer:"Stack"},
    {question:"Which of the following is a non-linear data structure?", options:["Array","Linked List","Tree","Stack"], answer:"Tree"},
    {question:"What is the time complexity of searching in a balanced BST?", options:["O(1)","O(log n)","O(n)","O(n log n)"], answer:"O(log n"},
    {question:"Which data structure is used in BFS algorithm?", options:["Stack","Queue","Heap","Tree"], answer:"Queue"},
    {question:"Which of these is a hashing data structure?", options:["Array","Hash Table","Linked List","Queue"], answer:"Hash Table"},
    {question:"Which algorithm is used to find shortest paths in weighted graphs?", options:["DFS","BFS","Dijkstra","Heap Sort"], answer:"Dijkstra"},
    {question:"Which of the following is a stable sorting algorithm?", options:["Quick Sort","Merge Sort","Heap Sort","Selection Sort"], answer:"Merge Sort"},
    {question:"Which data structure is used to implement recursion?", options:["Queue","Stack","Array","Graph"], answer:"Stack"},
    {question:"Which of these is a self-balancing BST?", options:["Binary Tree","AVL Tree","Heap","Trie"], answer:"AVL Tree"},
    {question:"Which of the following is NOT a type of linked list?", options:["Singly","Doubly","Circular","Heap"], answer:"Heap"}
];

let currentQuestionIndex = 0;

// Start Quiz
function startExercise() {
    document.querySelector('.choice-section').style.display = 'none';
    document.getElementById('exercise-content').style.display = 'block';
    currentQuestionIndex = 0;
    showQuestion();
}

// Show Each Question
function showQuestion() {
    const container = document.getElementById('exercise-content');
    container.innerHTML = "";

    if (currentQuestionIndex >= questions.length) {
        container.innerHTML = `<h2>Quiz Completed!</h2>
                               <p>You've answered all questions.</p>
                               <button class="back-btn" onclick="showChoiceSection()">Back to Selection</button>`;
        return;
    }

    const q = questions[currentQuestionIndex];
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('quiz-question');
    questionDiv.innerHTML = `<h3>Q${currentQuestionIndex + 1}: ${q.question}</h3>`;

    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('quiz-options');

    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option);
        optionsDiv.appendChild(btn);
    });

    container.appendChild(questionDiv);
    container.appendChild(optionsDiv);
}

// Check Answer
function checkAnswer(selectedOption) {
    const q = questions[currentQuestionIndex];
    const container = document.getElementById('exercise-content');
    const message = document.createElement('div');
    message.classList.add('result-message');

    if (selectedOption === q.answer) {
        message.innerText = "✅ Correct!";
        message.style.color = "#00ff00";
    } else {
        message.innerText = `❌ Wrong! Correct answer: ${q.answer}`;
        message.style.color = "#ff0000";
    }

    container.appendChild(message);
    currentQuestionIndex++;
    setTimeout(showQuestion, 1000);
}
