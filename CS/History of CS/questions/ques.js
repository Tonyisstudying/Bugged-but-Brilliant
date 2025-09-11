// Check multiple choice questions all at once
function checkMultipleChoice() {
  const questions = document.querySelectorAll('#multiple-choice-group .question');
  
  questions.forEach(questionDiv => {
    const correctAnswer = questionDiv.getAttribute("data-answer").trim();
    const feedback = questionDiv.querySelector(".feedback");
    
    const radios = questionDiv.querySelectorAll('input[type="radio"]');
    let selected = null;
    radios.forEach((r) => {
      if (r.checked) selected = r.value;
    });

    if (!selected) {
      feedback.textContent = "Please select an answer.";
      feedback.style.color = "#ff6b6b";
      feedback.style.fontWeight = "bold";
    } else if (selected === correctAnswer) {
      feedback.textContent = "✓ Correct!";
      feedback.style.color = "#51cf66";
      feedback.style.fontWeight = "bold";
      // Add green background to the question
      questionDiv.style.backgroundColor = "#e6fffa";
      questionDiv.style.border = "2px solid #51cf66";
    } else {
      feedback.textContent = "✗ Wrong!";
      feedback.style.color = "#ff6b6b";
      feedback.style.fontWeight = "bold";
      // Add red background to the question
      questionDiv.style.backgroundColor = "#ffe0e0";
      questionDiv.style.border = "2px solid #ff6b6b";
    }
  });
}

// Check matching questions
function checkMatching() {
  const questions = document.querySelectorAll('#matching-group .question');
  
  questions.forEach(questionDiv => {
    const correctAnswer = questionDiv.getAttribute("data-answer").trim();
    const feedback = questionDiv.querySelector(".feedback");
    const input = questionDiv.querySelector('input[type="text"]');
    
    if (input) {
      let userAnswer = input.value.trim();

      if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
        feedback.textContent = "✓ Correct!";
        feedback.style.color = "#51cf66";
        feedback.style.fontWeight = "bold";
        questionDiv.style.backgroundColor = "#e6fffa";
        questionDiv.style.border = "2px solid #51cf66";
      } else {
        feedback.textContent = "✗ Wrong! Correct answer: " + correctAnswer;
        feedback.style.color = "#ff6b6b";
        feedback.style.fontWeight = "bold";
        questionDiv.style.backgroundColor = "#ffe0e0";
        questionDiv.style.border = "2px solid #ff6b6b";
      }
    }
  });
}

// Handle Enter key for fill-in-the-blank questions
function setupFillInBlanks() {
  const fillInInputs = document.querySelectorAll('#fill-in-group .answer-input');
  
  fillInInputs.forEach(input => {
    input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        checkFillInAnswer(this);
      }
    });
  });
}

// Check individual fill-in-the-blank answer
function checkFillInAnswer(input) {
  const questionDiv = input.closest('.question');
  const correctAnswer = questionDiv.getAttribute("data-answer").trim();
  const feedback = questionDiv.querySelector(".feedback");
  
  let userAnswer = input.value.trim();

  if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
    feedback.textContent = "✓ Correct!";
    feedback.style.color = "#51cf66";
    feedback.style.fontWeight = "bold";
    questionDiv.style.backgroundColor = "#e6fffa";
    questionDiv.style.border = "2px solid #51cf66";
    input.style.backgroundColor = "#e6fffa";
    input.style.borderColor = "#51cf66";
  } else {
    feedback.textContent = "✗ Wrong! Correct answer: " + correctAnswer;
    feedback.style.color = "#ff6b6b";
    feedback.style.fontWeight = "bold";
    questionDiv.style.backgroundColor = "#ffe0e0";
    questionDiv.style.border = "2px solid #ff6b6b";
    input.style.backgroundColor = "#ffe0e0";
    input.style.borderColor = "#ff6b6b";
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
  setupFillInBlanks();
});

function checkAnswer(button) {
  const questionDiv = button.closest(".question");
  const correctAnswer = questionDiv.getAttribute("data-answer").trim();
  const feedback = questionDiv.querySelector(".feedback");

  const radios = questionDiv.querySelectorAll('input[type="radio"]');
  if (radios.length > 0) {
    let selected = null;
    radios.forEach((r) => {
      if (r.checked) selected = r.value;
    });

    if (!selected) {
      feedback.textContent = "Please select an answer.";
      feedback.style.color = "red";
    } else if (selected === correctAnswer) {
      feedback.textContent = "Correct!";
      feedback.style.color = "green";
    } else {
      feedback.textContent = "Wrong!";
      feedback.style.color = "red";
    }
    return;
  }

  // Nếu là câu nhập text (Fill in blank, Matching, Translating)
  const input = questionDiv.querySelector('input[type="text"]');
  if (input) {
    let userAnswer = input.value.trim();

    // Cho phép ignore phân biệt hoa thường
    if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
      feedback.textContent = "Correct!";
      feedback.style.color = "green";
    } else {
      feedback.textContent = "Wrong! Correct answer: " + correctAnswer;
      feedback.style.color = "red";
    }
  }
}
