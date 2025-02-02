// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCdkjImfuX2gnHDPglEJ7eD7C8zUxQIh9Q",
    authDomain: "coding-hub-34d66.firebaseapp.com",
    projectId: "coding-hub-34d66",
    storageBucket: "coding-hub-34d66.appspot.com",
    messagingSenderId: "640783204298",
    appId: "1:640783204298:web:82e774afbde3e579895933"
  };
firebase.initializeApp(firebaseConfig);

// Load user profile and set up avatar
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        const userEmail = user.email;
        const firstLetter = userEmail.charAt(0).toUpperCase(); // Get the first letter and capitalize it

        // Check if the user has a profile picture (Google Sign-In users)
        if (user.photoURL) {
            // Set the profile picture as the avatar image
            document.getElementById('profileAvatar').src = user.photoURL;
            document.getElementById('profileAvatar').alt = 'User Avatar';
        } else {
            // Fallback to the first letter of the email if no profile picture is available
            document.getElementById('profileAvatar').innerText = firstLetter;
        }

        document.getElementById('userEmail').innerText = userEmail; // Display the user email
    } else {
        // Redirect to login if not logged in
        window.location.href = 'index.html';
    }
});

// Logout function
function logout() {
    firebase.auth().signOut().then(function () {
        window.location.href = 'index.html';
    }).catch(function (error) {
        console.error('Error logging out:', error);
    });
}

// Active nav link
document.addEventListener("DOMContentLoaded", function () {
    // Get all nav links
    var navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Get the current URL path
    var currentPath = window.location.pathname;

    // Loop through each nav link and compare its href with the current URL
    navLinks.forEach(function (link) {
        // Check if the link's href matches the current path
        if (link.getAttribute('href') === currentPath) {
            // Add 'active' class to the matching link
            link.classList.add('active');
            // Change the link's color to white
            link.style.color = 'white';
        }
    });
});


// ---------------------------------------------
document.addEventListener('click', function (event) {
    // Check if the clicked element is not inside the navbar or its toggler button
    if (!document.getElementById('navbarNav').contains(event.target) && !document.querySelector('.navbar-toggler').contains(event.target)) {
        // Collapse the navbar if it is currently shown
        var navbar = document.getElementById('navbarNav');
        if (navbar.classList.contains('show')) {
            $('.navbar-collapse').collapse('hide');
        }
    }
});
