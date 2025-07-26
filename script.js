const questions = [
  {
    question: "What does HTML stand for?",
    choices: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperloop Machine Language",
    ],
    answer: 0,
  },
  {
    question: "Which tag is used for JavaScript?",
    choices: ["<java>", "<script>", "<js>", "<code>"],
    answer: 1,
  },
  {
    question: "What does CSS do?",
    choices: [
      "Adds logic",
      "Styles web pages",
      "Manages database",
      "Handles forms",
    ],
    answer: 1,
  },
  {
    question: "Which one is a JavaScript framework?",
    choices: ["Laravel", "Django", "React", "Flask"],
    answer: 2,
  },
  {
    question: "What keyword creates a variable in JS?",
    choices: ["create", "int", "let", "define"],
    answer: 2,
  },
];

let current = 0,
  score = 0,
  timeLeft = 20,
  timer;
const $ = (id) => document.getElementById(id);

$("start-btn").onclick = () => {
  $("instructions").classList.remove("active");
  $("quiz").classList.add("active");
  loadQuestion();
};

$("next-btn").onclick = () => {
  clearInterval(timer);
  checkAnswer();
  showFeedback(() => nextQuestion());
};

$("restart-btn").onclick = () => location.reload();

$("theme-toggle").onclick = () => {
  document.body.classList.toggle("dark");
  $("theme-toggle").textContent = document.body.classList.contains("dark")
    ? "🌙 Dark Mode"
    : "🌞 Light Mode";
};

$("fullscreen-btn").onclick = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    $("fullscreen-btn").textContent = "✖ Exit Fullscreen";
  } else {
    document.exitFullscreen();
    $("fullscreen-btn").textContent = "⛶ Fullscreen";
  }
};

function loadQuestion() {
  timeLeft = 20;
  $("time-left").textContent = timeLeft;
  const q = questions[current];
  $("question-title").textContent = `${current + 1}. ${q.question}`;
  $("quiz-form").innerHTML = "";

  q.choices.forEach((choice, i) => {
    const label = document.createElement("label");
    label.style.display = "flex";
    label.style.alignItems = "center";
    label.style.gap = "10px";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "question";
    input.value = i;
    label.appendChild(input);
    label.append(` ${choice}`);
    $("quiz-form").appendChild(label);
  });

  startTimer();
  updateProgress();
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    $("time-left").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer();
      showFeedback(() => nextQuestion());
    }
  }, 1000);
}

function checkAnswer() {
  const selected = document.querySelector('input[name="question"]:checked');
  const userAnswer = selected ? parseInt(selected.value) : null;
  if (userAnswer !== null && userAnswer === questions[current].answer) {
    score++;
  }
}

function showFeedback(callback) {
  const q = questions[current];
  const correctIndex = q.answer;

  const labels = document.querySelectorAll("#quiz-form label");
  labels.forEach((label) => {
    const input = label.querySelector("input");
    const index = parseInt(input.value);

    if (index === correctIndex) {
      label.classList.add("correct");
    } else if (input.checked) {
      label.classList.add("incorrect");
    }
    input.disabled = true;
  });

  const correctDiv = document.createElement("div");
  correctDiv.className = "correct-answer-popup";
  correctDiv.innerHTML = `<p>✅ Correct answer: <strong>${q.choices[correctIndex]}</strong></p>`;
  $("quiz-form").appendChild(correctDiv);

  setTimeout(() => {
    correctDiv.remove();
    callback();
  }, 1500);
}

function nextQuestion() {
  current++;
  if (current < questions.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function updateProgress() {
  const percent = ((current + 1) / questions.length) * 100;
  $("progress-bar").style.width = `${percent}%`;
  $("progress-bar").textContent = `${current + 1} / ${questions.length}`;
}

function showResult() {
  $("quiz").classList.remove("active");
  $("result").classList.add("active");
  $("final-score").textContent = `You scored ${score} out of ${questions.length}`;

  $("celebration-overlay").style.display = "flex";
  $("celebration-overlay").textContent =
    score >= 4 ? "🎉 Congratulations!" : "👍 Better Luck Next Time!";
  setTimeout(() => $("celebration-overlay").style.display = "none", 3000);
}
