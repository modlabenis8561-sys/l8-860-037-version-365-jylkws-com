
(function () {
  function getQueryParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name) || '';
  }

  function createCard(movie) {
    var article = document.createElement('article');
    article.className = 'movie-card';

    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span class="tag">' + escapeHtml(tag) + '</span>';
    }).join('');

    article.innerHTML = [
      '<a class="poster-frame" href="movie/' + movie.id + '.html" aria-label="查看' + escapeHtml(movie.title) + '">',
      '  <img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" onerror="this.closest('.poster-frame').classList.add('image-missing'); this.remove();">',
      '  <span class="play-badge">▶</span>',
      '</a>',
      '<div class="movie-card-body">',
      '  <a class="movie-title" href="movie/' + movie.id + '.html">' + escapeHtml(movie.title) + '</a>',
      '  <div class="movie-meta"><span>' + escapeHtml(movie.category) + '</span><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span></div>',
      '  <p>' + escapeHtml(movie.description) + '</p>',
      '  <div class="tag-row">' + tags + '</div>',
      '</div>'
    ].join('');

    return article;
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[character];
    });
  }

  function initSearchPage() {
    var input = document.querySelector('[data-search-input]');
    var category = document.querySelector('[data-search-category]');
    var year = document.querySelector('[data-search-year]');
    var results = document.querySelector('[data-search-results]');
    var status = document.querySelector('[data-search-status]');
    var data = window.MOVIE_SEARCH_DATA || [];

    if (!input || !results) {
      return;
    }

    var years = Array.from(new Set(data.map(function (movie) {
      return movie.year;
    }).filter(Boolean))).sort(function (a, b) {
      return Number(b) - Number(a);
    });

    years.forEach(function (item) {
      var option = document.createElement('option');
      option.value = item;
      option.textContent = item;
      year.appendChild(option);
    });

    input.value = getQueryParam('q');

    function render() {
      var keyword = input.value.trim().toLowerCase();
      var categoryValue = category.value;
      var yearValue = year.value;
      var matched = data.filter(function (movie) {
        var hay = [movie.title, movie.category, movie.year, movie.region, movie.type, movie.genre, movie.description, (movie.tags || []).join(' ')].join(' ').toLowerCase();

        if (keyword && hay.indexOf(keyword) === -1) {
          return false;
        }

        if (categoryValue && movie.category !== categoryValue) {
          return false;
        }

        if (yearValue && movie.year !== yearValue) {
          return false;
        }

        return true;
      });

      var limited = matched.slice(0, 120);
      results.innerHTML = '';
      limited.forEach(function (movie) {
        results.appendChild(createCard(movie));
      });

      status.textContent = '找到 ' + matched.length + ' 部影片，当前展示 ' + limited.length + ' 部';
    }

    [input, category, year].forEach(function (control) {
      control.addEventListener('input', render);
      control.addEventListener('change', render);
    });

    render();
  }

  document.addEventListener('DOMContentLoaded', initSearchPage);
})();
