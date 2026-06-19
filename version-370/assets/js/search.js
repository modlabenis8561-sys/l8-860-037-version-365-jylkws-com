(function () {
  const input = document.getElementById('searchInput');
  const results = document.getElementById('searchResults');
  const status = document.getElementById('searchStatus');
  const params = new URLSearchParams(window.location.search);
  const query = (params.get('q') || '').trim();
  if (input) input.value = query;

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  function card(movie) {
    return '<a class="movie-card" href="' + movie.url + '">' +
      '<span class="poster-wrap"><img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy"><span class="poster-badge">' + escapeHtml(movie.type) + '</span></span>' +
      '<span class="card-body"><strong>' + escapeHtml(movie.title) + '</strong><span class="card-meta">' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.genre) + '</span><span class="card-desc">' + escapeHtml(movie.desc) + '</span><span class="card-row"><em>★ ' + movie.rating + '</em><em>' + Number(movie.views).toLocaleString() + ' 热度</em></span></span>' +
      '</a>';
  }

  function render(keyword) {
    const list = Array.isArray(window.MovieCatalog) ? window.MovieCatalog : [];
    const q = String(keyword || '').trim().toLowerCase();
    const matched = q ? list.filter(function (movie) {
      return [movie.title, movie.year, movie.region, movie.type, movie.genre, movie.category, movie.desc, (movie.tags || []).join(' ')]
        .join(' ')
        .toLowerCase()
        .includes(q);
    }).slice(0, 160) : list.slice(0, 48);
    if (status) {
      status.textContent = q ? '与“' + keyword + '”相关的影片' : '热门推荐';
    }
    if (results) {
      results.innerHTML = matched.length ? matched.map(card).join('') : '<div class="text-card"><h2>没有找到匹配影片</h2><p>可以尝试输入片名、地区、年份、类型或题材关键词。</p></div>';
    }
  }

  render(query);
})();
