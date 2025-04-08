// Variable to store the user's mobile number
let userMobileNumber = "";

// Function to handle home click
function handleHomeClick() {
  localStorage.removeItem("token");
  window.location.href = "home.html";
}

// Function to validate the login number (10 digits)
function validateLoginNumber(el) {
  el.value = el.value.replace(/\D/g, '');
  if (el.value.length > 10) {
    document.getElementById("loginPhoneError").textContent = "Cannot exceed 10 digits.";
  } else {
    document.getElementById("loginPhoneError").textContent = "";
  }
}

// Function to send OTP to the backend
function sendOTP() {
  const loginInput = document.getElementById("loginPhoneNumber");
  const errorDiv = document.getElementById("loginPhoneError");
  const number = loginInput.value.trim();

  if (number.length !== 10) {
    errorDiv.textContent = "Enter a valid 10-digit mobile number.";
    return;
  }

  errorDiv.textContent = "";

  // Store the mobile number for OTP verification
  userMobileNumber = number;

  // Send request to backend to generate OTP
  fetch("http://localhost:8083/user/generate-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `mobileNo=${number}`,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to send OTP.");
      }
      return response.text();
    })
    .then((data) => {
      // Show the OTP popup
      document.getElementById("otpOverlay").style.display = "block";
      document.getElementById("otpPopup").style.display = "block";
    })
    .catch((error) => {
      errorDiv.textContent = error.message;
    });
}

// Function to validate OTP input (only digits)
function validateOTP(el) {
  el.value = el.value.replace(/\D/g, '');
}

// Function to verify OTP with the backend
function verifyOTP() {
  const otpInput = document.getElementById("otpInput");
  const otpError = document.getElementById("otpError");
  const otp = otpInput.value.trim();

  if (otp.length !== 6) {
    otpError.textContent = "Enter a valid 6-digit OTP.";
    return;
  }

  // Send request to backend to verify OTP
  fetch("http://localhost:8083/user/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `mobileNo=${userMobileNumber}&otp=${otp}`,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Invalid OTP. Please try again.");
      }
      return response.json();
    })
    .then((data) => {
      // Store the JWT token in localStorage
      localStorage.setItem("token", data.token);

      // Show success message
      showSuccessMessage();

      // Redirect to home page after 2 seconds
      setTimeout(() => {
        window.location.href = "home.html";
      }, 2000);
    })
    .catch((error) => {
      otpError.textContent = error.message;
    });
}

// Function to show success message
function showSuccessMessage() {
  const successMsg = document.getElementById("successMessage");
  successMsg.classList.add("show");

  // Hide the success message after 3 seconds
  setTimeout(() => {
    successMsg.classList.remove("show");
  }, 3000);
}

// Function to close the OTP popup
function closeOTPPopup() {
  document.getElementById("otpPopup").style.display = "none";
  document.getElementById("otpOverlay").style.display = "none";
}

// On page load, check if the user is already logged in
window.onload = function () {
  const token = localStorage.getItem("token");

  if (token) {
    // If the user is logged in, update the navbar
    if (document.getElementById("loginNav")) {
      document.getElementById("loginNav").style.display = "none";
    }
    if (document.getElementById("profileNav")) {
      document.getElementById("profileNav").style.display = "inline-block";
    }
  }
};