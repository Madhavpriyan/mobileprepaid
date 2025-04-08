// Logout functionality
function handleLogout() {
    // Clear all user data
    localStorage.clear();
    sessionStorage.clear();
    
    // Force redirect to login page
    window.location = 'login.html';
}
