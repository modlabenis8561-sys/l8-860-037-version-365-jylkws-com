
(function () {
  function toggleMobileMenu() {
    var button = document.querySelector('[data-menu-toggle]');
    var nav = document.querySelector('[data-mobile-nav]');

    if (!button || !nav) {
      return;
    }

    button.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  function initHeroCarousel() {
    var hero = document.querySelector('[data-hero]');

    if (!hero) {
      return;
    }

    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function activate(index) {
      current = index;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        activate(dotIndex);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        activate((current + 1) % slides.length);
      }, 5000);
    }
  }

  function initLocalFilters() {
    var input = document.querySelector('[data-local-filter]');
    var category = document.querySelector('[data-category-filter]');
    var year = document.querySelector('[data-year-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-filter-card]'));
    var status = document.querySelector('[data-filter-status]');

    if (!cards.length) {
      return;
    }

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var categoryValue = category ? category.value : '';
      var yearValue = year ? year.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var title = (card.getAttribute('data-title') || '').toLowerCase();
        var text = (card.textContent || '').toLowerCase();
        var cardCategory = card.getAttribute('data-category') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var matched = true;

        if (keyword && title.indexOf(keyword) === -1 && text.indexOf(keyword) === -1) {
          matched = false;
        }

        if (categoryValue && cardCategory !== categoryValue) {
          matched = false;
        }

        if (yearValue && cardYear !== yearValue) {
          matched = false;
        }

        card.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (status) {
        status.textContent = '当前显示 ' + visible + ' 部影片';
      }
    }

    [input, category, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilter);
        control.addEventListener('change', applyFilter);
      }
    });

    applyFilter();
  }

  document.addEventListener('DOMContentLoaded', function () {
    toggleMobileMenu();
    initHeroCarousel();
    initLocalFilters();
  });
})();
