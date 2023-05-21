var timerSection = document.getElementById("timer");
var startSection = document.getElementById("start");
var questionSection = document.getElementById("question");
var endSection = document.getElementById("end");
var highScoreSection = document.getElementById("highScore");
var initialsForm = document.getElementById("inputScore");
var timer;
var countDown = 60;


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
    timerSection.style.display = "none";
    startSection.style.display = "none";
    questionSection.style.display = "none";
    endSection.style.display = "block";
    highScoreSection.style.display = "none";
}
function viewHighScore(){
    timerSection.style.display = "none";
    startSection.style.display = "none";
    questionSection.style.display = "none";
    endSection.style.display = "none";
    highScoreSection.style.display = "block";
}

function startGame(){
    viewQuestion();
    timerSection.innerHTML = "Time: " + countDown;
    timer = setTimeout(timerCountdown, 1000);
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
    viewEnd();
}

initialsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    viewHighScore();
});

function restart(){
    countDown = 60;
    viewStart();
}