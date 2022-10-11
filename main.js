// selectors
let spansCount = document.querySelector(".head .count span");
let bulletSpans = document.querySelector(".bullets .spans");
let questionsArea = document.querySelector(".questions_area");
let answersArea = document.querySelector(".answers_area");
let submitButton = document.querySelector(".submit-button");
let bulletsContainer = document.querySelector(".bullets");
let resultsDiv = document.querySelector(".results");
let countDownElement = document.querySelector(".count-down");

// variables
let index = 0;
let rightAnswer = 0;
let countDownInterval;

// get data from the api and show it on the page
function getQuestions(apiUrl) {
  let data = new XMLHttpRequest();

  data.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qNumb = questionsObject.length;

      createBullets(qNumb);

      addQuestionData(questionsObject[index], qNumb);
      countDown(20, qNumb);
      submitButton.addEventListener("click", () => {
        let idealAnswer = questionsObject[index].right_answer;
        clearInterval(countDownInterval);
        countDown(20, qNumb);
        checkAnswer(idealAnswer);
        index++;

        questionsArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsObject[index], qNumb);

        handleBullets();
        showResults(qNumb);
      });
    }
  };
  data.open("GET", apiUrl, true);
  data.send();
}
getQuestions("questions.json");

// Create bullets with the number of questions
function createBullets(num) {
  spansCount.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    bulletSpans.appendChild(theBullet);
    if (i === 0) {
      theBullet.className = "on";
    }
  }
}
// Add the question and the answers
function addQuestionData(obj, qCount) {
  if (index < qCount) {
    let createHElement = document.createElement("h2");
    let createQuestion = document.createTextNode(obj.title);

    createHElement.appendChild(createQuestion);
    questionsArea.appendChild(createHElement);
    for (let i = 1; i <= 4; i++) {
      let answerDiv = document.createElement("div");
      answerDiv.className = "answer";
      let answerInput = document.createElement("input");
      answerInput.type = "radio";
      answerInput.name = "questions";
      answerInput.id = `answer_${i}`;
      answerInput.dataset.answer = obj[`answer_${i}`];
      if (i === 1) {
        answerInput.checked = true;
      }
      let answerLabel = document.createElement("label");
      let answerText = document.createTextNode(obj[`answer_${i}`]);
      answerLabel.htmlFor = `answer_${i}`;
      answerLabel.appendChild(answerText);
      answerDiv.appendChild(answerInput);
      answerDiv.appendChild(answerLabel);
      answersArea.appendChild(answerDiv);
    }
  } else {
    console.log("Questions Finished");
  }
}

// check the answer if it is right or not
function checkAnswer(rAnswer, numOfQ) {
  let answers = document.getElementsByName("questions");
  let choosenAns;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      choosenAns = answers[i].dataset.answer;
    }
  }

  if (choosenAns === rAnswer) {
    rightAnswer++;
  }
}
// to show the number of question that is shown
function handleBullets() {
  let spanOfBullets = document.querySelectorAll(".bullets .spans span");
  spanOfBullets = Array.from(spanOfBullets);

  for (let i = 0; i < spanOfBullets.length; i++) {
    if (index === i) {
      spanOfBullets[i].className = "on";
    }
  }
}
function showResults(count) {
  let theResults;
  if (index === count) {
    questionsArea.remove();
    answersArea.remove();
    bulletsContainer.remove();
    submitButton.remove();
    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResults = `<span>Good :)</span> You Got ${rightAnswer} Out of ${count}`;
    } else if (rightAnswer === count) {
      theResults = `<span>Perfect :)</span> You Got ${rightAnswer} Out of ${count}`;
    } else {
      theResults = `<span>Sorry :(</span> You Got ${rightAnswer} Out of ${count}`;
    }
    resultsDiv.innerHTML = theResults;
    resultsDiv.style.padding = "20px";
    resultsDiv.style.backgroundColor = "#fff";
    resultsDiv.style.marginTop = "10px";
    resultsDiv.style.textAlign = "center";
  }
}
function countDown(duration, count) {
  if (index < count) {
    let minuts, seconds;
    countDownInterval = setInterval(() => {
      minuts = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minuts = minuts < 10 ? `0${minuts}` : minuts;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      countDownElement.innerHTML = `${minuts}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}
