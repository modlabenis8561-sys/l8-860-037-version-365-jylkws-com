function initMoviePlayer(videoId, buttonId, url) {
    var video = document.getElementById(videoId);
    var button = document.getElementById(buttonId);
    var prepared = false;
    var hlsInstance = null;

    if (!video || !button || !url) {
        return;
    }

    function playVideo() {
        var attempt = video.play();

        if (attempt && typeof attempt.catch === "function") {
            attempt.catch(function() {});
        }
    }

    function prepareVideo() {
        button.classList.add("is-hidden");

        if (prepared) {
            playVideo();
            return;
        }

        prepared = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = url;
            video.addEventListener("loadedmetadata", playVideo, { once: true });
            video.load();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hlsInstance = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true
            });
            hlsInstance.loadSource(url);
            hlsInstance.attachMedia(video);
            hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
            hlsInstance.on(window.Hls.Events.ERROR, function(eventName, data) {
                if (!data || !data.fatal) {
                    return;
                }
                if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                    hlsInstance.startLoad();
                } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                    hlsInstance.recoverMediaError();
                }
            });
            return;
        }

        video.src = url;
        video.load();
        playVideo();
    }

    button.addEventListener("click", prepareVideo);
    video.addEventListener("click", function() {
        if (video.paused) {
            prepareVideo();
        }
    });
    video.addEventListener("play", function() {
        button.classList.add("is-hidden");
    });
    window.addEventListener("pagehide", function() {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
}
