document.addEventListener('DOMContentLoaded', function () {
    const appContainer = document.getElementById('app');

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('accessToken');

    if (isLoggedIn) {
        // If logged in, redirect to Profile page
        redirectToProfile();
    } else {
        // If not logged in, show Signup page
        renderSignupPage();
    }
});

function renderSignupPage() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <div class="bg"></div>
        <div class="bg bg2"></div>
        <div class="bg bg3"></div>
        <div class="container1">
            <h2>Sign up to your account</h2>
            <div id="signupForm">
                <label for="name">Name</label><br>
                <input type="text" id="name" required><br><br>
                <label for="email">Email</label><br>
                <input type="email" id="email" required pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"><br><br>
                <label for="password">Password</label><br>
                <input type="password" id="password" required><br><br>
                <label for="confirmPassword">Confirm Password</label><br>
                <input type="password" id="confirmPassword" required><br><br>
                <button class="button1" onclick="signup()">Signup</button>
            </div>
            <p id="signupMessage"></p>
        </div>
    `;

    const signupButton = document.querySelector('#signupForm button');
    signupButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!name || !email || !password || !confirmPassword) {
            displayMessage('error', 'Error: All fields are mandatory!');
            return;
        }

        if (password !== confirmPassword) {
            displayMessage('error', 'Passwords do not match!');
            return;
        }

        if (!validateEmail(email)) {
            displayMessage('error', 'Invalid email format!');
            return;
        }

        // Generate random 16-byte access token
        const accessToken = generateAccessToken();

        // Store user details in local storage
        localStorage.setItem('name', name);
        localStorage.setItem('email', email);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('password', password);

        // Redirect to Profile page
        redirectToProfile();
    });
}

function generateAccessToken() {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

function redirectToProfile() {
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = `
        <div class="slider-thumb"></div>
        <h2 class="Signup">Sign up Successful!</h2>
        <div class="container">
            <h2>Profile</h2>
            <div class="avatar">
                <div class="user-icon"><span></span></div>
            </div>
            <p><strong>Full Name:</strong> ${localStorage.getItem('name')}</p>
            <p><strong>Email:</strong> ${localStorage.getItem('email')}</p>
            <p><strong>Token:</strong> ${localStorage.getItem('accessToken')}</p>
            <p><strong>Password:</strong> ${'*'.repeat(localStorage.getItem('password').length)}</p>
            <button class="button" onclick="logout()">Logout</button>
        </div>
    `;
}

function logout() {
    // Clear local storage
    localStorage.clear();

    // Redirect to Signup page
    renderSignupPage();
}

function displayMessage(type, message) {
    const messageElement = document.getElementById('signupMessage');
    messageElement.innerText = message;
    messageElement.className = type === 'success' ? 'success' : 'error';

    // Clear message after 3 seconds
    setTimeout(() => {
        messageElement.innerText = '';
        messageElement.className = '';
    }, 3000);
}

function validateEmail(email) {
    // Use a regular expression to validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
