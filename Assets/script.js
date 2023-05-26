/*
Variables to keep track of quiz state, and frequently queried elements.
 */
var timerSection = document.getElementById("timer");
var startSection = document.getElementById("start");
var questionSection = document.getElementById("question");
var endSection = document.getElementById("end");
var highScoreSection = document.getElementById("highScore");
var initialsForm = document.getElementById("inputScore");
var userInitials = document.getElementById("initials")
var answerElement = document.getElementById("answer");
var resultElement = document.getElementById("result");
var highScoreList = document.getElementById("highScoreList");
var timer;                                                      //Timer to keep track of seconds.
var timerAnswer;                                                //Timer to pause question after an answer.
var countDown = 60;                                             //Track time remaining
var score = 0;                                                  //Track score
var answer = 1;                                                 //Track which option is correct
var questionNum = 0;                                            //Track question number

/* Score container */
class userScore{
    constructor(initials, score){
        this.initials = initials;
        this.score = score;
    }
}
/* Question container */
class question{
    constructor(question, answer, options){
        this.question = question;
        this.answer = answer;
        this.options = options;
    }
}

/* An array of 10 questions */
var questions = [];
questions.push(new question("What symbol comments a single line in JavaScript?", "//", ["*", "!-", "::"]));
questions.push(new question("What method adds a new element to an array?", ".push", [".pop", ".length", ".remove"]));
questions.push(new question("A while loop continues until it's condition is _____ .", "false", ["true", "met", "treated"]));
questions.push(new question("In JavaScript, what variable type is an array?", "object", ["number", "boolean", "symbol"]));
questions.push(new question("What command selects an HTML element by ID?", "document.getElementByID([name])", ["document.ID([name])", "document.selectID([name])", "HTML.selectID([name])"]));
questions.push(new question("Fill in the blank: for(var insideObject __ objects)", "of", ["in", "with", "inside"]));
questions.push(new question("What code skips the default execution of a form submit event?", "event.preventDefault()", ["event.skipDefault()", "event.skipSubmit()", "event.noSubmit()"]));
questions.push(new question("In JavaScript a NaN is ___ .", "not a number", ["null", "name a number", "not a navigator"]));
questions.push(new question("Console.log outputs text to ___ .", "the console in dev tools", ["the active HTML element", "an alert box", "a connected gaming console"]));
questions.push(new question("The switch operator ___ .", "evaluates if a case is true", ["switches two variables", "inverts a booelean", "routes a call to a receiver"]));

//Initial state
function viewStart(){
    timerSection.style.display = "none";
    startSection.style.display = "block";
    questionSection.style.display = "none";
    endSection.style.display = "none";
    highScoreSection.style.display = "none";
}
//Question state
function viewQuestion(){
    timerSection.style.display = "block";
    startSection.style.display = "none";
    questionSection.style.display = "block";
    endSection.style.display = "none";
    highScoreSection.style.display = "none";
}
//End of quiz state
function viewEnd(){
    clearTimeout(timer);
    document.getElementById("score").innerHTML = "Your Final Score is: " + score;
    timerSection.style.display = "none";
    startSection.style.display = "none";
    questionSection.style.display = "none";
    endSection.style.display = "block";
    highScoreSection.style.display = "none";
}
//High score state
function viewHighScore(){
    printHighScores();
    timerSection.style.display = "none";
    startSection.style.display = "none";
    questionSection.style.display = "none";
    endSection.style.display = "none";
    highScoreSection.style.display = "block";
}

/*
Initializes the quiz.
Generates the text areas for a question.
Displays the question state.
Starts the countdown timer.
*/
function startGame(){
    viewQuestion();
    generateQuestion(questionNum);
    timerSection.innerHTML = "Time: " + countDown;
    timer = setTimeout(timerCountdown, 1000);
}
/*
Parse a question object into the fields within the Question state.
*/
function generateQuestion(index){
    var optionIndex = 2;
    answer = Math.floor(Math.random() * 4 + 1);
    document.getElementById("questionNum").innerHTML = "Question " + (index + 1);
    document.getElementById("questionInfo").innerHTML = questions[index].question;
    document.getElementById("selection" + answer).innerHTML = questions[index].answer;
    for(let i = 1; i < 5; i++){
        if(i != answer){
            document.getElementById("selection" + i).innerHTML = questions[index].options[optionIndex];
            optionIndex--;
        }
    }
}
/*
    Event occurs when a second has passed during the quiz.
*/
function timerCountdown(){
    countDown--;
    timerSection.style.color = "black";
    timerSection.innerHTML = "Time: " + countDown;
    if(countDown < 0){
        viewEnd();
        return;
    }
    timer = setTimeout(timerCountdown, 1000);
}
/*
    Selects the next state after answering a question.
*/
function answerCountdown(){
    answerElement.style.display = "none";
    if(questionNum < questions.length){
        generateQuestion(questionNum);
    }
    else{
        viewEnd();
    }
}
/*
    Checks to see if an answer is right.
    Waits 1 second after answering before proceeding.
*/
function submitAnswer(selection){
    if(selection == answer){
        score += 10;
        countDown += 2;
        timerSection.style.color = "green";
        resultElement.innerHTML = "Correct!";
    }
    else{
        timerSection.style.color = "red";
        resultElement.innerHTML = "Wrong.";
        countDown -= 5;
    }
    answerElement.style.display = "block";
    questionNum++;
    timerAnswer = setTimeout(answerCountdown, 1000);
}

/*
    Takes form input for a user's initials.
*/
initialsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    var newScore = new userScore(userInitials.value, score);
    submitScore(newScore);
    viewHighScore();
});

/*
    Adds a score to the saved scores.
*/
function submitScore(incomingScore){
    var previousScores = getPreviousScores();
    var revisedScores = [];
    var index = 0;
    var scoreInserted = false;
    if(previousScores == null){
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

/*
    Reads previous scores and returns them as an array
*/
function getPreviousScores(){
    var previousScores = JSON.parse(localStorage.getItem("highScores"));
    if(previousScores == null){
        return;
    }
    else{
        localStorage.removeItem("highScores");
    }
    return previousScores;
}

/*
    Saves scores to the local storage.
*/
function setNewScores(newScores){
    localStorage.setItem("highScores", JSON.stringify(newScores));
}

/*
    Clears high scores from local storage.
*/
function clearScores(){
    localStorage.removeItem("highScores");
    printHighScores();
}

/*
    Displays high scores on the page.
*/
function printHighScores(){
    highScoreList.innerHTML = "";
    var currentScores = getPreviousScores();
    if(currentScores == null){
        return;
    }
    setNewScores(currentScores);
    for(record of currentScores){
        var newLine = document.createElement("p");
        newLine.textContent = record.initials + " | " + record.score;
        highScoreList.appendChild(newLine);
    }
}

/*
    Resets the state of the quiz.
*/
function restart(){
    countDown = 60;
    score = 0;
    questionNum = 0;
    userInitials.value = "";
    answerElement.style.display = "none";
    viewStart();
}