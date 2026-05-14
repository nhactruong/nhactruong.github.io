/* ================================================
   index.js
   1. Ẩn loader sau khi trang load xong
   2. Hiệu ứng cursor glow (lerp smoothing)
   3. Scroll reveal (IntersectionObserver)
   4. Active nav link khi cuộn
   5. Hiệu ứng nghiêng 3D khi hover card
   ================================================ */

/* ── 1. LOADER ───────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('page-loader').classList.add('gone');
  }, 600);
});


/* ── 2. CURSOR GLOW ──────────────────────────── */
const glowEl = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let glowX  = 0, glowY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.1;
  glowY += (mouseY - glowY) * 0.1;
  glowEl.style.left = `${glowX}px`;
  glowEl.style.top  = `${glowY}px`;
  requestAnimationFrame(animateGlow);
}

animateGlow();


/* ── 3. SCROLL REVEAL ────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.course-card').forEach((card) => revealObserver.observe(card));
document.querySelectorAll('.edu-list li').forEach((item) => revealObserver.observe(item));
document.querySelectorAll('.score-row').forEach((row)  => revealObserver.observe(row));


/* ── 4. ACTIVE NAV ON SCROLL ─────────────────── */
const sectionIds = ['contact', 'edu', 'scores', 'social', 'courses'];
const navLinks   = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
  let currentSection = '';

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section && window.scrollY >= section.offsetTop - 120) {
      currentSection = id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${currentSection}`;
    link.classList.toggle('active', isActive);
  });
}, { passive: true });


/* ── 5. 3D CARD TILT ─────────────────────────── */
document.querySelectorAll('.course-card').forEach((card) => {

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left)  / rect.width  - 0.5;
    const y = (e.clientY - rect.top)   / rect.height - 0.5;
    card.style.transform = `translateY(-8px) scale(1.03) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });

});
