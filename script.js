/* ========================================
   SEALED IN STARLIGHT — Scripts
   ======================================== */

// ---- Starfield Background ----
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];
  const STAR_COUNT = 200;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.8 + 0.1,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        isGold: Math.random() < 0.15,
      });
    }
  }

  function draw(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
      const opacity = star.opacity * (0.5 + twinkle * 0.5);

      if (star.isGold) {
        ctx.fillStyle = `rgba(201, 168, 76, ${opacity})`;
      } else {
        ctx.fillStyle = `rgba(200, 200, 220, ${opacity * 0.7})`;
      }

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      // Subtle glow on brighter stars
      if (star.size > 1 && star.isGold) {
        ctx.fillStyle = `rgba(201, 168, 76, ${opacity * 0.15})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  createStars();
  requestAnimationFrame(draw);

  window.addEventListener('resize', () => {
    resize();
    createStars();
  });
})();


// ---- Floating Particles ----
(function initParticles() {
  const container = document.getElementById('particles');
  const PARTICLE_COUNT = 15;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (6 + Math.random() * 6) + 's';
    particle.style.width = (2 + Math.random() * 2) + 'px';
    particle.style.height = particle.style.width;
    container.appendChild(particle);
  }
})();


// ---- Scroll Reveal ----
(function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.feature-card, .experience-text, .experience-visual, .audience-item, .waitlist-card, .section-title'
  );

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
})();


// ---- Waitlist Form ----
(function initForm() {
  const form = document.getElementById('waitlist-form');
  const successMessage = document.getElementById('success-message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const btnText = form.querySelector('.btn-text');
    const btnLoading = form.querySelector('.btn-loading');

    if (!name || !email) return;

    // Show loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';

    // Simulate submission delay (replace with real API call)
    // TODO: Connect to your email service (ConvertKit, Mailchimp, Loops, etc.)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store locally as fallback
    const waitlist = JSON.parse(localStorage.getItem('sis_waitlist') || '[]');
    waitlist.push({ name, email, date: new Date().toISOString() });
    localStorage.setItem('sis_waitlist', JSON.stringify(waitlist));

    // Show success
    form.style.display = 'none';
    successMessage.style.display = 'block';

    console.log('Waitlist signup:', { name, email });
  });
})();


// ---- Smooth scroll for CTA ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
});
