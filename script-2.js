document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Lock scroll until envelope opened ---------- */
  document.body.style.overflow = 'hidden';

  /* ---------- Ambient floating petals ---------- */
  const petalContainer = document.getElementById('petals');
  const PETAL_COUNT = 10;
  const petalColors = ['#E7A9C0', '#C9B6E4', '#E8C07D'];

  for (let i = 0; i < PETAL_COUNT; i++) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    const left = Math.random() * 100;
    const duration = 12 + Math.random() * 10;
    const delay = Math.random() * 12;
    const driftX = (Math.random() * 120 - 60) + 'px';
    const size = 8 + Math.random() * 10;
    const color = petalColors[Math.floor(Math.random() * petalColors.length)];

    petal.style.left = left + 'vw';
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.background = color;
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = delay + 's';
    petal.style.setProperty('--drift-x', driftX);

    petalContainer.appendChild(petal);
  }

  /* ---------- Envelope open interaction ---------- */
  const envelope = document.getElementById('envelope');
  const overlay = document.getElementById('envelopeOverlay');

  let opened = false;
  envelope.addEventListener('click', () => {
    if (opened) return;
    opened = true;
    envelope.classList.add('open');

    // Klik amplop = gesture pengguna, jadi ini titik teraman untuk mencoba autoplay musik
    tryPlayMusic();

    setTimeout(() => {
      overlay.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }, 1400);
  });

  /* ---------- Background music ---------- */
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicHint = document.getElementById('musicHint');

  function setPlayingUI(isPlaying) {
    musicToggle.classList.toggle('playing', isPlaying);
    musicToggle.setAttribute('aria-pressed', String(isPlaying));
    musicToggle.setAttribute('aria-label', isPlaying ? 'Jeda musik' : 'Putar musik');
  }

  function tryPlayMusic() {
    const playPromise = bgMusic.play();
    if (playPromise && playPromise.then) {
      playPromise
        .then(() => setPlayingUI(true))
        .catch(() => setPlayingUI(false)); // file lagu.mp3 belum ada / diblokir browser, tidak apa-apa
    }
  }

  musicToggle.addEventListener('click', () => {
    if (bgMusic.paused) {
      tryPlayMusic();
    } else {
      bgMusic.pause();
      setPlayingUI(false);
    }
    musicHint.classList.add('dismissed');
  });

  bgMusic.addEventListener('play', () => setPlayingUI(true));
  bgMusic.addEventListener('pause', () => setPlayingUI(false));

  // Sembunyikan hint otomatis setelah beberapa detik
  setTimeout(() => musicHint.classList.add('dismissed'), 9000);

  /* ---------- "Belum siap" button dodges the pointer/tap ---------- */
  const btnNo = document.getElementById('btnNo');
  const btnYes = document.getElementById('btnYes');
  const confessButtons = document.getElementById('confessButtons');

  function dodge() {
    const wrapRect = confessButtons.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const maxLeft = Math.max(wrapRect.width - btnRect.width, 0);
    const maxTop = Math.max(wrapRect.height - btnRect.height, 0);

    const newLeft = Math.random() * maxLeft;
    const newTop = Math.random() * maxTop;

    if (!btnNo.classList.contains('dodging')) {
      btnNo.classList.add('dodging');
    }
    btnNo.style.left = newLeft + 'px';
    btnNo.style.top = newTop + 'px';
  }

  // Desktop: dodge on hover
  btnNo.addEventListener('mouseenter', dodge);
  // Mobile: dodge on touch start, prevent the tap from registering as a click
  btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    dodge();
  }, { passive: false });

  /* ---------- "Ya, aku mau" reveals the result + confetti ---------- */
  const confessResult = document.getElementById('confessResult');
  const confettiWrap = document.getElementById('confetti');

  function launchConfetti() {
    const colors = ['#E7A9C0', '#C9B6E4', '#E8C07D', '#D98CA9'];
    const pieces = 60;

    for (let i = 0; i < pieces; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = (2.5 + Math.random() * 2) + 's';
      piece.style.animationDelay = (Math.random() * 0.6) + 's';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      confettiWrap.appendChild(piece);

      // clean up after animation
      setTimeout(() => piece.remove(), 5500);
    }
  }

  btnYes.addEventListener('click', () => {
    confessButtons.hidden = true;
    confessResult.hidden = false;
    launchConfetti();
  });

});
