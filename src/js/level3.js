// Global variables for Level 3
const essayInput = document.getElementById('essay-input');
const submitEssayButton = document.getElementById('submit-essay');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const quizContainer = document.getElementById('quiz-container');
const restartButton = document.getElementById('restart-level3');
const goToCourseButton = document.getElementById('go-to-course');

// Handle essay submission
function submitEssay() {
    const essayValue = essayInput.value.trim();
    if (essayValue.length > 0) {
        resultText.innerText = "Your essay has been submitted successfully!";
        updateQuizProgress(3); // Update progress for completion of Level 3
        showResults();
    } else {
        alert("Please write something before submitting.");
    }
}

// Show results
function showResults() {
    quizContainer.style.display = 'none';
    resultContainer.style.display = 'block';
}

// Restart the level
function restartLevel3() {
    essayInput.value = '';
    quizContainer.style.display = 'block';
    resultContainer.style.display = 'none';
}

// Go to course page
function goToCourse() {
    window.location.href = 'course.html';
}

// Update progress in localStorage
function updateQuizProgress(level) {
    let storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        storedUser.progress = level; // Update progress in local storage
        localStorage.setItem('user', JSON.stringify(storedUser));
        alert(`Progress updated to Level ${level}!`);
    }
}

// Attach event listeners
submitEssayButton.addEventListener('click', submitEssay);
restartButton.addEventListener('click', restartLevel3);
goToCourseButton.addEventListener('click', goToCourse);
