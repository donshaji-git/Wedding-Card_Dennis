/**
 * Canvas Romantic Particle Engine
 * Creates drifting soft rose petals and glowing golden bokeh/stardust
 * Runs at 60fps on mobile without lag
 */
(function () {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const petalCount = window.innerWidth < 768 ? 22 : 36;
  const bokehCount = window.innerWidth < 768 ? 25 : 45;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Petal class
  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = Math.random() * 9 + 7;
      this.speedY = Math.random() * 0.9 + 0.4;
      this.speedX = Math.random() * 0.6 - 0.3;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
      this.swayAngle = Math.random() * Math.PI * 2;
      this.swaySpeed = Math.random() * 0.02 + 0.01;
      this.opacity = Math.random() * 0.4 + 0.35;
      
      // Romantic blush/rose petal colors
      const colors = [
        'rgba(244, 185, 188, ',
        'rgba(235, 160, 165, ',
        'rgba(247, 210, 205, ',
        'rgba(218, 140, 148, '
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.swayAngle += this.swaySpeed;
      this.x += this.speedX + Math.sin(this.swayAngle) * 0.5;
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
      
      // Draw organic petal shape
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.7, -this.size * 0.6, this.size * 0.8, this.size * 0.4, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.8, this.size * 0.4, -this.size * 0.7, -this.size * 0.6, 0, -this.size);
      ctx.fill();
      ctx.restore();
    }
  }

  // Bokeh / Golden Stardust class
  class Stardust {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 10;
      this.radius = Math.random() * 2.5 + 1;
      this.speedY = -(Math.random() * 0.35 + 0.15);
      this.pulse = Math.random() * Math.PI;
      this.pulseSpeed = Math.random() * 0.03 + 0.015;
      this.baseAlpha = Math.random() * 0.3 + 0.2;
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
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0, alpha)})`;
      ctx.shadowColor = 'rgba(235, 200, 110, 0.6)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
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
