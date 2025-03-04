

// Session check - Redirects to login if not logged in
function checkLogin() {
  const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  if (!isLoggedIn) {
    window.location.href = 'login.html';
  }
}

// Run on page load
checkLogin();

// Implement logout functionality
function handleLogout() {
  // Clear session storage
  sessionStorage.removeItem('loggedIn');
  // Redirect to login page
  window.location.href = 'login.html';
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add click event to logout link
  const logoutLink = document.querySelector('a[href="#logout"]');
  if (logoutLink) {
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      handleLogout();
    });
  }
  
  // Add current date to header
  const currentDateElement = document.getElementById('currentDate');
  if (currentDateElement) {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = now.toLocaleDateString('en-US', options);
  }
});
    // Navigation handling
    document.querySelectorAll('.sidebar a').forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('href').substring(1);
        document.querySelectorAll('.content > section').forEach(section => {
          section.style.display = 'none';
        });
        document.getElementById(target).style.display = 'block';
      });
    });
    
    // Show dashboard by default
    document.getElementById('dashboard').style.display = 'block';
    
    // Analytics Charts Initialization
    function initAnalyticsCharts() {
      // User Growth & Recharges Chart
      const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
      const userGrowthChart = new Chart(userGrowthCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'New Users',
              data: [150, 175, 210, 230, 245, 280, 310, 325, 340, 365, 390, 415],
              borderColor: '#4e73df',
              backgroundColor: 'rgba(78, 115, 223, 0.05)',
              pointBackgroundColor: '#4e73df',
              pointBorderColor: '#fff',
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: true,
              tension: 0.1
            },
            {
              label: 'Recharges',
              data: [620, 710, 805, 890, 950, 1020, 1140, 1190, 1240, 1310, 1395, 1460],
              borderColor: '#1cc88a',
              backgroundColor: 'rgba(28, 200, 138, 0.05)',
              pointBackgroundColor: '#1cc88a',
              pointBorderColor: '#fff',
              pointRadius: 3,
              pointHoverRadius: 5,
              fill: true,
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              mode: 'index',
              intersect: false,
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false,
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
      
      // Plan Distribution Chart
      const planDistributionCtx = document.getElementById('planDistributionChart').getContext('2d');
      const planDistributionChart = new Chart(planDistributionCtx, {
        type: 'doughnut',
        data: {
          labels: ['₹199', '₹299', '₹399', '₹499', '₹699'],
          datasets: [{
            data: [35, 25, 20, 15, 5],
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'right',
            }
          }
        }
      });
      
      // Payment Method Chart
      const paymentMethodCtx = document.getElementById('paymentMethodChart').getContext('2d');
      const paymentMethodChart = new Chart(paymentMethodCtx, {
        type: 'pie',
        data: {
          labels: ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallet'],
          datasets: [{
            data: [45, 20, 15, 12, 8],
            backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 12,
                padding: 10
              }
            }
          }
        }
      });
      
      // Activity Hours Chart
      const activityHoursCtx = document.getElementById('activityHoursChart').getContext('2d');
      const activityHoursChart = new Chart(activityHoursCtx, {
        type: 'bar',
        data: {
          labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM', '3AM'],
          datasets: [{
            label: 'User Activity',
            data: [5, 12, 15, 18, 25, 32, 22, 8],
            backgroundColor: '#4e73df',
            borderRadius: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                drawBorder: false,
                color: 'rgba(0, 0, 0, 0.05)'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
      
      // Retention Chart
      const retentionCtx = document.getElementById('retentionChart').getContext('2d');
      const retentionChart = new Chart(retentionCtx, {
        type: 'line',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
          datasets: [{
            label: 'Retention Rate',
            data: [100, 85, 78, 72, 68, 65],
            borderColor: '#36b9cc',
            backgroundColor: 'rgba(54, 185, 204, 0.1)',
            tension: 0.1,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: 50,
              max: 100,
              grid: {
                drawBorder: false,
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
      
      // Age Distribution Chart
      const ageDistributionCtx = document.getElementById('ageDistributionChart').getContext('2d');
      const ageDistributionChart = new Chart(ageDistributionCtx, {
        type: 'bar',
        data: {
          labels: ['18-24', '25-34', '35-44', '45-54', '55+'],
          datasets: [{
            label: 'Users by Age',
            data: [25, 38, 20, 12, 5],
            backgroundColor: [
              'rgba(78, 115, 223, 0.8)',
              'rgba(28, 200, 138, 0.8)',
              'rgba(54, 185, 204, 0.8)',
              'rgba(246, 194, 62, 0.8)',
              'rgba(231, 74, 59, 0.8)'
            ],
            borderRadius: 3
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                drawBorder: false,
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          }
        }
      });
      
      // Region Distribution Chart
      const regionDistributionCtx = document.getElementById('regionDistributionChart').getContext('2d');
      const regionDistributionChart = new Chart(regionDistributionCtx, {
        type: 'bar',
        data: {
          labels: ['North', 'South', 'East', 'West', 'Central'],
          datasets: [{
            label: 'Users by Region',
            data: [32, 28, 15, 18, 7],
            backgroundColor: [
              'rgba(78, 115, 223, 0.8)',
              'rgba(28, 200, 138, 0.8)',
              'rgba(54, 185, 204, 0.8)',
              'rgba(246, 194, 62, 0.8)',
              'rgba(231, 74, 59, 0.8)'
            ],
            borderRadius: 3
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                drawBorder: false,
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                callback: function(value) {
                  return value + '%';
                }
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          }
        }
      });
      
      // Chart filter for User Growth Chart
      document.querySelectorAll('[data-chart-type]').forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          
          // Remove active class from all items
          document.querySelectorAll('[data-chart-type]').forEach(el => {
            el.classList.remove('active');
          });
          
          // Add active class to clicked item
          this.classList.add('active');
          
          const chartType = this.getAttribute('data-chart-type');
          
          if (chartType === 'all') {
            userGrowthChart.data.datasets[0].hidden = false;
            userGrowthChart.data.datasets[1].hidden = false;
          } else if (chartType === 'users') {
            userGrowthChart.data.datasets[0].hidden = false;
            userGrowthChart.data.datasets[1].hidden = true;
          } else if (chartType === 'recharges') {
            userGrowthChart.data.datasets[0].hidden = true;
            userGrowthChart.data.datasets[1].hidden = false;
          }
          
          userGrowthChart.update();
        });
      });
      
      // Refresh button functionality
      document.getElementById('refreshAnalytics').addEventListener('click', function() {
        const days = document.getElementById('dateRangeSelect').value;
        alert(`Data refreshed for the last ${days} days.`);
        // In a real application, you would fetch new data here and update the charts
      });
    }
    
    // Initialize charts when page loads
    window.addEventListener('load', initAnalyticsCharts);

   // Dummy plans data (this would typically come from your backend)
let plans = [
  { id: 1, amount: 199, validity: 28, description: "Unlimited calls + 1.5GB/day data" },
  { id: 2, amount: 299, validity: 56, description: "Unlimited calls + 2GB/day data" }
];

function renderPlans() {
  const tbody = document.getElementById("plansTableBody");
  tbody.innerHTML = "";
  plans.forEach(plan => {
    tbody.innerHTML += `
      <tr data-plan-id="${plan.id}">
        <td>${plan.id}</td>
        <td>₹${plan.amount}</td>
        <td>${plan.description}</td>
        <td>${plan.validity} days</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="editPlan(${plan.id})">Modify</button>
          <button class="btn btn-sm btn-danger" onclick="deletePlan(${plan.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Handle form submission to add or update a plan
document.getElementById("planForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const planId = document.getElementById("planId").value;
  const planAmount = parseInt(document.getElementById("planAmount").value);
  const planDescription = document.getElementById("planDescription").value;
  const planValidity = parseInt(document.getElementById("planvalidity").value);

  if (planId) {
    // Update existing plan
    plans = plans.map(plan => {
      if (plan.id == planId) {
        return { 
          id: parseInt(plan.id), 
          amount: planAmount, 
          description: planDescription ,
          validity: planValidity
        };
      }
      return plan;
    });
    alert("Plan updated for Rezap with amount ₹" + planAmount + ", validity " + planValidity + " days, and details: " + planDescription);
  } else {
    // Add new plan
    const newId = plans.length ? plans[plans.length - 1].id + 1 : 1;
    plans.push({ 
      id: newId, 
      amount: planAmount, 
      description: planDescription,
      validity: planValidity
    });
    alert("New plan added for Rezap with amount ₹" + planAmount + ", validity " + planValidity + " days, and details: " + planDescription);
  }
  renderPlans();
  resetForm();
});

// Populate form for editing a plan
function editPlan(id) {
  const plan = plans.find(p => p.id === id);
  if (plan) {
    document.getElementById("planId").value = plan.id;
    document.getElementById("planAmount").value = plan.amount;
    document.getElementById("planDescription").value = plan.description;
    document.getElementById("planvalidity").value = plan.validity;
    document.getElementById("formTitle").innerText = "Modify Recharge Plan";
    document.getElementById("formButton").innerText = "Update Plan";
    document.getElementById("cancelEdit").style.display = "inline-block";
  }
}

// Delete a plan
function deletePlan(id) {
  if (confirm("Are you sure you want to delete this plan?")) {
    plans = plans.filter(p => p.id !== id);
    renderPlans();
    resetForm();
  }
}

// Reset form to default state
function resetForm() {
  document.getElementById("planForm").reset();
  document.getElementById("planId").value = "";
  document.getElementById("formTitle").innerText = "Add New Recharge Plan";
  document.getElementById("formButton").innerText = "Add Plan";
  document.getElementById("cancelEdit").style.display = "none";
}

// Cancel edit mode
document.getElementById("cancelEdit").addEventListener("click", function () {
  resetForm();
});

// Initial render of plans table
renderPlans();

    // Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const content = document.querySelector('.content');

  sidebarToggle.addEventListener('click', function() {
    sidebar.classList.toggle('sidebar-open');
    overlay.classList.toggle('active');
  });

  // Close sidebar when clicking on overlay
  overlay.addEventListener('click', function() {
    sidebar.classList.remove('sidebar-open');
    overlay.classList.remove('active');
  });

  // Close sidebar when clicking on a sidebar link on mobile
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (window.innerWidth < 992) {
        sidebar.classList.remove('sidebar-open');
        overlay.classList.remove('active');
      }
    });
  });

  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 992) {
      sidebar.classList.remove('sidebar-open');
      overlay.classList.remove('active');
    }
  });
});

// Sample user data - in a real application, this would come from your backend
let users = [
  {
    id: 1,
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    status: "active",
    lastRecharge: "₹399 on 25 Feb, 2025",
    joinedDate: "15 Jan, 2023",
    recentActivity: [
      { action: "Recharged ₹399 plan", time: "2 days ago" },
      { action: "Updated profile information", time: "1 week ago" },
      { action: "Recharged ₹199 plan", time: "1 month ago" }
    ]
  },
  {
    id: 2,
    name: "Priya Singh",
    phone: "9898765432",
    email: "priya.singh@example.com",
    status: "active",
    lastRecharge: "₹299 on 18 Feb, 2025",
    joinedDate: "03 Mar, 2023",
    recentActivity: [
      { action: "Recharged ₹299 plan", time: "2 weeks ago" },
      { action: "Login from new device", time: "3 weeks ago" },
      { action: "Changed password", time: "1 month ago" }
    ]
  },
  {
    id: 3,
    name: "Amit Kumar",
    phone: "9765432109",
    email: "amit.kumar@example.com",
    status: "inactive",
    lastRecharge: "₹199 on 10 Jan, 2025",
    joinedDate: "22 May, 2023",
    recentActivity: [
      { action: "Account deactivated", time: "1 week ago" },
      { action: "Recharged ₹199 plan", time: "2 months ago" },
      { action: "Updated email address", time: "3 months ago" }
    ]
  },
  {
    id: 4,
    name: "Sneha Patel",
    phone: "9567890123",
    email: "sneha.patel@example.com",
    status: "active",
    lastRecharge: "₹499 on 01 Mar, 2025",
    joinedDate: "14 Feb, 2025",
    recentActivity: [
      { action: "Recharged ₹499 plan", time: "3 days ago" },
      { action: "Account created", time: "18 days ago" }
    ]
  },
  {
    id: 5,
    name: "Vijay Malhotra",
    phone: "9234567890",
    email: "vijay.malhotra@example.com",
    status: "active",
    lastRecharge: "₹699 on 22 Feb, 2025",
    joinedDate: "30 Nov, 2023",
    recentActivity: [
      { action: "Recharged ₹699 plan", time: "10 days ago" },
      { action: "Submitted support ticket", time: "1 month ago" },
      { action: "Recharged ₹399 plan", time: "3 months ago" }
    ]
  }
];

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to render users table
function renderUsersTable(filteredUsers = null) {
  const usersToRender = filteredUsers || users;
  const tbody = document.getElementById('usersTableBody');
  
  if (!tbody) {
    console.error("Users table body element not found!");
    return;
  }
  
  tbody.innerHTML = '';
  
  if (usersToRender.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center">No users found</td>
      </tr>
    `;
    return;
  }
  
  usersToRender.forEach(user => {
    const statusBadgeClass = user.status === 'active' ? 'bg-success' : 'bg-danger';
    
    tbody.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.phone}</td>
        <td>${user.email}</td>
        <td><span class="badge ${statusBadgeClass}">${capitalizeFirstLetter(user.status)}</span></td>
        <td>${user.lastRecharge}</td>
        <td>${user.joinedDate}</td>
        <td>
          <button class="btn btn-sm btn-info me-1" onclick="showUserDetails(${user.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm ${user.status === 'active' ? 'btn-warning' : 'btn-success'}" onclick="showToggleStatusModal(${user.id})">
            <i class="fas fa-${user.status === 'active' ? 'ban' : 'check'}"></i> ${user.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </td>
      </tr>
    `;
  });
  
  // Update pagination info
  const paginationInfo = document.getElementById('userPaginationInfo');
  if (paginationInfo) {
    paginationInfo.textContent = `1-${usersToRender.length} of ${usersToRender.length}`;
  }
}

// Function to show user details
function showUserDetails(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) {
    console.error("User not found with ID:", userId);
    return;
  }
  
  // Set user details in the modal
  document.getElementById('userDetailsModalLabel').textContent = `User Details - ${user.name}`;
  document.getElementById('userDetailName').textContent = user.name;
  document.getElementById('userDetailId').textContent = user.id;
  document.getElementById('userDetailPhone').textContent = user.phone;
  document.getElementById('userDetailEmail').textContent = user.email;
  
  const statusBadge = document.getElementById('userDetailStatus');
  statusBadge.textContent = capitalizeFirstLetter(user.status);
  statusBadge.className = `badge ${user.status === 'active' ? 'bg-success' : 'bg-danger'}`;
  
  document.getElementById('userDetailJoined').textContent = user.joinedDate;
  
  // Set user initials
  const nameParts = user.name.split(' ');
  const initials = nameParts.length > 1 
    ? `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`
    : nameParts[0].charAt(0);
  document.getElementById('userInitials').textContent = initials.toUpperCase();
  
  // Populate recent activity
  const activityList = document.getElementById('userDetailActivity');
  activityList.innerHTML = '';
  
  if (user.recentActivity && user.recentActivity.length > 0) {
    user.recentActivity.forEach(activity => {
      activityList.innerHTML += `
        <li class="list-group-item px-0">
          <div class="d-flex justify-content-between">
            <span>${activity.action}</span>
            <span class="text-muted">${activity.time}</span>
          </div>
        </li>
      `;
    });
  } else {
    activityList.innerHTML = `
      <li class="list-group-item px-0">
        <div class="d-flex justify-content-center">
          <span class="text-muted">No recent activity</span>
        </div>
      </li>
    `;
  }
  
  // Set up the toggle status button
  const toggleStatusBtn = document.getElementById('toggleStatusBtn');
  toggleStatusBtn.textContent = user.status === 'active' ? 'Deactivate User' : 'Activate User';
  toggleStatusBtn.className = user.status === 'active' 
    ? 'btn btn-warning' 
    : 'btn btn-success';
  
  // Add event listener to the toggle status button
  toggleStatusBtn.onclick = function() {
    const detailsModal = bootstrap.Modal.getInstance(document.getElementById('userDetailsModal'));
    detailsModal.hide();
    showToggleStatusModal(userId);
  };
  
  // Show the modal
  const userDetailsModal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
  userDetailsModal.show();
}

// Function to show toggle status modal
function showToggleStatusModal(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) {
    console.error("User not found with ID:", userId);
    return;
  }
  
  document.getElementById('toggleStatusUserId').value = userId;
  document.getElementById('toggleStatusModalLabel').textContent = 
    `${user.status === 'active' ? 'Deactivate' : 'Activate'} User - ${user.name}`;
  document.getElementById('toggleStatusMessage').textContent = 
    `Are you sure you want to ${user.status === 'active' ? 'deactivate' : 'activate'} ${user.name}?`;
  
  // Set the color of the confirm button based on the action
  const confirmBtn = document.getElementById('confirmToggleStatusBtn');
  confirmBtn.className = user.status === 'active' 
    ? 'btn btn-warning' 
    : 'btn btn-success';
  confirmBtn.textContent = user.status === 'active' ? 'Deactivate' : 'Activate';
  
  const toggleStatusModal = new bootstrap.Modal(document.getElementById('toggleStatusModal'));
  toggleStatusModal.show();
}

// Function to toggle user status
function toggleUserStatus(userId) {
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    console.error("User not found with ID:", userId);
    return;
  }
  
  const oldStatus = users[userIndex].status;
  users[userIndex].status = oldStatus === 'active' ? 'inactive' : 'active';
  
  // Add activity for status change
  const statusChangeActivity = {
    action: `Status changed from ${capitalizeFirstLetter(oldStatus)} to ${capitalizeFirstLetter(users[userIndex].status)}`,
    time: "Just now"
  };
  
  if (!users[userIndex].recentActivity) {
    users[userIndex].recentActivity = [];
  }
  
  users[userIndex].recentActivity.unshift(statusChangeActivity);
  
  alert(`${users[userIndex].name}'s status has been changed to ${capitalizeFirstLetter(users[userIndex].status)}.`);
  
  // Update the table
  renderUsersTable();
}

// Initialize user management functionality
document.addEventListener('DOMContentLoaded', function() {
  console.log("Initializing user management functionality");
  
  // Show users section when link is clicked
  const usersLink = document.querySelector('a[href="#users"]');
  if (usersLink) {
    usersLink.addEventListener('click', function() {
      // Initial render of users table when the section is shown
      renderUsersTable();
    });
  }
  
  // Search functionality
  const searchUsersBtn = document.getElementById('searchUsersBtn');
  if (searchUsersBtn) {
    searchUsersBtn.addEventListener('click', function() {
      const searchQuery = document.getElementById('userSearchInput').value.toLowerCase();
      
      if (!searchQuery.trim()) {
        renderUsersTable(); // Show all users if search is empty
        return;
      }
      
      const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery) ||
        user.phone.toLowerCase().includes(searchQuery) ||
        user.email.toLowerCase().includes(searchQuery) ||
        user.id.toString().includes(searchQuery)
      );
      
      renderUsersTable(filteredUsers);
    });
  }
  
  // Filter functionality
  const userFilterSelect = document.getElementById('userFilterSelect');
  if (userFilterSelect) {
    userFilterSelect.addEventListener('change', function() {
      const filterValue = this.value;
      
      if (filterValue === 'all') {
        renderUsersTable();
        return;
      }
      
      let filteredUsers = [];
      if (filterValue === 'active' || filterValue === 'inactive') {
        filteredUsers = users.filter(user => user.status === filterValue);
      } else if (filterValue === 'new') {
        // Filter users joined in the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        filteredUsers = users.filter(user => {
          // Simple date parsing for the demo
          const parts = user.joinedDate.split(' ');
          const day = parseInt(parts[0]);
          const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(parts[1].replace(',', ''));
          const year = parseInt(parts[2]);
          
          const joinDate = new Date(year, month, day);
          return joinDate >= thirtyDaysAgo;
        });
      }
      
      renderUsersTable(filteredUsers);
    });
  }
  
  // Toggle status confirmation button
  const confirmToggleStatusBtn = document.getElementById('confirmToggleStatusBtn');
  if (confirmToggleStatusBtn) {
    confirmToggleStatusBtn.addEventListener('click', function() {
      const userId = parseInt(document.getElementById('toggleStatusUserId').value);
      toggleUserStatus(userId);
      
      // Close the modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('toggleStatusModal'));
      modal.hide();
    });
  }
  
  // Initialize pagination (demo only)
  document.querySelectorAll('.pagination .page-link').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      // In a real application, you would fetch data for the selected page
      alert('Pagination would load different users in a real application.');
    });
  });
});