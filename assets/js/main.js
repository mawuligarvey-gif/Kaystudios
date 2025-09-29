// Initialize header and footer injection and basic interactivity
document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
  injectFooter();
  setupContactForm();
  markActiveNav();
  requestAnimationFrame(() => document.body.classList.add('ready'));
});

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
    });
  }
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

    statusEl.textContent = 'Sending...';
    setTimeout(() => {
      statusEl.textContent = 'Thanks! Your message has been sent.';
      form.reset();
    }, 700);
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


