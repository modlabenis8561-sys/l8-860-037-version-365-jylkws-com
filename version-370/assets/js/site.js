const menuButton = document.querySelector('[data-menu-toggle]');
const menuPanel = document.querySelector('[data-menu-panel]');

if (menuButton && menuPanel) {
  menuButton.addEventListener('click', () => {
    menuPanel.classList.toggle('open');
  });
}

const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
let heroIndex = 0;

function showHero(index) {
  if (!slides.length) return;
  heroIndex = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === heroIndex));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === heroIndex));
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => showHero(index));
});

if (slides.length > 1) {
  setInterval(() => showHero(heroIndex + 1), 5200);
}

async function loadVideo(video, overlay) {
  const url = video.getAttribute('data-video-url');
  if (!url) return;
  if (!video.dataset.ready) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
    } else {
      const mod = await import('./hls.js');
      const Hls = mod.H;
      if (Hls && Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
    }
    video.dataset.ready = '1';
    video.setAttribute('controls', 'controls');
  }
  if (overlay) overlay.hidden = true;
  try {
    await video.play();
  } catch (error) {
    video.setAttribute('controls', 'controls');
  }
}

for (const frame of document.querySelectorAll('[data-player]')) {
  const video = frame.querySelector('video');
  const overlay = frame.querySelector('.player-overlay');
  if (!video) continue;
  if (overlay) {
    overlay.addEventListener('click', () => loadVideo(video, overlay));
  }
  video.addEventListener('click', () => {
    if (!video.dataset.ready) loadVideo(video, overlay);
  });
}
