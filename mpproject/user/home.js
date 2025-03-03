

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
    // Validate so that only digits are entered.
    function validateNumber(el) {
      el.value = el.value.replace(/\D/g, '');
      if (el.value.length > 10) {
        document.getElementById("phoneError").textContent = "Cannot exceed 10 digits.";
      } else {
        document.getElementById("phoneError").textContent = "";
      }
    }

    // When Home is clicked, clear the quick recharge number.
    // If logged in, keep the profile number.
    function handleHomeClick() {
      // Always clear quick recharge number.
      localStorage.removeItem("userPhoneNumber");
      // Then redirect to home.
      window.location.href = "home.html";
    }

    // Save a valid number and go to the Plans page.
    function saveNumberAndRedirect() {
      const phoneInput = document.getElementById("phoneNumber");
      const errorDiv = document.getElementById("phoneError");
      let number = phoneInput.value.trim();
      if (number.length !== 10) {
        errorDiv.textContent = "Enter a valid 10-digit mobile number.";
        return;
      }
      errorDiv.textContent = "";
      localStorage.setItem("userPhoneNumber", number);
      window.location.href = "plans.html";
    }

    // Update navbar depending on login state.
    window.onload = function() {
      if (localStorage.getItem("loggedInUser")) {
        document.getElementById("loginNav").style.display = "none";
        document.getElementById("profileNav").style.display = "inline-block";
      }
    }

    // Carousel functionality
    let currentIndex = 0;
        const totalCards = document.querySelectorAll('.card').length;
        const cardContainer = document.getElementById('cardContainer');
        const pagination = document.getElementById('pagination');
        const navButtons = document.getElementById('navButtons');

        function updateCarousel() {
            const cardWidth = document.querySelector('.card').offsetWidth + 15; // Including gap
            cardContainer.style.transform = `translateX(${-currentIndex * cardWidth}px)`;
            pagination.innerText = `${currentIndex + 1} / ${totalCards}`;
        }

        function nextSlide() {
            if (currentIndex < totalCards - 1) {
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
            if (window.innerWidth <= 768) {
                navButtons.style.display = 'flex';
            } else {
                navButtons.style.display = 'none';
            }
        }

        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();

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
