// ===== PAGE LOADER =====
window.addEventListener('load', () => {
	setTimeout(() => {
		document.getElementById('page-loader').classList.add('gone');
	}, 600);
});

// ===== CURSOR GLOW =====
const glow = document.getElementById('cursorGlow');
let mx = 0, my = 0, gx = 0, gy = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
(function raf() {
	gx += (mx - gx) * 0.1;
	gy += (my - gy) * 0.1;
	glow.style.left = gx + 'px';
	glow.style.top = gy + 'px';
	requestAnimationFrame(raf);
})();

// ===== INTERSECTION OBSERVER (scroll reveal) =====
const observer = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('visible');
		}
	});
}, { threshold: 0.12 });

// Observe course cards
document.querySelectorAll('.course_item').forEach(el => observer.observe(el));

// Observe education items
document.querySelectorAll('ol li').forEach(el => observer.observe(el));

// Observe score table rows
document.querySelectorAll('.data-row').forEach(el => observer.observe(el));

// ===== NAV ACTIVE HIGHLIGHT =====
const sections = ['contact','edu','scores','social','courses'];
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
	let current = '';
	sections.forEach(id => {
		const el = document.getElementById(id);
		if (el && window.scrollY >= el.offsetTop - 120) current = id;
	});
	navLinks.forEach(a => {
		a.style.color = a.getAttribute('href') === '#' + current ? '#a1eb86' : '';
	});
}, { passive: true });

// ===== SMOOTH HOVER TILT on course cards =====
document.querySelectorAll('.course_item').forEach(card => {
	card.addEventListener('mousemove', e => {
		const r = card.getBoundingClientRect();
		const x = (e.clientX - r.left) / r.width - 0.5;
		const y = (e.clientY - r.top) / r.height - 0.5;
		card.style.transform = `translateY(-8px) scale(1.03) rotateY(${x * 8}deg) rotateX(${-y * 6}deg)`;
	});
	card.addEventListener('mouseleave', () => {
		card.style.transform = '';
	});
});