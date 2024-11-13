// Quiz data
const questionsLevel1 = [
    {
        question: "Choose the correct word to complete the sentence: I _____ to the park yesterday",
        answers: [
            { text: 'Go', correct: false },
            { text: 'Going', correct: false },
            { text: 'Went', correct: true },
            { text: 'Gone', correct: false }
        ]
    },
    {
        question: "Which of these is a fruit?",
        answers: [
            { text: 'Chair', correct: false },
            { text: 'Apple', correct: true },
            { text: 'Dog', correct: false },
            { text: 'Car', correct: false }
        ]
    },
    {
        question: "Which is the correct sentence?",
        answers: [
            { text: 'She is a teacher.', correct: true },
            { text: 'She are a teacher.', correct: false },
            { text: 'She am a teacher.', correct: false },
            { text: 'She be a teacher.', correct: false }
        ]
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        answers: [
            { text: 'Oxygen', correct: true },
            { text: 'Hydrogen', correct: false },
            { text: 'Gold', correct: false },
            { text: 'Silver', correct: false }
        ]
    },
    {
        question: "Choose the correct plural form: One cat, two ____. ",
        answers: [
            { text: 'cats', correct: true },
            { text: 'cates', correct: false },
            { text: 'cat', correct: false },
            { text: 'catses', correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
const totalQuestions = questionsLevel1.length;
const progressBar = document.getElementById('progress-bar');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const submitButton = document.getElementById('submit-btn');
const nextButtonContainer = document.getElementById('next-button-container');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
let selectedButton = null;

// Create the "Next" button
const nextButton = document.createElement('button');
nextButton.innerText = "Next";
nextButton.classList.add('mt-4', 'bg-[#3b82f6]', 'hover:bg-[#60a5fa]', 'text-white', 'font-bold', 'py-2', 'px-6', 'rounded');
nextButton.style.display = 'none';
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < totalQuestions) {
        loadQuestion();
    } else {
        showResults();
    }
});
nextButtonContainer.appendChild(nextButton);

function loadQuestion() {
    resetState();
    const currentQuestion = questionsLevel1[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn', 'bg-[#1e40af]', 'text-white', 'py-2', 'px-4', 'rounded', 'mb-2', 'hover:bg-blue-500');
        button.dataset.correct = answer.correct;
        button.addEventListener('click', () => {
            selectAnswer(button);
            submitButton.disabled = false; // Enable the submit button when an answer is selected
        });
        answerButtons.appendChild(button);
    });

    updateProgressBar();
    submitButton.style.display = 'block';
    nextButton.style.display = 'none';
    selectedButton = null;
    submitButton.disabled = true; // Disable the submit button initially
}

function selectAnswer(button) {
    if (selectedButton) {
        selectedButton.classList.remove('selected');
    }
    selectedButton = button;
    selectedButton.classList.add('selected');
}

submitButton.addEventListener('click', () => {
    if (selectedButton) {
        const correct = selectedButton.dataset.correct === 'true';
        selectedButton.classList.remove('selected');
        selectedButton.classList.add(correct ? 'correct' : 'incorrect');

        Array.from(answerButtons.children).forEach(button => {
            button.disabled = true;
            if (button.dataset.correct === 'true' && button !== selectedButton) {
                button.classList.add('correct');
            }
        });

        submitButton.style.display = 'none';
        nextButton.style.display = 'block';
        nextButtonContainer.style.display = 'block'; // Ensure the container is shown

        if (correct) {
            correctAnswers++;
        }
    } else {
        alert("Please select an answer before submitting.");
    }
});

function resetState() {
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
    selectedButton = null;
    submitButton.style.display = 'block';
    nextButton.style.display = 'none';
    nextButtonContainer.style.display = 'none'; // Hide the container initially
}

function updateProgressBar() {
    const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressBar.style.width = progressPercentage + '%';
}

function showResults() {
    questionElement.style.display = 'none';
    answerButtons.style.display = 'none';
    submitButton.style.display = 'none';
    nextButton.style.display = 'none';
    resultContainer.style.display = 'block';
    resultText.innerText = `You answered ${correctAnswers} out of ${totalQuestions} questions correctly.`;

    // Update user's progress if they completed the level
    if (correctAnswers >= (totalQuestions * 0.6)) { // Set a passing threshold, e.g., 60%
        updateQuizProgress(2); // Update to the next level
    } else {
        alert("Try again to advance to the next level.");
    }
}

function restartLevel() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    questionElement.style.display = 'block';
    answerButtons.style.display = 'block';
    resultContainer.style.display = 'none';
    loadQuestion();
}

function goToCoursePage() {
    window.location.href = 'course.html';
}

function updateQuizProgress(level) {
    let storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        storedUser.progress = level; // Update progress in localStorage
        localStorage.setItem('user', JSON.stringify(storedUser));
        alert(`Progress updated to Level ${level}!`);
    }
}

// Initial load of the quiz
loadQuestion();
