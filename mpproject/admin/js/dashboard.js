

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
      { id: 1, amount: 199, description: "Unlimited calls + 1.5GB/day data" },
      { id: 2, amount: 299, description: "Unlimited calls + 2GB/day data" }
    ];

    function renderPlans() {
      const tbody = document.getElementById("plansTableBody");
      tbody.innerHTML = "";
      plans.forEach(plan => {
        tbody.innerHTML += `
          <tr data-plan-id="${plan.id}">
            <td>${plan.id}</td>
            <td>${plan.amount}</td>
            <td>${plan.description}</td>
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
      const planAmount = document.getElementById("planAmount").value;
      const planDescription = document.getElementById("planDescription").value;

      if (planId) {
        // Update existing plan
        plans = plans.map(plan => {
          if (plan.id == planId) {
            return { id: plan.id, amount: planAmount, description: planDescription };
          }
          return plan;
        });
        alert("Plan updated for Rezap with amount ₹" + planAmount + " and details: " + planDescription);
      } else {
        // Add new plan
        const newId = plans.length ? plans[plans.length - 1].id + 1 : 1;
        plans.push({ id: newId, amount: planAmount, description: planDescription });
        alert("New plan added for Rezap with amount ₹" + planAmount + " and details: " + planDescription);
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
        document.getElementById("formTitle").innerText = "Modify Recharge Plan";
        document.getElementById("formButton").innerText = "Update Plan";
        document.getElementById("cancelEdit").style.display = "inline-block";
      }
    }

    // Delete a plan
    function deletePlan(id) {if (confirm("Are you sure you want to delete this plan?")) {
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

// Sample user data - in a real application this would come from your backend
let users = [
  {
    id: 1001,
    name: "Arnav Sharma",
    phone: "+91 9876543210",
    email: "arnav.sharma@example.com",
    status: "active",
    lastRecharge: "10 Feb, 2025",
    joinedDate: "15 Dec, 2022",
    recentActivity: [
      { action: "Recharged ₹599 plan", time: "10 minutes ago" },
      { action: "Updated payment method", time: "3 days ago" },
      { action: "Recharged ₹399 plan", time: "1 month ago" }
    ]
  },
  {
    id: 1002,
    name: "Priya Patel",
    phone: "+91 9876543211",
    email: "priya.patel@example.com",
    status: "active",
    lastRecharge: "25 Feb, 2025",
    joinedDate: "20 Jan, 2023",
    recentActivity: [
      { action: "Recharged ₹249 plan", time: "25 minutes ago" },
      { action: "Viewed usage history", time: "5 days ago" },
      { action: "Updated profile information", time: "3 weeks ago" }
    ]
  },
  {
    id: 1003,
    name: "Rahul Gupta",
    phone: "+91 9876543212",
    email: "rahul.gupta@example.com",
    status: "inactive",
    lastRecharge: "15 Jan, 2025",
    joinedDate: "5 Mar, 2023",
    recentActivity: [
      { action: "Failed recharge attempt ₹399", time: "42 minutes ago" },
      { action: "Requested customer support", time: "2 days ago" },
      { action: "Recharged ₹299 plan", time: "2 months ago" }
    ]
  },
  {
    id: 1004,
    name: "Sneha Reddy",
    phone: "+91 9876543213",
    email: "sneha.reddy@example.com",
    status: "active",
    lastRecharge: "1 Mar, 2025",
    joinedDate: "10 Apr, 2023",
    recentActivity: [
      { action: "Recharged ₹499 plan", time: "1 hour ago" },
      { action: "Changed password", time: "1 week ago" },
      { action: "First login", time: "11 months ago" }
    ]
  },
  {
    id: 1005,
    name: "Vikram Singh",
    phone: "+91 9876543214",
    email: "vikram.singh@example.com",
    status: "active",
    lastRecharge: "28 Feb, 2025",
    joinedDate: "12 May, 2024",
    recentActivity: [
      { action: "Recharged ₹699 plan", time: "2 hours ago" },
      { action: "Updated email address", time: "10 days ago" },
      { action: "Created account", time: "9 months ago" }
    ]
  }
];

// Function to render users table
function renderUsersTable(filteredUsers = null) {
  const tbody = document.getElementById("usersTableBody");
  if (!tbody) return;
  
  const displayUsers = filteredUsers || users;
  tbody.innerHTML = "";
  
  displayUsers.forEach(user => {
    const statusBadge = user.status === "active" 
      ? '<span class="badge bg-success">Active</span>' 
      : '<span class="badge bg-secondary">Inactive</span>';
      
    tbody.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.phone}</td>
        <td>${user.email}</td>
        <td>${statusBadge}</td>
        <td>${user.lastRecharge}</td>
        <td>${user.joinedDate}</td>
        <td>
          <button class="btn btn-sm btn-info me-1" onclick="viewUserDetails(${user.id})">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-warning me-1" onclick="editUser(${user.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="showDeleteUserModal(${user.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  });
  
  updatePaginationInfo(displayUsers.length);
}

// Update pagination info text
function updatePaginationInfo(totalUsers) {
  const paginationInfo = document.getElementById("userPaginationInfo");
  if (paginationInfo) {
    if (totalUsers === 0) {
      paginationInfo.textContent = "0 of 0";
    } else {
      paginationInfo.textContent = `1-${Math.min(10, totalUsers)} of ${totalUsers}`;
    }
  }
}

// Function to show user details modal
function viewUserDetails(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  // Update user details in modal
  document.getElementById("userDetailName").textContent = user.name;
  document.getElementById("userInitials").textContent = getInitials(user.name);
  document.getElementById("userDetailId").textContent = user.id;
  document.getElementById("userDetailPhone").textContent = user.phone;
  document.getElementById("userDetailEmail").textContent = user.email;
  
  const statusBadge = document.getElementById("userDetailStatus");
  statusBadge.textContent = capitalizeFirstLetter(user.status);
  statusBadge.className = user.status === "active" ? "badge bg-success" : "badge bg-secondary";
  
  document.getElementById("userDetailJoined").textContent = user.joinedDate;
  
  // Populate recent activity
  const activityList = document.getElementById("userDetailActivity");
  activityList.innerHTML = "";
  
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
    activityList.innerHTML = `<li class="list-group-item px-0">No recent activity</li>`;
  }
  
  // Set up edit button to open edit modal
  document.getElementById("editUserFromDetails").onclick = function() {
    const userDetailsModal = bootstrap.Modal.getInstance(document.getElementById('userDetailsModal'));
    userDetailsModal.hide();
    editUser(userId);
  };
  
  // Show the modal
  const userDetailsModal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
  userDetailsModal.show();
}

// Function to open edit user form
function editUser(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  // Populate form fields
  document.getElementById("userId").value = user.id;
  document.getElementById("userName").value = user.name;
  document.getElementById("userPhone").value = user.phone;
  document.getElementById("userEmail").value = user.email;
  document.getElementById("userStatus").value = user.status;
  
  // Adjust password field for editing
  document.getElementById("userPassword").required = false;
  document.getElementById("userPassword").value = "";
  document.getElementById("userPassword").disabled = true;
  document.getElementById("passwordLabel").textContent = "Password (leave blank to keep unchanged)";
  document.getElementById("passwordChangeContainer").style.display = "block";
  
  // Update modal title
  document.getElementById("userFormModalLabel").textContent = "Edit User";
  
  // Toggle welcome email option
  document.getElementById("sendWelcomeEmail").checked = false;
  document.getElementById("sendWelcomeEmail").parentElement.style.display = "none";
  
  // Show modal
  const userFormModal = new bootstrap.Modal(document.getElementById('userFormModal'));
  userFormModal.show();
}

// Function to reset user form for adding new user
function resetUserForm() {
  document.getElementById("userForm").reset();
  document.getElementById("userId").value = "";
  document.getElementById("userPassword").required = true;
  document.getElementById("userPassword").disabled = false;
  document.getElementById("passwordLabel").textContent = "Password";
  document.getElementById("passwordChangeContainer").style.display = "none";
  document.getElementById("userFormModalLabel").textContent = "Add New User";
  document.getElementById("sendWelcomeEmail").parentElement.style.display = "block";
}

// Function to show delete confirmation modal
function showDeleteUserModal(userId) {
  document.getElementById("deleteUserId").value = userId;
  const deleteModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
  deleteModal.show();
}

// Function to delete a user
function deleteUser(userId) {
  users = users.filter(user => user.id !== userId);
  renderUsersTable();
  
  // Show success message
  alert(`User with ID ${userId} has been deleted successfully.`);
}

// Helper function to get initials from name
function getInitials(name) {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add event listeners once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initial render of users table
  renderUsersTable();
  
  // Add user button click - reset form and show modal
  const addNewUserBtn = document.getElementById('addNewUserBtn');
  if (addNewUserBtn) {
    addNewUserBtn.addEventListener('click', function() {
      resetUserForm();
    });
  }
  
  // Password change checkbox toggle
  const changePasswordCheck = document.getElementById('changePasswordCheck');
  if (changePasswordCheck) {
    changePasswordCheck.addEventListener('change', function() {
      const passwordField = document.getElementById('userPassword');
      passwordField.disabled = !this.checked;
      passwordField.required = this.checked;
    });
  }
  
  // Save user button click
  const saveUserBtn = document.getElementById('saveUserBtn');
  if (saveUserBtn) {
    saveUserBtn.addEventListener('click', function() {
      const form = document.getElementById('userForm');
      
      // Basic form validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      
      const userId = document.getElementById('userId').value;
      const userData = {
        name: document.getElementById('userName').value,
        phone: document.getElementById('userPhone').value,
        email: document.getElementById('userEmail').value,
        status: document.getElementById('userStatus').value,
        lastRecharge: 'N/A',
        joinedDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      
      if (userId) {
        // Update existing user
        const existingUser = users.find(u => u.id == userId);
        if (existingUser) {
          // Preserve existing properties
          userData.id = parseInt(userId);
          userData.lastRecharge = existingUser.lastRecharge;
          userData.joinedDate = existingUser.joinedDate;
          userData.recentActivity = existingUser.recentActivity;
          
          // Update user in array
          users = users.map(u => u.id == userId ? userData : u);
          alert(`User ${userData.name} has been updated successfully.`);
        }
      } else {
        // Add new user
        userData.id = Math.max(...users.map(u => u.id), 0) + 1;
        userData.recentActivity = [
          { action: "Created account", time: "Just now" }
        ];
        users.push(userData);
        alert(`New user ${userData.name} has been added successfully.`);
      }
      
      // Close modal and update table
      const modal = bootstrap.Modal.getInstance(document.getElementById('userFormModal'));
      modal.hide();
      renderUsersTable();
    });
  }
  
  // Confirm delete button click
  const confirmDeleteUserBtn = document.getElementById('confirmDeleteUserBtn');
  if (confirmDeleteUserBtn) {
    confirmDeleteUserBtn.addEventListener('click', function() {
      const userId = parseInt(document.getElementById('deleteUserId').value);
      
      // Close modal
      const modal = bootstrap.Modal.getInstance(document.getElementById('deleteUserModal'));
      modal.hide();
      
      // Delete user
      deleteUser(userId);
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
          const joinDate = new Date(user.joinedDate);
          return joinDate >= thirtyDaysAgo;
        });
      }
      
      renderUsersTable(filteredUsers);
    });
  }
});
