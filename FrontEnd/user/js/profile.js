
// Navigation scripts
const menuToggle = document.getElementById("menuToggle");
const navContainer = document.getElementById("navContainer");
const navbar = document.getElementById("navbar");
const blurredNavbar = document.getElementById("blurredNavbar");

menuToggle.addEventListener("click", function () {
    navContainer.classList.toggle("show");
});

document.addEventListener("click", function (event) {
    if (!menuToggle.contains(event.target) && !navContainer.contains(event.target)) {
        navContainer.classList.remove("show");
    }
});

window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        navbar.classList.add("hidden");
        blurredNavbar.classList.add("show");
    } else {
        navbar.classList.remove("hidden");
        blurredNavbar.classList.remove("show");
    }
});

// Back to top button
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", function() {
    if (window.scrollY > 200) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});

backToTop.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
});

// User Profile Functions
function getUserProfile() {
    const userProfileStr = localStorage.getItem("userProfile");
    if (userProfileStr) {
        const userProfile = JSON.parse(userProfileStr);
        document.getElementById("profileName").innerText = userProfile.name || "User";
        document.getElementById("userName").innerText = userProfile.name || "User";
        document.getElementById("userEmail").innerText = userProfile.email || "user@example.com";
        document.getElementById("userPhone").innerText = userProfile.phone || "";
        return userProfile;
    }
    return null;
}

function handleHomeClick() {
    // Clear only the quick recharge number
    localStorage.removeItem("userPhoneNumber");
    window.location.href = "home.html";
}

function toggleEditProfileForm() {
    const profileInfoCard = document.getElementById("profileInfoCard");
    const editProfileForm = document.getElementById("editProfileForm");
    
    if (profileInfoCard.style.display !== "none") {
        profileInfoCard.style.display = "none";
        editProfileForm.style.display = "block";
        
        // Load current values into form
        const userProfile = getUserProfile();
        document.getElementById("editName").value = userProfile.name;
        document.getElementById("editEmail").value = userProfile.email;
        document.getElementById("editPhone").value = userProfile.phone;
     
    } else {
        profileInfoCard.style.display = "block";
        editProfileForm.style.display = "none";
    }
}

function saveProfileChanges() {
    const name = document.getElementById("editName").value;
    const email = document.getElementById("editEmail").value;
    const phone = document.getElementById("editPhone").value;
    
    
    // Validate inputs
    if (!name || !email) {
        alert("Name and email are required!");
        return;
    }
    
    // Save profile data
    const userProfile = {
        name: name,
        email: email,
        phone: phone,
       
    };
    
    localStorage.setItem("userProfile", JSON.stringify(userProfile));
    
    // Update display
    document.getElementById("profileName").innerText = name;
    document.getElementById("userName").innerText = name;
    document.getElementById("userEmail").innerText = email;
    document.getElementById("userPhone").innerText = phone;
    
    
    // Close edit form
    toggleEditProfileForm();
    
    // Show success message
    alert("Profile updated successfully!");
}

// Transaction History Functions
function loadTransactions() {
    const transactionAccordion = document.getElementById("transactionAccordion");
    let transactions = getTransactions();
    
    // Clear existing content
    transactionAccordion.innerHTML = "";
    
    // Add transactions in reverse order (newest first)
    transactions.reverse().forEach((transaction, index) => {
        const transactionItem = document.createElement("div");
        transactionItem.className = "accordion-item";
        
        const statusBadge = getStatusBadge(transaction.status);
        
        transactionItem.innerHTML = `
            <h2 class="accordion-header" id="heading${index}">
                <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" 
                        data-bs-toggle="collapse" data-bs-target="#collapse${index}" 
                        aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse${index}">
                    Transaction ID: ${transaction.id} - ₹${transaction.amount}
                    ${statusBadge}
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                 aria-labelledby="heading${index}" data-bs-parent="#transactionAccordion">
                <div class="accordion-body">
                    <strong>Amount:</strong> ₹${transaction.amount} <br>
                    <strong>Status:</strong> ${transaction.status} <br>
                    <strong>Date:</strong> ${transaction.date} <br>
                    <strong>Plan:</strong> ${transaction.plan} <br>
                    <strong>Payment Method:</strong> ${transaction.paymentMethod}
                </div>
            </div>
        `;
        
        transactionAccordion.appendChild(transactionItem);
    });
}

function getStatusBadge(status) {
    switch(status) {
        case "Successful":
            return '<span class="badge bg-success transaction-badge">Successful</span>';
        case "Pending":
            return '<span class="badge bg-warning transaction-badge">Pending</span>';
        case "Failed":
            return '<span class="badge bg-danger transaction-badge">Failed</span>';
        default:
            return '';
    }
}

function getTransactions() {
    let transactionsJson = localStorage.getItem("transactions");
    
    if (!transactionsJson) {
        // Create default transactions if none exist
        const defaultTransactions = [
            {
                id: "TXN123456789",
                amount: "199",
                status: "Successful",
                date: "20-Feb-2025",
                plan: "Monthly Data Pack",
                paymentMethod: "UPI"
            },
            {
                id: "TXN987654321",
                amount: "299",
                status: "Pending",
                date: "19-Feb-2025",
                plan: "Unlimited Pack",
                paymentMethod: "Credit Card"
            },
            {
                id: "TXN456789123",
                amount: "149",
                status: "Failed",
                date: "18-Feb-2025",
                plan: "Weekly Pack",
                paymentMethod: "Debit Card"
            },
            {
                id: "TXN852963741",
                amount: "399",
                status: "Successful",
                date: "17-Feb-2025",
                plan: "Family Pack",
                paymentMethod: "Net Banking"
            },
            {
                id: "TXN369258147",
                amount: "599",
                status: "Successful",
                date: "15-Feb-2025",
                plan: "Premium Pack",
                paymentMethod: "UPI"
            }
        ];
        localStorage.setItem("transactions", JSON.stringify(defaultTransactions));
        return defaultTransactions;
    }
    
    return JSON.parse(transactionsJson);
}

function rechargeCurrentPlan() {
    const currentPlan = document.getElementById("currentPlan").innerText;
    const amount = currentPlan.match(/₹(\d+)/)[1];
    
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    
    // Generate a random transaction ID
    const txnId = "TXN" + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
    
    // Create new transaction
    const newTransaction = {
        id: txnId,
        amount: amount,
        status: "Successful",
        date: formattedDate,
        plan: currentPlan.replace(/^₹\d+ /, ''),
        paymentMethod: "UPI"
    };
    
    // Add to transaction history
    let transactions = getTransactions();
    transactions.push(newTransaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    
    // Update expiry date (add 30 days)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    const expDay = String(expiryDate.getDate()).padStart(2, '0');
    const expMonth = String(expiryDate.getMonth() + 1).padStart(2, '0');
    const expYear = expiryDate.getFullYear();
    const formattedExpiry = `${expDay}-${expMonth}-${expYear}`;
    
    document.getElementById("activationDate").innerText = formattedDate;
    document.getElementById("expiryDate").innerText = formattedExpiry;
    
    // Reload transactions
    loadTransactions();
}

// Initialize on page load
window.onload = function() {
    // Check login state
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (!loggedInUser) {
        window.location.href = "login.html";
        return;
    }
    
    // Show profile button, hide login button
    document.getElementById("loginNav").style.display = "none";
    document.getElementById("profileNav").style.display = "inline-block";
    
    // Load user profile and transactions
    getUserProfile();
    loadTransactions();
}
