import { H as Hls } from './hls-dru42stk.js';

function setMessage(shell, message) {
    var target = shell.querySelector('[data-video-message]');
    if (target) {
        target.textContent = message || '';
    }
}

function loadWithHls(video, source, shell) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return Promise.resolve();
    }

    if (Hls && Hls.isSupported && Hls.isSupported()) {
        var hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        hls.loadSource(source);
        hls.attachMedia(video);
        shell._hlsInstance = hls;
        return new Promise(function (resolve) {
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                resolve();
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal) {
                    setMessage(shell, '播放源加载遇到问题，请刷新页面或稍后重试。');
                }
            });
        });
    }

    video.src = source;
    return Promise.resolve();
}

function setupPlayer(shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-video-start]');
    var source = shell.getAttribute('data-video-src');

    if (!video || !button || !source) {
        return;
    }

    button.addEventListener('click', function () {
        button.classList.add('is-hidden');
        setMessage(shell, '正在加载播放源...');

        loadWithHls(video, source, shell)
            .then(function () {
                setMessage(shell, '播放源已加载。');
                return video.play();
            })
            .catch(function () {
                setMessage(shell, '浏览器阻止了自动播放，请点击播放器继续。');
            });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-video-src]').forEach(setupPlayer);
});
