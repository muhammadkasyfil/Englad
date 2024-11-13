// Quiz data for Level 2
const questionsLevel2 = [
    {
        question: "What is the capital of France?",
        options: ["Paris", "Rome", "Berlin", "Madrid"],
        correctAnswer: "Paris"
    },
    {
        question: "They _____ to the cinema last week",
        options: ["go", "goes", "went", "going"],
        correctAnswer: "went"
    },
    {
        question: "What is the opposite of 'expensive'?",
        options: ["cheap", "big", "slow", "beautiful"],
        correctAnswer: "cheap"
    },
    {
        question: "If it rains tomorrow, we _____ stay at home.",
        options: ["will", "would", "were", "was"],
        correctAnswer: "will"
    }
];

// Global variables for Level 2
let currentDragQuestionIndex = 0;
let correctDragAnswers = 0;
const totalDragQuestions = questionsLevel2.length;
const dragProgressBar = document.getElementById('progress-bar');
const dragResultContainer = document.getElementById('result-container');
const dragResultText = document.getElementById('result-text');
const dragOptionsContainer = document.getElementById('drag-options');
const dropArea = document.getElementById('drop-area');
const questionElement = document.getElementById('question');
const restartButton = document.getElementById('restart-level');
const goToCourseButton = document.getElementById('go-to-course');

// Load the next drag-and-drop question
function loadDragQuestion() {
    if (currentDragQuestionIndex >= totalDragQuestions) {
        showDragResults();
        return;
    }

    resetDragState();
    const currentDragQuestion = questionsLevel2[currentDragQuestionIndex];
    questionElement.innerText = currentDragQuestion.question;

    currentDragQuestion.options.forEach(option => {
        const dragItem = document.createElement('div');
        dragItem.classList.add('drag-item');
        dragItem.innerText = option;
        dragItem.draggable = true;
        dragItem.dataset.correct = option === currentDragQuestion.correctAnswer;
        dragItem.addEventListener('dragstart', handleDragStart);
        dragOptionsContainer.appendChild(dragItem);
    });

    updateDragProgressBar();
}

// Handle dragging and dropping
function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.innerText);
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const draggedAnswer = e.dataTransfer.getData('text/plain');
    const correctAnswer = questionsLevel2[currentDragQuestionIndex].correctAnswer;

    if (draggedAnswer === correctAnswer) {
        dropArea.style.backgroundColor = '#22c55e'; // Green for correct
        correctDragAnswers++;
    } else {
        dropArea.style.backgroundColor = '#dc2626'; // Red for incorrect
    }

    setTimeout(() => {
        currentDragQuestionIndex++;
        if (currentDragQuestionIndex < totalDragQuestions) {
            loadDragQuestion();
        } else {
            showDragResults();
        }
    }, 1000);
}

// Reset state for the next question
function resetDragState() {
    dragOptionsContainer.innerHTML = '';
    dropArea.style.backgroundColor = '#1e293b'; // Reset to default color
}

// Update progress bar
function updateDragProgressBar() {
    const progressPercentage = ((currentDragQuestionIndex + 1) / totalDragQuestions) * 100;
    dragProgressBar.style.width = progressPercentage + '%';
}

// Show drag results and update progress
function showDragResults() {
    document.querySelector('main').style.display = 'none';
    dragResultContainer.style.display = 'block';
    dragResultText.innerText = `You answered ${correctDragAnswers} out of ${totalDragQuestions} correctly.`;

    // Update user's progress if they completed the level successfully
    if (correctDragAnswers >= (totalDragQuestions * 0.6)) { // Set a passing threshold, e.g., 60%
        updateQuizProgress(3); // Update to the next level (assume 3 is the next)
    } else {
        alert("Try again to advance to the next level.");
    }
}

// Restart the level
function restartLevel2() {
    currentDragQuestionIndex = 0;
    correctDragAnswers = 0;
    dragResultContainer.style.display = 'none';
    document.querySelector('main').style.display = 'block';
    loadDragQuestion();
}

// Go back to the course page
function goToTryCourse() {
    window.location.href = 'course.html';
}

// Update quiz progress in localStorage
function updateQuizProgress(level) {
    let storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        if (storedUser.progress < level) { // Only update if progressing to a higher level
            storedUser.progress = level;
            localStorage.setItem('user', JSON.stringify(storedUser));
            alert(`Progress updated to Level ${level}!`);
        }
    }
}

// Start the drag-and-drop quiz on page load
window.onload = () => {
    loadDragQuestion();
};

// Attach dragover and drop event listeners to the drop area
dropArea.addEventListener('dragover', handleDragOver);
dropArea.addEventListener('drop', handleDrop);

// Attach event listeners to buttons
restartButton.addEventListener('click', restartLevel2);
goToCourseButton.addEventListener('click', goToTryCourse);
