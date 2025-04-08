const API_BASE_URL = "http://localhost:8083/payment"; // Adjust based on backend context path

document.addEventListener("DOMContentLoaded", () => {
  displayPaymentSummary();
  document.getElementById("payNowBtn").addEventListener("click", initiatePayment);
});

function displayPaymentSummary() {
  const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan"));
  const mobileNumber = localStorage.getItem("paymentMobileNumber");

  if (!selectedPlan || !mobileNumber) {
    document.getElementById("paymentSummary").innerHTML = `
      <p class="error">Error: Payment details not found. Please select a plan again.</p>
    `;
    document.getElementById("payNowBtn").disabled = true;
    return;
  }

  document.getElementById("mobileNumber").textContent = mobileNumber;
  document.getElementById("planName").textContent = selectedPlan.planName;
  document.getElementById("planPrice").textContent = selectedPlan.planPrice;
  document.getElementById("planValidity").textContent = selectedPlan.validity;
}

async function initiatePayment() {
  const selectedPlan = JSON.parse(localStorage.getItem("selectedPlan"));
  const mobileNumber = localStorage.getItem("paymentMobileNumber");
  const token = localStorage.getItem("token");
  const isGuestCheckout = localStorage.getItem("isGuestCheckout") === "true";

  try {
    // Step 1: Request payment session from backend
    const response = await fetch(`${API_BASE_URL}/initiate-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
      body: JSON.stringify({
        mobileNo: mobileNumber,
        planId: selectedPlan.planId,
        amount: selectedPlan.planPrice,
        isGuest: isGuestCheckout,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to initiate payment");
    }

    const paymentData = await response.json();
    const { paymentSessionId } = paymentData;

    // Step 2: Initialize Cashfree SDK
    const cashfree = Cashfree({
      mode: "sandbox", // Change to "production" for live environment
    });

    // Step 3: Open Cashfree checkout
    const paymentOptions = {
      paymentSessionId: paymentSessionId,
      returnUrl: "http://localhost:5501/success.html?orderId={orderId}", // Adjust port and URL
    };

    cashfree.checkout(paymentOptions).then((result) => {
      if (result.paymentDetails) {
        verifyPayment(result.paymentDetails.orderId, mobileNumber, selectedPlan.planId);
      } else if (result.error) {
        showPaymentStatus("Payment Failed", result.error.message, "error");
      }
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    showPaymentStatus("Error", "Unable to process payment. Please try again.", "error");
  }
}

async function verifyPayment(orderId, mobileNumber, planId) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
      },
      body: JSON.stringify({
        orderId: orderId,
        mobileNo: mobileNumber,
        planId: planId,
      }),
    });

    if (!response.ok) {
      throw new Error("Payment verification failed");
    }

    const result = await response.json();
    if (result.status === "SUCCESS") {
      showPaymentStatus("Payment Successful", "Your recharge has been completed!", "success");
      localStorage.removeItem("selectedPlan");
      localStorage.removeItem("paymentMobileNumber");
      localStorage.removeItem("isGuestCheckout");
      setTimeout(() => (window.location.href = "index.html"), 3000);
    } else {
      showPaymentStatus("Payment Failed", result.message || "Transaction failed.", "error");
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    showPaymentStatus("Error", "Payment verification failed. Contact support.", "error");
  }
}

function showPaymentStatus(title, message, type) {
  const statusDiv = document.getElementById("paymentStatus");
  statusDiv.innerHTML = `
    <h3>${title}</h3>
    <p>${message}</p>
  `;
  statusDiv.className = `payment-status ${type}`;
  statusDiv.style.display = "block";
  document.getElementById("payNowBtn").disabled = true;
}