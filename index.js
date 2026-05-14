/* ── ACTIVE NAV ON CLICK & SCROLL ── */
const navLinks = document.querySelectorAll('nav a');
let isClicking = false;

navLinks.forEach(link => {
  link.addEventListener('click', function() {
    isClicking = true;
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
    setTimeout(() => { isClicking = false; }, 800);
  });
});

window.addEventListener('scroll', () => {
  if (isClicking) return;

  let currentSection = '';
  const sections = ['contact', 'edu', 'scores', 'social', 'courses'];

  sections.forEach((id) => {
    const section = document.getElementById(id);
    if (section && window.scrollY >= section.offsetTop - 150) {
      currentSection = id;
    }
  });

  if (currentSection) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentSection);
    });
  }
}, { passive: true });

/* ── ZALO QR POPUP ── */
const zaloWidget = document.getElementById('zalo-widget');
const zaloPopup  = document.getElementById('zalo-qr-popup');

zaloWidget.addEventListener('click', (e) => {
  e.stopPropagation();
  zaloPopup.classList.toggle('active');
});

document.addEventListener('click', () => {
  zaloPopup.classList.remove('active');
});
