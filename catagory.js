document.addEventListener("DOMContentLoaded", function () {
    const categories = {
        "Programming": ["Html", "CSS", "JavaScript", "Bootstrap", "Java", "C language", "C++", "#C", "Ruby on Rails", "Python", "swift", "Kotlin", "PHP", "React", "Database", "Jquery", "XML", "MySql", "Django", "Numpy", "Pandas", "Nodejs", "Nextjs", "React Native", "Angular", "Git", "MongoBD", "ASP", "SAAS", "VUE", "DSA"],
        "Design & Creativity": ["Graphic Design", "UI/UX Design", "Animation & VFX", "Photography", "Video Editing", "Game Design", "3D Modeling", "Illustration & Digital Art"],
        "Business & Marketing": ["Entrepreneurship", "Digital Marketing", " SEO & Content Writing", "Business Strategy", "Finance & Accounting", "Project Management", "Sales & Negotiation", "Human Resources"],
        "Engineering": ["Electrical Engineering", "Mechanical Engineering", "Civil Engineering", "Aeronautical Engineering", "Chemical Engineering", "Biomedical Engineering", "Industrial Engineering", "Robotics"],
        "Science & Mathematics": [" Physics", "Chemistry", "Biology", "Mathematics", "Environmental Science", "Astronomy & Space Science", "Geology", "Nanotechnology"],
        "Personal Development": ["Time Management", "Leadership Skills", "Public Speaking", "Emotional Intelligence", "Mindfulness & Meditation", "Productivity Hacks", "Career Development", "Language Learning"],
        "Health & Fitness": ["Nutrition", "Physical Fitness", "Yoga & Meditation", "Mental Health", "Personal Training", "Sports Science", "Wellness Coaching", "Diet & Weight Loss"],
        "Arts & Humanities": ["History ", "Philosophy", "Literature", "Music Theory", "Cultural Studies", "Religious Studies", "Languages & Linguistics"],
        "Kids & Education": ["Cartoons & Animation", "Educational Games", "Storytelling & Reading", "Math for Kids", "Science Experiments", "Language Learning", "Art & Craft", "Coding for Kids"],
        "Miscellaneous": ["Cooking & Culinary Arts", "Cooking & Culinary Arts", "DIY & Home Improvement", "Travel ", "Adventure", "Photography", "Pet Care & Training", "Fashion", "Beauty"],
        "Sports": ["Football", "Cricket", "Hockey", "Baseball", "Basketball", "Tennis", "Golf", "Rugby", "Swimming", "Cycling", "Volleyball", "Badminton", "Athletics", "Boxing", "Wrestling"],
        "Entertainment": ["Songs", "Comdey", "Dancing", "Sports", "NETFLIX Seasons", "English Movies", "Dramas", "Punjabi Movies"],
    };


    document.querySelectorAll('.category-card').forEach(function (card) {
        card.addEventListener('click', function () {
            const categoryTitle = this.querySelector('.category-title').textContent.trim();
            const subcategories = categories[categoryTitle];

            // Store subcategories and category name in localStorage
            localStorage.setItem('subcategories', JSON.stringify(subcategories));
            localStorage.setItem('selectedCategoryName', categoryTitle);

            // Store the first subcategory
            if (subcategories.length > 0) {
                localStorage.setItem('selectedSubcategory', subcategories[0]);
            }

            // Redirect to dashboard.html
            window.location.href = "dashboard.html";
        });
    });
});

// Populate dropdown with main categories
// for (let category in categories) {
//     const categoryItem = document.createElement('a');
//     categoryItem.className = 'dropdown-item';
//     categoryItem.textContent = category;
//     categoryItem.href = "#"; // Optional: add href if you want to navigate to a specific page
//     categoryItem.addEventListener('click', function () {
//         // Store selected category in localStorage
//         localStorage.setItem('selectedCategoryName', category);
//         localStorage.setItem('subcategories', JSON.stringify(categories[category]));

//         // Redirect or perform another action
//         window.location.href = "dashboard.html";
//     });
//     dropdownMenu.appendChild(categoryItem);
// }


// --------------------------Drop Down---------------------


    document.addEventListener("DOMContentLoaded", function () {
        const categories = {
            "Programming": ["Html", "CSS", "JavaScript", "Bootstrap", "Java", "C Language", "C++", "C#", "Ruby on Rails", "Python", "swift", "Kotlin", "PHP", "React", "Database", "Jquery", "XML", "MySql", "Django", "Numpy", "Pandas", "Nodejs", "Nextjs", "React Native", "Angular", "Git", "MongoBD", "ASP", "SAAS", "VUE", "DSA"],
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
            "Entertainment": ["Songs", "Comendy", "Dancing", "NETFLIX Seasons", "English Movies", "Dramas", "Punjabi Movies"],
        };

        document.querySelectorAll('.category-card').forEach(function (card) {
            card.addEventListener('click', function () {
                const categoryTitle = this.querySelector('.category-title').textContent.trim();
                const subcategories = categories[categoryTitle];

                // Store subcategories and category name in localStorage
                localStorage.setItem('subcategories', JSON.stringify(subcategories));
                localStorage.setItem('selectedCategoryName', categoryTitle);

                // Redirect to dashboard.html
                window.location.href = "dashboard.html";
            });
        });
    });

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
    
    