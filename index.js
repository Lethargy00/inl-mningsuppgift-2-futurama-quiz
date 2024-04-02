const btnStartQuiz = document.getElementById("startButton");
const questionsSection = document.getElementById("questionsSection");
const resultSection = document.getElementById("resultSection");
const question = document.getElementById("questionText");
const alt1 = document.getElementById("alt1");
const alt2 = document.getElementById("alt2");
const alt3 = document.getElementById("alt3");
const alt4 = document.getElementById("alt4");
const inpAlt1 = document.getElementById("firstInput");
const inpAlt2 = document.getElementById("secondInput");
const inpAlt3 = document.getElementById("thirdInput");
const inpAlt4 = document.getElementById("fourthInput");
const btnAnswer = document.getElementById("btn-answer");
const currentScore = document.getElementById("currentScore");

const btnResetQuiz = document.getElementById("restartButton");

const spanNumberOfQuestionsAnswered = document.getElementById("numberOfQuestionsAnswered");
const spanNumberOfCorrectAnswers = document.getElementById("numberOfCorrectAnswers");

let allFuturamaQuestions = [];
let randomizedFuturamaQuestions = [];
let answers = [];

(async function fetchFuturamaQuestions() {
  const response = await fetch("https://api.sampleapis.com/futurama/questions");
  const data = await response.json();

  if (response.ok) {
    futuramaQuestions = data;
    console.log(data);
  } else {
    console.log("Error fetching data");
  }
})();

// Function that creates an array of 10 unique random numbers between 0 and the lengt of the futuramaQuestions array
function generateRandomNumbers() {
  let randomNumbers = [];
  while (randomNumbers.length < 10) {
    let randomNumber = Math.floor(Math.random() * 28);
    if (!randomNumbers.includes(randomNumber)) {
      randomNumbers.push(randomNumber);
    }
  }
  return randomNumbers.sort((a, b) => a - b);
}

function startNewQuiz() {
  if (randomizedFuturamaQuestions.length === 0) {
    // Generate ten radom questions
    const randomNumbers = generateRandomNumbers();
    randomizedFuturamaQuestions = randomNumbers.map(number => futuramaQuestions[number]);
    populateQuestion(0);

    // Hide elements
    btnStartQuiz.classList.add("hidden");

    // Show elements
    // questionsSection.classList.remove("hidden"); TODO: IMPLEMENT THIS
    // resultSection.classList.remove("hidden"); TODO: IMPLEMENT THIS
  }
}

function populateQuestion(questionNumber) {
  console.log(randomizedFuturamaQuestions[questionNumber]);
  var quest = randomizedFuturamaQuestions[questionNumber].question;
  question.textContent = quest;

  // set the text of span elements to the answers
  alt1.textContent = randomizedFuturamaQuestions[questionNumber].possibleAnswers[0];
  alt2.textContent = randomizedFuturamaQuestions[questionNumber].possibleAnswers[1];
  alt3.textContent = randomizedFuturamaQuestions[questionNumber].possibleAnswers[2];
  alt4.textContent = randomizedFuturamaQuestions[questionNumber].possibleAnswers[3];

  // update current score
  updateScore();
}

function checkAnswer(questionNumber) {
  const correctAnswer = randomizedFuturamaQuestions[questionNumber].correctAnswer;
  console.log(correctAnswer);
  let userAnswer = document.querySelector(
    `label[for="${document.querySelector("input[name='answer']:checked").id}"]`
  ).textContent;
  console.log(userAnswer);

  if (correctAnswer === userAnswer) {
    console.log("Correct answer");
    answers.push(true);
  } else {
    console.log("Wrong answer");
    answers.push(false);
  }

  spanNumberOfQuestionsAnswered.textContent = answers.length;
  spanNumberOfCorrectAnswers.textContent = answers.filter(answer => answer === true).length;

  console.log(answers);
  if (answers.length < 10) {
    // Clear the checked radio button
    const radiobuttons = document.getElementsByName("answer");
    for (var i = 0; i < radiobuttons.length; i++) {
      radiobuttons[i].checked = false;
    }

    // Populate the next question
    populateQuestion(answers.length);
  } else {
    console.log("Quiz is over");
    btnResetQuiz.classList.remove("hidden");
    btnAnswer.classList.add("hidden");
    console.log(answers);
  }
}

function updateScore() {
  console.log("update score");

  var html = "";

  for (var i = 0; i < answers.length; i++) {
    if (answers[i] === true) {
      html += `
      <div class="scoreDiv">
        <div class='resultDiv'>
          <i class='fa-solid fa-check' style='color: greenyellow'></i>
        </div>
        <p style="color:darkslategrey">${i + 1}</p>
      </div>
      `;
    } else {
      html += `
      <div class="scoreDiv">
        <div class="resultDiv">
          <i class="fa-solid fa-xmark" style="color: lightcoral"></i>
        </div>
        <p style="color:darkslategrey">${i + 1}</p>
      </div>
      `;
    }
  }

  html += `
  <div class="scoreDiv">
    <div class='resultDiv activeQuestion'>
      <i class="fa-solid fa-question"></i>
    </div>
    <p>${answers.length + 1}</p>
  </div>
  `;

  for (var i = answers.length + 1; i < 10; i++) {
    html += `
    <div class="scoreDiv">
      <div class='resultDiv'>
        <i class="fa-solid fa-question" style="color:darkslategrey"></i>
      </div>
      <p style="color:darkslategrey">${i + 1}</p>
    </div>
    `;
  }

  currentScore.innerHTML = html;
}

function resetQuiz() {
  answers = [];
  randomizedFuturamaQuestions = [];
  spanNumberOfQuestionsAnswered.textContent = 0;
  spanNumberOfCorrectAnswers.textContent = 0;
  btnStartQuiz.classList.remove("hidden");
  questionsSection.classList.add("hidden");
  resultSection.classList.add("hidden");
}

btnStartQuiz.addEventListener("click", startNewQuiz);

btnAnswer.addEventListener("click", function (e) {
  e.preventDefault();
  checkAnswer(answers.length);
});

btnResetQuiz.addEventListener("click", resetQuiz);
