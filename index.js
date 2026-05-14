/* ── 2. CURSOR GLOW ── */
const glowEl = document.getElementById('cursor-glow');
let mouseX = 0, mouseY = 0;
let glowX  = 0, glowY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

(function animateGlow() {
  glowX += (mouseX - glowX) * 0.1;
  glowY += (mouseY - glowY) * 0.1;
  glowEl.style.left = `${glowX}px`;
  glowEl.style.top  = `${glowY}px`;
  requestAnimationFrame(animateGlow);
})();


/* ── 3. SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.course-card, .edu-list li, .score-row').forEach((el) =>
  revealObserver.observe(el)
);

/* ── 4. ACTIVE NAV ON CLICK & SCROLL ── */
const navLinks = document.querySelectorAll('nav a');
let isClicking = false; // Khai báo biến để theo dõi xem người dùng có đang click hay không

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    isClicking = true; // Bật cờ chặn khi click
    
    // 1. Xóa màu ở tất cả các nút
    navLinks.forEach(l => l.classList.remove('active'));
    
    // 2. Thêm màu (class active) ngay lập tức vào nút vừa click
    this.classList.add('active');

    // 3. Khóa sự kiện theo dõi cuộn trong 800 mili-giây (thời gian đủ để trang trượt đến nơi)
    // Sau đó mở lại để cuộn bằng tay vẫn hoạt động bình thường
    setTimeout(() => {
      isClicking = false;
    }, 800);
  });
});

window.addEventListener('scroll', () => {
  // Nếu đang trong quá trình click (trang đang tự động trượt) thì bỏ qua, không tính toán lại
  if (isClicking) return; 

  let currentSection = '';
  const sections = ['contact', 'edu', 'scores', 'social', 'courses'];

  sections.forEach((id) => {
    const section = document.getElementById(id);
    if (section) {
      const sectionTop = section.offsetTop;
      // Trừ đi 150px để đổi màu ngay khi thẻ heading vừa chạm tới menu
      if (window.scrollY >= sectionTop - 150) {
        currentSection = id;
      }
    }
  });

  if (currentSection) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentSection);
    });
  }
}, { passive: true });

/* ── 5. 3D CARD TILT ── */
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


/* ── 6. ZALO QR POPUP ── */
const zaloWidget = document.getElementById('zalo-widget');
const zaloPopup  = document.getElementById('zalo-qr-popup');

zaloWidget.addEventListener('click', (e) => {
  e.stopPropagation();
  zaloPopup.classList.toggle('active');
});

document.addEventListener('click', () => {
  zaloPopup.classList.remove('active');
});
