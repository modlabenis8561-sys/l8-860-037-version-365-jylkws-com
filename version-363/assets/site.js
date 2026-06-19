document.addEventListener('DOMContentLoaded', function() {
    var menuButton = document.querySelector('.menu-toggle');
    var mobilePanel = document.querySelector('.mobile-panel');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function() {
            mobilePanel.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-hero-slider]').forEach(function(slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
        var index = 0;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        dots.forEach(function(dot, dotIndex) {
            dot.addEventListener('click', function() {
                show(dotIndex);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function() {
                show(index + 1);
            }, 5200);
        }
    });

    document.querySelectorAll('.site-search').forEach(function(input) {
        var scope = input.closest('.section-block') || document;
        var clear = scope.querySelector('.search-clear');
        var empty = scope.querySelector('.empty-state');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-title]'));

        function normalize(value) {
            return String(value || '').trim().toLowerCase();
        }

        function applyFilter() {
            var query = normalize(input.value);
            var visible = 0;

            cards.forEach(function(card) {
                var text = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-meta')
                ].join(' '));
                var matched = !query || text.indexOf(query) !== -1;
                card.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        input.addEventListener('input', applyFilter);
        if (clear) {
            clear.addEventListener('click', function() {
                input.value = '';
                applyFilter();
                input.focus();
            });
        }
    });
});
