// ================= VARIABLES ======================
let currentTopic = ""
let currentSubtopic = ""
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let username = "";
let currentScreenId = "";
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


// ============= SCREEN CONTROL ================
async function showScreen(screenId) {
    const currentScreen = currentScreenId
        ? document.querySelector("#" + currentScreenId)
        : null;
    currentScreenId = screenId;

    if (currentScreen) {
        console.log("entering fadeout");
        const children = Array.from(currentScreen.children);

        for (const [index, child] of children.entries()) {
            await sleep(index * 120);
            child.classList.add("fade-out-up");
        }

        await sleep(children.length * 120 + 400);
        currentScreen.style.display = "none";
        children.forEach(child => child.classList.remove("fade-out-up"));
        
        await sleep(200);
    }

    const newScreen = document.querySelector("#" + screenId);
    newScreen.style.display = "flex";

    const newChildren = Array.from(newScreen.children);
    newChildren.forEach(child => child.style.opacity = "0");

    for (const [index, child] of newChildren.entries()) {
        await sleep(index * 120);
        child.style.opacity = "";
        child.classList.add("fade-in-down");
    }

    await sleep(newChildren.length * 120 + 300);
    newChildren.forEach(child => child.classList.remove("fade-in-down"));

    const dynamicButtons = Array.from(document.querySelectorAll("#subtopic-buttons button"));
    if (dynamicButtons.length > 0) {
        dynamicButtons.forEach(btn => btn.style.opacity = "0");
        
       for (const [index, btn] of dynamicButtons.entries()) {
        await sleep(index * 120);
        btn.style.opacity = "";
        btn.classList.add("fade-in-down");
        await sleep(500);
        btn.classList.remove("fade-in-down");
       }
    }
    await sleep(newChildren.length * 120 + 150);
    newChildren.forEach(child => child.classList.remove("fade-in-down"));


}


// ============= VALIDATION=====================
function validateCredentials() {
    const button = document.querySelector("button[onclick='validateCredentials()']");
    button.disabled = true;
    const nameInput = document.querySelector("#username-input").value.trim();
    const ageInput = document.querySelector("#age-input").value.trim();
    const errorBox = document.querySelector("#welcome-error");
    const responseBox = document.querySelector("#welcome-response");

    if (!nameInput || !/^[a-zA-Z]+$/.test(nameInput)) {
        animateText(errorBox, "Please enter a valid name (letters only).")
        button.disabled = false;
        return;
    }

    if (!ageInput || parseInt(ageInput) <9) {
       animateText(errorBox, "You must be atleast 9 years old to play.")
       button.disabled = false;
        return;
    }

     errorBox.textContent = "";
    username = nameInput.trim()[0].toUpperCase() + nameInput.trim().slice(1).toLowerCase();
    animateText(responseBox,`Nice name, ${username}!`);

setTimeout(() => {
     animateText(responseBox,`Anyways, it seems you are ${ageInput} years old. That's a pretty good age!`);
}, 2000);

setTimeout(() => {
    animateText(responseBox, "Let us start, shall we?");
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
        button.style.opacity = "0";
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


setTimeout(() => {
    if (currentIndex < currentQuestions.length) {
        displayQuestion();
    } else {
        showResults();
    }
    }, 1500);
    
currentIndex++;
}

function playAgain() {
    score = 0;
    currentIndex = 0;
    currentQuestions = [];
    currentTopic = "";
    currentSubtopic = "";

    document.querySelector("button[onclick='saveScore()'").disabled = false;
    showScreen("topic-screen");

}


// ===================== LEADERBOARD =============================
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

// =============== ANIMATION ============================
function animateText(element, text) {
    element.textContent = text;
    element.classList.remove("fade-in-up");
    void element.offsetWidth;
    element.classList.add("fade-in-up");
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function animateHeading() {
    const h1 = document.querySelector("h1");
    const letters = h1.textContent.split("");
    h1.textContent = "";
    const spans = [];

   letters.forEach((letter, index) => {
    const span = document.createElement("span");
    span.textContent = letter === " " ? "\u00A0" : letter;
    span.classList.add("bounce-letter");
    span.style.animationName = "dropIn";
    span.style.animationDuration = "1s";
    span.style.animationTimingFunction = "ease";
    span.style.animationFillMode = "both";
    span.style.animationDelay = `${index * 0.08}s`;
    h1.appendChild(span);
    spans.push(span);
    });
    
    const lastSpan = spans[spans.length - 1];
    lastSpan.addEventListener("animationend", (e) => {
        console.log("animation ended:", e.animationName);
     wave(spans);
    });
}

async function wave(spans) {
    for (const [index, span] of spans.entries()) {
        if (span.textContent === "\u00A0") {
            continue;
        }
        await sleep (index * 0.001);
        span.style.animation = "none";
        span.style.transition = "transform 0.3s ease";
        span.style.transform = "translateY(-12px)";
        await sleep(150);
        span.style.transition = "transform 1s ease";
        span.style.transform = "translateY(0)";
    }
    await sleep(200);
    spans.forEach(s => {
        s.style.transform = "";
        s.style.transition = "";
        s.classList.add("hover-ready");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    animateHeading();
    showScreen("welcome-screen");
})

function addHoverEffect(selector) {
    const heading = document.querySelector(selector);
    if (!heading) return;

    const letters = heading.textContent.split("");
    heading.textContent = "";

    letters.forEach(letter => {
        const span = document.createElement("span");
        span.textContent = letter === " " ? "\u00A0" : letter;
        span.classList.add("hover-ready");
        heading.appendChild(span);
    });
}
function displayQuestion() {
    const current = currentQuestions[currentIndex];
    document.querySelector("#question-text").textContent = current.question;
    addHoverEffect("#question-text");

    document.querySelector("#progress").textContent = `Question ${currentIndex + 1} of ${currentQuestions.length}`;
    document.querySelector("#answer-input").value = "";
    document.querySelector("#feedback").textContent = "";
}