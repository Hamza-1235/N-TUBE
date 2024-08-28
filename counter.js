import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getFirestore, collection, onSnapshot, doc, deleteDoc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCdkjImfuX2gnHDPglEJ7eD7C8zUxQIh9Q",
    authDomain: "coding-hub-34d66.firebaseapp.com",
    projectId: "coding-hub-34d66",
    storageBucket: "coding-hub-34d66.appspot.com",
    messagingSenderId: "640783204298",
    appId: "1:640783204298:web:82e774afbde3e579895933"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const favoritesCountElement = document.getElementById('favorites-count');

    if (favoritesCountElement) {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                const userId = user.uid;

                // Listen for real-time updates to the favorites collection
                const favoritesRef = collection(db, "favorites");
                onSnapshot(favoritesRef, (snapshot) => {
                    let favoritesCount = 0;

                    snapshot.forEach((doc) => {
                        const video = doc.data();
                        if (video.userId === userId) {  // Count only the current user's favorites
                            favoritesCount++;
                        }
                    });

                    // Update the favorites count in the navbar
                    favoritesCountElement.textContent = favoritesCount;
                }, (error) => {
                    console.error('Error listening to favorites:', error);
                });
            } else {
                favoritesCountElement.textContent = '0'; // Reset counter if the user is not logged in
            }
        });
    } else {
        console.error('Favorites count element not found');
    }
});



