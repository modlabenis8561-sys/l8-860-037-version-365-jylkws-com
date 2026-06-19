(function () {
    var video = document.querySelector('[data-video]');
    var button = document.querySelector('[data-play-button]');
    var hlsInstance = null;
    var ready = false;

    if (!video) {
        return;
    }

    function prepare() {
        if (ready) {
            return;
        }

        var source = video.getAttribute('data-video');

        if (!source) {
            return;
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
        } else if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hlsInstance.loadSource(source);
            hlsInstance.attachMedia(video);
        } else {
            video.src = source;
        }

        ready = true;
    }

    function play() {
        prepare();
        if (button) {
            button.classList.add('is-hidden');
        }
        var promise = video.play();
        if (promise && promise.catch) {
            promise.catch(function () {});
        }
    }

    if (button) {
        button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            play();
        }
    });

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('is-hidden');
        }
    });

    window.addEventListener('pagehide', function () {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}());
