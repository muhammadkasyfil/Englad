// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, collection, getDocs, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Your Firebase configuration
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

// Global variables for Level 2
let currentDragQuestionIndex = 0;
let correctDragAnswers = 0;
let questionsLevel2 = [];
const totalDragQuestions = questionsLevel2.length;
const dragProgressBar = document.getElementById('progress-bar');
const dragResultContainer = document.getElementById('result-container');
const dragResultText = document.getElementById('result-text');
const dragOptionsContainer = document.getElementById('drag-options');
const dropArea = document.getElementById('drop-area');
const questionElement = document.getElementById('question');
const restartButton = document.getElementById('restart-level');
const goToCourseButton = document.getElementById('go-to-course');

// Load quiz data from Firestore for Level 2
async function fetchQuizData() {
    try {
        const querySnapshot = await getDocs(collection(db, "quizQuestionsLevel2"));
        questionsLevel2 = querySnapshot.docs.map(doc => ({
            question: doc.data().question,
            options: doc.data().options,
            correctAnswer: doc.data().correctAnswer
        }));

        if (questionsLevel2.length > 0) {
            loadDragQuestion();
        } else {
            alert('No quiz data found.');
        }
    } catch (error) {
        console.error('Error fetching quiz data:', error);
        alert('Failed to load quiz data. Please try again later.');
    }
}

// Load the next drag-and-drop question
function loadDragQuestion() {
    if (currentDragQuestionIndex >= questionsLevel2.length) {
        showDragResults();
        return;
    }

    resetDragState();
    const currentDragQuestion = questionsLevel2[currentDragQuestionIndex];
    questionElement.innerText = currentDragQuestion.question;

    currentDragQuestion.options.forEach(option => {
        const dragItem = document.createElement('div');
        dragItem.classList.add('drag-item', 'bg-[#1e40af]', 'text-white', 'py-2', 'px-4', 'rounded', 'cursor-move', 'mb-2');
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
        if (currentDragQuestionIndex < questionsLevel2.length) {
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
    dropArea.innerText = 'Drop your answer here'; // Reset text
}

// Update progress bar
function updateDragProgressBar() {
    const progressPercentage = ((currentDragQuestionIndex + 1) / questionsLevel2.length) * 100;
    dragProgressBar.style.width = progressPercentage + '%';
}

// Show drag results and update progress
function showDragResults() {
    document.querySelector('main').style.display = 'none';
    dragResultContainer.style.display = 'block';
    dragResultText.innerText = `You answered ${correctDragAnswers} out of ${questionsLevel2.length} correctly.`;

    // Update user's progress if they completed the level successfully
    if (correctDragAnswers >= (questionsLevel2.length * 0.6)) { // Set a passing threshold, e.g., 60%
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

// Update quiz progress in Firestore for authenticated users
async function updateQuizProgress(level) {
    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
            await setDoc(userRef, { progress: level }, { merge: true });
            alert(`Progress updated to Level ${level}!`);
        } catch (error) {
            console.error('Error updating progress:', error);
            alert('Failed to update progress. Please try again later.');
        }
    } else {
        alert("User not authenticated.");
    }
}

// Start the drag-and-drop quiz on page load if the user is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        fetchQuizData();
    } else {
        alert('User is not authenticated. Please log in to access Level 2.');
    }
});

// Attach dragover and drop event listeners to the drop area
dropArea.addEventListener('dragover', handleDragOver);
dropArea.addEventListener('drop', handleDrop);

// Attach event listeners to buttons
restartButton.addEventListener('click', restartLevel2);
goToCourseButton.addEventListener('click', goToTryCourse);
