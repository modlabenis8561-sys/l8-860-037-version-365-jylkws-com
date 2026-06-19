(function () {
    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getQuery() {
        var params = new URLSearchParams(window.location.search);
        return params.get('q') || '';
    }

    function renderResult(movie) {
        return [
            '<article class="search-result-card">',
            '    <a href="./movies/' + escapeHtml(movie.id) + '.html">',
            '        <span class="search-result-poster" style="background-image: url(\'./' + escapeHtml(movie.cover) + '\');"></span>',
            '        <span class="search-result-info">',
            '            <h2>' + escapeHtml(movie.title) + '</h2>',
            '            <p>' + escapeHtml(movie.oneLine) + '</p>',
            '            <small>' + escapeHtml(movie.year) + ' · ' + escapeHtml(movie.region) + ' · ' + escapeHtml(movie.category) + ' · ★ ' + escapeHtml(movie.rating) + '</small>',
            '        </span>',
            '    </a>',
            '</article>'
        ].join('\n');
    }

    function runSearch(query) {
        var data = window.MOVIE_SEARCH_DATA || [];
        var normalizedQuery = normalize(query);
        if (!normalizedQuery) {
            return [];
        }
        return data.filter(function (movie) {
            var haystack = normalize([
                movie.title,
                movie.region,
                movie.year,
                movie.type,
                movie.genre,
                movie.category,
                movie.tags,
                movie.oneLine
            ].join(' '));
            return haystack.indexOf(normalizedQuery) !== -1;
        }).slice(0, 120);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var input = document.querySelector('[data-global-search-input]');
        var summary = document.querySelector('[data-search-summary]');
        var results = document.querySelector('[data-search-results]');
        if (!input || !summary || !results) {
            return;
        }
        var query = getQuery();
        input.value = query;
        var matches = runSearch(query);
        if (!query) {
            summary.textContent = '输入关键词后显示搜索结果。';
            results.innerHTML = '';
            return;
        }
        summary.textContent = '关键词“' + query + '”找到 ' + matches.length + ' 条结果，最多展示 120 条。';
        results.innerHTML = matches.map(renderResult).join('\n');
    });
}());
