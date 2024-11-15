// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
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

// Global variables for Level 3
const essayInput = document.getElementById('essay-input');
const submitEssayButton = document.getElementById('submit-essay');
const resultContainer = document.getElementById('result-container');
const resultText = document.getElementById('result-text');
const quizContainer = document.getElementById('quiz-container');
const restartButton = document.getElementById('restart-level3');
const goToCourseButton = document.getElementById('go-to-course');

// Handle essay submission
// Handle essay submission
async function submitEssay() {
    const essayValue = essayInput.value.trim();
    if (essayValue.length > 0) {
        const user = auth.currentUser;
        if (user) {
            const userRef = doc(db, "users", user.uid);
            try {
                // Update the user's progress and save the essay in the database
                await setDoc(userRef, { 
                    progress: 3,
                    essaySubmission: essayValue // Storing the essay under 'essaySubmission' field
                }, { merge: true });
                
                resultText.innerText = "Your essay has been submitted successfully!";
                showResults();
            } catch (error) {
                console.error("Error saving essay:", error);
                alert("Failed to submit the essay. Please try again.");
            }
        } else {
            alert("User not authenticated. Please log in.");
        }
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

// Update progress in Firestore
async function updateQuizProgress(level) {
    const user = auth.currentUser;
    if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                await setDoc(userRef, { progress: level }, { merge: true });
                alert(`Progress updated to Level ${level}!`);
            } else {
                console.error("User document not found.");
                alert("User profile not found. Please contact support.");
            }
        } catch (error) {
            console.error("Error updating progress:", error);
            alert("Failed to update progress. Please try again later.");
        }
    } else {
        alert("User not authenticated. Please log in.");
    }
}

// Check if the user is authenticated and display the quiz
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(`User is logged in: ${user.email}`);
        // User is logged in, allow quiz interaction
    } else {
        alert("Please log in to take this quiz.");
        // Redirect to login page or handle unauthenticated state as needed
    }
});

// Attach event listeners
submitEssayButton.addEventListener('click', submitEssay);
restartButton.addEventListener('click', restartLevel3);
goToCourseButton.addEventListener('click', goToCourse);
