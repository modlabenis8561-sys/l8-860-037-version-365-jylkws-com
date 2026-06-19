(function () {
    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function setupMobileMenu() {
        var toggle = document.querySelector('[data-menu-toggle]');
        var panel = document.querySelector('[data-mobile-panel]');
        if (!toggle || !panel) {
            return;
        }
        toggle.addEventListener('click', function () {
            var isOpen = panel.classList.toggle('is-open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    }

    function setupHeroCarousel() {
        var carousel = document.querySelector('[data-hero-carousel]');
        if (!carousel) {
            return;
        }
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = Number(dot.getAttribute('data-hero-dot') || '0');
                show(index);
                start();
            });
        });

        carousel.addEventListener('mouseenter', stop);
        carousel.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function setupLocalSearch() {
        var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-local-search]'));
        inputs.forEach(function (input) {
            var scope = input.closest('main') || document;
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search-card]'));
            var clearButton = scope.querySelector('[data-clear-search]');

            function filter() {
                var query = normalize(input.value);
                cards.forEach(function (card) {
                    var haystack = [
                        card.getAttribute('data-title'),
                        card.getAttribute('data-region'),
                        card.getAttribute('data-year'),
                        card.getAttribute('data-genre'),
                        card.getAttribute('data-tags')
                    ].map(normalize).join(' ');
                    card.classList.toggle('is-hidden', Boolean(query) && haystack.indexOf(query) === -1);
                });
            }

            input.addEventListener('input', filter);
            if (clearButton) {
                clearButton.addEventListener('click', function () {
                    input.value = '';
                    filter();
                    input.focus();
                });
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupMobileMenu();
        setupHeroCarousel();
        setupLocalSearch();
    });
}());
