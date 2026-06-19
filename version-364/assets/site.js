(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (toggle && mobileNav) {
        toggle.addEventListener('click', function () {
            mobileNav.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
            });
        });

        if (slides.length > 1) {
            setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    }

    var forms = Array.prototype.slice.call(document.querySelectorAll('[data-search-form]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
    var emptyState = document.querySelector('[data-empty-state]');
    var filterButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
    var activeCategory = 'all';

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function filterCards() {
        if (!cards.length) {
            return;
        }

        var input = document.querySelector('[data-search-input]');
        var keyword = normalize(input ? input.value : '');
        var visible = 0;

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute('data-title'));
            var category = card.getAttribute('data-category') || '';
            var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchesCategory = activeCategory === 'all' || category === activeCategory;
            var matched = matchesKeyword && matchesCategory;
            card.hidden = !matched;
            if (matched) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.hidden = visible !== 0;
        }
    }

    forms.forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('[data-search-input]');
            var value = input ? input.value.trim() : '';
            if (cards.length) {
                filterCards();
            } else {
                window.location.href = './movies.html?keyword=' + encodeURIComponent(value);
            }
        });
    });

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            activeCategory = button.getAttribute('data-filter-value') || 'all';
            filterButtons.forEach(function (item) {
                item.classList.toggle('active', item === button);
            });
            filterCards();
        });
    });

    var params = new URLSearchParams(window.location.search);
    var keyword = params.get('keyword');

    if (keyword) {
        var input = document.querySelector('[data-search-input]');
        if (input) {
            input.value = keyword;
            filterCards();
        }
    }
}());
