/**
 * DENNIS & ANU WEDDING INVITATION - BUTTERY SMOOTH INTERACTIONS
 * - 60fps Zero-Jank Scroll Tracking using IntersectionObserver
 * - Real-Time Countdown to Nov 21, 2026
 * - Smooth Touch Gallery Lightbox
 * - Confetti Blessings with Multi-Stage Physics
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. LIVE WEDDING COUNTDOWN TIMER (November 21, 2026, 10:30 AM IST)
     -------------------------------------------------------------------------- */
  const weddingDate = new Date('2026-11-21T10:30:00+05:30').getTime();

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minutesEl = document.getElementById('count-minutes');
  const secondsEl = document.getElementById('count-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl && daysEl.textContent !== String(days).padStart(2, '0')) {
      daysEl.textContent = String(days).padStart(2, '0');
    }
    if (hoursEl && hoursEl.textContent !== String(hours).padStart(2, '0')) {
      hoursEl.textContent = String(hours).padStart(2, '0');
    }
    if (minutesEl && minutesEl.textContent !== String(minutes).padStart(2, '0')) {
      minutesEl.textContent = String(minutes).padStart(2, '0');
    }
    if (secondsEl) {
      secondsEl.textContent = String(seconds).padStart(2, '0');
    }
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* --------------------------------------------------------------------------
     2. PHOTO GALLERY LIGHTBOX & FILTER CHIPS
     -------------------------------------------------------------------------- */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  const filterChips = document.querySelectorAll('.filter-chip');

  let currentImageIndex = 0;
  const imageSources = [];

  galleryItems.forEach((item, index) => {
    const img = item.querySelector('.gallery-img');
    if (img) {
      imageSources.push(img.getAttribute('src'));
    }

    item.addEventListener('click', () => {
      currentImageIndex = index;
      openLightbox(currentImageIndex);
    });
  });

  function openLightbox(idx) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = imageSources[idx];
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % imageSources.length;
    if (lightboxImg) lightboxImg.src = imageSources[currentImageIndex];
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + imageSources.length) % imageSources.length;
    if (lightboxImg) lightboxImg.src = imageSources[currentImageIndex];
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // Filter Chips
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter || (category && category.includes(filter))) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     3. BLESSINGS BURST WITH CONFETTI
     -------------------------------------------------------------------------- */
  const heartBurstBtn = document.getElementById('heart-burst-btn');
  const wishCounterEl = document.getElementById('wish-counter');
  
  let currentWishes = parseInt(localStorage.getItem('dennis_anu_wishes') || '142', 10);
  if (wishCounterEl) wishCounterEl.textContent = currentWishes;

  if (heartBurstBtn) {
    heartBurstBtn.addEventListener('click', () => {
      currentWishes++;
      localStorage.setItem('dennis_anu_wishes', currentWishes);
      if (wishCounterEl) wishCounterEl.textContent = currentWishes;

      if (navigator.vibrate) {
        navigator.vibrate([35, 25, 35]);
      }

      if (window.confetti) {
        window.confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.75 },
          colors: ['#C59B27', '#F2DEAA', '#FF7F86', '#E03E4A', '#FFFFFF']
        });
      }
    });
  }

  /* --------------------------------------------------------------------------
     4. ADD TO CALENDAR
     -------------------------------------------------------------------------- */
  const addToCalendarBtn = document.getElementById('btn-add-calendar');

  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const event = {
        title: 'Wedding: Dennis Mathew & Anu George',
        start: '20261121T050000Z',
        end: '20261121T103000Z',
        location: 'St. Maria Goretti Syro-Malabar Church, Thopramkudy, Idukki, Kerala',
        details: 'Holy Matrimony of Dennis Mathew and Anu George on Saturday, November 21, 2026.'
      };

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;
      window.open(googleCalUrl, '_blank');
    });
  }

  /* --------------------------------------------------------------------------
     5. GLITCH-FREE MOBILE NAVIGATION OBSERVER (NO LAYOUT REFLOWS)
     -------------------------------------------------------------------------- */
  const navItems = document.querySelectorAll('.quick-bar-item');
  const sections = document.querySelectorAll('section[id]');

  if ('IntersectionObserver' in window && sections.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navItems.forEach(item => {
            if (item.getAttribute('href') === `#${currentId}`) {
              item.classList.add('active');
            } else {
              item.classList.remove('active');
            }
          });
        }
      });
    }, {
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0
    });

    sections.forEach(s => navObserver.observe(s));
  }

});
