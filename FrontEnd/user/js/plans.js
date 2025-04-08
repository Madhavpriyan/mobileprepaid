const API_BASE_URL = "http://localhost:8083/user";
let allPlans = [];
let selectedPlanForGuest = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded, updating navbar...");
    updateNavbar();
    loadCategories();
    loadPlans("all");

    const searchInput = document.getElementById("searchInput");
    const priceFilter = document.getElementById("priceFilter");
    const validityFilter = document.getElementById("validityFilter");

    if (searchInput) searchInput.addEventListener("input", filterAndSearchPlans);
    if (priceFilter) priceFilter.addEventListener("change", filterAndSearchPlans);
    if (validityFilter) validityFilter.addEventListener("change", filterAndSearchPlans);

    setupBackToTop();
});

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token") || ''}`
            }
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const categories = await response.json();

        const categoryList = document.getElementById("categoryList");
        if (!categoryList) {
            console.error("categoryList element not found");
            return;
        }

        categoryList.innerHTML = `
            <li><a href="#" data-category-id="all" class="active" onclick="loadPlans('all')">
                <i class="fas fa-list"></i>
                <span>All Plans</span>
            </a></li>
        `;

        categories.forEach(category => {
            const li = document.createElement("li");
            li.innerHTML = `
                <a href="#" data-category-id="${category.categoryId}" onclick="loadPlans(${category.categoryId})">
                    <i class="fas fa-folder"></i>
                    <span>${category.categoryName}</span>
                </a>
            `;
            categoryList.appendChild(li);
        });
    } catch (error) {
        console.error("Error loading categories:", error);
        const categoryList = document.getElementById("categoryList");
        if (categoryList) {
            categoryList.innerHTML = `
                <li><a href="#" data-category-id="all" class="active" onclick="loadPlans('all')">
                    <i class="fas fa-list"></i>
                    <span>All Plans</span>
                </a></li>
            `;
        }
    }
}

async function loadPlans(categoryId) {
    const plansContainer = document.getElementById("plansContainer");
    const categoryTitle = document.getElementById("categoryTitle");

    if (!plansContainer || !categoryTitle) {
        console.error("plansContainer or categoryTitle not found");
        return;
    }

    plansContainer.innerHTML = '<div class="loading-state"><div class="spinner"></div></div>';

    try {
        const url = categoryId === "all" 
            ? `${API_BASE_URL}/plans` 
            : `${API_BASE_URL}/plans/category/${categoryId}`;
        
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token") || ''}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 204) {
                showEmptyState();
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allPlans = await response.json();
        categoryTitle.textContent = categoryId === "all" 
            ? "All Plans" 
            : allPlans[0]?.category?.categoryName || "Plans";
        
        displayPlans(allPlans);
        updateSidebarActive(categoryId);
    } catch (error) {
        console.error("Error loading plans:", error);
        showErrorState("Error Loading Plans", error.message);
    }
}

function displayPlans(plans) {
    const plansContainer = document.getElementById("plansContainer");
    if (!plansContainer) return;

    plansContainer.innerHTML = "";

    if (plans.length === 0) {
        showEmptyState();
        return;
    }

    plans.forEach(plan => {
        const planCard = document.createElement("div");
        planCard.className = "plan-card";
        planCard.innerHTML = `
            <div class="plan-icon">
                <i class="fas fa-wifi"></i>
            </div>
            <div class="plan-details">
                <div class="plan-price">₹${plan.planPrice}</div>
                <div class="plan-features">${plan.planName}</div>
                <div class="plan-validity">Validity: ${plan.validity}</div>
            </div>
            <div class="plan-actions">
                <button class="btn btn-outline view-details-btn">
                    <i class="fas fa-info-circle"></i> View Details
                </button>
                <button class="btn btn-primary get-plan-btn">
                    <i class="fas fa-shopping-cart"></i> Get Plan
                </button>
            </div>
        `;

        const viewDetailsBtn = planCard.querySelector('.view-details-btn');
        const getPlanBtn = planCard.querySelector('.get-plan-btn');

        viewDetailsBtn?.addEventListener('click', () => viewPlanDetails(plan));
        getPlanBtn?.addEventListener('click', () => selectPlan(plan));

        plansContainer.appendChild(planCard);
    });
}

async function selectPlan(plan) {
    console.log("Plan selected:", plan.planName);
    const token = localStorage.getItem("token");
    const quickRechargeNumber = localStorage.getItem("userPhoneNumber");
    
    try {
        let mobileNumber;
        
        if (quickRechargeNumber) {
            mobileNumber = quickRechargeNumber;
            console.log("Using quick recharge number from home page:", mobileNumber);
            
            if (token) {
                await updateQuickNumber(mobileNumber);
            }
        } 
        else if (token) {
            const user = await fetchUserProfile(token);
            mobileNumber = user.mobileNo;
            console.log("Using logged-in user's number:", mobileNumber);
        } 
        else {
            selectedPlanForGuest = plan;
            showMobileNumberPopup();
            return;
        }

        proceedToPayment(plan, mobileNumber);
    } catch (error) {
        console.error("Error in selectPlan:", error);
        alert(`Error: ${error.message}`);
    }
}

async function updateQuickNumber(quickNumber) {
    try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/update-mobile`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `quickNumber=${encodeURIComponent(quickNumber)}`
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to update quick number");
        }
        
        console.log("Quick number updated in DB");
    } catch (error) {
        console.error("Update quick number error:", error);
        throw error;
    }
}

async function fetchUserProfile(token) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: { 
            "Authorization": `Bearer ${token}` 
        }
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user profile");
    }
    return await response.json();
}

function proceedToPayment(plan, mobileNumber) {
    localStorage.setItem("selectedPlan", JSON.stringify(plan));
    localStorage.setItem("paymentMobileNumber", mobileNumber);
    localStorage.removeItem("userPhoneNumber");
    window.location.href = "payment.html";
}

function showMobileNumberPopup() {
    const popup = document.getElementById("mobileNumberPopup");
    const overlay = document.getElementById("mobileNumberOverlay");
    
    if (popup && overlay) {
        popup.style.display = "block";
        overlay.style.display = "block";
        document.getElementById("guestMobileNumber").value = "";
        document.getElementById("guestMobileNumber").focus();
        
        const errorElement = document.getElementById("mobileNumberError");
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.style.display = "none";
        }
    }
}

function closeMobileNumberPopup() {
    const popup = document.getElementById("mobileNumberPopup");
    const overlay = document.getElementById("mobileNumberOverlay");
    
    if (popup && overlay) {
        popup.style.display = "none";
        overlay.style.display = "none";
        selectedPlanForGuest = null;
    }
}

async function proceedWithGuestRecharge() {
    const mobileNumberInput = document.getElementById("guestMobileNumber");
    const mobileNumber = mobileNumberInput.value.trim();
    const errorElement = document.getElementById("mobileNumberError") || createErrorElement();
    
    if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
        showMobileNumberError(errorElement, "Please enter a valid 10-digit mobile number");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/validate-mobile?mobileNo=${mobileNumber}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token") || ''}`
            }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to validate mobile number");
        }

        proceedWithValidatedNumber(mobileNumber);
        
    } catch (error) {
        console.error("Error validating mobile number:", error);
        showMobileNumberError(errorElement, error.message);
    }
}

function proceedWithValidatedNumber(mobileNumber) {
    if (selectedPlanForGuest) {
        localStorage.setItem("selectedPlan", JSON.stringify(selectedPlanForGuest));
        localStorage.setItem("paymentMobileNumber", mobileNumber);
        localStorage.setItem("isGuestCheckout", "true");
        window.location.href = "payment.html";
    }
    closeMobileNumberPopup();
}

function createErrorElement() {
    const popup = document.getElementById("mobileNumberPopup");
    const errorElement = document.createElement("div");
    errorElement.id = "mobileNumberError";
    errorElement.style.color = "var(--primary)";
    errorElement.style.marginBottom = "1rem";
    errorElement.style.display = "none";
    popup.insertBefore(errorElement, popup.querySelector(".popup-buttons"));
    return errorElement;
}

function showMobileNumberError(element, message) {
    element.textContent = message;
    element.style.display = "block";
    document.getElementById("guestMobileNumber").focus();
}

function viewPlanDetails(plan) {
    const popup = document.getElementById("planDetailsPopup");
    const overlay = document.getElementById("blurOverlay");

    if (!popup || !overlay) return;

    document.getElementById("popupPlanName").textContent = plan.planName;
    document.getElementById("popupPlanPrice").textContent = `₹${plan.planPrice}`;
    document.getElementById("popupPlanValidity").textContent = plan.validity;
    document.getElementById("popupPlanDescription").textContent = 
        plan.planDetailsContent || plan.benefits || "No additional details available.";

    popup.style.display = "block";
    overlay.style.display = "block";
}

function closePlanDetails() {
    const popup = document.getElementById("planDetailsPopup");
    const overlay = document.getElementById("blurOverlay");

    if (popup && overlay) {
        popup.style.display = "none";
        overlay.style.display = "none";
    }
}

function showErrorState(title, message) {
    const plansContainer = document.getElementById("plansContainer");
    if (!plansContainer) return;

    plansContainer.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}

function showEmptyState() {
    const plansContainer = document.getElementById("plansContainer");
    if (!plansContainer) return;

    plansContainer.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <h3>No Plans Available</h3>
            <p>No plans match your criteria. Try adjusting your filters or search.</p>
        </div>
    `;
}

function filterAndSearchPlans() {
    const searchTerm = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const priceFilter = document.getElementById("priceFilter")?.value || "";
    const validityFilter = document.getElementById("validityFilter")?.value || "";

    let filteredPlans = [...allPlans];

    if (searchTerm) {
        filteredPlans = filteredPlans.filter(plan => 
            plan.planName.toLowerCase().includes(searchTerm) ||
            plan.benefits?.toLowerCase().includes(searchTerm)
        );
    }

    if (priceFilter) {
        const [min, max] = priceFilter.split("-").map(Number);
        filteredPlans = filteredPlans.filter(plan => {
            const price = Number(plan.planPrice);
            return max ? (price >= min && price <= max) : (price >= min);
        });
    }

    if (validityFilter) {
        const [min, max] = validityFilter.split("-").map(Number);
        filteredPlans = filteredPlans.filter(plan => {
            const days = Number(plan.validity.replace(/[^0-9]/g, ""));
            return max ? (days >= min && days <= max) : (days >= min);
        });
    }

    displayPlans(filteredPlans);
}

function updateSidebarActive(categoryId) {
    const links = document.querySelectorAll(".categories a");
    links.forEach(link => {
        link.classList.toggle("active", 
            link.getAttribute("data-category-id") === String(categoryId));
    });
}

function setupBackToTop() {
    const backToTopButton = document.getElementById("backToTop");
    if (!backToTopButton) return;

    window.addEventListener("scroll", () => {
        backToTopButton.style.display = window.scrollY > 300 ? "flex" : "none";
    });

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

function updateNavbar() {
    const loginNav = document.getElementById("loginNav");
    const profileNav = document.getElementById("profileNav");
    const token = localStorage.getItem("token");

    if (loginNav && profileNav) {
        loginNav.style.display = token ? "none" : "block";
        profileNav.style.display = token ? "block" : "none";
    }
}

window.addEventListener("storage", updateNavbar);