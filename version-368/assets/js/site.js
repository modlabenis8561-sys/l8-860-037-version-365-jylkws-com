(function() {
  var body = document.body;
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function() {
      var open = body.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var current = 0;
    var timer = null;
    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, position) {
        slide.classList.toggle('active', position === current);
      });
      dots.forEach(function(dot, position) {
        dot.classList.toggle('active', position === current);
      });
    }
    function startCarousel() {
      timer = window.setInterval(function() {
        showSlide(current + 1);
      }, 5000);
    }
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        window.clearInterval(timer);
        showSlide(Number(dot.getAttribute('data-slide')) || 0);
        startCarousel();
      });
    });
    if (slides.length > 1) {
      startCarousel();
    }
  }

  var params = new URLSearchParams(window.location.search);
  var initialQuery = params.get('q') || '';
  var inputs = Array.prototype.slice.call(document.querySelectorAll('.live-search-input'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.filter-grid .movie-card'));
  var noResults = document.querySelector('.no-results');

  function normalize(text) {
    return String(text || '').toLowerCase().trim();
  }

  function filterCards(value) {
    var query = normalize(value);
    var visible = 0;
    cards.forEach(function(card) {
      var text = normalize(card.getAttribute('data-filter-text'));
      var match = !query || text.indexOf(query) !== -1;
      card.style.display = match ? '' : 'none';
      if (match) {
        visible += 1;
      }
    });
    if (noResults) {
      noResults.classList.toggle('show', visible === 0);
    }
  }

  if (initialQuery && inputs.length) {
    inputs.forEach(function(input) {
      input.value = initialQuery;
    });
    filterCards(initialQuery);
  }

  inputs.forEach(function(input) {
    input.addEventListener('input', function() {
      filterCards(input.value);
    });
  });
}());
