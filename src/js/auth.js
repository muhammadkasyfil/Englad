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
    // Redirect to course.html without updating progress
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

// Register a new user (simulated)
document.getElementById('register-button').addEventListener('click', () => {
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (email && password) {
        const userData = { email, password, progress: 0 };
        localStorage.setItem('user', JSON.stringify(userData));
        alert('User registered successfully!');
        registerForm.style.display = 'none';
        authSection.style.display = 'none'; // Hide auth section after registration
        showUserProfile(userData);
    } else {
        alert('Please fill in both fields.');
    }
});

// Log in an existing user (simulated)
document.getElementById('login-button').addEventListener('click', () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser && storedUser.email === email && storedUser.password === password) {
        alert('Logged in successfully!');
        loginForm.style.display = 'none';
        authSection.style.display = 'none'; // Hide auth section after login
        showUserProfile(storedUser);
    } else {
        alert('Invalid email or password.');
    }
});

// Show user profile and progress
function showUserProfile(user) {
    authContainer.style.display = 'none'; // Hide the auth container
    userEmailElement.textContent = user.email;
    quizProgressElement.textContent = user.progress;
    profileSection.style.display = 'block';

    // Check if the user can still progress to the next level
    if (user.progress < 3) { 
        if (!profileSection.contains(nextLevelButton)) {
            profileSection.appendChild(nextLevelButton);
        }
    } else {
        // Remove the next level button if the user has reached the final level
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
    localStorage.removeItem('user');
    alert('Logged out successfully!');
    profileSection.style.display = 'none';
    authContainer.style.display = 'block'; // Show the auth container after logout
    loginForm.style.display = 'block';
});

// Check if the user is already logged in when the page loads
window.onload = () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        loginForm.style.display = 'none';
        authContainer.style.display = 'none'; // Hide the auth container if the user is logged in
        showUserProfile(storedUser);
    }
};