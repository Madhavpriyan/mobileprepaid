document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const errorMessage = document.getElementById("error-message");

    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Validate inputs
        if (!username || !password) {
            errorMessage.innerText = "Please enter both username and password.";
            errorMessage.style.display = "block";
            return;
        }

        try {
            // Create form data
            const formData = new URLSearchParams();
            formData.append("username", username);
            formData.append("password", password);

            // Send username and password as form data
            const response = await fetch("http://localhost:8083/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                const token = data.token; // Assuming the backend returns a JWT token

                // Store the token in localStorage
                localStorage.setItem("token", token);

                // Redirect to the dashboard page
                window.location.href = "\\mpproject\\admin\\html\\dashboard.html";
            } else {
                const errorData = await response.json();
                errorMessage.innerText = errorData.message || "Login failed. Please check your credentials.";
                errorMessage.style.display = "block";
            }
        } catch (error) {
            console.error("Error during login:", error);
            errorMessage.innerText = "An error occurred. Please try again later.";
            errorMessage.style.display = "block";
        }
    });
});