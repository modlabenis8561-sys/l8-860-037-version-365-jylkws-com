
import { H as Hls } from './hls-dru42stk.js';

function attachSource(video) {
  var source = video.getAttribute('data-src');

  if (!source) {
    return Promise.reject(new Error('Missing video source'));
  }

  if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = source;
    return Promise.resolve();
  }

  if (Hls && Hls.isSupported()) {
    if (!video.__movieHls) {
      var hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      video.__movieHls = hls;
    }

    return Promise.resolve();
  }

  video.src = source;
  return Promise.resolve();
}

function initPlayers() {
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-play-button]'));

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      var targetId = button.getAttribute('data-play-button');
      var video = document.getElementById(targetId);

      if (!video) {
        return;
      }

      attachSource(video).then(function () {
        button.classList.add('hidden');
        video.setAttribute('controls', 'controls');
        var playResult = video.play();

        if (playResult && typeof playResult.catch === 'function') {
          playResult.catch(function () {
            button.classList.remove('hidden');
          });
        }
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', initPlayers);
