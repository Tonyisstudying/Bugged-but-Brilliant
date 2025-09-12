const answers = {
  q1: "b",
  q2: "c",
  q3: "c",
  q4: "b",
  q5: "c",
  q6: "a",
  q7: "c",
  q8: "b",
  q9: "b",
  q10: "c"
};

document.getElementById("submit-btn").addEventListener("click", () => {
  let score = 0;
  Object.keys(answers).forEach(q => {
    const selected = document.querySelector(`input[name="${q}"]:checked`);
    const labels = document.querySelectorAll(`input[name="${q}"] + label`);
    labels.forEach(l => l.classList.remove("correct", "wrong"));
    if (selected) {
      if (selected.value === answers[q]) {
        score++;
        selected.nextElementSibling.classList.add("correct");
      } else {
        selected.nextElementSibling.classList.add("wrong");
        document.querySelector(`input[name="${q}"][value="${answers[q]}"] + label`).classList.add("correct");
      }
    }
  });
  document.getElementById("result").innerText = `You scored ${score} / 10 🎉`;
});