 // Update navbar depending on login state
 window.onload = function() {
    if (localStorage.getItem("loggedInUser")) {
        document.getElementById("loginNav").style.display = "none";
        document.getElementById("profileNav").style.display = "inline-block";
    }
}

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
