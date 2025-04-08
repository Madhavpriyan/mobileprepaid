
// Mobile menu toggle
document.getElementById('mobileMenu').addEventListener('click', function() {
  document.getElementById('navMenu').classList.toggle('active');
});

// Clear quick recharge number if Home is clicked
function handleHomeClick() {
  localStorage.removeItem("userPhoneNumber");
  window.location.href = "home.html";
}

// Update the wallet balance from localStorage
function updateWalletBalance() {
  // Get balance with better error handling
  let balanceStr = localStorage.getItem("walletBalance");
  let balance = 0;
  
  // Make sure we have a valid number
  if (balanceStr !== null && balanceStr !== "") {
    balance = parseFloat(balanceStr);
    // If parsing failed and we got NaN, reset to 0
    if (isNaN(balance)) {
      balance = 0;
    }
  }
  
  // Always ensure we have a valid number in localStorage
  localStorage.setItem("walletBalance", balance.toString());
  
  // Update the display
  document.getElementById("walletBalance").textContent = balance.toFixed(2);
}

// Show the Add Funds section
function showAddFunds() {
  document.getElementById("addFundsSection").style.display = "block";
}

// Hide the Add Funds section
function hideAddFunds() {
  document.getElementById("addFundsSection").style.display = "none";
}

// Add funds function: adds the entered amount to the wallet
function addFunds() {
  let amountInput = document.getElementById("fundsAmount");
  let amount = parseFloat(amountInput.value);
  let paymentMethod = document.getElementById("fundsPaymentMethod").value;
  
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount.");
    return;
  }
  
  // Get current balance with error handling
  let balanceStr = localStorage.getItem("walletBalance") || "0";
  let currentBalance = parseFloat(balanceStr);
  
  // Ensure we have a valid number
  if (isNaN(currentBalance)) {
    currentBalance = 0;
  }
  
  // Add the new amount
  currentBalance += amount;
  
  // Store the result as a string
  localStorage.setItem("walletBalance", currentBalance.toString());
  
  // Add transaction to history
  addTransaction("Wallet Top-up", amount, true, paymentMethod);
  
  // Update display
  updateWalletBalance();
  hideAddFunds();
  updateTransactionHistory();
  
  // Show success notification
  showNotification(`₹${amount.toFixed(2)} added successfully!`, 'success');
  
  // Clear the input field
  amountInput.value = "";
}

// Function to add transaction record
function addTransaction(description, amount, isCredit, method) {
  // Get existing transactions or initialize empty array
  let transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  
  // Create new transaction
  const transaction = {
    id: Date.now(), // Unique ID
    description: description,
    amount: amount,
    isCredit: isCredit, // true for credit, false for debit
    method: method || "N/A",
    date: new Date().toISOString()
  };
  
  // Add to beginning of array (most recent first)
  transactions.unshift(transaction);
  
  // Limit to 20 transactions to avoid localStorage bloat
  if (transactions.length > 20) {
    transactions = transactions.slice(0, 20);
  }
  
  // Save back to localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Function to update transaction history display
function updateTransactionHistory() {
  const transactionList = document.getElementById("transactionList");
  const transactions = JSON.parse(localStorage.getItem("transactions") || "[]");
  
  // Clear current list
  transactionList.innerHTML = "";
  
  if (transactions.length === 0) {
    transactionList.innerHTML = "<li class='transaction-item'>No transactions yet</li>";
    return;
  }
  
  // Add each transaction to the list
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
    
    const li = document.createElement("li");
    li.className = "transaction-item";
    li.innerHTML = `
      <div class="transaction-info">
        <div class="transaction-type">${transaction.description}</div>
        <div class="transaction-date">${formattedDate} • ${transaction.method}</div>
      </div>
      <div class="transaction-amount ${transaction.isCredit ? 'credit' : 'debit'}">
        ${transaction.isCredit ? '+' : '-'}₹${transaction.amount.toFixed(2)}
      </div>
    `;
    
    transactionList.appendChild(li);
  });
}

// Function to show notification
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = type === 'success' ? '#2dce89' : 
                                      type === 'warning' ? '#fb6340' : 
                                      type === 'error' ? '#f5365c' : '#5e72e4';
  notification.style.color = 'white';
  notification.style.padding = '15px 25px';
  notification.style.borderRadius = '5px';
  notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
  notification.style.zIndex = '1000';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s ease';
    setTimeout(() => document.body.removeChild(notification), 500);
  }, 3000);
}

// Function to handle payment page integration
function setupPaymentIntegration() {
  // Listen for payment events from payment page
  window.addEventListener('storage', function(e) {
    // Check if this is a payment event
    if (e.key === 'paymentCompleted') {
      const paymentData = JSON.parse(e.newValue || "{}");
      
      // Only process if it's a valid payment
      if (paymentData && paymentData.amount) {
        const amount = parseFloat(paymentData.amount);
        const paymentMethod = paymentData.method || "Unknown";
        const isWalletPayment = paymentMethod.toLowerCase() === 'wallet';
        
        // If paid by wallet, deduct from wallet balance
        if (isWalletPayment) {
          let currentBalance = parseFloat(localStorage.getItem("walletBalance") || "0");
          currentBalance = Math.max(0, currentBalance - amount);
          localStorage.setItem("walletBalance", currentBalance.toString());
          
          // Add transaction record
          addTransaction("Recharge Payment", amount, false, "Wallet");
          showNotification(`₹${amount.toFixed(2)} deducted from wallet`, 'info');
        } else {
          // If paid by other methods, add 20 Rs bonus
          let currentBalance = parseFloat(localStorage.getItem("walletBalance") || "0");
          currentBalance += 20;
          localStorage.setItem("walletBalance", currentBalance.toString());
          
          // Add transaction records
          addTransaction("Recharge Payment", amount, false, paymentMethod);
          addTransaction("Recharge Cashback", 20, true, "Bonus");
          
          showNotification(`Recharge successful! ₹20 cashback added to wallet`, 'success');
        }
        
        // Update UI
        updateWalletBalance();
        updateTransactionHistory();
        
        // Clear the payment completed flag
        localStorage.removeItem('paymentCompleted');
      }
    }
  });
}

// Initialize wallet with a clean slate
function initializeWallet() {
  // Only initialize if not already set
  if (!localStorage.getItem("walletBalance")) {
    localStorage.setItem("walletBalance", "500");
  }
  
  // Initialize transactions if not present
  if (!localStorage.getItem("transactions")) {
    const initialTransactions = [
      {
        id: Date.now() - 1000,
        description: "Welcome Bonus",
        amount: 500,
        isCredit: true,
        method: "System",
        date: new Date().toISOString()
      }
    ];
    localStorage.setItem("transactions", JSON.stringify(initialTransactions));
  }
}

// On page load, check if the user is logged in
window.onload = function() {
  const loggedInUser = localStorage.getItem("loggedInUser");
  
  if (!loggedInUser) {
    // Not logged in: redirect to login page
    window.location.href = "login.html";
    return;
  }
  
  // Initialize wallet and show content
  initializeWallet();
  setupPaymentIntegration();
  document.getElementById("walletDetails").style.display = "block";
  document.getElementById("loginMessage").style.display = "none";
  
  // Update wallet info
  updateWalletBalance();
  updateTransactionHistory();
};

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