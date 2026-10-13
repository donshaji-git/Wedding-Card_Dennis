/**
 * Romantic Wedding Audio Engine ("The Music Box")
 * Manages background music, seamless loop, audio fade-in,
 * wax seal trigger, and Web Audio API fallback synthesizer.
 */
(function () {
  const audioWidget = document.getElementById('music-box-widget');
  const discWrapper = document.getElementById('disc-wrapper');
  const musicLabel = document.getElementById('music-label');
  const royalCurtain = document.getElementById('royal-curtain');
  const openSealBtn = document.getElementById('open-seal-btn');
  const envelopeMonogram = document.getElementById('envelope-monogram');

  let audio = new Audio();
  audio.src = 'assets/audio/wedding-bgm.wav';
  audio.loop = true;
  audio.preload = 'auto';

  let isPlaying = false;
  let isMuted = false;
  let audioContext = null;
  let synthActive = false;

  // Initialize Web Audio API Fallback Synthesizer if needed
  function playWebAudioSynthesizer() {
    if (synthActive) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audioContext = new AudioCtx();

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      synthActive = true;
      const notes = [
        587.33, 554.37, 493.88, 440.00, 392.00, 369.99,
        493.88, 554.37, 587.33, 440.00, 369.99, 293.66
      ];
      let step = 0;

      function playNextNote() {
        if (!isPlaying || !synthActive) return;
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], audioContext.currentTime);

        gain.gain.setValueAtTime(0.001, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.start();
        osc.stop(audioContext.currentTime + 1.3);

        step++;
        setTimeout(playNextNote, 900);
      }

      playNextNote();
    } catch (e) {
      console.warn('Web Audio synthesis fallback initialized gently', e);
    }
  }

  function startMusic() {
    if (isPlaying) return;

    audio.play().then(() => {
      isPlaying = true;
      updateUI();
    }).catch((err) => {
      console.log('Audio file playback prevented, starting synthesized music box:', err);
      isPlaying = true;
      playWebAudioSynthesizer();
      updateUI();
    });
  }

  function pauseMusic() {
    if (!isPlaying) return;
    audio.pause();
    isPlaying = false;
    synthActive = false;
    updateUI();
  }

  function toggleMusic() {
    if (isPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  }

  function updateUI() {
    if (!audioWidget) return;
    if (isPlaying) {
      audioWidget.classList.add('playing');
      if (discWrapper) discWrapper.classList.add('rotating');
      if (musicLabel) musicLabel.textContent = 'Playing';
    } else {
      audioWidget.classList.remove('playing');
      if (discWrapper) discWrapper.classList.remove('rotating');
      if (musicLabel) musicLabel.textContent = 'Paused';
    }
  }

  // Open Invitation & Start Music
  function unlockInvitation() {
    if (royalCurtain) {
      royalCurtain.classList.add('opened');
      setTimeout(() => {
        royalCurtain.style.display = 'none';
      }, 900);
    }

    startMusic();

    if (navigator.vibrate) {
      navigator.vibrate(60);
    }

    // Trigger initial celebration sparkle
    if (window.confetti) {
      window.confetti({
        particleCount: 55,
        spread: 75,
        origin: { y: 0.55 },
        colors: ['#C5A059', '#EBD49F', '#FFFFFF', '#D9A79E', '#9E2A2B']
      });
    }
  }

  if (openSealBtn) {
    openSealBtn.addEventListener('click', unlockInvitation);
  }

  if (envelopeMonogram) {
    envelopeMonogram.addEventListener('click', unlockInvitation);
  }

  if (audioWidget) {
    audioWidget.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // First touch unlock anywhere as fallback
  const firstTouchHandler = function () {
    if (!isPlaying && royalCurtain && royalCurtain.classList.contains('opened')) {
      startMusic();
    }
    document.removeEventListener('click', firstTouchHandler);
    document.removeEventListener('touchstart', firstTouchHandler);
  };

  document.addEventListener('click', firstTouchHandler);
  document.addEventListener('touchstart', firstTouchHandler);

  // Expose global controller
  window.WeddingAudio = {
    play: startMusic,
    pause: pauseMusic,
    toggle: toggleMusic,
    unlock: unlockInvitation
  };
})();
