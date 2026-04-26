// ================= DATA ============================
const quizData = {
    Science: {
        subtopics: ["Biology", "Geography"],
        questions: {
            Biology: [
                { question: "What is the powerhouse of the cell?", answer: "mitochondria" },
                { question: "What is the main component of a plant's cell wall?", answer: "cellulose" },
                { question: "What do plants use to initiate photosynthesis?", answer: "sunlight" },
                { question: "What is the process of breaking down glucose without oxygen?", answer: "fermentation" },
                { question: "Which protein in red blood cells carries oxygen?", answer: "hemoglobin" },
            ],
            Geography: [
                { question: "What is the largest desert in the world?", answer: "antarctica" },
                { question: "Which continent has land in all four hemispheres?", answer: "africa" },
                { question: "What is the deepest point in the world's oceans?", answer: "challenger deep" },
                { question: "Which line divides Earth into Northern and Southern Hemispheres?", answer: "equator" },
                { question: "What type of rock forms from cooling magma?", answer: "igneous" },
            ],
        }
    },
    "Social Sciences": {
        subtopics: ["Geopolitics"],
        questions: {
            Geopolitics: [
                { question: "What is the official power to reject a proposal or bill?", answer: "veto" },
                { question: "What is a country completely surrounded by other countries called?", answer: "landlocked" },
                { question: "What term describes total authority over a territory?", answer: "sovereignty" },
                { question: "What term describes soft power through culture and values?", answer: "hegemony" },
                { question: "Which organization was established in 1945 to maintain global peace?", answer: "united nations" },
            ],
        }
    }
};

// ================= VARIABLES ======================
let currentTopic = ""
let currentSubtopic = ""
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let username = "";


// ============= SCREEN CONTROL ================
function showScreen(screenId) {
    const screens = document.querySelectorAll("div[id$='-screen']");
    screens.forEach(screen => screen.style.display = "none");
    document.querySelector("#" + screenId).style.display = "block";
}
showScreen("welcome-screen");



// ============= VALIDATION=====================
function validateCredentials() {
    const nameInput = document.querySelector("#username-input").value.trim();
    const ageInput = document.querySelector("#age-input").value.trim();
    const errorBox = document.querySelector("#welcome-error");
    const responseBox = document.querySelector("#welcome-response");

    if (!nameInput || !/^[a-zA-Z]+$/.test(nameInput)) {
        errorBox.textContent = "Please enter a valid name (letters only).";
        return;
    }

    if (!ageInput || parseInt(ageInput) <9) {
        errorBox.textContent = "You must be atleast 9 years old to play.";
        return;
    }

     errorBox.textContent = "";
    username = nameInput.trim()[0].toUpperCase() + nameInput.trim().slice(1).toLowerCase();
    responseBox.textContent = `Nice name, ${username}!`;

setTimeout(() => {
    responseBox.textContent = `Anyways, it seems you are ${ageInput} years old. That's a pretty good age!`;
}, 2000);

setTimeout(() => {
    responseBox.textContent = "Let us start, shall we?";
}, 4000);

setTimeout(() => {
    showScreen("topic-screen");
}, 6000);
    }

// ============= TOPIC CONTROL =================
function selectTopic(topic) {
    currentTopic = topic;

    const subtopicButtons = document.querySelector("#subtopic-buttons");
    subtopicButtons.innerHTML = "";

    quizData[topic].subtopics.forEach(subtopic => {
        const button = document.createElement("button");
        button.textContent = subtopic;
        button.onclick = () => selectSubtopic(subtopic);
        subtopicButtons.appendChild(button);
    });
    showScreen("subtopic-screen");
}
function selectSubtopic(subtopic) {
    currentSubtopic = subtopic;
    currentQuestions = [...quizData[currentTopic].questions[subtopic]]
    currentQuestions.sort(() => Math.random() - 0.5);
    currentIndex = 0;
    score = 0;
    showScreen("quiz-screen");
    displayQuestion();
}

// =============== QUIZ LOGIC ==================
function displayQuestion() {
    const current = currentQuestions[currentIndex];
    
    document.querySelector("#question-text").textContent = current.question;
    document.querySelector("#progress").textContent = `Question ${currentIndex + 1 } of ${currentQuestions.length}`;
    document.querySelector("#answer-input").value = "";
    document.querySelector("#feedback").textContent = "";
}
function checkAnswer() {
    const userAnswer = document.querySelector("#answer-input").value.trim().toLowerCase();
    const correctAnswer = currentQuestions[currentIndex].answer.toLowerCase();
    const feedback = document.querySelector("#feedback");

    if (userAnswer === "") {
        feedback.textContent = "Please type an answer first.";
        return;
    }

    if (userAnswer === correctAnswer) {
        feedback.textContent = "That's correct!";
        score++;
    } else {
        feedback.textContent = `Wrong! The correct answer is ${correctAnswer}!`;
    }

currentIndex++;

setTimeout(() => {
    if (currentIndex < currentQuestions.length) {
        displayQuestion();
    } else {
        showResults();
    }
    }, 1500);
}

function showResults() {
    const total = currentQuestions.length;
    const finalScore = document.querySelector("#final-score");
    const scoreMessage = document.querySelector("#score-message");

    finalScore.textContent = `You... scored ${score} out of ${total}`;

    if (score === total) {
        scoreMessage.textContent = "Perfect score! That's incredible!";
    } else if (score >= total * 0.6) {
        scoreMessage.textContent = `Nice one, ${username}! Keep it up!`;
    } else {
        scoreMessage.textContent = `Not bad, ${username}! Practice makes perfect.`;
    }
    showLeaderboard();
    showScreen("results-screen");
}

function saveScore() {
    const key = `leaderboard_${currentSubtopic}`;
    const existing = localStorage.getItem(key);
    const scores = existing ? JSON.parse(existing) : [];

    scores.push({name: username, score: score, total: currentQuestions.length});

    localStorage.setItem(key, JSON.stringify(scores));
    document.querySelector("button[onclick='saveScore()']").disabled = true
    showLeaderboard();
}

function showLeaderboard() {
    const key = `leaderboard_${currentSubtopic}`;
    const existing = localStorage.getItem(key);
    const scores = existing ? JSON.parse(existing) : [];

    scores.sort((a,b) => b.score - a.score);

    const list = document.querySelector("#leaderboard-list");
    const leaderboardDiv = document.querySelector("#leaderboard");
    list.innerHTML = ""
    leaderboardDiv.querySelector("h3").textContent = `Leaderboard — ${currentSubtopic}`;

    scores.forEach(entry => {
        const item = document.createElement("li");
        item.textContent = `${entry.name} - ${entry.score}/${entry.total}`;
        list.appendChild(item);
    });

}