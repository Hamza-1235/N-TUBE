// Import Firebase SDKs
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getAuth, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getFirestore, collection, getDocs, doc, deleteDoc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

// Your Firebase configuration
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

// ----------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        const favoriteContainer = document.getElementById('favorite-video-cards');
        if (user) {
            const userId = user.uid;

            // Fetching favorites based on userId
            const favoriteQuery = await getDocs(collection(db, "favorites"));

            favoriteContainer.innerHTML = '';

            let hasFavorites = false; // Flag to check if there are any favorites

            function formatViews(views) {
                if (views >= 1_000_000_000) {
                    return (views / 1_000_000_000).toFixed(1) + 'B';
                } else if (views >= 1_000_000) {
                    return (views / 1_000_000).toFixed(1) + 'M';
                } else if (views >= 1_000) {
                    return (views / 1_000).toFixed(1) + 'K';
                } else {
                    return views.toString();
                }
            }
            
            

            favoriteQuery.forEach((doc) => {
                const video = doc.data();
                console.log(video);  // Check if channelId is present and correct
                if (video.userId === userId) {
                    hasFavorites = true;
                    const formattedViews = formatViews(parseInt(video.views) || 0);  // Convert views to integer and format
                    const videoCard = `
                        <div class="col-md-4 mb-4 d-flex align-items-stretch">
                            <div class="card">
                                <img src="${video.thumbnail}" class="card-img-top" alt="${video.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${video.title}</h5>
                                    <p class="card-text">Channel: <a href="https://www.youtube.com/channel/${video.channelId}" target="_blank">${video.channelTitle}</a></p>
                                    <p class="card-text-views">Views: ${formattedViews}</p>
                                    <button class="btn btn-danger view-video-btn" data-video-id="${video.videoId}">View Video</button>
                                    <button class="btn favorite-btn" data-video-id="${video.videoId}">
                                        <i class="fas fa-heart ${video.userId === userId ? 'text-danger' : 'text-muted'}"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    favoriteContainer.insertAdjacentHTML('beforeend', videoCard);
                }
            });
            
            

            if (!hasFavorites) {
                // Display a message when there are no favorites
                favoriteContainer.innerHTML = '<p class="text-center text-danger">There is nothing in your favorites!</p>';
            }

            // Add event listeners to the "View Video" buttons
            document.querySelectorAll('.view-video-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const videoId = e.target.getAttribute('data-video-id');
                    openVideoPopup(videoId);
                });
            });

            // Add event listeners to the "Favorite" buttons to allow unfavoriting from this page
            document.querySelectorAll('.favorite-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const videoId = e.currentTarget.getAttribute('data-video-id');
                    const card = e.currentTarget.closest('.col-md-4');
                    await toggleFavorite(videoId, e.currentTarget, card);

                    // Check if the container is now empty after removing a favorite
                    if (favoriteContainer.children.length === 0) {
                        favoriteContainer.innerHTML = '<p class="text-center">There is nothing in your favorites.</p>';
                    }
                });
            });
        } else {
            favoriteContainer.innerHTML = '<p>You must be logged in to see your favorites.</p>';
        }
    });
});



async function toggleFavorite(videoId, button, card) {
    const user = auth.currentUser;
    if (user) {
        const userId = user.uid;
        const favoriteDocRef = doc(db, "favorites", `${userId}_${videoId}`);
        const docSnapshot = await getDoc(favoriteDocRef);

        if (docSnapshot.exists()) {
            // If video is already a favorite, remove it
            await deleteDoc(favoriteDocRef);
            button.querySelector('i').classList.remove('text-danger');
            button.querySelector('i').classList.add('text-muted');
            // Remove the card from the DOM
            card.remove();
        } else {
            // If video is not a favorite, add it
            const videoCard = button.closest('.card');
            await setDoc(favoriteDocRef, {
                userId: userId,
                videoId: videoId,
                thumbnail: videoCard.querySelector('img').src,
                title: videoCard.querySelector('.card-title').textContent,
                channelTitle: videoCard.querySelector('a').textContent,
                views: videoCard.querySelector('.card-text-views').textContent.split('Views:, ')[1] || 'N/A', // Correct extraction
                channelId: videoCard.querySelector('a').getAttribute('href').split('/').pop()
            });
            button.querySelector('i').classList.remove('text-muted');
            button.querySelector('i').classList.add('text-danger');
        }
    }
}


// --------------------------------------------------------
function openVideoPopup(videoId) {
    const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    const videoFrame = document.getElementById('videoFrame');
    
    if (videoFrame) {
        videoFrame.src = videoUrl;
        $('#videoModal').modal('show'); // Ensure Bootstrap's JavaScript is correctly included
    } else {
        console.error('Video frame element not found');
    }
}

// Clear the video source when the modal is hidden
$('#videoModal').on('hidden.bs.modal', () => {
    const videoFrame = document.getElementById('videoFrame');
    if (videoFrame) {
        videoFrame.src = '';
    }
});

// Logout function
window.logout = function () {
    signOut(auth).then(() => {
        // Clear the stored language
        localStorage.removeItem('selectedLanguage');

        // Redirect to the login page after logout
        window.location.href = 'index.html'; // Ensure this is the correct path to your login page
    }).catch((error) => {
        console.error('Logout error:', error.message);
        alert('Error during logout. Please try again.');
    });
}


// ---------------------------------------------------
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