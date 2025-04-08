
  // Tab switching functionality
  function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
      button.classList.remove('active');
    });
    
    // Show selected tab content and activate button
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
  }

  // FAQ toggle functionality
  function toggleFAQ(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    
    answer.classList.toggle('show');
    
    if (icon.classList.contains('fa-chevron-down')) {
      icon.classList.remove('fa-chevron-down');
      icon.classList.add('fa-chevron-up');
    } else {
      icon.classList.remove('fa-chevron-up');
      icon.classList.add('fa-chevron-down');
    }
  }

  // Contact form submission
  document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showErrorNotification("Please enter a valid email address");
      return;
    }
    
    // Here you would typically send this data to your server
    console.log('Form submitted:', { name, email, subject, message });
    
    // Clear form
    this.reset();
    
    // Show success notification
    showNotification();
  });

  // Notification functions
  function showNotification() {
    const notification = document.getElementById('notificationCard');
    notification.classList.remove('error');
    notification.classList.add('success');
    notification.querySelector('i').className = 'fas fa-check-circle';
    notification.querySelector('h4').textContent = 'Success!';
    notification.querySelector('p').textContent = 'Thank you for your message. We will get back to you soon!';
    notification.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideNotification();
    }, 5000);
  }
  
  function showErrorNotification(message) {
    const notification = document.getElementById('notificationCard');
    notification.classList.remove('success');
    notification.classList.add('error');
    notification.querySelector('i').className = 'fas fa-exclamation-circle';
    notification.querySelector('h4').textContent = 'Error!';
    notification.querySelector('p').textContent = message;
    notification.classList.add('show');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideNotification();
    }, 5000);
  }

  function hideNotification() {
    const notification = document.getElementById('notificationCard');
    notification.classList.remove('show');
  }
  
  // Help article display function
  function showHelpArticle(articleId) {
    // This would typically load or display a help article
    // For now, we'll just show a notification with the article ID
    const notification = document.getElementById('notificationCard');
    notification.querySelector('h4').textContent = 'Help Article';
    notification.querySelector('p').textContent = `Loading help article: ${articleId}`;
    notification.classList.add('show');
    
    setTimeout(() => {
      hideNotification();
    }, 3000);
  }
  
  // Live chat function
  function startLiveChat() {
    // This would typically open a chat widget
    // For now, we'll just show a notification
    const notification = document.getElementById('notificationCard');
    notification.querySelector('h4').textContent = 'Live Chat';
    notification.querySelector('p').textContent = 'Connecting you to a support agent...';
    notification.classList.add('show');
    
    setTimeout(() => {
      hideNotification();
    }, 3000);
  }
  
  // Check if user is logged in (demo)
  function checkLoginStatus() {
    // This would normally check a cookie or session storage
    // For demo purposes, we'll just simulate a login status
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
      document.getElementById('loginNav').style.display = 'none';
      document.getElementById('profileNav').style.display = 'inline-block';
    } else {
      document.getElementById('loginNav').style.display = 'inline-block';
      document.getElementById('profileNav').style.display = 'none';
    }
  }
  
  // Run on page load
  document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
  });
