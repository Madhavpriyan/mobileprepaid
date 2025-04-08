document.addEventListener('DOMContentLoaded', function() {
  // DOM Elements
  const menuToggle = document.getElementById("menuToggle");
  const navContainer = document.getElementById("navContainer");
  const phoneInput = document.getElementById("phoneNumber");
  const rechargeButton = document.getElementById("rechargeButton");
  const errorDiv = document.getElementById("phoneError");
  const token = localStorage.getItem("token");

  // Initialize
  updateNavbar();
  setupMobileMenu();
  setupPhoneInputValidation();
  setupRechargeButton();
  setupCarousel();
  setupBackToTopButton();

  // Clear any previous quick recharge number
  localStorage.removeItem("userPhoneNumber");

  // Mobile Menu Functions
  function setupMobileMenu() {
    if (menuToggle) {
      menuToggle.addEventListener("click", function() {
        navContainer.classList.toggle("active");
        menuToggle.classList.toggle("active");
      });
    }

    document.addEventListener("click", function(event) {
      if (menuToggle && !menuToggle.contains(event.target) && !navContainer.contains(event.target)) {
        navContainer.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });
  }

  // Phone Input Validation
  function setupPhoneInputValidation() {
    phoneInput.addEventListener('input', function() {
      // Remove non-digits and limit to 10 characters
      this.value = this.value.replace(/\D/g, '').slice(0, 10);
      errorDiv.style.display = 'none';
    });
  }

  // Recharge Button Handler
  function setupRechargeButton() {
    rechargeButton.addEventListener('click', async function() {
      const number = phoneInput.value.trim();
      
      // Basic client-side validation
      if (!/^[6-9]\d{9}$/.test(number)) {
        showError("Please enter a valid 10-digit mobile number starting with 6-9");
        return;
      }

      try {
        // Show loading state
        rechargeButton.disabled = true;
        rechargeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Validating...';

        // Server-side validation
        const isRegistered = await checkNumberExists(number);
        if (!isRegistered) {
          showError("This number is not registered in our system");
          return;
        }

        // For logged-in users, update quickNumber in database
        if (token) {
          await updateQuickNumberInDatabase(number);
        }

        // Store number and redirect
        localStorage.setItem("userPhoneNumber", number);
        window.location.href = "plans.html";

      } catch (error) {
        showError(error.message || "Service unavailable. Please try again later.");
        console.error("Recharge error:", error);
      } finally {
        // Reset button state
        rechargeButton.disabled = false;
        rechargeButton.innerHTML = '<i class="fas fa-bolt"></i> Recharge Now';
      }
    });
  }

  // Check if number exists in database
  async function checkNumberExists(mobileNo) {
    try {
      const response = await fetchWithTimeout(
        `http://localhost:8083/user/is-number-registered?mobileNo=${mobileNo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
          }
        },
        5000 // 5 second timeout
      );

      if (response.status === 404) return false;
      if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
      
      return await response.json();
    } catch (error) {
      console.error("Number check error:", error);
      throw new Error("Unable to validate number at this time");
    }
  }

  // Update quickNumber in database
  async function updateQuickNumberInDatabase(quickNumber) {
    try {
      const response = await fetchWithTimeout(
        "http://localhost:8083/user/update-mobile",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `quickNumber=${encodeURIComponent(quickNumber)}`
        },
        5000 // 5 second timeout
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update quick number");
      }
      
      return await response.text();
    } catch (error) {
      console.error("Update error:", error);
      throw new Error("Failed to save quick number");
    }
  }

  // Helper function with timeout
  async function fetchWithTimeout(resource, options = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    
    clearTimeout(id);
    return response;
  }

  // UI Helpers
  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    phoneInput.focus();
  }

  function updateNavbar() {
    const loginNav = document.getElementById("loginNav");
    const profileNav = document.getElementById("profileNav");

    if (loginNav && profileNav) {
      loginNav.style.display = token ? "none" : "block";
      profileNav.style.display = token ? "block" : "none";
    }
  }

  // Carousel Functions
  function setupCarousel() {
    let currentIndex = 0;
    const totalCards = document.querySelectorAll('.card').length;
    const cardContainer = document.getElementById('cardContainer');
    const cardsPerView = window.innerWidth < 768 ? 1 : 3;

    function updateCarousel() {
      const translateX = -currentIndex * (100 / cardsPerView);
      cardContainer.style.transform = `translateX(${translateX}%)`;
      document.getElementById('pagination').textContent = `${currentIndex + 1} / ${totalCards}`;
    }

    function nextSlide() {
      if (currentIndex < totalCards - cardsPerView) {
        currentIndex++;
        updateCarousel();
      }
    }

    function prevSlide() {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    }

    function checkScreenSize() {
      const isMobile = window.innerWidth < 768;
      cardContainer.style.width = isMobile ? '100%' : '300%';
      currentIndex = 0;
      updateCarousel();
    }

    // Navigation buttons
    document.getElementById('nextBtn')?.addEventListener('click', nextSlide);
    document.getElementById('prevBtn')?.addEventListener('click', prevSlide);

    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
  }

  // Back to Top Button
  function setupBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
      window.addEventListener('scroll', function() {
        backToTopButton.style.display = window.scrollY > 300 ? 'flex' : 'none';
      });

      backToTopButton.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
});