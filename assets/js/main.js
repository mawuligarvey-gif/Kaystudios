// Initialize header and footer injection and basic interactivity
document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
  injectFooter();
  splitHeroWords();
  navEntrance();
  setupContactForm();
  markActiveNav();
  setupRevealObserver();
  initCapsuleSheen();
  requestAnimationFrame(() => document.body.classList.add('ready'));
});

// markSheen removed (hero typographic mark was reverted)

function setupRevealObserver(){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) {
        e.target.classList.add('visible');
        // also reveal any inner hero-animate blocks immediately
        const heroAnim = e.target.querySelector('.hero-animate');
        if (heroAnim) heroAnim.classList.add('visible');
        // optional: stop observing once visible
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.12});
  // Observe overall reveal sections and also individual service cards for title reveal
  document.querySelectorAll('.reveal, .service-card').forEach(el=>obs.observe(el));
}

function initCapsuleSheen(){
  try{
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const cap = document.querySelector('.capsule');
    if (!cap) return;
    cap.style.position = 'relative';
    const shine = document.createElement('span');
    shine.className = 'capsule-sheen';
    cap.appendChild(shine);
    // trigger a CSS animation by adding class
    setTimeout(()=> cap.classList.add('with-sheen'), 300);
    // also start gentle gradient float
    setTimeout(()=> cap.classList.add('animate-gradient'), 120);
  }catch(e){/* ignore */}
}

// Split each hero-line into word spans so we can stagger per-word animation.
function splitHeroWords(){
  const lines = document.querySelectorAll('.hero-line');
  if (!lines.length) return;
  lines.forEach((line, lineIndex) => {
    // skip if already split
    if (line.dataset.split === '1') return;
    const words = line.textContent.trim().split(/\s+/);
    line.textContent = '';
    words.forEach((w, i) => {
      const span = document.createElement('span');
      span.className = 'word';
      span.textContent = w + (i < words.length - 1 ? ' ' : '');
      span.style.setProperty('--w-i', i);
      line.appendChild(span);
    });
    // base offset per original line delay (keep original stagger feel)
    const baseDelays = [220, 460, 700];
    const offset = baseDelays[lineIndex] || 0;
    line.style.setProperty('--w-offset', offset + 'ms');
    line.dataset.split = '1';
  });
}

// Small nav entrance: stagger the nav-links on page load for a subtle entrance
function navEntrance(){
  try{
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const nav = document.querySelector('.nav');
    if (!nav) return;
    nav.classList.add('nav-entrance');
    // remove the class after the sequence finishes so hover styles remain clean
    setTimeout(()=>nav.classList.remove('nav-entrance'), 1600);
  }catch(e){/* silent */}
}

function injectHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;
  header.innerHTML = `
    <nav class="nav">
      <div class="container nav-inner">
        <a href="index.html" class="brand" aria-label="Kay Studios Home">
          <span class="logo"></span>
          <span>Kay Studios</span>
        </a>
        <button class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false">☰</button>
        <div class="nav-links" id="nav-links">
          <a href="about.html">About</a>
          <a href="services.html">Services</a>
          <a href="portfolio.html">Portfolio</a>
          <a href="blog.html">Blog</a>
          <a href="contact.html">Contact</a>
        </div>
      </div>
    </nav>
  `;

  const toggle = header.querySelector('.menu-toggle');
  const links = header.querySelector('#nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      // prevent body scroll when menu is open on mobile
      if (open) document.body.style.overflow = 'hidden'; else document.body.style.overflow = '';
    });
  }

  // no scripted header animation (reverted to simple logo)
}

function injectFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="container footer-inner">
      <div class="muted">© ${year} Kay Studios</div>
      <div class="social" aria-label="Social links">
        <a class="icon" href="#" aria-label="Instagram"></a>
        <a class="icon" href="#" aria-label="Twitter"></a>
        <a class="icon" href="#" aria-label="YouTube"></a>
      </div>
    </div>
  `;
}

function markActiveNav() {
  const path = location.pathname.replace(/\\/g, '/');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (path.endsWith(href)) {
      a.classList.add('active');
    } else if (href === '/index.html' && (path.endsWith('/') || path.endsWith('/kaystudios'))) {
      a.classList.add('active');
    }
  });
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const statusEl = document.getElementById('form-status');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    let valid = true;
    valid &= showFieldError('name', name.length >= 2, 'Please enter your name');
    valid &= showFieldError('email', /.+@.+\..+/.test(email), 'Enter a valid email');
    valid &= showFieldError('message', message.length >= 10, 'Message should be at least 10 characters');
    if (!valid) return;

    if (statusEl) { statusEl.hidden = false; statusEl.classList.remove('show'); statusEl.textContent = 'Sending...'; }
    fetch('/', { method: 'POST', body: new URLSearchParams([...data]) })
      .then(() => {
        if (statusEl) { statusEl.hidden = false; statusEl.textContent = '✅ Thank you! Your message has been sent.'; requestAnimationFrame(() => statusEl.classList.add('show')); }
        form.reset();
      })
      .catch(() => {
        // fallback: open mail client with prefilled content
        const mailto = `mailto:Ebendofori@gmail.com?subject=${encodeURIComponent('Contact from website: '+name)}&body=${encodeURIComponent(message+'\n\nFrom: '+name+' <'+email+'>')}`;
        window.location.href = mailto;
      });
  });
}

function showFieldError(fieldId, condition, message) {
  const field = document.getElementById(fieldId);
  const error = document.querySelector(`.error[data-for="${fieldId}"]`);
  if (!field || !error) return true;
  if (!condition) {
    error.textContent = message;
    field.setAttribute('aria-invalid', 'true');
    return false;
  } else {
    error.textContent = '';
    field.removeAttribute('aria-invalid');
    return true;
  }
}


