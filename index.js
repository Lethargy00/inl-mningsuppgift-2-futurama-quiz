const btnStartQuiz = document.getElementById("startButton");
const questionsSection = document.getElementById("questionsSection");
const resultSection = document.getElementById("resultSection");
const highScoreSection = document.getElementById("scores");
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
const errorMessage = document.getElementById("errorMessage");

const spanNumberOfQuestionsAnswered = document.getElementById("numberOfQuestionsAnswered");
const spanNumberOfCorrectAnswers = document.getElementById("numberOfCorrectAnswers");

const totalQuestionsAnswered = document.getElementById("totalQuestionsAnswered");
const totalCorrectAnswers = document.getElementById("totalCorrectAnswers");
const totalWrongAnswers = document.getElementById("totalWrongAnswers");
const btnClearTotalScore = document.getElementById("clearTotalScore");

let allFuturamaQuestions = [];
let randomizedFuturamaQuestions = [];
let answers = [];
let results = JSON.parse(localStorage.getItem("results")) || [];

let fetchSuccess = false;

(async function fetchFuturamaQuestions() {
  try {
    const response = await fetch("https://da-demo.github.io/api/futurama/questions");
    fetchSuccess = true;
    const data = await response.json();
    allFuturamaQuestions = data;
  } catch (error) {
    console.log(error);
    fetchSuccess = false;
    hideElement(btnStartQuiz);
    showElement(errorMessage);
  } finally {
    // TODO: Hide loading spinner
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
  if (randomizedFuturamaQuestions.length === 0 && fetchSuccess) {
    // Generate ten radom questions
    const randomNumbers = generateRandomNumbers();
    randomizedFuturamaQuestions = randomNumbers.map(number => allFuturamaQuestions[number]);
    populateQuestion(0);

    // Hide elements
    hideElement(btnStartQuiz);
    hideElement(highScoreSection);

    // Show elements
    showElement(questionsSection);
  } else {
    console.log("Error fetching data");
  }
}

function showElement(element) {
  element.classList.remove("hidden");
}

function hideElement(element) {
  element.classList.add("hidden");
}

function populateQuestion(questionNumber) {
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

// function to update score table
function updateScoreTable() {
  // Get the table body
  let tableBody = document.querySelector("#scoreTable tbody");

  // Clear the table body
  tableBody.innerHTML = "";

  // For each result in the results array
  for (let i = 0; i < results.length; i++) {
    // Create a new row and cells
    let row = document.createElement("tr");
    let nrCell = document.createElement("td");
    let scoreCell = document.createElement("td");
    let dateCell = document.createElement("td");

    // Set the cell values
    nrCell.textContent = i + 1;
    scoreCell.textContent = results[i].Score + "/10";
    let date = new Date(results[i].Date); // Convert the date string back to a Date object
    dateCell.textContent = date.toISOString().split("T")[0]; // Format the date as YYYY-MM-DD

    // Add the cells to the row
    row.appendChild(nrCell);
    row.appendChild(scoreCell);
    row.appendChild(dateCell);

    // Add the row to the table body
    tableBody.appendChild(row);
  }
}

updateScoreTable();

function checkAnswer(questionNumber) {
  const correctAnswer = randomizedFuturamaQuestions[questionNumber].correctAnswer;
  let userAnswer = document.querySelector(
    `label[for="${document.querySelector("input[name='answer']:checked").id}"]`
  ).textContent;

  if (correctAnswer === userAnswer) {
    answers.push(true);
    updateTotalScore(true);
  } else {
    answers.push(false);
    updateTotalScore(false);
  }

  if (answers.length < 10) {
    // Clear the checked radio button TODO: IMPLEMENT THIS?!

    // const radiobuttons = document.getElementsByName("answer");
    // for (var i = 0; i < radiobuttons.length; i++) {
    //   radiobuttons[i].checked = false;
    // }

    // Populate the next question
    populateQuestion(answers.length);
  } else {
    hideElement(questionsSection);
    showElement(highScoreSection);
    showElement(resultSection);
    var html = "";

    html += `<div id="finalResultDiv">`;

    // Count the number of correct answers
    let correctAnswers = answers.filter(answer => answer === true).length;

    //Create a new result object
    let result = {
      Score: correctAnswers,
      Date: new Date(),
    };

    //Push the result object into the results array
    results.push(result);

    // Save the results to local storage
    localStorage.setItem("results", JSON.stringify(results));

    // Update the score table
    updateScoreTable();

    // Create a heading "Final Score"
    html += `<h1 style="font-size:3em">Final Score</h1>`;

    // Create paragraph with number of correct answers / total number of questions
    html += `<p id="finalScore">${correctAnswers}  / 10</p>`;

    // Create paragraph with message depending on the number of correct answers
    if (correctAnswers >= 8) {
      html += `<p id="finalScoreMessage">Wow! You are a true Futurama fan!</p>`;
    } else if (correctAnswers >= 4) {
      html += `<p id="finalScoreMessage">Not too bad! But there is room for improvement!</p>`;
    } else {
      html += `<p id="finalScoreMessage">You suck at this! Better luck next time! :)</p>`;
    }

    // Create a link that reloads the page
    html += `<a id="tryAgainLink" href="#" onclick="location.reload()">Try again!</a>`;

    html += `</div>`;

    resultSection.innerHTML = html;
  }
}

function updateScore() {
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

function updateTotalScore(isCorrect) {
  var currentCorrectTotal = localStorage.getItem("correctTotal");
  var currentWrongTotal = localStorage.getItem("wrongTotal");

  if (currentCorrectTotal === null) {
    currentCorrectTotal = 0;
    localStorage.setItem("correctTotal", currentCorrectTotal);
  }

  if (currentWrongTotal === null) {
    currentWrongTotal = 0;
    localStorage.setItem("wrongTotal", currentWrongTotal);
  }

  if (isCorrect === undefined) {
    totalQuestionsAnswered.textContent = Number(currentCorrectTotal) + Number(currentWrongTotal);
    totalCorrectAnswers.textContent = currentCorrectTotal;
    totalWrongAnswers.textContent = currentWrongTotal;
    return;
  }

  if (isCorrect) {
    currentCorrectTotal++;
    localStorage.setItem("correctTotal", currentCorrectTotal);
  } else {
    currentWrongTotal++;
    localStorage.setItem("wrongTotal", currentWrongTotal);
  }
  totalQuestionsAnswered.textContent = Number(currentCorrectTotal) + Number(currentWrongTotal);
  totalCorrectAnswers.textContent = currentCorrectTotal;
  totalWrongAnswers.textContent = currentWrongTotal;
}

updateTotalScore();

function clearTotalScore() {
  localStorage.setItem("correctTotal", 0);
  localStorage.setItem("wrongTotal", 0);
  totalQuestionsAnswered.textContent = 0;
  totalCorrectAnswers.textContent = 0;
  totalWrongAnswers.textContent = 0;
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

document.getElementById("clearResults").addEventListener("click", function () {
  // Remove results from local storage
  localStorage.removeItem('results');
  // clear the results array
  results = [];

  // Clear the table
  let tableBody = document.querySelector("#scoreTable tbody");

  // Remove all child (data rows from the table)
  while (tableBody.firstChild) {
    tableBody.removeChild(tableBody.firstChild);
  }
});

btnStartQuiz.addEventListener("click", startNewQuiz);

btnAnswer.addEventListener("click", function (e) {
  e.preventDefault();
  checkAnswer(answers.length);
});

btnClearTotalScore.addEventListener("click", clearTotalScore);
