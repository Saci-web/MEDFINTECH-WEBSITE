/* ── EmailJS Configuration ── */
// Initialize EmailJS with your credentials
// Get your keys at: https://dashboard.emailjs.com/admin/account
const EMAILJS_PUBLIC_KEY = 'Ac3RnPtPJ_Dz5ysnI';
const EMAILJS_SERVICE_ID = 'service_jh9bboc';
const EMAILJS_TEMPLATE_ID = 'template_contact_form'; // You'll need to create this template in EmailJS

// Initialize EmailJS
(function() {
  if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('✅ EmailJS initialized successfully');
  }
})();

/* ── Navbar scroll ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40));

/* ── Mobile menu ── */
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'))
);

/* ── Scroll reveal ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal, .feature-card').forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

/* ── Screenshots switcher ── */
const screens = {
  dashboard:     { src: 'assets/images/screen_dashboard.png',     labelKey: 'screens.label.dashboard',     capKey: 'screens.cap.dashboard' },
  patient:       { src: 'assets/images/screen_patient.png',       labelKey: 'screens.label.patient',       capKey: 'screens.cap.patient' },
  prescriptions: { src: 'assets/images/screen_prescriptions.png', labelKey: 'screens.label.prescriptions', capKey: 'screens.cap.prescriptions' },
  billing:       { src: 'assets/images/screen_billing.png',       labelKey: 'screens.label.billing',       capKey: 'screens.cap.billing' },
  agenda:        { src: 'assets/images/screen_agenda_queue.svg',  labelKey: 'screens.label.agenda',        capKey: 'screens.cap.agenda' },
  bloc:          { src: 'assets/images/screen_bloc.svg',          labelKey: 'screens.label.bloc',          capKey: 'screens.cap.bloc' },
  ai:            { src: 'assets/images/screen_ai.png',            labelKey: 'screens.label.ai',            capKey: 'screens.cap.ai' },
  migration:     { src: 'assets/images/screen_migration.png',     labelKey: 'screens.label.migration',     capKey: 'screens.cap.migration' },
};

const screenKeys = Object.keys(screens);
let currentScreenIdx = 0;

function getScreenText(key, field) {
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'fr';
  const item = screens[key];
  if (!item) return '';
  const i18nKey = item[field];
  return typeof t === 'function' ? t(i18nKey, lang) : i18nKey;
}

function setActiveScreenUI(key) {
  document.querySelectorAll('.sc-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.screen === key);
  });
  document.querySelectorAll('.sc-thumb').forEach(th => {
    th.classList.toggle('active', th.dataset.screen === key);
  });
  document.querySelectorAll('.feature-card[data-screen]').forEach(card => {
    card.classList.toggle('feature-active', card.dataset.screen === key);
  });
  const tab = document.querySelector(`.sc-tab[data-screen="${key}"]`);
  if (tab) tab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function showScreen(key, btn) {
  if (!screens[key]) return;
  currentScreenIdx = screenKeys.indexOf(key);
  const img = document.getElementById('mainScreen');
  const url = document.getElementById('screenUrl');
  const caption = document.getElementById('screenCaption');
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = screens[key].src;
    img.alt = getScreenText(key, 'labelKey');
    url.textContent = getScreenText(key, 'labelKey');
    if (caption) caption.textContent = getScreenText(key, 'capKey');
    img.style.opacity = '1';
  }, 250);
  setActiveScreenUI(key);
  if (btn) btn.classList.add('active');
}

function showScreenByIndex(idx) {
  const key = screenKeys[(idx + screenKeys.length) % screenKeys.length];
  showScreen(key, document.querySelector(`.sc-tab[data-screen="${key}"]`));
}

function jumpToScreen(key) {
  const section = document.getElementById('screenshots');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => showScreen(key, document.querySelector(`.sc-tab[data-screen="${key}"]`)), 400);
  } else {
    showScreen(key, null);
  }
}

document.querySelectorAll('.sc-tab').forEach(tab => {
  tab.addEventListener('click', () => showScreen(tab.dataset.screen, tab));
});

document.getElementById('scPrev')?.addEventListener('click', () => showScreenByIndex(currentScreenIdx - 1));
document.getElementById('scNext')?.addEventListener('click', () => showScreenByIndex(currentScreenIdx + 1));

document.addEventListener('keydown', (e) => {
  const section = document.getElementById('screenshots');
  if (!section) return;
  const rect = section.getBoundingClientRect();
  if (rect.top >= window.innerHeight || rect.bottom <= 0) return;
  if (e.key === 'ArrowLeft') showScreenByIndex(currentScreenIdx - 1);
  if (e.key === 'ArrowRight') showScreenByIndex(currentScreenIdx + 1);
});

window.refreshScreensI18n = function(lang) {
  const key = screenKeys[currentScreenIdx] || 'dashboard';
  const url = document.getElementById('screenUrl');
  const caption = document.getElementById('screenCaption');
  if (url) url.textContent = t(screens[key].labelKey, lang);
  if (caption) caption.textContent = t(screens[key].capKey, lang);
};

/* ── Hero screen auto-cycle ── */
let heroIdx = 0;
setInterval(() => {
  heroIdx = (heroIdx + 1) % screenKeys.length;
  const heroImg = document.getElementById('heroScreen');
  if (heroImg && document.visibilityState === 'visible') {
    const key = screenKeys[heroIdx];
    heroImg.style.opacity = '0.6';
    setTimeout(() => {
      heroImg.src = screens[key].src;
      heroImg.style.opacity = '1';
    }, 300);
  }
}, 5000);

/* ── Smooth active nav highlight ── */
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) cur = s.id; });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.fontWeight = (a.getAttribute('href') === `#${cur}`) ? '700' : '500';
  });
});

/* ── Contact form with EmailJS ── */
function submitForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  const successEl = document.getElementById('form-success');
  const errorEl = document.getElementById('form-error');
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'fr';
  
  // Hide previous messages
  successEl.style.display = 'none';
  if (errorEl) errorEl.style.display = 'none';
  
  // Show sending state
  const originalText = btn.textContent;
  btn.textContent = t('contact.sending', lang);
  btn.disabled = true;

  // Collect form data
  const formData = {
    full_name: e.target.querySelector('input[name="full_name"]').value,
    email: e.target.querySelector('input[name="email"]').value,
    phone: e.target.querySelector('input[name="phone"]').value || 'Non fourni',
    specialty: e.target.querySelector('select[name="specialty"]').value,
    country: e.target.querySelector('select[name="country"]').value,
    facility: e.target.querySelector('select[name="facility"]').value,
    message: e.target.querySelector('textarea[name="message"]').value || 'Aucun message',
  };

  // Send email via EmailJS
  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, formData)
    .then(function(response) {
      console.log('✅ Email sent successfully!', response.status, response.text);
      successEl.style.display = 'block';
      successEl.textContent = t('contact.success', lang);
      e.target.reset();
      btn.textContent = originalText;
      btn.disabled = false;
    })
    .catch(function(error) {
      console.error('❌ Failed to send email:', error);
      if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.textContent = '❌ ' + (lang === 'fr' ? 'Erreur lors de l\'envoi. Veuillez réessayer.' : 'Error sending. Please try again.');
      }
      btn.textContent = originalText;
      btn.disabled = false;
    });
}

/* ── Init first screen caption ── */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => showScreen('dashboard', document.querySelector('.sc-tab[data-screen="dashboard"]')), 100);
});
