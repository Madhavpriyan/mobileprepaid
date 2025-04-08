// Toggle mobile menu on hamburger icon click
const menuToggle = document.getElementById("menuToggle");
const navContainer = document.getElementById("navContainer");
const navbar = document.getElementById("navbar");
const blurredNavbar = document.getElementById("blurredNavbar");

// Show/hide mobile menu when hamburger icon is clicked
menuToggle.addEventListener("click", function () {
    navContainer.classList.toggle("show");
});

// Close mobile menu when clicking outside
document.addEventListener("click", function (event) {
    if (!menuToggle.contains(event.target) && !navContainer.contains(event.target)) {
        navContainer.classList.remove("show");
    }
});

// Handle scroll behavior for navbar
window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        // Hide main navbar and show blurred navbar when scrolling down
        navbar.classList.add("hidden");
        blurredNavbar.classList.add("show");
    } else {
        // Show main navbar and hide blurred navbar when at top
        navbar.classList.remove("hidden");
        blurredNavbar.classList.remove("show");
    }
});

// When Home is clicked, clear the quick recharge number
function handleHomeClick() {
    // Always clear quick recharge number
    localStorage.removeItem("userPhoneNumber");
    // Then redirect to home
    window.location.href = "home.html";
}

// Update navbar depending on login state
window.onload = function() {
    if (localStorage.getItem("loggedInUser")) {
        document.getElementById("loginNav").style.display = "none";
        document.getElementById("profileNav").style.display = "inline-block";
    }
}