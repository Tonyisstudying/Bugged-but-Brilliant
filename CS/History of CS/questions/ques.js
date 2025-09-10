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
