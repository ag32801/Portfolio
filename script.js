/* =====================
   LANGUAGE TOGGLE
   ===================== */
function setLang(lang) {
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.classList.toggle('visible', el.getAttribute('data-lang') === lang);
    });
    document.querySelectorAll('[data-lang-inline]').forEach(el => {
        el.classList.toggle('visible', el.getAttribute('data-lang-inline') === lang);
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.textContent.toLowerCase() === lang);
    });
    document.querySelectorAll('[data-nav-' + lang + ']').forEach(el => {
        el.textContent = el.getAttribute('data-nav-' + lang);
    });
    document.documentElement.lang = lang;
    try { localStorage.setItem('lang', lang); } catch (_) {}
}

// Restore saved language preference, default to German
const savedLang = (function () {
    try { return localStorage.getItem('lang') || 'de'; } catch (_) { return 'de'; }
})();
setLang(savedLang);

/* =====================
   SMOOTH SCROLL
   ===================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        // Close mobile nav if open
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    });
});

/* =====================
   SCROLL PROGRESS BAR
   ===================== */
const scrollProgress = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
    const scrollTop   = window.scrollY;
    const docHeight   = document.documentElement.scrollHeight - window.innerHeight;
    const pct         = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
}, { passive: true });

/* =====================
   NAVBAR: scrolled state + active link
   ===================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Highlight nav link for the section currently in view
const sections    = document.querySelectorAll('section[id]');
const navAnchors  = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navAnchors.forEach(a => {
                a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
            });
        }
    });
}, { threshold: 0.45 });

sections.forEach(s => sectionObserver.observe(s));

/* =====================
   HAMBURGER MENU
   ===================== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close menu on outside click
document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

/* =====================
   SCROLL-TRIGGERED REVEAL
   ===================== */
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
        if (!entry.isIntersecting) return;
        // Stagger siblings that enter at the same time
        const siblings = Array.from(
            (entry.target.parentElement || document).querySelectorAll('.reveal:not(.visible)')
        );
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
            entry.target.classList.add('visible');
        }, Math.max(0, idx) * 70);
        revealObserver.unobserve(entry.target);
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
