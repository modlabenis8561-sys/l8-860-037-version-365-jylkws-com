document.addEventListener("DOMContentLoaded", function() {
    var toggle = document.querySelector(".mobile-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (toggle && mobileNav) {
        toggle.addEventListener("click", function() {
            var open = mobileNav.classList.toggle("is-open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var activeIndex = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach(function(slide, slideIndex) {
            slide.classList.toggle("is-active", slideIndex === activeIndex);
        });
        dots.forEach(function(dot, dotIndex) {
            dot.classList.toggle("is-active", dotIndex === activeIndex);
        });
    }

    dots.forEach(function(dot, dotIndex) {
        dot.addEventListener("click", function() {
            showSlide(dotIndex);
        });
    });

    if (slides.length > 1) {
        window.setInterval(function() {
            showSlide(activeIndex + 1);
        }, 5600);
    }

    var filterInputs = Array.prototype.slice.call(document.querySelectorAll(".card-filter"));

    function applyFilter(input) {
        var scope = input.closest("section");
        var cards = scope ? Array.prototype.slice.call(scope.querySelectorAll(".movie-card")) : [];
        var query = input.value.trim().toLowerCase();

        cards.forEach(function(card) {
            var haystack = [
                card.getAttribute("data-title") || "",
                card.getAttribute("data-tags") || "",
                card.getAttribute("data-year") || "",
                card.getAttribute("data-region") || "",
                card.textContent || ""
            ].join(" ").toLowerCase();

            card.classList.toggle("is-hidden-card", query && haystack.indexOf(query) === -1);
        });
    }

    filterInputs.forEach(function(input) {
        input.addEventListener("input", function() {
            applyFilter(input);
        });
    });

    var params = new URLSearchParams(window.location.search);
    var keyword = params.get("q");
    var searchInput = document.querySelector(".search-query");

    if (keyword && searchInput) {
        searchInput.value = keyword;
        applyFilter(searchInput);
        searchInput.focus();
    }
});
