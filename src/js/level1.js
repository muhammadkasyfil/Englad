// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAo7THPMqq84xmVE6j1o27wwhDTOquRW_U",
    authDomain: "englad-b3cfd.firebaseapp.com",
    projectId: "englad-b3cfd",
    storageBucket: "englad-b3cfd.firebasestorage.app",
    messagingSenderId: "724125114948",
    appId: "1:724125114948:web:87ca2d1544ed66d1201211",
    measurementId: "G-F13YDT22RF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Global variables for Level 1
let currentQuestionIndex = 0;
let correctAnswers = 0;
let questionsLevel1 = [];
const progressBar = document.getElementById('progress-bar');
const questionElement = document.getElementById('question');
const answerButtons = document.getElementById('answer-buttons');
const submitButton = document.getElementById('submit-btn');
const nextButtonContainer = document.getElementById('next-button-container');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const restartButton = document.getElementById('restart-level');
const goToCourseButton = document.getElementById('go-to-course');
let selectedButton = null;

// Create the "Next" button
const nextButton = document.createElement('button');
nextButton.innerText = "Next";
nextButton.classList.add('mt-4', 'bg-[#3b82f6]', 'hover:bg-[#60a5fa]', 'text-white', 'font-bold', 'py-2', 'px-6', 'rounded');
nextButton.style.display = 'none';
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questionsLevel1.length) {
        loadQuestion();
    } else {
        showResults();
    }
});
nextButtonContainer.appendChild(nextButton);

// Load quiz data from Firestore
async function fetchQuizData() {
    try {
        const querySnapshot = await getDocs(collection(db, "quizQuestionsLevel1"));
        questionsLevel1 = querySnapshot.docs.map(doc => ({
            question: doc.data().question,
            answers: doc.data().answers
        }));

        if (questionsLevel1.length > 0) {
            loadQuestion();
        } else {
            alert('No quiz data found.');
        }
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        alert('Failed to load quiz data. Please try again later.');
    }
}

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
            submitButton.disabled = false;
        });
        answerButtons.appendChild(button);
    });

    updateProgressBar();
    submitButton.style.display = 'block';
    nextButton.style.display = 'none';
    selectedButton = null;
    submitButton.disabled = true;
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
        nextButtonContainer.style.display = 'block';

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
    nextButtonContainer.style.display = 'none';
}

function updateProgressBar() {
    const progressPercentage = ((currentQuestionIndex + 1) / questionsLevel1.length) * 100;
    progressBar.style.width = progressPercentage + '%';
}

function showResults() {
    questionElement.style.display = 'none';
    answerButtons.style.display = 'none';
    submitButton.style.display = 'none';
    nextButton.style.display = 'none';
    resultContainer.style.display = 'block';
    resultText.innerText = `You answered ${correctAnswers} out of ${questionsLevel1.length} questions correctly.`;

    progressBar.style.display = 'none';

    // Only update the user's progress if they are not at Level 3
    updateQuizProgress(2); // Update to the next level
}

async function updateQuizProgress(level) {
    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();

            // Check if the user is already at or above the desired level
            if (userData.progress < level) {
                await setDoc(userRef, { progress: level }, { merge: true });
                alert(`Progress updated to Level ${level}!`);
            }
        } catch (error) {
            console.error('Error updating progress:', error);
            alert('Failed to update progress. Please try again later.');
        }
    } else {
        alert("User not authenticated.");
    }
}

// Check if the user is already logged in and load data
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchQuizData();
    } else {
        alert('User is not authenticated. Please log in to take the quiz.');
    }
});

// Add event listeners for retry and navigation buttons
function restartLevel() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    progressBar.style.display = 'block'; // Show the progress bar again
    progressBar.style.width = '0%'; // Reset progress bar to 0%
    resultContainer.style.display = 'none';
    loadQuestion();
}

function goToCoursePage() {
    window.location.href = 'course.html';
}

restartButton.addEventListener('click', restartLevel);
goToCourseButton.addEventListener('click', goToCoursePage);
