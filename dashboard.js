import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

const firebaseConfig = {
    apiKey: "AIzaSyCdkjImfuX2gnHDPglEJ7eD7C8zUxQIh9Q",
    authDomain: "coding-hub-34d66.firebaseapp.com",
    projectId: "coding-hub-34d66",
    storageBucket: "coding-hub-34d66.appspot.com",
    messagingSenderId: "640783204298",
    appId: "1:640783204298:web:82e774afbde3e579895933"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.logout = function () {
    signOut(auth).then(() => {
        localStorage.removeItem('selectedLanguage');

        // Redirect to the login page after logout
        window.location.href = 'index.html'; 
    }).catch((error) => {
        alert(error.message);
    });
}

// ------------------Dashboard JavaScript------------------
const scrollContainer = document.querySelector('.scrolling-bar');
const scrollLeftButton = document.getElementById('scroll-left');
const scrollRightButton = document.getElementById('scroll-right');

const scrollAmount = 200;  // Amount to scroll each time
let scrollInterval;  // Variable to hold the interval ID
let currentScrollPosition = 0;

// Update the scroll position
function updateScrollPosition() {
    scrollContainer.style.transform = `translateX(-${currentScrollPosition}px)`;
}

// Event listener for left scroll button
scrollLeftButton.addEventListener('mousedown', () => {
    scrollInterval = setInterval(() => {
        if (currentScrollPosition > 0) {
            currentScrollPosition -= scrollAmount;
            updateScrollPosition();
        }
    }, 50);
});

scrollLeftButton.addEventListener('mouseup', () => {
    clearInterval(scrollInterval);
});

scrollLeftButton.addEventListener('mouseleave', () => {
    clearInterval(scrollInterval);
});

// Event listener for right scroll button
scrollRightButton.addEventListener('mousedown', () => {
    scrollInterval = setInterval(() => {
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        if (currentScrollPosition < maxScroll) {
            currentScrollPosition += scrollAmount;
            updateScrollPosition();
        }
    }, 50);
});

scrollRightButton.addEventListener('mouseup', () => {
    clearInterval(scrollInterval);
});

scrollRightButton.addEventListener('mouseleave', () => {
    clearInterval(scrollInterval);
});

// ------------------------Video section --------------------//

document.addEventListener('DOMContentLoaded', async () => {

    const apiKey = 'AIzaSyBK9kR44nmIcJdIeExXketcuAvHUCV7xf8';
    const videoContainer = document.getElementById('video-cards');
    const viewMoreButton = document.getElementById('view-more-btn');
    const languageItems = document.querySelectorAll('.scrolling-bar li');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const suggestionsBox = document.getElementById('suggestions');
    const user = auth.currentUser;
    let allVideos = []; 
    let currentDisplayCount = 0; 
    const videosPerPage = 18;

    async function getFavoriteVideos() {
        if (user) {
            const userId = user.uid;
            const favoriteQuery = await getDocs(collection(db, "favorites"));
            const favorites = new Set();

            favoriteQuery.forEach((doc) => {
                const video = doc.data();
                if (video.userId === userId) {
                    favorites.add(video.videoId);
                }
            });

            return favorites;
        }
        return new Set();
    }

    const favoriteVideos = await getFavoriteVideos();

    onAuthStateChanged(auth, async (user) => {
        if (user) {
            const savedLanguage = localStorage.getItem('selectedLanguage');

            if (savedLanguage) {
                languageItems.forEach(async item => {
                    if (item.textContent === savedLanguage) {
                        item.classList.add('active-language');
                        await fetchAndDisplayVideos(savedLanguage, favoriteVideos);
                    }
                });
            }
        } else {
            console.log('User not authenticated.');
        }
    });

    // Handle language item clicks
    languageItems.forEach(item => {
        item.addEventListener('click', async () => {
            languageItems.forEach(li => {
                li.classList.remove('active-language');
            });
            item.classList.add('active-language');

            const selectedLanguage = item.textContent;
            localStorage.setItem('selectedLanguage', selectedLanguage);

            await fetchAndDisplayVideos(selectedLanguage, favoriteVideos);
        });
    });

    // Wrapper function to fetch videos and display them
    async function fetchAndDisplayVideos(language, favorites) {
        currentDisplayCount = 0; // Reset the counter
        videoContainer.innerHTML = ''; // Clear existing videos
        await fetchVideos(language, favorites); // Fetch new videos
        displayNextVideos(); // Display the first set of videos
    }

    // Fetch videos from YouTube API based on a search query
    async function fetchVideos(query, favorites) {
        const maxResults = 50; // Number of videos to fetch
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.items.length === 0) {
                console.log('No videos found for this query.');
                return;
            }

            const videoIds = data.items.map(item => item.id.videoId).join(',');

            const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`;
            const statsResponse = await fetch(statsUrl);
            const statsData = await statsResponse.json();

            allVideos = data.items.map((item, index) => {
                return {
                    ...item,
                    views: parseInt(statsData.items[index].statistics.viewCount, 10),
                    isFavorite: favorites.has(item.id.videoId), // Check if videoId is in favorites
                    channelId: item.snippet.channelId // Store channelId
                };
            });

            allVideos.sort((a, b) => b.views - a.views);

            // Display the first batch of videos
            displayNextVideos();

        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    }

    // Display the next batch of videos
    function displayNextVideos() {
        const nextVideos = allVideos.slice(currentDisplayCount, currentDisplayCount + videosPerPage);
        nextVideos.forEach(video => {
            const videoId = video.id.videoId;
            const thumbnail = video.snippet.thumbnails.high.url;
            const title = video.snippet.title;
            const channelTitle = video.snippet.channelTitle;
            const channelId = video.channelId; // Use stored channelId
            const views = formatViews(video.views);
            const channelUrl = `https://www.youtube.com/channel/${channelId}`; // Construct the channel URL
            const heartClass = video.isFavorite ? 'text-danger' : 'text-muted';

            const videoCard = `
                <div class="col-md-4 mb-4 d-flex align-items-stretch">
                    <div class="card">
                        <img src="${thumbnail}" class="card-img-top" alt="${title}">
                        <div class="card-body">
                            <h5 class="card-title">${title}</h5>
                            <p class="card-text">Channel: <a href="${channelUrl}" target="_blank">${channelTitle}</a></p>
                            <p class="card-text-views">Views: ${views}</p>
                            <button class="btn btn-danger view-video-btn" data-video-id="${videoId}">Watch Video</button>
                            <button class="btn btn-light favorite-btn" data-video-id="${videoId}">
                                <i class="fas fa-heart ${heartClass}"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            videoContainer.insertAdjacentHTML('beforeend', videoCard);
        });

        currentDisplayCount += nextVideos.length;

        // Show or hide the "View More" button based on whether more videos are available
        if (currentDisplayCount < allVideos.length) {
            viewMoreButton.style.display = 'block';
        } else {
            viewMoreButton.style.display = 'none';
        }

        // Attach event listeners to the new buttons
        document.querySelectorAll('.view-video-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const videoId = e.target.getAttribute('data-video-id');
                openVideoPopup(videoId);
            });
        });

        document.querySelectorAll('.favorite-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const videoId = e.currentTarget.getAttribute('data-video-id');
                toggleFavorite(videoId, e.currentTarget);
            });
        });
    }

    // Open video popup modal
    function openVideoPopup(videoId) {
        const videoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        const videoFrame = document.getElementById('videoFrame');
        videoFrame.src = videoUrl;
        $('#videoModal').modal('show');
    }

    $('#videoModal').on('hidden.bs.modal', () => {
        const videoFrame = document.getElementById('videoFrame');
        videoFrame.src = '';
    });

    // Toggle favorite status
    async function toggleFavorite(videoId, button) {
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const favoriteDocRef = doc(db, "favorites", `${userId}_${videoId}`);
            const docSnapshot = await getDoc(favoriteDocRef);
    
            if (docSnapshot.exists()) {
                await deleteDoc(favoriteDocRef);
                button.querySelector('i').classList.remove('text-danger');
                button.querySelector('i').classList.add('text-muted');
            } else {
                // Fetch video details from allVideos array
                const videoData = allVideos.find(video => video.id.videoId === videoId);
                if (videoData) {
                    await setDoc(favoriteDocRef, {
                        videoId,
                        userId,
                        title: videoData.snippet.title, // Store the video title
                        thumbnail: videoData.snippet.thumbnails.high.url, // Store the video thumbnail URL
                        channelTitle: videoData.snippet.channelTitle, // Store the channel title
                        channelId: videoData.channelId, // Store the channel ID
                        views: videoData.views, // Store the view count
                        timestamp: new Date()
                    });
                    button.querySelector('i').classList.remove('text-muted');
                    button.querySelector('i').classList.add('text-danger');
                } else {
                    console.error('Video data not found.');
                }
            }
        } else {
            console.log('User not authenticated.');
        }
    }

    // Format views count
    function formatViews(views) {
        if (views >= 1e9) {
            return (views / 1e9).toFixed(1) + 'B';
        } else if (views >= 1e6) {
            return (views / 1e6).toFixed(1) + 'M';
        } else if (views >= 1e3) {
            return (views / 1e3).toFixed(1) + 'K';
        } else {
            return views.toString();
        }
    }

    // Search form submission event
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query !== '') {
            currentDisplayCount = 0; // Reset the display count
            videoContainer.innerHTML = ''; // Clear the video container
            fetchVideos(query, favoriteVideos); // Fetch and display the videos
        }
    });

    // View more button click event
    viewMoreButton.addEventListener('click', () => {
        displayNextVideos(); // Display the next set of videos
    });

    // Logic to trigger content of the first subcategory when the page loads
    const selectedCategory = localStorage.getItem('selectedCategory');
    const selectedSubcategory = localStorage.getItem('selectedSubcategory');

    if (selectedCategory) {
        const subcategories = JSON.parse(localStorage.getItem('subcategories')) || [];

        if (selectedSubcategory && subcategories.includes(selectedSubcategory)) {
            // Fetch and display videos for the selected subcategory
            await fetchAndDisplayVideos(selectedSubcategory, favoriteVideos);
        } else if (subcategories.length > 0) {
            // Default to the first subcategory if no subcategory is selected
            localStorage.setItem('selectedSubcategory', subcategories[0]);
            await fetchAndDisplayVideos(subcategories[0], favoriteVideos);
        }
    }

});

// // --------------------Handelling search bar --------------- //
// // JavaScript enhancements for keyboard navigation and selection
// document.addEventListener('DOMContentLoaded', function () {
//     const searchInput = document.getElementById('searchInput');
//     const suggestions = document.getElementById('suggestions');
//     let subcategories = [];

//     // Load subcategories from the scrolling bar
//     const scrollingBarItems = document.querySelectorAll('.scrolling-bar li');
//     scrollingBarItems.forEach(item => {
//         subcategories.push(item.textContent.trim());
//     });

//     let highlightedIndex = -1;
//     let debounceTimer;

//     searchInput.addEventListener('input', function () {
//         clearTimeout(debounceTimer);
//         debounceTimer = setTimeout(() => {
//             const query = searchInput.value.toLowerCase();
//             suggestions.innerHTML = '';
//             if (query.length >= 1) {
//                 const filteredSubcategories = subcategories.filter(subcategory => subcategory.toLowerCase().startsWith(query));
//                 if (filteredSubcategories.length > 0) {
//                     filteredSubcategories.forEach((subcategory, index) => {
//                         const item = document.createElement('a');
//                         item.href = '#';
//                         item.className = 'dropdown-item';
//                         item.textContent = subcategory;
//                         item.dataset.index = index;
//                         item.addEventListener('click', function () {
//                             selectSubcategory(subcategory);
//                         });
//                         suggestions.appendChild(item);
//                     });
//                     suggestions.classList.add('show');
//                     highlightedIndex = -1; // Reset highlighted index
//                 } else {
//                     performRandomSearch(query); // Call the random search function if no subcategory matches
//                 }
//             } else {
//                 suggestions.classList.remove('show');
//                 highlightedIndex = -1; // Reset highlighted index
//             }
//         }, 300); // 300ms debounce delay
//     });

//     searchInput.addEventListener('keydown', function (event) {
//         if (suggestions.classList.contains('show')) {
//             const items = suggestions.querySelectorAll('.dropdown-item');
//             if (event.key === 'ArrowDown') {
//                 event.preventDefault();
//                 if (highlightedIndex < items.length - 1) {
//                     highlightedIndex++;
//                     updateHighlightedItem(items);
//                 }
//             } else if (event.key === 'ArrowUp') {
//                 event.preventDefault();
//                 if (highlightedIndex > 0) {
//                     highlightedIndex--;
//                     updateHighlightedItem(items);
//                 }
//             } else if (event.key === 'Enter') {
//                 event.preventDefault();
//                 if (highlightedIndex >= 0 && highlightedIndex < items.length) {
//                     const selectedSubcategory = items[highlightedIndex].textContent;
//                     searchInput.value = selectedSubcategory;
//                     selectSubcategory(selectedSubcategory);
//                     suggestions.classList.remove('show');
//                 }
//             }
//         }
//     });

//     function updateHighlightedItem(items) {
//         items.forEach((item, index) => {
//             item.classList.toggle('active', index === highlightedIndex);
//         });
//     }

//     function selectSubcategory(subcategory) {
//         const items = document.querySelectorAll('.scrolling-bar li');
//         let found = false;
//         items.forEach(item => {
//             if (item.textContent.trim() === subcategory) {
//                 item.click(); // Trigger click event to select the subcategory
//                 found = true;
//             }
//         });
//         if (!found) {
//             // Handle cases where the subcategory is not in the list
//             performSearch(subcategory);
//         }
//     }

//     function performSearch(subcategory) {
//         // Placeholder for actual search logic
//         console.log('Performing search for:', subcategory);
//         // You can redirect or display search results as needed
//     }

//     function performRandomSearch(query) {
//         suggestions.innerHTML = `<a class="dropdown-item">No exact subcategory found, searching for: ${query}</a>`;
//         suggestions.classList.add('show');
//         console.log('Performing random search for:', query);
//         // Implement the logic to handle random searches here, such as querying the database or redirecting to a search results page.
//     }
// });


// // -----Search enter funtionality --------
// // Handle Enter key press on the search input
// document.addEventListener('DOMContentLoaded', function () {
//     const searchInput = document.getElementById('searchInput');
//     const suggestions = document.getElementById('suggestions');

//     searchInput.addEventListener('keydown', function (event) {
//         if (event.key === 'Enter') {
//             event.preventDefault(); // Prevent form submission or default action

//             const query = searchInput.value.trim();
//             if (query.length >= 1) {
//                 const languageItems = document.querySelectorAll('.scrolling-bar li');
//                 let languageFound = false;

//                 languageItems.forEach(item => {
//                     if (item.textContent.trim().toLowerCase() === query.toLowerCase()) {
//                         item.click(); // Trigger click event to select the language
//                         item.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Scroll the item into view
//                         languageFound = true;
//                     }
//                 });

//                 if (!languageFound) {
//                     // Handle the case where the language is not found
//                     suggestions.innerHTML = '<a class="dropdown-item">Result not found</a>';
//                     suggestions.classList.add('show');
//                 } else {
//                     // Clear suggestions when a valid language is found
//                     suggestions.innerHTML = '';
//                     suggestions.classList.remove('show');
//                 }
//             } else {
//                 // Handle the case where the query is too short
//                 suggestions.innerHTML = '<a class="dropdown-item">Please enter at least 2 characters</a>';
//                 suggestions.classList.add('show');
//             }
//         }
//     });
// });




// ------------------------------------------------------------------
// -----------------navbar close

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


// ----------------------------------------------------------------------

// --------------Navbar dropdown------------------------
document.addEventListener("DOMContentLoaded", function () {
    const categories = {
        "Programming": ["Html", "CSS", "JavaScript", "Bootstrap", "Java", "C language", "C++", "#C", "Ruby on Rails", "Scala", "Python", "swift", "Kotlin", "PHP", "React", "React Node Js", "Database", "Jquery", "XML", "MySql", "Django", "Numpy", "Pandas", "Nodejs", "Nextjs", "React Native", "Angular", "Git", "MongoBD", "ASP", "SAAS", "VUE", "DSA"],
        "Design & Creativity": ["Graphic Design", "UI/UX Design", "Animation & VFX", "Photography", "Video Editing", "Game Design", "3D Modeling", "Illustration & Digital Art"],
        "Business & Marketing": ["Entrepreneurship", "Digital Marketing", " SEO & Content Writing", "Business Strategy", "Finance & Accounting", "Project Management", "Sales & Negotiation", "Human Resources"],
        "Engineering": ["Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Aeronautical Engineering", "Chemical Engineering", "Biomedical Engineering", "Industrial Engineering", "Robotics"],
        "Science & Mathematics": [" Physics", "Chemistry", "Biology", "Mathematics", "Environmental Science", "Astronomy & Space Science", "Geology", "Nanotechnology","Bio Phyics","Bio Chemistry"],
        "Personal Development": ["Time Management", "Leadership Skills", "Public Speaking", "Emotional Intelligence", "Mindfulness & Meditation", "Productivity Hacks", "Career Development", "Language Learning"],
        "Health & Fitness": ["Nutrition", "Physical Fitness", "Yoga & Meditation", "Mental Health", "Personal Training", "Sports Science", "Wellness Coaching", "Diet & Weight Loss"],
        "Arts & Humanities": ["History ", "Philosophy", "Literature", "Music Theory", "Cultural Studies", "Religious Studies", "Languages & Linguistics"],
        "Kids & Education": ["Quran reading Basic","Cartoons & Animation", "Educational Games", "Storytelling & Reading", "Math for Kids", "Science Experiments", "Language Learning", "Art & Craft", "Coding for Kids"],
        "Miscellaneous": ["Cooking & Culinary Arts", "Cooking & Culinary Arts", "DIY & Home Improvement", "Travel ", "Adventure", "Photography", "Pet Care & Training", "Fashion", "Beauty"],
        "Sports": [
            "Football", "Cricket", "Hockey", "Baseball", "Basketball", "Tennis", "Golf", "Rugby", "Swimming", "Cycling", "Volleyball", "Badminton", "Athletics", "Boxing", "Wrestling"
        ],
        "Entertainment": ["Songs", "Comedy", "Dancing", "Netflix Seasons", "English Movies", "Dramas", "Punjabi Movies"],
    };


    const dropdownMenu = document.getElementById('mainCategoriesDropdown');

    // Populate dropdown with main categories
    for (let category in categories) {
        const categoryItem = document.createElement('a');
        categoryItem.className = 'dropdown-item';
        categoryItem.textContent = category;
        categoryItem.href = "#"; // Optional: add href if you want to navigate to a specific page
        categoryItem.addEventListener('click', function () {
            // Store selected category in localStorage
            localStorage.setItem('selectedCategoryName', category);
            localStorage.setItem('subcategories', JSON.stringify(categories[category]));

            // Redirect or perform another action, e.g., reload the page to reflect the selected category
            window.location.href = "dashboard.html";
        });
        dropdownMenu.appendChild(categoryItem);
    }
});

