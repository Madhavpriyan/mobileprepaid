// Navigation functionality
function handleLogout() {
    localStorage.clear();
    sessionStorage.clear();
    window.location = 'login.html';
}

// Toggle mobile menu on hamburger icon click
const menuToggle = document.getElementById("menuToggle");
const navContainer = document.getElementById("navContainer");
const navbar = document.getElementById("navbar");

// Show/hide mobile menu when hamburger icon is clicked
if (menuToggle) {
    menuToggle.addEventListener("click", function () {
        navContainer.classList.toggle("active");
        menuToggle.classList.toggle("active");
    });
}

// Close mobile menu when clicking outside
document.addEventListener("click", function (event) {
    if (menuToggle && !menuToggle.contains(event.target) && !navContainer.contains(event.target)) {
        navContainer.classList.remove("active");
        menuToggle.classList.remove("active");
    }
});

// When Home is clicked, clear the quick recharge number
function handleHomeClick() {
    localStorage.removeItem("userPhoneNumber");
    window.location.href = "home.html";
}

// Update navbar based on login state
function updateNavbar() {
    const loginNav = document.getElementById("loginNav");
    const profileNav = document.getElementById("profileNav");
    const loggedInUser = localStorage.getItem("loggedInUser");
    
    if (loginNav && profileNav) {
        if (loggedInUser) {
            loginNav.style.display = "none";
            profileNav.style.display = "block";
        } else {
            loginNav.style.display = "block";
            profileNav.style.display = "none";
        }
    }
}

// Initialize navbar on page load
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
    
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-links a");
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
});

// Update navbar when storage changes
window.addEventListener("storage", updateNavbar);