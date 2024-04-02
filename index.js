const btnStartQuiz = document.getElementById("btn-start-quiz");
const questionsSection = document.getElementById("questionsSection");
const resultSection = document.getElementById("resultSection");
const question = document.getElementById("question");
const alt1 = document.getElementById("alt1");
const alt2 = document.getElementById("alt2");
const alt3 = document.getElementById("alt3");
const alt4 = document.getElementById("alt4");
const inpAlt1 = document.getElementById("inp-alt1");
const inpAlt2 = document.getElementById("inp-alt2");
const inpAlt3 = document.getElementById("inp-alt3");
const inpAlt4 = document.getElementById("inp-alt4");
const btnAnswer = document.getElementById("btn-answer");
const btnResetQuiz = document.getElementById("btn-reset");

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
    questionsSection.classList.remove("hidden");
    resultSection.classList.remove("hidden");
  }
}
