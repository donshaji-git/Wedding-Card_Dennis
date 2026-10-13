/**
 * Canvas Romantic Particle Engine (Hardware Accelerated 60fps)
 * Creates drifting soft rose petals and glowing golden stardust
 * Optimized to prevent GPU stalls and mobile battery drain
 */
(function () {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width, height;
  let particles = [];
  const isMobile = window.innerWidth < 768;
  const petalCount = isMobile ? 18 : 30;
  const bokehCount = isMobile ? 20 : 36;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Romantic Rose Petal Class
  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 0.75 + 0.35;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.opacity = Math.random() * 0.35 + 0.3;

      const colors = [
        'rgba(242, 192, 194, ',
        'rgba(235, 172, 176, ',
        'rgba(245, 212, 206, ',
        'rgba(224, 158, 164, '
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.swayAngle += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.swayAngle) * 0.45;
      this.y += this.speedY;
      this.rotation += this.rotSpeed;

      if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.fillStyle = this.color + this.opacity + ')';

      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.6, this.size * 0.8, this.size * 0.4, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.4, -this.size * 0.7, -this.size * 0.6, 0, -this.size);
      ctx.fill();
      ctx.restore();
    }
  }

  // Antique Golden Stardust Class (Zero-blur for maximum scroll speed)
  class Stardust {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 2 + 1;
      this.speedY = -(Math.random() * 0.3 + 0.15);
      this.pulse = Math.random() * Math.PI;
      this.pulseSpeed = Math.random() * 0.03 + 0.015;
      this.baseAlpha = Math.random() * 0.35 + 0.2;
    }

    update() {
      this.y += this.speedY;
      this.pulse += this.pulseSpeed;
      if (this.y < -10) {
        this.reset();
      }
    }

    draw() {
      const alpha = this.baseAlpha + Math.sin(this.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(197, 160, 89, ${Math.max(0, alpha)})`;
      ctx.fill();
    }
  }

  // Initialize
  for (let i = 0; i < petalCount; i++) {
    particles.push(new Petal());
  }
  for (let i = 0; i < bokehCount; i++) {
    particles.push(new Stardust());
  }

  let isRunning = true;
  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) requestAnimationFrame(loop);
  });

  function loop() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
