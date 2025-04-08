// dashboard.js
let categoryMap = new Map();
const API_BASE_URL = "http://localhost:8083/admin";

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
    
    if (!token) {
        window.location.href = "/mpproject/admin/html/login.html";
    } else {
        initializeDashboard(token);
    }
});

async function initializeDashboard(token) {
    showLoading(true);
    document.getElementById("currentDate").innerText = new Date().toLocaleString();

    try {
        // Run fetches independently to prevent one failure from breaking all
        const fetchPromises = [
            fetchDashboardData(token).catch(err => console.error("Dashboard data fetch failed:", err)),
            fetchRecentTransactions(token).catch(err => console.error("Recent transactions fetch failed:", err)),
            fetchQuickRechargeTransactions(token).catch(err => console.error("Quick recharge fetch failed:", err)),
            fetchUsers(token).catch(err => console.error("Users fetch failed:", err)),
            fetchExpiringPlans(token).catch(err => console.error("Expiring plans fetch failed:", err)),
            fetchAdminProfile(token).catch(err => console.error("Profile fetch failed:", err)),
            fetchCategories(token).catch(err => console.error("Categories fetch failed:", err)),
            fetchPlans(token).catch(err => console.error("Plans fetch failed:", err)),
            loadUserAnalytics(token).catch(err => console.error("Analytics fetch failed:", err))
        ];
        
        await Promise.all(fetchPromises);
        setupEventListeners(token);
        const hash = window.location.hash.substring(1);
        showSection(hash || "dashboard");
    } catch (error) {
        console.error("Unexpected error during dashboard init:", error);
        showError("Parts of the dashboard failed to load. Please refresh.");
    } finally {
        showLoading(false);
    }
}

// Utility Functions
function showLoading(show) {
    const loader = document.getElementById("loadingOverlay");
    if (loader) loader.style.display = show ? "flex" : "none";
}

function showError(message) {
    const errorAlert = document.getElementById("errorAlert");
    if (errorAlert) {
        errorAlert.textContent = message;
        errorAlert.style.display = "block";
        setTimeout(() => errorAlert.style.display = "none", 5000);
    }
}

function getStatusClass(status) {
    if (!status) return "bg-secondary";
    const statusLower = status.toLowerCase();
    return statusLower.includes("success") || statusLower.includes("completed") ? "bg-success" :
           statusLower.includes("fail") || statusLower.includes("rejected") ? "bg-danger" :
           statusLower.includes("pending") || statusLower.includes("processing") ? "bg-warning" :
           "bg-secondary";
}

function showSection(sectionId) {
    const sections = document.querySelectorAll(".section-container");
    const validSections = ["dashboard", "analytics", "plans", "users", "profile"];
    
    if (!validSections.includes(sectionId)) sectionId = "dashboard";

    sections.forEach(section => {
        section.style.display = section.id === sectionId ? "block" : "none";
    });

    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    sidebarLinks.forEach(link => {
        const linkSection = link.getAttribute("href").substring(1);
        link.classList.toggle("active", linkSection === sectionId);
    });

    if (window.innerWidth <= 992) toggleSidebar();
    window.history.pushState({}, "", `#${sectionId}`);
}

// Event Listeners
function setupEventListeners(token) {
    document.getElementById("planForm")?.addEventListener("submit", (e) => handlePlanFormSubmit(e, token));
    document.getElementById("sidebarToggle")?.addEventListener("click", toggleSidebar);
    document.getElementById("overlay")?.addEventListener("click", toggleSidebar);
    document.getElementById("addCategoryButton")?.addEventListener("click", () => {
        resetCategoryForm();
        new bootstrap.Modal(document.getElementById("addCategoryModal")).show();
    });
    document.getElementById("saveCategoryButton")?.addEventListener("click", () => handleCategoryFormSubmit(token));
    document.getElementById("sendExpiryNotifications")?.addEventListener("click", () => sendExpiryNotifications(token));
    document.getElementById("showPlanFormBtn")?.addEventListener("click", () => {
        document.getElementById("planFormContainer").style.display = "block";
        document.getElementById("categoriesContainer").style.display = "none";
        resetPlanForm();
    });
    document.getElementById("showCategoriesBtn")?.addEventListener("click", () => {
        document.getElementById("planFormContainer").style.display = "none";
        document.getElementById("categoriesContainer").style.display = "block";
    });
    document.getElementById("cancelEdit")?.addEventListener("click", () => {
        resetPlanForm();
        document.getElementById("planFormContainer").style.display = "none";
    });
    document.getElementById("logoutBtn")?.addEventListener("click", logout);
    document.getElementById("refreshTransactions")?.addEventListener("click", () => fetchRecentTransactions(token));
    document.getElementById("refreshQuickRecharge")?.addEventListener("click", () => fetchQuickRechargeTransactions(token));
    document.getElementById("refreshExpiringPlans")?.addEventListener("click", () => fetchExpiringPlans(token));

    setupSidebarNavigation();
}

function setupSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll(".sidebar-link");
    sidebarLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute("href").substring(1);
            showSection(sectionId);
        });
    });
}

function resetPlanForm() {
    document.getElementById("planForm").reset();
    document.getElementById("planId").value = "";
    document.getElementById("formTitle").innerText = "Add New Recharge Plan";
    document.getElementById("formButton").innerText = "Add Plan";
}

// Fetch Functions with better error handling
async function fetchDashboardData(token) {
    const endpoints = [
        { url: `${API_BASE_URL}/total-plans`, id: "totalPlans", key: "totalPlans" },
        { url: `${API_BASE_URL}/admin/users/count-active-users`, id: "totalUsers" },
        { url: `${API_BASE_URL}/recent-transactions`, id: "totalTransactions", process: data => data.length }
    ];

    for (const { url, id, key, process } of endpoints) {
        try {
            const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            if (response.ok) {
                const data = await response.json();
                document.getElementById(id).innerText = process ? process(data) : (key ? data[key] : data);
            } else {
                console.warn(`Failed to fetch ${id}: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error fetching ${id}:`, error);
        }
    }
}

async function fetchRecentTransactions(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/recent-transactions`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const transactions = await response.json() || [];
        const table = document.getElementById("recentTransactionsTable");
        table.innerHTML = transactions.length === 0 ? 
            `<tr><td colspan="14">No transactions found</td></tr>` :
            transactions.map(t => `
                <tr>
                    <td>${t.transactionId || "N/A"}</td>
                    <td>${t.orderId || "N/A"}</td>
                    <td>${t.user?.username || "N/A"}</td>
                    <td>${t.phoneNumber || "N/A"}</td>
                    <td>${t.planName || "N/A"}</td>
                    <td>${t.categoryName || "N/A"}</td>
                    <td>₹${t.price || 0}</td>
                    <td>${t.validity || "N/A"}</td>
                    <td>${t.transactionDateTime ? new Date(t.transactionDateTime).toLocaleString() : "N/A"}</td>
                    <td>${t.expiryDate ? new Date(t.expiryDate).toLocaleDateString() : "N/A"}</td>
                    <td>${t.daysToExpiry !== null ? t.daysToExpiry : "N/A"}</td>
                    <td><span class="badge ${getStatusClass(t.paymentStatus)}">${t.paymentStatus || "N/A"}</span></td>
                    <td>${t.paymentMethod || "N/A"}</td>
                    <td>${t.isQuickRecharge ? "Yes" : "No"}</td>
                </tr>
            `).join("");
    } catch (error) {
        console.error("Error fetching recent transactions:", error);
        document.getElementById("recentTransactionsTable").innerHTML = `<tr><td colspan="14">Error loading transactions</td></tr>`;
    }
}

async function fetchQuickRechargeTransactions(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/quick-recharge-transactions`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const transactions = await response.json() || [];
        const table = document.getElementById("quickRechargeTable");
        table.innerHTML = transactions.length === 0 ? 
            `<tr><td colspan="8">No quick recharge transactions</td></tr>` :
            transactions.map(t => `
                <tr>
                    <td>${t.user?.username || "N/A"}</td>
                    <td>${t.user?.mobileNo || "N/A"}</td>
                    <td>${t.plan?.planName || "N/A"}</td>
                    <td>${t.plan?.category?.categoryName || "N/A"}</td>
                    <td>₹${t.price || 0}</td>
                    <td>${t.transactionDateTime ? new Date(t.transactionDateTime).toLocaleString() : "N/A"}</td>
                    <td><span class="badge ${getStatusClass(t.paymentStatus)}">${t.paymentStatus || "N/A"}</span></td>
                    <td>${t.isQuickRecharge ? "Yes" : "No"}</td>
                </tr>
            `).join("");
    } catch (error) {
        console.error("Error fetching quick recharge transactions:", error);
        document.getElementById("quickRechargeTable").innerHTML = `<tr><td colspan="8">Error loading quick recharge</td></tr>`;
    }
}

async function fetchUsers(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const users = await response.json() || [];
        document.getElementById("usersTableBody").innerHTML = users.map(u => `
            <tr>
                <td>${u.userId}</td>
                <td>${u.username}</td>
                <td>${u.mobileNo}</td>
                <td>${u.email || "N/A"}</td>
                <td><span class="badge bg-${u.status === "ACTIVE" ? "success" : "danger"}">${u.status}</span></td>
                <td><button class="btn btn-sm btn-warning" onclick="toggleUserStatus(${u.userId}, '${u.status === "ACTIVE" ? "DEACTIVE" : "ACTIVE"}')">Toggle</button></td>
            </tr>
        `).join("");
    } catch (error) {
        console.error("Error fetching users:", error);
        document.getElementById("usersTableBody").innerHTML = `<tr><td colspan="6">Error loading users</td></tr>`;
    }
}

async function fetchExpiringPlans(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/expiring-plans`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) {
            console.warn(`Expiring plans fetch failed with status: ${response.status}`);
            throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        const plans = text ? JSON.parse(text) : []; // Handle empty response
        const table = document.getElementById("expiringPlansTableBody");
        table.innerHTML = plans.length === 0 ?
            `<tr><td colspan="6">No expiring plans</td></tr>` :
            plans.map(t => `
                <tr>
                    <td>${t.user?.userId || "N/A"}</td>
                    <td>${t.user?.username || "N/A"}</td>
                    <td>${t.user?.mobileNo || "N/A"}</td>
                    <td>${t.plan?.planName || "N/A"}</td>
                    <td>${t.plan?.category?.categoryName || "N/A"}</td>
                    <td>${t.expiryDate ? new Date(t.expiryDate).toLocaleDateString() : "N/A"}</td>
                </tr>
            `).join("");
    } catch (error) {
        console.error("Error fetching expiring plans:", error);
        document.getElementById("expiringPlansTableBody").innerHTML = `<tr><td colspan="6">Error loading expiring plans: ${error.message}</td></tr>`;
    }
}

async function fetchAdminProfile(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const admin = await response.json() || {};
        document.getElementById("adminUsername").value = admin.username || "N/A";
        document.getElementById("adminEmail").value = admin.email || "N/A";
        document.getElementById("adminLastLogin").value = admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "N/A";
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        document.getElementById("adminUsername").value = "Error";
        document.getElementById("adminEmail").value = "Error";
        document.getElementById("adminLastLogin").value = "Error";
    }
}

async function fetchCategories(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const categories = await response.json() || [];
        categoryMap.clear();
        categories.forEach(c => categoryMap.set(c.categoryId, c.categoryName));
        document.getElementById("categoriesTableBody").innerHTML = categories.map(c => `
            <tr data-category-id="${c.categoryId}">
                <td>${c.categoryId}</td>
                <td>${c.categoryName}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editCategory(${c.categoryId})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteCategory(${c.categoryId})">Delete</button>
                </td>
            </tr>
        `).join("");
        const dropdown = document.getElementById("planCategory");
        dropdown.innerHTML = `<option value="" selected disabled>Select Category</option>` + 
            categories.map(c => `<option value="${c.categoryName}">${c.categoryName}</option>`).join("");
    } catch (error) {
        console.error("Error fetching categories:", error);
        document.getElementById("categoriesTableBody").innerHTML = `<tr><td colspan="3">Error loading categories</td></tr>`;
    }
}

async function fetchPlans(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/plans`, { headers: { Authorization: `Bearer ${token}` } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const plans = await response.json() || [];
        document.getElementById("plansTableBody").innerHTML = plans.length === 0 ?
            `<tr><td colspan="7">No plans available</td></tr>` :
            plans.map(p => `
                <tr data-plan-id="${p.planId}">
                    <td>${p.planId}</td>
                    <td>${p.planName}</td>
                    <td>₹${p.planPrice}</td>
                    <td>${p.planDetailsContent || "N/A"}</td>
                    <td>${p.validity}</td>
                    <td>${p.category?.categoryName || "N/A"}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editPlan(${p.planId})">Modify</button>
                        <button class="btn btn-sm btn-danger" onclick="deletePlan(${p.planId})">Delete</button>
                    </td>
                </tr>
            `).join("");
    } catch (error) {
        console.error("Error fetching plans:", error);
        document.getElementById("plansTableBody").innerHTML = `<tr><td colspan="7">Error loading plans</td></tr>`;
    }
}

// CRUD Operations (unchanged for brevity, but add error handling if needed)
async function handlePlanFormSubmit(e, token) {
    e.preventDefault();
    const planId = document.getElementById("planId").value;
    const planData = {
        planName: document.getElementById("planName").value,
        planPrice: parseFloat(document.getElementById("planAmount").value),
        planDetailsContent: document.getElementById("planDescription").value,
        validity: document.getElementById("planValidity").value,
        categoryName: document.getElementById("planCategory").value
    };

    try {
        const url = planId ? `${API_BASE_URL}/plans/${planId}` : `${API_BASE_URL}/plans`;
        const method = planId ? "PUT" : "POST";
        const response = await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(planData)
        });
        if (response.ok) {
            alert(`Plan ${planId ? "updated" : "added"} successfully!`);
            await fetchPlans(token);
            resetPlanForm();
            document.getElementById("planFormContainer").style.display = "none";
        } else {
            alert("Failed to save plan: " + await response.text());
        }
    } catch (error) {
        console.error("Error saving plan:", error);
        alert("Error saving plan");
    }
}

async function deletePlan(planId) {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
            alert("Plan deleted successfully!");
            await fetchPlans(token);
        } else {
            alert("Failed to delete plan");
        }
    } catch (error) {
        console.error("Error deleting plan:", error);
        alert("Error deleting plan");
    }
}

async function handleCategoryFormSubmit(token) {
    const categoryId = document.getElementById("categoryId").value;
    const categoryData = { categoryName: document.getElementById("newCategoryName").value };
    try {
        const url = categoryId ? `${API_BASE_URL}/categories/${categoryId}` : `${API_BASE_URL}/categories`;
        const method = categoryId ? "PUT" : "POST";
        const response = await fetch(url, {
            method,
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(categoryData)
        });
        if (response.ok) {
            alert(`Category ${categoryId ? "updated" : "added"} successfully!`);
            bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();
            await fetchCategories(token);
            await fetchPlans(token);
        } else {
            alert("Failed to save category: " + await response.text());
        }
    } catch (error) {
        console.error("Error saving category:", error);
        alert("Error saving category");
    }
}

async function deleteCategory(categoryId) {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
            alert("Category deleted successfully!");
            await fetchCategories(token);
            await fetchPlans(token);
        } else {
            alert("Failed to delete category");
        }
    } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category");
    }
}

async function toggleUserStatus(userId, status) {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_BASE_URL}/users/status?userId=${userId}&status=${status}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
            alert("User status updated!");
            await fetchUsers(token);
        } else {
            alert("Failed to update status");
        }
    } catch (error) {
        console.error("Error toggling user status:", error);
        alert("Error updating user status");
    }
}

async function sendExpiryNotifications(token) {
    if (!confirm("Send expiry notifications?")) return;
    try {
        const response = await fetch(`${API_BASE_URL}/send-expiry-notifications`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });
        alert(response.ok ? "Notifications sent!" : "Failed to send notifications");
    } catch (error) {
        console.error("Error sending notifications:", error);
        alert("Error sending notifications");
    }
}

async function loadUserAnalytics(token) {
    try {
        const statusResponse = await fetch(`${API_BASE_URL}/users/count-by-status`, { headers: { Authorization: `Bearer ${token}` } });
        if (!statusResponse.ok) throw new Error(`HTTP ${statusResponse.status}`);
        const statusData = await statusResponse.json() || {};

        const transactionData = {
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            userCounts: [120, 150, 180, 200, 220, 250],
            transactionCounts: [50, 75, 90, 110, 130, 150]
        };

        if (document.getElementById("userActivityChart")) {
            new Chart(document.getElementById("userActivityChart"), {
                type: "line",
                data: {
                    labels: transactionData.months,
                    datasets: [{ label: "Active Users", data: transactionData.userCounts, borderColor: "#4361ee", fill: true }]
                },
                options: { responsive: true, scales: { y: { beginAtZero: true } } }
            });
        }

        if (document.getElementById("userDemographicsChart")) {
            new Chart(document.getElementById("userDemographicsChart"), {
                type: "pie",
                data: {
                    labels: ["18-25", "26-35", "36-45", "46+"],
                    datasets: [{ data: [300, 450, 200, 150], backgroundColor: ["#3a0ca3", "#4361ee", "#0077b6", "#00b4d8"] }]
                },
                options: { responsive: true }
            });
        }

        if (document.getElementById("userStatusChart")) {
            new Chart(document.getElementById("userStatusChart"), {
                type: "doughnut",
                data: {
                    labels: Object.keys(statusData),
                    datasets: [{ data: Object.values(statusData), backgroundColor: ["#2a9d8f", "#e63946", "#457b9d"] }]
                },
                options: { responsive: true }
            });
        }

        if (document.getElementById("transactionTrendsChart")) {
            new Chart(document.getElementById("transactionTrendsChart"), {
                type: "bar",
                data: {
                    labels: transactionData.months,
                    datasets: [{ label: "Transactions", data: transactionData.transactionCounts, backgroundColor: "#2a9d8f" }]
                },
                options: { responsive: true, scales: { y: { beginAtZero: true } } }
            });
        }
    } catch (error) {
        console.error("Error loading analytics:", error);
        showError("Failed to load analytics data");
    }
}

// Helper Functions
function editPlan(planId) {
    const row = document.querySelector(`tr[data-plan-id="${planId}"]`);
    document.getElementById("planId").value = planId;
    document.getElementById("planName").value = row.cells[1].textContent;
    document.getElementById("planAmount").value = row.cells[2].textContent.replace("₹", "");
    document.getElementById("planDescription").value = row.cells[3].textContent;
    document.getElementById("planValidity").value = row.cells[4].textContent;
    document.getElementById("planCategory").value = row.cells[5].textContent;
    document.getElementById("formTitle").innerText = "Edit Recharge Plan";
    document.getElementById("formButton").innerText = "Update Plan";
    document.getElementById("planFormContainer").style.display = "block";
    document.getElementById("categoriesContainer").style.display = "none";
}

function editCategory(categoryId) {
    const row = document.querySelector(`tr[data-category-id="${categoryId}"]`);
    document.getElementById("categoryId").value = categoryId;
    document.getElementById("newCategoryName").value = row.cells[1].textContent;
    document.getElementById("addCategoryModalLabel").innerText = "Edit Category";
    new bootstrap.Modal(document.getElementById("addCategoryModal")).show();
}

function resetCategoryForm() {
    document.getElementById("categoryForm").reset();
    document.getElementById("categoryId").value = "";
    document.getElementById("addCategoryModalLabel").innerText = "Add New Category";
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("token");
        window.location.href = "/mpproject/admin/html/login.html";
    }
}

function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("sidebar-open");
    document.getElementById("overlay").classList.toggle("active");
}

// Global functions for HTML
window.toggleUserStatus = toggleUserStatus;
window.editPlan = editPlan;
window.deletePlan = deletePlan;
window.editCategory = editCategory;
window.deleteCategory = deleteCategory;
window.logout = logout;