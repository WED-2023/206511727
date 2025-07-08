let currentWord;
let options = [];
let mode = "en-to-he";
let score = 0;
let total = 0;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function startQuiz(selectedMode) {
    mode = selectedMode;
    document.getElementById("mode-selection").style.display = "none";
    document.getElementById("quiz").style.display = "block";
    document.getElementById("score").innerText = `Score: 0 / 0`;
    nextQuestion();
}

function nextQuestion() {
    document.getElementById("options").innerHTML = "";

    currentWord = words[Math.floor(Math.random() * words.length)];
    let questionText, correctAnswer, wrongAnswers;

    if (mode === "en-to-he") {
        questionText = `What is the meaning of "${currentWord.english}" in Hebrew?`;
        correctAnswer = currentWord.hebrew;
        wrongAnswers = shuffle(words.filter(w => w !== currentWord)).slice(0, 3).map(w => w.hebrew);
    } else {
        questionText = `מה התרגום של "${currentWord.hebrew}" לאנגלית?`;
        correctAnswer = currentWord.english;
        wrongAnswers = shuffle(words.filter(w => w !== currentWord)).slice(0, 3).map(w => w.english);
    }

    options = shuffle([correctAnswer, ...wrongAnswers]);

    document.getElementById("question").innerText = questionText;

    options.forEach(option => {
        const btn = document.createElement("div");
        btn.className = "option";
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option);
        document.getElementById("options").appendChild(btn);
    });
}

function checkAnswer(selected) {
    const buttons = document.querySelectorAll(".option");
    const correct = (mode === "en-to-he") ? currentWord.hebrew : currentWord.english;

    buttons.forEach(btn => {
        if (btn.innerText === correct) {
            btn.classList.add("correct");
        } else if (btn.innerText === selected) {
            btn.classList.add("wrong");
        }
        btn.onclick = null;
    });

    if (selected === correct) score++;
    total++;
    document.getElementById("score").innerText = `Score: ${score} / ${total}`;
}
