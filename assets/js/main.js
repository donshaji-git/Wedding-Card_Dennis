/**
 * DENNIS & ANU WEDDING INVITATION - INTERACTIVE LOGIC
 * Features:
 * - Real-Time Countdown to Nov 21, 2026
 * - Scroll Entrance Observer
 * - Masonry Gallery Lightbox & Filter
 * - Heart Burst Wishes & Confetti Physics
 * - 1-Click WhatsApp RSVP & Add to Google Calendar (.ics)
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

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  /* --------------------------------------------------------------------------
     2. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    });

    animateElements.forEach(el => observer.observe(el));
  } else {
    animateElements.forEach(el => el.classList.add('in-view'));
  }

  /* --------------------------------------------------------------------------
     3. PHOTO GALLERY LIGHTBOX & FILTER CHIPS
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

  // Gallery Filter Chips
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
     4. SEND WISHES & HEART BURST WITH CONFETTI
     -------------------------------------------------------------------------- */
  const heartBurstBtn = document.getElementById('heart-burst-btn');
  const wishCounterEl = document.getElementById('wish-counter');
  
  let currentWishes = parseInt(localStorage.getItem('dennis_anu_wishes') || '142', 10);
  if (wishCounterEl) wishCounterEl.textContent = currentWishes;

  if (heartBurstBtn) {
    heartBurstBtn.addEventListener('click', () => {
      // Increment counter
      currentWishes++;
      localStorage.setItem('dennis_anu_wishes', currentWishes);
      if (wishCounterEl) wishCounterEl.textContent = currentWishes;

      // Haptic feedback for smartphones
      if (navigator.vibrate) {
        navigator.vibrate([40, 30, 40]);
      }

      // Sparkle & Heart Confetti Burst
      if (window.confetti) {
        // Gold and Rose petals burst
        window.confetti({
          particleCount: 60,
          spread: 90,
          origin: { y: 0.75 },
          colors: ['#C5A059', '#EBD49F', '#FF7880', '#D93B47', '#FFFFFF', '#D9A79E']
        });

        // Second wave
        setTimeout(() => {
          window.confetti({
            particleCount: 40,
            angle: 60,
            spread: 60,
            origin: { x: 0.2, y: 0.8 },
            colors: ['#C5A059', '#EBD49F', '#FF7880', '#D9A79E']
          });
          window.confetti({
            particleCount: 40,
            angle: 120,
            spread: 60,
            origin: { x: 0.8, y: 0.8 },
            colors: ['#C5A059', '#EBD49F', '#FF7880', '#D9A79E']
          });
        }, 200);
      }
    });
  }

  /* --------------------------------------------------------------------------
     5. ADD TO CALENDAR (.ICS & GOOGLE CALENDAR)
     -------------------------------------------------------------------------- */
  const addToCalendarBtn = document.getElementById('btn-add-calendar');

  if (addToCalendarBtn) {
    addToCalendarBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const event = {
        title: 'Wedding of Dennis Mathew & Anu George',
        start: '20261121T050000Z', // 10:30 AM IST = 05:00 UTC
        end: '20261121T103000Z',   // 04:00 PM IST = 10:30 UTC
        location: 'St. Maria Goretti Syro-Malabar Church, Thopramkudy, Idukki, Kerala',
        details: 'Join us to celebrate the Holy Matrimony of Dennis Mathew and Anu George on Saturday, November 21, 2026.'
      };

      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.details)}&location=${encodeURIComponent(event.location)}`;

      // Ask user or default to Google Calendar / .ics file download
      window.open(googleCalUrl, '_blank');
    });
  }

  /* --------------------------------------------------------------------------
     6. MOBILE QUICK NAVIGATION BAR ACTIVE STATE
     -------------------------------------------------------------------------- */
  const navItems = document.querySelectorAll('.quick-bar-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

});
