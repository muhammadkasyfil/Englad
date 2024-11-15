// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// DOM Elements
const authSection = document.getElementById('auth-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const profileSection = document.getElementById('profile-section');
const userEmailElement = document.getElementById('user-email');
const quizProgressElement = document.getElementById('quiz-progress');
const authContainer = document.getElementById('auth-container');
const nextLevelButton = document.createElement('button');

// Configure the Next Level button
nextLevelButton.textContent = 'Proceed to Next Level';
nextLevelButton.className = 'btn-custom bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md mt-4';
nextLevelButton.addEventListener('click', () => {
    window.location.href = 'course.html';
});

// Toggle between login and register forms
document.getElementById('show-login').addEventListener('click', () => {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
});

document.getElementById('show-register').addEventListener('click', () => {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
});

// Google sign-in logic
document.getElementById('google-signin').addEventListener('click', () => {
    signInWithPopup(auth, provider)
        .then(result => {
            alert(`Welcome, ${result.user.email}`);
            showUserProfile(result.user);
        })
        .catch(error => {
            alert('Error during Google sign-in: ' + error.message);
        });
});

// Register a new user
document.getElementById('register-button').addEventListener('click', () => {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (email && password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredential => {
                alert('User registered successfully!');
                registerForm.style.display = 'none';
                authSection.style.display = 'none';
                showUserProfile({ email: userCredential.user.email, progress: 0 });
            })
            .catch(error => {
                alert('Error: ' + error.message);
            });
    } else {
        alert('Please fill in both fields.');
    }
});

// Log in an existing user
document.getElementById('login-button').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then(userCredential => {
            alert('Logged in successfully!');
            loginForm.style.display = 'none';
            authSection.style.display = 'none';
            showUserProfile({ email: userCredential.user.email, progress: 0 });
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
});

// Show user profile and progress
function showUserProfile(user) {
    authContainer.style.display = 'none';
    userEmailElement.textContent = user.email;
    quizProgressElement.textContent = user.progress; // Adjust as needed to fetch real progress
    profileSection.style.display = 'block';

    if (user.progress < 3) {
        if (!profileSection.contains(nextLevelButton)) {
            profileSection.appendChild(nextLevelButton);
        }
    } else {
        if (profileSection.contains(nextLevelButton)) {
            profileSection.removeChild(nextLevelButton);
        }
        const maxLevelMessage = document.createElement('p');
        maxLevelMessage.textContent = 'You have completed all levels!';
        maxLevelMessage.className = 'mt-4 text-green-500';
        profileSection.appendChild(maxLevelMessage);
    }
}

// Log out the user
document.getElementById('logout-button').addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            alert('Logged out successfully!');
            profileSection.style.display = 'none';
            authContainer.style.display = 'block'; // Show the auth container after logout
            loginForm.style.display = 'block'; // Ensure the login form is visible
            document.getElementById('auth-section').style.display = 'block'; // Show the Google sign-in button
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
});

// Check if the user is already logged in when the page loads
window.onload = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            loginForm.style.display = 'none';
            authContainer.style.display = 'none';
            showUserProfile({ email: user.email, progress: 0 }); // Adjust if needed
        } else {
            authContainer.style.display = 'block';
            document.getElementById('auth-section').style.display = 'block'; // Show the auth section by default
            profileSection.style.display = 'none';
        }
    });
};
