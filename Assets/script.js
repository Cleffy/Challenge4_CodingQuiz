var timerSection = document.getElementById("timer");
var startSection = document.getElementById("start");
var questionSection = document.getElementById("question");
var endSection = document.getElementById("end");
var highScoreSection = document.getElementById("highScore");
var initialsForm = document.getElementById("inputScore");
var timer;
var countDown = 60;
var score = 0;
var answer = 1;
var questionNum = 0;

class userScore{
    constructor(initials, score){
        this.initials = initials;
        this.score = score;
    }
}

var question1 = {
    body: "What symbol comments a single line in JavaScript?",
    answer: "//",
    options: ["*", "!-", "::"],
}

function viewStart(){
    timerSection.style.display = "none";
    startSection.style.display = "block";
    questionSection.style.display = "none";
    endSection.style.display = "none";
    highScoreSection.style.display = "none";
}
function viewQuestion(){
    timerSection.style.display = "block";
    startSection.style.display = "none";
    questionSection.style.display = "block";
    endSection.style.display = "none";
    highScoreSection.style.display = "none";
}
function viewEnd(){
    clearTimeout(timer);
    document.getElementById("score").innerHTML = "Your Final Score is: " + score;
    timerSection.style.display = "none";
    startSection.style.display = "none";
    questionSection.style.display = "none";
    endSection.style.display = "block";
    highScoreSection.style.display = "none";
}
function viewHighScore(){
    printHighScores();
    timerSection.style.display = "none";
    startSection.style.display = "none";
    questionSection.style.display = "none";
    endSection.style.display = "none";
    highScoreSection.style.display = "block";
}

function startGame(){
    viewQuestion();
    generateQuestion();
    timerSection.innerHTML = "Time: " + countDown;
    timer = setTimeout(timerCountdown, 1000);
}
function generateQuestion(){
    var optionIndex = 2;
    answer = Math.floor(Math.random() * 4 + 1);
    document.getElementById("questionInfo").innerHTML = question1.body;
    document.getElementById("selection" + answer).innerHTML = question1.answer;
    for(let i = 1; i < 5; i++){
        if(i != answer){
            document.getElementById("selection" + i).innerHTML = question1.options[optionIndex];
            optionIndex--;
        }
    }
}

function timerCountdown(){
    countDown--;
    timerSection.innerHTML = "Time: " + countDown;
    if(countDown < 0){
        viewEnd();
        return;
    }
    timer = setTimeout(timerCountdown, 1000);
}
function submitAnswer(selection){
    if(selection == answer){
        score += 10;
        document.getElementById("answer").innerHTML = "Correct!";
    }
    else{
        document.getElementById("answer").innerHTML = "Wrong.";
    }
    document.getElementById("answer").style.display = "block";
    viewEnd();
}

initialsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    var newScore = new userScore(document.getElementById("initials").value, score);
    console.log(newScore.initials, newScore.score);
    submitScore(newScore);
    viewHighScore();
});

function submitScore(incomingScore){
    var previousScores = getPreviousScores();
    var revisedScores = [];
    var index = 0;
    var scoreInserted = false;
    if(previousScores.length < 1){
        revisedScores.push(incomingScore);
    }
    else{
        while(index < previousScores.length){
            if(incomingScore.score > previousScores[index].score){
                revisedScores.push(incomingScore);
                scoreInserted = true;
                index++
                break;
            }
            else{
                revisedScores.push(previousScores[index]);
                index++;
            }
        }
        while(index < previousScores.length + 1){
            if(scoreInserted){
                revisedScores.push(previousScores[index - 1]);
                index++;
            }
            else{
                revisedScores.push(incomingScore);
                scoreInserted = true;
                index++;
            }
        }
    }
    setNewScores(revisedScores);
}

function getPreviousScores(){
    var previousScores = JSON.parse(localStorage.getItem("highScores"));
    if(previousScores == null){
        previousScores = [];
    }
    else{
        clearScores();
    }
    return previousScores;
}

function setNewScores(newScores){
    localStorage.setItem("highScores", JSON.stringify(newScores));
}

function clearScores(){
    localStorage.removeItem("highScores");
    printHighScores();
}

function printHighScores(){
    var currentScores = getPreviousScores();
    setNewScores(currentScores);
    document.getElementById("highScoreList").innerHTML = "";
    for(record of currentScores){
        var newLine = document.createElement("p");
        newLine.textContent = record.initials + " | " + record.score;
        document.getElementById("highScoreList").appendChild(newLine);
        console.log("I got here");
    }
}

function restart(){
    countDown = 60;
    score = 0;
    document.getElementById("answer").style.display = "none";
    viewStart();
}